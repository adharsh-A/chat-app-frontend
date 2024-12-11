import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "@/components/ui/Loader";

axios.defaults.baseURL = 
  import.meta.env.VITE_BACKEND 
    ? `${import.meta.env.VITE_BACKEND}chat`
    : "http://localhost:3000/api/chat";


const Profile = () => {
  const [username, setUsername] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [image, setImage] = useState("https://i.imgur.com/TM94NQl.png");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const id = useSelector((state) => state.auth.id);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/users/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      });
      setUsername(response.data?.user?.username || "Unknown User");
      setEmail(response.data?.user?.email || "No email provided");
      setImage(response.data?.user?.avatar || "https://i.imgur.com/TM94NQl.png");
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }finally{
      setIsLoading(false);
    }
  }, [id]); // Dependency array ensures fetchUsers is recreated if `id` changes.

  useEffect(() => {
    fetchUsers(); // Call the memoized function
  }, [fetchUsers]);

  const handleSave = async () => {
    setIsEditing(false);
    try {
      await axios.put(`/users/${id}`, {
        username,
        email,
        avatar: image,
      }, {
        withCredentials: true,
      });
      console.log("User data saved successfully");
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
    };
  const userImage = image || "https://i.imgur.com/TM94NQl.png";
  if (isLoading) {
    return <Loader/>
  }

  return (
    <div className="h-screen flex items-center justify-center bg-black/30 text-white">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
            <span className="text-3xl font-bold text-white "><img src={userImage} alt="EmailSentIcon" className="rounded-full" /></span>
          </div>
          <h2 className="text-xl font-semibold mt-4">{username}</h2>
          <p className="text-gray-400">{email}</p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!isEditing}
              className={`w-full p-3 rounded-lg bg-gray-700 text-gray-200 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isEditing ? "border-gray-600" : "border-transparent"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              className={`w-full p-3 rounded-lg bg-gray-700 text-gray-200 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isEditing ? "border-gray-600" : "border-transparent"
              }`}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 text-gray-300 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
