import React, { useState, useEffect } from 'react';
import { User, MessageCircle, Search, PlusCircleIcon } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Loader from './Loader';
// Configure axios base URL
axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND}chat`
  || "http://localhost:3000/api/chat";
 

const CreateDialog = ({ onCreateConversation, currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to control Dialog open/close

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/users', {
          params: {
            exclude: currentUserId,
            search: searchTerm,
            limit: 50, // Limit number of returned users
          },
        });

        if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          // console.error('Unexpected response format', response);
          setUsers([]);
        }
      } catch (error) {
        // console.error('Failed to fetch users:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchTerm.length > 0) {
      fetchUsers();
    } else {
      fetchUsers();
    }
  }, [searchTerm, currentUserId]);

  const handleUserClick = (userId) => {
    onCreateConversation(userId);
    setIsOpen(false); // Close the dialog
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#00a884] text-white hover:bg-[#02bc97]"
        >
          <PlusCircleIcon className="mr-2" size={20} /> New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1f2c34] border-none">
        <DialogHeader>
          <DialogTitle className="text-white">Start a New Conversation</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8696a0]"
            size={20}
          />
          <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-2 bg-[#2a3942] rounded-lg text-white placeholder-[#8696a0] border-none focus:outline-none focus:ring-2 focus:ring-[#00a884]"
          />
        </div>

        {/* Users List */}
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <Loader />
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-3 hover:bg-[#2a3942] rounded-lg cursor-pointer transition-colors"
                onClick={() => handleUserClick(user.id)}
              >
                <div className="w-10 h-10 bg-[#3b5560] rounded-full flex items-center justify-center mr-4">
                  {user.profilePicture ? <img src={user.profilePicture} alt="Profile" className="w-10 h-10 rounded-full" /> : <User size={24} className="text-[#8696a0]" />}
                </div>
                <div>
                  <p className="text-white font-semibold">{user.username}</p>
                  <p className="text-sm text-[#8696a0]">{user.email}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-[#8696a0]">No users found</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
