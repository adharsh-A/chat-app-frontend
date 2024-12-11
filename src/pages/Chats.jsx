import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { MessageCircle, Send, Plus, ArrowLeft } from "lucide-react";
import Loader from "@/components/ui/Loader";
import CreateDialog from "@/components/ui/CreateDialog";
import { useSocketEvents } from "@/hooks/useSocketEvents.js";
import { DropDown } from "@/components/ui/dropDown.jsx";

// Configure axios base URL
axios.defaults.baseURL =
  `${import.meta.env.VITE_BACKEND}chat` || "http://localhost:3000/api/chat";
const token = localStorage.getItem('token'); 
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const Chats = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { subscribeToEvent, emitEvent } = useSocketEvents();
  const [searchUsername, setSearchUsername] = useState("");
  const [isMobileConversationListVisible, setIsMobileConversationListVisible] = useState(true);

  const messageEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Scroll to new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const currentUserId = useSelector((state) => state.auth.id);
  
  useEffect(() => {
    subscribeToEvent("newMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, [currentUserId]);

  const [originalConversations, setOriginalConversations] = useState([]);

  const filterConversations = (conversations, value) => {
    return conversations.filter((conversation) =>
      conversation.receivers.some(
        (participant) =>
          participant.username.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchUsername(value);

    setConversations((prevConversations) => {
      if (value === "") {
        return originalConversations;
      }
      return filterConversations(originalConversations, value);
    });
  };

  const loadConversations = (conversations) => {
    setOriginalConversations(conversations);
    setConversations(conversations);
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/users/${currentUserId}/conversations`
        );
        const processedConversations = response.data.conversations.map(
          (conv) => ({
            ...conv,
            participants: conv.participants || [],
            messages: conv.messages || [],
          })
        );

        loadConversations(processedConversations);
        setTimeout(() => {
          setSelectedConversation(processedConversations[0]);
        }, 500);
      } catch (error) {
        toast.error("Failed to fetch conversations");
        setConversations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation) {
        try {
          const response = await axios.get(
            `/conversations/${selectedConversation.id}/messages`
          );
          setMessages(response.data.messages);
        } catch (error) {
          toast.error("Failed to fetch messages");
          setMessages([]);
        }
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await axios.post("/messages", {
        senderId: currentUserId,
        conversationId: selectedConversation.id,
        content: newMessage,
      });

      setMessages((prevMessages) => [...prevMessages, response.data.message]);
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleCreateConversation = async (otherUserId) => {
    try {
      const response = await axios.post("/conversations", {
        participantIds: [currentUserId, otherUserId],
      });
      setConversations([...conversations, response.data.conversation]);
      setSelectedConversation(response.data.conversation);
      // For mobile, switch to messages view after creating conversation
      setIsMobileConversationListVisible(false);
    } catch (error) {
      return;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const diagonalPattern =
    'url("data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%232a3942" fill-opacity="0.2"%3E%3Cpath d="M0 40L40 0H20L0 20M40 40V20L20 40"/%3E%3C/g%3E%3C/svg%3E")';

  const getConversationName = (conversation) => {
    return conversation.receivers && conversation.receivers.length > 0
      ? conversation.receivers[0]?.username
      : currentUserId === conversation.participants[0]?.id
      ? conversation.participants[1]?.username
      : conversation.participants[0]?.username || "Unknown Participant";
  };

  const getConversationAvatar = (conversation) => {
    return conversation.receivers && conversation.receivers.length > 0 && conversation.receivers[0]?.avatar
      ? conversation.receivers[0].avatar
      : null;
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#121b22] text-white">
      {/* Mobile Back Button & Conversation List Toggle */}
      <div className="md:hidden flex items-center bg-[#202c33] p-4">
        {!isMobileConversationListVisible && selectedConversation && (
          <button 
            onClick={() => setIsMobileConversationListVisible(true)}
            className="mr-4"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h2 className="text-xl font-semibold flex-grow">
          {!isMobileConversationListVisible && selectedConversation 
            ? getConversationName(selectedConversation) 
            : "Chats"}
        </h2>
        <CreateDialog
          onCreateConversation={handleCreateConversation}
          currentUserId={currentUserId}
        />
      </div>

      {/* Sidebar - Responsive */}
      <div className={`
        ${isMobileConversationListVisible ? 'block' : 'hidden'} 
        md:block 
        w-full md:w-[400px] 
        bg-[#1f2c34] 
        border-r border-[#2a3942] 
        h-[calc(100vh-56px)] md:h-screen
      `}>
        {/* Desktop Header */}
        <div className="hidden md:flex bg-[#202c33] p-4 justify-between items-center">
          <h2 className="text-xl font-semibold">Chats</h2>
          <CreateDialog
            onCreateConversation={handleCreateConversation}
            currentUserId={currentUserId}
          />
        </div>

        {/* Search Bar */}
        <div className="p-3">
          <input
            type="text"
            placeholder="Search chats"
            onChange={handleInputChange}
            value={searchUsername}
            className="w-full p-2 bg-[#2a3942] rounded-lg text-white placeholder-[#8696a0] border-none"
          />
        </div>

        {/* Conversations List */}
        <div className="overflow-y-auto h-[calc(100vh-140px)]">
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 flex items-center hover:bg-[#2a3942] cursor-pointer ${
                  selectedConversation?.id === conversation.id
                    ? "bg-[#2a3942]"
                    : ""
                }`}
                onClick={() => {
                  setSelectedConversation(conversation);
                  setIsMobileConversationListVisible(false);
                  if (messageInputRef.current) {
                    messageInputRef.current.focus();
                  }
                }}
              >
                <div className="w-12 h-12 bg-[#3b5560] rounded-full flex items-center justify-center mr-4">
                  {getConversationAvatar(conversation) ? (
                    <img
                      src={getConversationAvatar(conversation)}
                      alt="Avatar"
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <MessageCircle size={24} className="text-[#8696a0]" />
                  )}
                </div>
                <div className="flex-grow">
                  <p className="font-semibold">
                    {getConversationName(conversation)}
                  </p>
                  {conversation.messages && conversation.messages.length > 0 && (
                    <p className="text-sm text-[#8696a0] truncate">
                      {conversation.messages[0].content || "No messages yet"}
                    </p>
                  )}
                </div>
                <span className="text-xs text-[#8696a0]">
                  {conversation.messages && conversation.messages.length > 0
                    ? new Date(
                        conversation.messages[0].createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            ))
          ) : (
            <p className="text-[#8696a0] text-center mt-10">
              No conversations found
            </p>
          )}
        </div>
      </div>

      {/* Messages View - Responsive */}
      <div className={`
        ${isMobileConversationListVisible ? 'hidden' : 'flex'} 
        md:flex 
        flex-col 
        flex-grow 
        h-[calc(100vh-56px)] md:h-screen
      `}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-[#202c33] p-4 flex items-center justify-between pr-9">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#3b5560] rounded-full flex items-center justify-center mr-4">
                  {getConversationAvatar(selectedConversation) ? (
                    <img
                      src={getConversationAvatar(selectedConversation)}
                      alt="Avatar"
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <MessageCircle size={24} className="text-[#8696a0]" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">
                    {getConversationName(selectedConversation)}
                  </p>
                </div>
              </div>
              <div>
                <DropDown />
              </div>
            </div>

            {/* Messages Area */}
            <div
              className="flex-grow overflow-y-auto p-4 bg-[#0b141a]"
              style={{
                backgroundImage: diagonalPattern,
                backgroundRepeat: "repeat",
              }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.senderId === currentUserId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[65%] p-3 rounded-lg ${
                      message.senderId === currentUserId
                        ? "bg-[#005c4b] text-white"
                        : "bg-[#202c33] text-white"
                    }`}
                  >
                    <p>{message.content}</p>
                    <small className="block text-right text-xs text-[#8696a0] mt-1">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                </div>
              ))}
              {/* Ref for the last element to scroll into view */}
              <div ref={messageEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-[#202c33] p-4 flex items-center">
              <input
                type="text"
                value={newMessage}
                ref={messageInputRef}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-grow p-3 bg-[#2a3942] text-white rounded-lg mr-4 border-none placeholder-[#8696a0]"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#00a884] text-white p-3 rounded-full hover:bg-[#02bc97]"
              >
                <Send size={24} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col justify-center items-center text-[#8696a0] text-center">
            <MessageCircle size={128} className="mb-4 text-[#2a3942]" />
            <h2 className="text-2xl mb-2">Keep your phone connected</h2>
            <p>Select a chat or start a new conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;