const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const FriendRequest = require("../models/FriendRequest");
const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided or invalid format"); // Debugging message
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Extract the token from the Authorization header (after the "Bearer " part)
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log the decoded token for debugging
    // console.log("Decoded token:", decoded);

    // Attach the decoded payload (user info) to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Log the error for debugging
    console.error("JWT Error:", error);

    // Respond with a 401 Unauthorized status if token is invalid or expired
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


// Sign Up
router.post("/signup", async (req, res) => {
  const { firstname, lastname, phone, email, username, password } = req.body;

  try {
    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ username }, { phone }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with the same username, phone, or email already exists" });
    }

    // Hash the password using argon2
    // const hashedPassword = await argon2.hash(password); // Hash the password using argon2
    const newUser = new User({
      firstname,
      lastname,
      phone,
      email,
      username,
      password, // Store hashed password
    });

    await newUser.save();
    return res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // console.log("User found:", user.username); // Check if user is found
    // console.log("Stored hashed password:", user.password); // Log the stored hashed password

    // Compare entered password with stored hash using argon2
  // Compare entered password with stored hash using argon2
  const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Set token expiration to 1 day
    });

    // console.log("Generated Token:", token); // Log the token to verify it

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get Current User
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("friends friendRequests");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// Update Profile
router.put("/update-profile", verifyToken, async (req, res) => {
  const { firstname, lastname, phone, email, profession, hobbies, address, city, state, country, bio } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the provided fields
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if(profession) user.profession = profession;
    if (hobbies) user.hobbies = hobbies;
    if (address) user.address = address;
    if (city) user.city = city;
    if (state) user.state = state;
    if (country) user.country = country;
    if (bio) user.bio = bio;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Friend Recommendations with Filters
// router.post("/recommendations", verifyToken, async (req, res) => {
//   const { filters } = req.body; // Filters array sent from the client

//   try {
//     // Get the current user based on the JWT token
//     const currentUser = await User.findById(req.user.id);

//     if (!currentUser) {
//       return res.status(404).json({ message: "Current user not found" });
//     }

//    // Fetch all users who are friends with the current user
//     const friends = currentUser.friends || []; // Assuming `friends` is an array of user IDs in the User model

//     // Fetch all pending friend requests involving the current user
//     const sentRequests = await FriendRequest.find({ sender: currentUser._id, status: "Pending" });
//     const receivedRequests = await FriendRequest.find({ receiver: currentUser._id, status: "Pending" });

//      // Extract user IDs from friend requests
//     const sentRequestUserIds = sentRequests.map((req) => req.receiver);
//     const receivedRequestUserIds = receivedRequests.map((req) => req.sender);

//     // Combine all excluded user IDs
//     const excludedUserIds = [...friends, ...sentRequestUserIds, ...receivedRequestUserIds];
    
//     // Start with a base query that excludes the current user
//     let query = {
//       _id: { $ne: currentUser._id, $nin: excludedUserIds },
//     };

//     if (filters.length === 0) {
//       // If no filters are selected, recommend users based on hobbies
//       query.hobbies = { $in: currentUser.hobbies };
//     } else {
//       // Build an `$and` array to strictly match all selected filters
//       const andConditions = [];

//       if (filters.includes("hobbies") && currentUser.hobbies) {
//         andConditions.push({ hobbies: { $in: currentUser.hobbies } });
//       }
//       if (filters.includes("city") && currentUser.city) {
//         andConditions.push({ city: currentUser.city });
//       }
//       if (filters.includes("state") && currentUser.state) {
//         andConditions.push({ state: currentUser.state });
//       }
//       if (filters.includes("profession") && currentUser.profession) {
//         andConditions.push({ profession: currentUser.profession });
//       }

//       // If there are conditions, add them to the query
//       if (andConditions.length > 0) {
//         query.$and = andConditions;
//       }
//     }

//     // Fetch users matching the query
//     const recommendations = await User.find(query).select(
//       "firstname lastname username city state hobbies profession"
//     );

//     // Handle empty recommendations
//     if (!recommendations.length) {
//       return res.status(404).json({ message: "No recommendations found" });
//     }

//     // Respond with the list of recommended users
//     res.json(recommendations);
//   } catch (error) {
//     console.error("Error fetching recommendations:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });


router.post("/recommendations", verifyToken, async (req, res) => {
  const { filters } = req.body; // Filters array sent from the client

  try {
    // Get the current user based on the JWT token
    const currentUser = await User.findById(req.user.id).populate('friends'); // Populate friends for current user

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    // Fetch all users who are friends with the current user
    const friends = currentUser.friends || []; // Assuming `friends` is an array of user IDs in the User model

    // Fetch all pending friend requests involving the current user
    const sentRequests = await FriendRequest.find({ sender: currentUser._id, status: "Pending" });
    const receivedRequests = await FriendRequest.find({ receiver: currentUser._id, status: "Pending" });

    // Extract user IDs from friend requests
    const sentRequestUserIds = sentRequests.map((req) => req.receiver);
    const receivedRequestUserIds = receivedRequests.map((req) => req.sender);

    // Combine all excluded user IDs
    const excludedUserIds = [...friends, ...sentRequestUserIds, ...receivedRequestUserIds];
    
    // Start with a base query that excludes the current user
    let query = {
      _id: { $ne: currentUser._id, $nin: excludedUserIds },
    };

    // Filters logic
    if (filters.length === 0) {
      query = {
        ...query,
        mutualFriendsCount: { $gt: 0 }, // Default to mutual friends (must have > 0 mutual friends)
      };
    } else {
      const andConditions = [];

      if (filters.includes("hobbies") && currentUser.hobbies) {
        andConditions.push({ hobbies: { $in: currentUser.hobbies } });
      }
      if (filters.includes("city") && currentUser.city) {
        andConditions.push({ city: currentUser.city });
      }
      if (filters.includes("state") && currentUser.state) {
        andConditions.push({ state: currentUser.state });
      }
      if (filters.includes("profession") && currentUser.profession) {
        andConditions.push({ profession: currentUser.profession });
      }

      if (andConditions.length > 0) {
        query.$and = andConditions;
      }
    }

    // Fetch users matching the query
    const recommendations = await User.find(query).populate('friends').select(
      "firstname lastname username city state hobbies profession friends"
    );

    // Handle empty recommendations
    if (!recommendations.length) {
      return res.status(404).json({ message: "No recommendations found" });
    }

    // Function to find mutual friends count
    const getMutualFriendsCount = (userFriends, recommendedUserFriends) => {
      const mutualFriends = userFriends.filter(friend =>
        recommendedUserFriends.some(friend2 => friend2._id.equals(friend._id))
      );
      return mutualFriends.length;
    };

    // Get mutual friends count for each recommended user
    const recommendationsWithMutualFriends = [];

    for (const user of recommendations) {
      const mutualFriendsCount = getMutualFriendsCount(currentUser.friends, user.friends);
      if (mutualFriendsCount > 0) {
        recommendationsWithMutualFriends.push({
          ...user.toObject(),
          mutualFriends: mutualFriendsCount
        });
      }
    }

    // Fallback to hobbies if no mutual friends found
    if (recommendationsWithMutualFriends.length === 0) {
      query = {
        ...query,
        hobbies: { $in: currentUser.hobbies },
      };

      const hobbyRecommendations = await User.find(query).select(
        "firstname lastname username city state hobbies profession friends"
      );

      recommendationsWithMutualFriends.push(...hobbyRecommendations);
    }

    // Sort recommendations by mutual friends in descending order
    recommendationsWithMutualFriends.sort((a, b) => {
      if (b.mutualFriends === a.mutualFriends) {
        return Math.random() > 0.5 ? 1 : -1; // Randomize when mutual friends are the same
      }
      return b.mutualFriends - a.mutualFriends; // Sort by mutual friends
    });

    res.json(recommendationsWithMutualFriends);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



// Send Friend Request
router.post("/sendFriendRequest", verifyToken, async (req, res) => {
  const { friendId } = req.body; // The friend the user wants to send a request to

  try {
    console.log("Received friendId:", friendId); // Debugging incoming friendId

    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      console.error("Current user not found");
      return res.status(404).json({ message: "Current user not found" });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      console.error("Friend not found");
      return res.status(404).json({ message: "Friend not found" });
    }

    // Ensure friendRequests is initialized as an array
    const friendRequests = currentUser.friendRequests || [];

    // Check if the user has already sent a friend request
    if (friendRequests.includes(friendId)) {
      console.error("Friend request already sent");
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Add to friendRequests of both users
    currentUser.friendRequests.push(friendId);
    friend.friendRequests.push(currentUser._id);

    await currentUser.save();
    await friend.save();

    console.log("Friend request sent successfully");

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Error sending friend request:", error.message || error); // Log error details
    res.status(500).json({ message: "Server error", error: error.message || error });
  }
});


// Fetch Friend Requests
router.get("/friendRequests", verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).populate(
      "friendRequests",
      "firstname lastname profilePicture email"
    );

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(currentUser.friendRequests);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Accept Friend Request
router.post("/acceptFriendRequest", verifyToken, async (req, res) => {
  const { friendId } = req.body; // The friend to accept

  try {
    const currentUser = await User.findById(req.user.id);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Remove from friendRequests
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== friendId
    );
    friend.friendRequests = friend.friendRequests.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    // Add to friends list
    currentUser.friends.push(friendId);
    friend.friends.push(currentUser._id);

    // Save updated data for both users
    await currentUser.save();
    await friend.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Friend Request
router.post("/deleteFriendRequest", verifyToken, async (req, res) => {
  const { friendId } = req.body;

  try {
    const currentUser = await User.findById(req.user.id);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Ensure friendRequests and pendingRequests are initialized as arrays
    currentUser.friendRequests = currentUser.friendRequests || [];
    friend.pendingRequests = friend.pendingRequests || [];

    // Remove friendId from current user's friendRequests
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== friendId
    );

    // Remove current user ID from friend's pendingRequests
    friend.pendingRequests = friend.pendingRequests.filter(
      (id) => id.toString() !== req.user.id
    );

    await currentUser.save();
    await friend.save();

    res.status(200).json({ message: "Friend request deleted successfully" });
  } catch (error) {
    console.error("Error deleting friend request:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Remove Friend
router.delete("/removeFriend/:friendId", verifyToken, async (req, res) => {
  const { friendId } = req.params; // Friend to remove

  try {
    const currentUser = await User.findById(req.user.id); // Get current user
    const friend = await User.findById(friendId); // Get the friend to be removed

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Remove current user from the friend's friend list
    friend.friends = friend.friends.filter((id) => id.toString() !== currentUser._id.toString());
    // Remove friend from current user's friend list
    currentUser.friends = currentUser.friends.filter((id) => id.toString() !== friendId);

    // Save the updated user records
    await currentUser.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// Search for Users by Username
router.get("/search", verifyToken, async (req, res) => {
  const { query } = req.query; // Getting the search term from query parameters

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    // Find users whose usernames contain the search query (case-insensitive)
    const users = await User.find({
      username: { $regex: query, $options: "i" }, // 'i' for case-insensitive matching
    }).select("username"); // You can select additional fields as necessary

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the list of users matching the search query
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
