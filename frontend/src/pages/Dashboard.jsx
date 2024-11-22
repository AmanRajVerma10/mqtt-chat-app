import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axiosInstance from "../axiosConfig";

export default function Dashboard() {
  const history = useHistory();
  const [users, setUsers] = useState([]); // List of registered users
  const [searchTerm, setSearchTerm] = useState(""); // Search filter
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order
  const [currentUser, setCurrentUser] = useState(""); // Logged-in user's username
  const [error, setError] = useState(""); // Error messages

  useEffect(() => {
    // Decode the token and fetch logged-in user's details
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/"); // Redirect to login if no token
    } else {
      const decodedToken = jwtDecode(token);
      fetchCurrentUser(decodedToken.id); // Fetch user details using ID
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      // Fetch users only after currentUser is set
      fetchUsers();
    }
  }, [currentUser, sortOrder]);

  const fetchCurrentUser = async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`); // Endpoint to get user details
      setCurrentUser(response.data.username); // Store the username in state
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setError("Failed to fetch logged-in user details");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      const filteredUsers = response.data.filter(
        (user) => user.username !== currentUser // Exclude the logged-in user
      );
      const sortedUsers = filteredUsers.sort((a, b) => {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Welcome, {currentUser || "User"}!
        </h2>

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

        <ul className="border rounded-lg divide-y">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="p-4 hover:bg-gray-100 cursor-pointer"
            >
              <Link
                to={{
                  pathname: "/chat",
                  state: { username: user.username, currentUser },
                }}
                className="block text-blue-500 hover:underline"
              >
                {user.username}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
