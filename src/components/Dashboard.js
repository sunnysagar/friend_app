import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Recommendations from "./RecommondationList";
import FriendRequestList from "./FriendRequestList";
import FriendsSection from "./FriendsList";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    profession:"",
    username: "",
    hobbies: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  const [activeSection, setActiveSection] = useState("friendRequests"); // This state controls which section is active

  const handleInputChange = (e) => {
    setUpdatedUser({
      ...updatedUser,
      [e.target.name]: e.target.value
    });
  };

  // Fetch logged-in user details
  const fetchUser = async () => {
    setLoadingUser(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found.");
        return;
      }
      const { data } = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
      setUpdatedUser({
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        phone: data.phone || "",
        email: data.email || "",
        profession: data.profession || "",
        username: data.username || "",
        hobbies: data.hobbies || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        bio: data.bio || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user details.");
      if (err.response?.status === 401) {
        // Token might be invalid/expired, remove it from localStorage
        localStorage.removeItem("token");
        setError("Session expired. Please log in again.");
      }
    } finally {
      setLoadingUser(false);
    }
  };

  const [overlayOpen, setOverlayOpen] = useState(false);
  // Store friend requests statuses
  const [friendRequests, setFriendRequests] = useState({});

   // Send friend request
   const sendFriendRequest = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/users/sendFriendRequest`,
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFriendRequests((prev) => ({
        ...prev,
        [friendId]: "Request Sent",
      }));

      console.log("Friend request sent:", response.data);
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };
  

  // Update user profile
  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/update-profile",
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile updated successfully!");
      setOverlayOpen(false);
      // setSidebarOpen(false); // Close sidebar after update
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  // Search for users with debouncing
  const searchUsers = async () => {
    if (!search.trim()) {
      setResults([]);
      return;
    }
    setLoadingSearch(true);
    setError("");
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/users/search?query=${search}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search users.");
    } finally {
      setLoadingSearch(false);
    }
  };

  // Debounce Effect for Search Input
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchUsers();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    fetchUser();
  }, []);

  const navigate = useNavigate()

  const handleLogout = () =>{
    localStorage.removeItem("token");
    navigate("/");
    alert("Logout successfully!");
  }

  return (
    <div className="dashboard-container">

      <div className="header-content">
          <h1>Dashboard</h1>

          <div className="search-section">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {loadingSearch ? <p>Searching...</p> : null}
         </div>

         <div className="profile-space">

              <div className="user-profile" onClick={() => setSidebarOpen(true)}>

              

                <div className="image-div">
                  {user?.photo? (
                    <img
                    src={user?.photo} // Default photo if no user photo
                    alt="User"
                    className="user-photo"
                  />
                  ): ( <FaUser style={{ fontSize: '24px', color: 'black' }} />)}

                  </div>

                  <div>
                  <h3>{user?.firstname} {user?.lastname}</h3>
                </div>

                </div>
         </div>

          

      </div>

       {/* Toggle Buttons */}
       <div className="toggle-buttons">
        <button
          className={activeSection === "friendRequests" ? "active" : ""}
          onClick={() => setActiveSection("friendRequests")}
        >
          Friend Requests
        </button>
        <button
          className={activeSection === "recommendations" ? "active" : ""}
          onClick={() => setActiveSection("recommendations")}
        >
          Recommendations
        </button>
        <button
          className={activeSection === "friendsList" ? "active" : ""}
          onClick={() => setActiveSection("friendsList")}
        >
          Friends List
        </button>
      </div>

      {/* Full Screen Content */}
      <div className="content-section">
        {activeSection === "friendRequests" && <FriendRequestList />}
        {activeSection === "recommendations" && <Recommendations />}
        {activeSection === "friendsList" && <FriendsSection friends={user?.friends} />}
      </div>

      {/* <div>
        <FriendRequestList />
      </div>

      <div>
        <Recommendations />
      </div>

       <div>
        <FriendsSection friends={user?.friends}  />
      </div> */}

     {/* Search Results Overlay */}
  {search && (
    <div className="overlay">
      <h2>Results:</h2>
      {results.length > 0 ? (
        results.map((u) => (
          <div key={u._id} className="user-resultt">
            <div className="user-infoo">
              {/* User's Photo or FaUser as fallback */}
              <div className="user-photoo">
                {u.photo ? (
                  <img src={u.photo} alt={u.username} />
                ) : (
                  <FaUser />
                )}
              </div>
              {/* User's Name */}
              <span>{u.username}</span>
            </div>
            {/* Add Friend button */}
            <button className="friend-request-btn"

              onClick={() => sendFriendRequest(u._id)}
              disabled={friendRequests[u._id] === "Request Sent"}
              >
              {friendRequests[u._id] || "Add Friend"}</button>
          </div>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
  )}


      {/* Profile Sidebar */}
      {sidebarOpen && (
      <div className="profile-sidebar">
        <div className="sidebar-header">
          <h2>Profile</h2>
          <button onClick={() => setSidebarOpen(false)} className="close-btn">X</button>
        </div>
        <div className="profile-photo-container">
          {user.photo ? (
            <div className="profile-photo">
              <img src={user.photo} alt="User" />
            </div>
          ) : (
            <div className="profile-photo">
              <FaUser size={40}/>
            </div>
          )}
        </div>
        <div className="profile-info">
          <div className="left">
            <h3>{user?.firstname + " " +user?.lastname || 'Full Name'}</h3>
            <h4>{user?.username}</h4>
            <p>{user?.profession || 'Profession'}</p>
            <div className="profile-bio">
              <textarea value={updatedUser.bio} disabled placeholder="Bio" />
            </div>
          </div>
          <div className="right">
          <button onClick={() => setOverlayOpen(true)} className="update-profile-btn">
            Update Profile
          </button>
          </div>
        </div>
        
        {overlayOpen && (
          <div className="profile-overlay">
            <div className="overlay-content">
              <div className="overlay-header">
                <h2>Update Profile</h2>
              </div>
              <div className="form-fields">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstname">First Name</label>
                    <input
                      type="text"
                      id="firstname"
                      placeholder="First Name"
                      name="firstname"
                      value={updatedUser.firstname}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastname">Last Name</label>
                    <input
                      type="text"
                      id="lastname"
                      placeholder="Last Name"
                      name="lastname"
                      value={updatedUser.lastname}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      id="phone"
                      placeholder="Phone"
                      name="phone"
                      value={updatedUser.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Email"
                      name="email"
                      value={updatedUser.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  
                  <div className="form-group">
                    <label htmlFor="profession">Profession</label>
                    <input
                      type="text"
                      id="profession"
                      placeholder="Profession"
                      name="profession"
                      value={updatedUser.profession}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hobbies">Hobbies</label>
                    <input
                      type="text"
                      id="hobbies"
                      placeholder="Hobbies"
                      name="hobbies"
                      value={updatedUser.hobbies}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      placeholder="Address"
                      name="address"
                      value={updatedUser.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      placeholder="City"
                      name="city"
                      value={updatedUser.city}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      placeholder="State"
                      name="state"
                      value={updatedUser.state}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      placeholder="Country"
                      name="country"
                      value={updatedUser.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                 
                  <div className="form-group bio-row">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      placeholder="Bio"
                      name="bio"
                      value={updatedUser.bio}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-buttons">
                  <button onClick={handleProfileUpdate} className="save-btn">Save & Update</button>
                  <button
                    onClick={() => setOverlayOpen(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


      <div className="logout-div">
            <button onClick={handleLogout} className="cancel-btn">
              Logout
            </button>
        </div>

      </div>
    )}

   
    </div>
  );
};

export default Dashboard;
