import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { MessageCircle, Send, Plus } from "lucide-react";
import Loader from "@/components/ui/Loader";
import CreateDialog from "@/components/ui/CreateDialog";
import { useSocketEvents } from "src/hooks/useSocketEvents.js"
import { DropDown } from "@/components/ui/dropDown.jsx";

// Configure axios base URL
axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND}chat`
 || "http://localhost:3000/api/chat";

const Chats = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { subscribeToEvent, emitEvent } = useSocketEvents();
  const [searchUsername, setSearchUsername] = useState("");
  
  const messageEndRef = useRef(null);
  const messageInputRef = useRef(null);

  //scrooll to new message
  
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Run only when messages change
  

  const currentUserId = useSelector((state) => state.auth.id);
  useEffect(() => {
    subscribeToEvent("newMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    })
  }, [currentUserId])

  const [originalConversations, setOriginalConversations] = useState([]); // Store the original conversations

  const filterConversations = (conversations, value) => {
    return conversations.filter((conversation) =>
      conversation.receivers.some((participant) =>
        participant.username.toLowerCase().includes(value.toLowerCase()) // Case-insensitive search
      )
    );
  };
  
  const handleInputChange = (event) => {
    const value = event.target.value;
  
    setSearchUsername(value); // Update the search term state
  
    setConversations((prevConversations) => {
      if (value === "") {
        // If the search input is cleared, return the original list of conversations
        return originalConversations;
      }
  
      // If there is a search term, filter the conversations
      return filterConversations(originalConversations, value);
    });
  };
  
  const loadConversations = (conversations) => {
    setOriginalConversations(conversations); // Store the original conversations
    setConversations(conversations); // Set the conversations initially
  };
  ;

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
          console.log("processedConversations",processedConversations);
          setSelectedConversation(processedConversations[0]);
        },500)
        // setSelectedConversation();
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

          // console.log("selected conversation messages:", response.data.messages);
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
  //use
  const handleCreateConversation = async (otherUserId) => {
    try {
      const response = await axios.post("/conversations", {
        participantIds: [currentUserId, otherUserId],
      });
      setConversations([...conversations, response.data.conversation]);
      setSelectedConversation(response.data.conversation);
    } catch (error) {
      toast.error("Failed to create conversation");
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  {
    /* Pattern 1: Subtle Dots */
  }
  const dotPattern =
    'url("data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%232a3942" fill-opacity="0.4"%3E%3Cpath d="M0 0h20v20H0V0zm10 10h10v10H10V10z"/%3E%3C/g%3E%3C/svg%3E")';

  /* Pattern 2: Geometric Triangles */
  const trianglePattern =
    'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%232a3942" fill-opacity="0.3"%3E%3Cpath d="M0 0h50v50H0V0zm50 50h50v50H50V50z"/%3E%3C/g%3E%3C/svg%3E")';

  /* Pattern 3: Subtle Diagonal Lines */
  const diagonalPattern =
    'url("data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%232a3942" fill-opacity="0.2"%3E%3Cpath d="M0 40L40 0H20L0 20M40 40V20L20 40"/%3E%3C/g%3E%3C/svg%3E")';

  /* Pattern 4: Hexagonal Grid */
  const hexPattern =
    'url("data:image/svg+xml,%3Csvg width="80" height="80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%232a3942" fill-opacity="0.3"%3E%3Cpath d="M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c-5.523 0-10-4.477-10-10z"/%3E%3C/g%3E%3C/svg%3E")';

  /* Pattern 5: Subtle Waves */
  const wavePattern =
    'url("data:image/svg+xml,%3Csvg width="100" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%232a3942" fill-opacity="0.2"%3E%3Cpath d="M0 10c10 0 10-10 20-10s10 10 20 10 10-10 20-10 10 10 20 10"/%3E%3C/g%3E%3C/svg%3E")';

  return (
    <>
      <div className=" h-screen flex bg-[#121b22] text-white">
        {/* Sidebar */}
        <div className="w-[400px] bg-[#1f2c34] border-r border-[#2a3942]">
          {/* Header */}
          <div className="bg-[#202c33] p-4 flex justify-between items-center">
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
                    if (messageInputRef.current) {
                      messageInputRef.current.focus();
                    }
                   }}
                  
                >
                  <div className="w-12 h-12 bg-[#3b5560] rounded-full flex items-center justify-center mr-4">
                    {conversation?.receivers[0].avatar ? <img src={conversation?.receivers[0].avatar} alt="Avatar" className="w-full h-full rounded-full" /> : <MessageCircle size={24} className="text-[#8696a0]" />}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">
                      {conversation.receivers &&
                      conversation.receivers.length > 0
                        ? conversation.receivers[0]?.username
                        : currentUserId === conversation.participants[0]?.id
                        ? conversation.participants[1]?.username
                        : conversation.participants[0]?.username ||
                          "Unknown Participant"}
                    </p>
                    {conversation.messages &&
                      conversation.messages.length > 0 && (
                        <p className="text-sm text-[#8696a0] truncate">
                          {/* {conversation.messages[0].content !== null ? conversation.messages[0].content : 'No messages yet'} */}
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

        {/* Messages View */}
        <div className="flex-grow flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-[#202c33] p-4 flex items-center justify-between pr-9">
                <div className="flex items-center">

                <div className="w-12 h-12 bg-[#3b5560] rounded-full flex items-center justify-center mr-4">
                {selectedConversation?.receivers[0].avatar ? <img src={selectedConversation?.receivers[0].avatar} alt="Avatar" className="w-full h-full rounded-full" /> : <MessageCircle size={24} className="text-[#8696a0]" />}
                </div>
                <div>
                  <p className="font-semibold">
                    {selectedConversation.receivers &&
                    selectedConversation.receivers.length > 0
                    ? selectedConversation.receivers[0]?.username
                    : currentUserId ===
                    selectedConversation.participants[0]?.id
                    ? selectedConversation.participants[1]?.username
                    : selectedConversation.participants[0]?.username ||
                    "Unknown Participant"}
                  </p>
                </div>
                    </div>
                <div>

                <DropDown  />
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
      {/* {createConversationModalOpen && <CreateDialog isOpen={createConversationModalOpen} />} */}
    </>
  );
};

export default Chats;
