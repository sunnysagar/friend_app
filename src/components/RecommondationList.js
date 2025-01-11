import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style.css";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Store current user details
  const [filters, setFilters] = useState([]); // Store active filters
  const [showFilters, setShowFilters] = useState(false);

  // Store friend requests statuses
  const [friendRequests, setFriendRequests] = useState({});

  // Fetch current user details
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // Fetch recommendations based on selected filters
  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem("token");
      // Default to mutual friends and hobbies if no filters are selected
      const activeFilters = filters.length > 0 ? filters : ["mutualFriends", "hobbies"];

      const response = await axios.post(
        "http://localhost:5000/api/users/recommendations",
        {
          filters: activeFilters,  // Send the active filters, default filters if none are selected
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecommendations(response.data); // Update the recommendations list
      console.log("Updated recommendations:", response.data); // Debugging log
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

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

  // Fetch data on component mount
  useEffect(() => {
    fetchCurrentUser(); // Fetch the current user's details
  }, []);

  // Trigger fetchRecommendations when filters change
  useEffect(() => {
    if (currentUser) {
      fetchRecommendations();
    }
  }, [filters, currentUser]);

  const handleFilterChange = (filter) => {
    setFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter]
    );
  };

  return (
    <div className="recommendations-container">
      <div className="header">
        <h1>Friend Recommendations</h1>
        <button
          className="filter-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          More Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters">
          <label>
            <input
              type="checkbox"
              checked={filters.includes("hobbies")}
              onChange={() => handleFilterChange("hobbies")}
            />
            Hobbies
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.includes("city")}
              onChange={() => handleFilterChange("city")}
            />
            City
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.includes("state")}
              onChange={() => handleFilterChange("state")}
            />
            State
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.includes("profession")}
              onChange={() => handleFilterChange("profession")}
            />
            Profession
          </label>
        </div>
      )}

      <div className="recommendation-list">
        {recommendations.map((user) => (
          <div className="recommendation-item" key={user._id}>
            <div className="user-info">
              <h2>{user.firstname} {user.lastname}</h2>
              <p>{user.mutualFriends || 0} mutual friends</p>
              <p>@{user.username}</p>
            </div>
            <button
              className="add-friend-button"
              onClick={() => sendFriendRequest(user._id)}
              disabled={friendRequests[user._id] === "Request Sent"}
            >
              {friendRequests[user._id] || "Add Friend"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
