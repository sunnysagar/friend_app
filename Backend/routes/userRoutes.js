const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user")
const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Sign Up
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error registering user", error });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get Current User
router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).populate("friends friendRequests");
  res.json(user);
});

// Send Friend Request
router.post("/send-request", verifyToken, async (req, res) => {
  const { friendId } = req.body;
  const user = await User.findById(req.user.id);
  const friend = await User.findById(friendId);
  if (!friend) return res.status(404).json({ message: "User not found" });

  if (friend.friendRequests.includes(user._id))
    return res.status(400).json({ message: "Friend request already sent" });

  friend.friendRequests.push(user._id);
  await friend.save();
  res.json({ message: "Friend request sent" });
});

// Accept/Reject Friend Request
router.post("/respond-request", verifyToken, async (req, res) => {
  const { requesterId, action } = req.body;
  const user = await User.findById(req.user.id);
  const requester = await User.findById(requesterId);

  if (!user.friendRequests.includes(requesterId))
    return res.status(400).json({ message: "No such friend request" });

  user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requesterId);
  if (action === "accept") {
    user.friends.push(requesterId);
    requester.friends.push(user._id);
  }
  await user.save();
  await requester.save();
  res.json({ message: `Friend request ${action}ed` });
});

// Friend Recommendations
router.get("/recommendations", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).populate("friends");
  const allUsers = await User.find({ _id: { $ne: req.user.id } });
  const recommendations = allUsers.filter(
    (u) =>
      !user.friends.some((friend) => friend._id.equals(u._id)) &&
      !u.friendRequests.includes(req.user.id)
  );
  res.json(recommendations);
});

// Search for Users by Username
router.get("/search", verifyToken, async (req, res) => {
  const { query } = req.query;  // Getting the search term from query parameters

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    // Find users whose usernames contain the search query (case-insensitive)
    const users = await User.find({
      username: { $regex: query, $options: "i" },  // 'i' for case-insensitive matching
    }).select("username");  // You can select additional fields as necessary

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
