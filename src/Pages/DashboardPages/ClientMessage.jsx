import React, { useEffect, useState } from 'react';
import { MessageCircle, FileText, Image, Clock, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

function ClientMessage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://servies-pro-server.onrender.com/message-user');
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Function to format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If message is from today, show time only
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    
    // If message is from this week, show day name
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Function to get message icon based on type
  const getMessageIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText size={16} className="text-red-500" />;
      case 'image':
        return <Image size={16} className="text-blue-500" />;
      default:
        return <MessageCircle size={16} className="text-green-500" />;
    }
  };

  // Function to get message preview text
  const getMessagePreview = (message) => {
    switch (message.type) {
      case 'text':
        return message.message.length > 30 
          ? `${message.message.slice(0, 30)}...` 
          : message.message;
      case 'pdf':
        return "Sent a PDF document";
      case 'image':
        return "Sent an image";
      default:
        return "New message";
    }
  };

  const MessageItem = ({ message }) => (
    <Link
      to={`/chat/${message.senderId}/${message.serviceId}`}
      key={message._id}
      className="flex items-center p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 border border-gray-100 hover:border-blue-200 cursor-pointer"
    >
      <div className="relative">
        <img 
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-100" 
          src={message?.profileImage || "/api/placeholder/50/50"} 
          alt={message.senderName}
        />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      </div>
      
      <div className="flex-1 ml-4">
        <div className="flex justify-between items-center mb-1">
          <h2 className="font-semibold text-gray-800">{message.senderName}</h2>
          <div className="flex items-center text-gray-500 text-xs">
            <Clock size={12} className="mr-1" />
            {formatTime(message.timestamp)}
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm">
          {getMessageIcon(message.type)}
          <span className="ml-1">{getMessagePreview(message)}</span>
        </div>
        
        {/* Add the service name with a briefcase icon */}
        <div className="flex items-center text-gray-500 text-xs mt-1">
          <Briefcase size={12} className="mr-1" />
          <span>{message.serviceName || "Unknown Service"}</span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
        <div className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-medium">
          {messages.length} conversations
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Loading conversations...</span>
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-2">
          {messages.map((message) => (
            <MessageItem message={message} key={message._id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <MessageCircle size={40} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No messages found</p>
        </div>
      )}
    </div>
  );
}

export default ClientMessage;