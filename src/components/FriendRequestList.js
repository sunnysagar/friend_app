import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import "../style.css"; // Custom CSS file

const FriendRequestList = () => {
  const [friendRequests, setFriendRequests] = useState([]);

  // Fetch friend requests
  const fetchFriendRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5001/api/users/friendRequests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFriendRequests(response.data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  // Accept friend request
  const handleAccept = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5001/api/users/acceptFriendRequest",
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the list after accepting
      setFriendRequests((prev) =>
        prev.filter((request) => request._id !== friendId)
      );
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  // Delete friend request
  const handleDelete = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5001/api/users/deleteFriendRequest",
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the list after deleting
      setFriendRequests((prev) =>
        prev.filter((request) => request._id !== friendId)
      );
    } catch (error) {
      console.error("Error deleting friend request:", error);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  return (
    <div className="friend-request-list">
      <h1>Friend Requests</h1>
      {friendRequests.length > 0 ? (
        friendRequests.map((request) => (
          <div className="friend-request-item" key={request._id}>
            <div className="left">
              {request.profilePicture ? (
                <img
                  src={request.profilePicture}
                  alt="Profile"
                  className="profile-pic"
                />
              ) : (
                <FaUser className="default-icon" />
              )}
              <span className="name">
                {request.firstname} {request.lastname}
              </span>
            </div>
            <div className="right">
              <button
                className="confirm-btn"
                onClick={() => handleAccept(request._id)}
              >
                Confirm
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(request._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No friend requests at the moment.</p>
      )}
    </div>
  );
};

export default FriendRequestList;
