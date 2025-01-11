import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import "../style.css"; // Create a CSS file for styling

const FriendsSection = ({friends}) => {
  const [friendss, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null); // Track selected friend for profile view

  // Function to remove a friend from the list
  const removeFriend = async (friendId) => {
    try {
        const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/removeFriend/${friendId}`,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      setFriends(friends.filter((friend) => friend._id !== friendId));
      alert("Friend Removed successfully!")
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  
  // Handle selecting a friend to view their profile
  const openProfile = (friend) => {
    setSelectedFriend(friend);
  };

  // Handle closing the profile and going back to the friend list
  const closeProfile = () => {
    setSelectedFriend(null);
  };



return (
    <div className="friends-section">
      {/* If a friend is selected, show the profile page */}
      {selectedFriend ? (
        <div className="friend-profile">
          <button className="close-profile-button" onClick={closeProfile}>
            Close Profile
          </button>
          <div className="profile-details">
            <div className="profile-image">
              {selectedFriend.profilePicture ? (
                <img
                  src={selectedFriend.profilePicture}
                  alt={`${selectedFriend.firstname} ${selectedFriend.lastname}`}
                />
              ) : (
                <FaUser size={100} />
              )}
            </div>
            <h3>{selectedFriend.firstname} {selectedFriend.lastname}</h3>
            <p>username: {selectedFriend.username}</p>
            <p>Email: {selectedFriend.email}</p>
            <p>Phone: {selectedFriend.phone}</p>
            <p>{selectedFriend.bio}</p>
            {/* Display other profile details you wish */}
          </div>
        </div>
      ) : (
        // Friend List View
        <div className="friend-list">
          <h2>Friends:</h2>
          {friends?.length > 0 ? (
            friends.map((friend) => (
              <div key={friend._id} className="friend-item">
                <div className="friend-left" onClick={() => openProfile(friend)}>
                  <div className="friend-image">
                    {friend.profilePicture ? (
                      <img
                        src={friend.profilePicture}
                        alt={`${friend.firstname} ${friend.lastname}`}
                      />
                    ) : (
                      <FaUser size={40} />
                    )}
                  </div>
                  <div className="friend-details">
                    <p className="friend-name">
                      {friend.firstname} {friend.lastname}
                    </p>
                  
                  </div>
                </div>

                <div className="friend-right">
                  <button
                    className="close-button"
                    onClick={() => console.log("Close clicked for", friend._id)}
                  >
                    Close
                  </button>
                  <button
                    className="remove-button"
                    onClick={() => removeFriend(friend._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>You have no friends added yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendsSection;
