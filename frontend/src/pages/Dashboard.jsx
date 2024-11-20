import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [sortOrder]); // Fetch users when sortOrder changes

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/users"); // Updated path
      const sortedUsers = [...response.data].sort((a, b) => {
        return sortOrder === "asc"
          ? a.username.localeCompare(b.username)
          : b.username.localeCompare(a.username);
      });
      setUsers(sortedUsers);
    } catch (error) {
      setError("Failed to fetch users");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">User Dashboard</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by username"
            value={searchTerm}
            onChange={handleSearch}
            className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sort: {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>

        <ul>
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="p-4 border-b last:border-none hover:bg-gray-100 cursor-pointer"
              onClick={() => alert(`Chat with ${user.username} coming soon!`)} // Navigate to chat page later
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
