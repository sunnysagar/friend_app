import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get("http://localhost:5000/api/users/me", {
      headers: { Authorization: token },
    });
    setUser(data);
  };

  const searchUsers = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/api/users/search?query=${search}`,
      {
        headers: { Authorization: localStorage.getItem("token") },
      }
    );
    setResults(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={searchUsers}>Search</button>
      <div>
        <h2>Results:</h2>
        {results.map((u) => (
          <div key={u._id}>
            {u.username}
            <button>Send Friend Request</button>
          </div>
        ))}
      </div>
      <div>
        <h2>Friends:</h2>
        {user?.friends.map((friend) => (
          <div key={friend._id}>{friend.username}</div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
