import React, { useEffect, useRef, useState } from "react";
import { FiSend, FiImage, FiFileText, FiDollarSign, FiDownload } from "react-icons/fi";
import { Link, useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { BsArrowUpRightCircleFill, BsThreeDotsVertical } from "react-icons/bs";
import { useGetUser } from "../../AuthProvider/getUser";
import { FaArrowLeft } from "react-icons/fa6";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

function ChatBox() {
  const { userId, serviceId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [socket, setSocket] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { data, isLoading, isError } = useGetUser();
  const [clientData, setClientData] = useState(null);
  const [service, setService] = useState(null);
  const messagesEndRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const messageContainerRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connect to socket server
  useEffect(() => {
    if (!userId) return;
    const newSocket = io("https://servies-pro-server.onrender.com");
    setSocket(newSocket);
    const roomId = `${userId}${serviceId}`;
    newSocket.on("connect", () => {
      newSocket.emit("joinUser", roomId);
    });

    return () => newSocket.disconnect();
  }, [userId, serviceId]);

  // Receive messages
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("userTyping", () => {
      setTyping(true);
    });

    socket.on("userStoppedTyping", () => {
      setTyping(false);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [socket]);

  useEffect(() => {
    const fetchMessages = async () => {
      const roomId = `${userId}${serviceId}`;
      try {
        const res = await fetch(`https://servies-pro-server.onrender.com/api/messages/${roomId}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    if (userId && serviceId) {
      fetchMessages();
    }
  }, [userId, serviceId]);

  // Adjust height on window resize
  useEffect(() => {
    const handleResize = () => {
      adjustMessageContainerHeight();
    };

    window.addEventListener('resize', handleResize);
    adjustMessageContainerHeight(); // Initial adjustment
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const adjustMessageContainerHeight = () => {
    if (messageContainerRef.current) {
      const viewportHeight = window.innerHeight;
      const navbarHeight = 64; // Approximate navbar height
      const headerHeight = 72; // Approximate header height
      const inputAreaHeight = 80; // Approximate input area height
      
      // Adjust the container height to fit the viewport
      const containerHeight = viewportHeight - navbarHeight - headerHeight - inputAreaHeight;
      messageContainerRef.current.style.height = `${containerHeight}px`;
    }
  };

  // Upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "flybook");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dljmobi4k/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  };

  // Handle file download
  const handleDownload = async (url, filename) => {
    setDownloading(true);
    try {
      // Create a temporary anchor element
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      
      // Extract filename from URL if not provided
      if (!filename) {
        filename = url.split('/').pop();
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // Send message
  const handleSend = async () => {
    if (!newMsg && !file) return;

    setUploading(true);

    let uploadedUrl = null;
    let type = "text";
    let fileName = null;

    try {
      if (file) {
        uploadedUrl = await uploadToCloudinary(file);
        type = file.type.includes("image") ? "image" : "pdf";
        fileName = file.name;
      }

      const msgObj = {
        senderId: data.userId,
        senderName: data.name,
        serviceId: serviceId,
        serviceName: service?.title,
        message: newMsg,
        roomId: `${userId}${serviceId}`,
        fileUrl: uploadedUrl,
        fileName: fileName,
        type: type,
        role: (data?.role === "admin" || data?.role === "moderator") ? "admin" : "client",
        profileImage: data?.profileImage || "https://i.ibb.co.com/t9Q5HDC/f10ff70a7155e5ab666bcdd1b45b726d.jpg",
        timestamp: new Date().toISOString(),
      };

      socket.emit("send_message", msgObj);
      setNewMsg("");
      setFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  // Send payment request message
  const sendPaymentRequest = () => {
    if (!socket) return;

    const paymentMsg = {
      senderId: data.userId,
      senderName: data.name,
      serviceId: serviceId,
      serviceName: service?.title,
      message: "Please complete your payment for this service",
      roomId: `${userId}${serviceId}`,
      fileUrl: null,
      type: "payment",
      role: "admin",
      profileImage: data?.profileImage || "https://i.ibb.co.com/t9Q5HDC/f10ff70a7155e5ab666bcdd1b45b726d.jpg",
      paymentAmount: service?.price || "Custom price",
      paymentId: `PAY-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", paymentMsg);
  };

  // Handle payment message click
  const handlePaymentMessageClick = (paymentId) => {
    // Check if user role is not admin or moderator
    if (data.role !== 'admin' && data.role !== 'moderator') {
      // Navigate to payment route with necessary params
      navigate(`/service-book/${serviceId}`);
    }
  };
  
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch("https://servies-pro-server.onrender.com/client-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setClientData(data);
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    if (data?.role === "admin" || data?.role === "moderator") {
      fetchUserData(userId);
    }
  }, [userId, data]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`https://servies-pro-server.onrender.com/services/${serviceId}`);
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchService();
  }, [serviceId]);

  // Handle file input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create preview for images
    if (selectedFile && selectedFile.type.includes("image")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  // Typing indicator
  const handleTyping = () => {
    if (socket) {
      socket.emit("typing", `${userId}${serviceId}`);
      
      if (typingTimeout) clearTimeout(typingTimeout);
      
      const timeout = setTimeout(() => {
        socket.emit("stopTyping", `${userId}${serviceId}`);
      }, 2000);
      
      setTypingTimeout(timeout);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format time from message timestamp
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "";
    }
  };

  const cancelFileUpload = () => {
    setFile(null);
    setFilePreview(null);
  };

  // Utility to load image as base64 for PDF embedding
  const getImageDataUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/jpeg");
        resolve(dataURL);
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  // Download conversation as PDF (with images embedded)
  const downloadConversationAsPDF = async () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4"
    });

    doc.setFontSize(18);
    doc.text("Chat Conversation", 40, 40);
    doc.setFontSize(12);

    let y = 60;
    const pageHeight = doc.internal.pageSize.height;
    const leftMargin = 40;
    const rightMargin = 40;
    const maxLineWidth = doc.internal.pageSize.width - leftMargin - rightMargin;
    const lineHeight = 18;
    const imageMaxWidth = 200;
    const imageMaxHeight = 150;

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const time = formatMessageTime(msg.timestamp);
      const sender = msg.senderName || "Unknown";
      let text = `[${time}] ${sender}: `;

      if (msg.type === "text") {
        text += msg.message;
      } else if (msg.type === "image") {
        text += "[Image]";
      } else if (msg.type === "pdf") {
        text += `[Document] ${msg.fileName || ''}`;
      } else if (msg.type === "payment") {
        text += `[Payment Request] ${msg.message}`;
      } else {
        text += msg.message;
      }

      // Split text and print
      const splitText = doc.splitTextToSize(text, maxLineWidth);
      if (y + splitText.length * lineHeight > pageHeight - 40) {
        doc.addPage();
        y = 40;
      }
      doc.text(splitText, leftMargin, y);
      y += splitText.length * lineHeight;

      // If message is image, embed image preview below text
      if (msg.type === "image" && msg.fileUrl) {
        if (y + imageMaxHeight > pageHeight - 40) {
          doc.addPage();
          y = 40;
        }
        try {
          // Load image data URL
          // eslint-disable-next-line no-await-in-loop
          const dataUrl = await getImageDataUrl(msg.fileUrl);
          if (dataUrl) {
            // Calculate image size while keeping aspect ratio
            const img = new Image();
            img.src = dataUrl;
            await new Promise(r => (img.onload = r));
            let imgWidth = img.width;
            let imgHeight = img.height;

            const widthRatio = imageMaxWidth / imgWidth;
            const heightRatio = imageMaxHeight / imgHeight;
            const ratio = Math.min(widthRatio, heightRatio, 1);

            imgWidth = imgWidth * ratio;
            imgHeight = imgHeight * ratio;

            doc.addImage(dataUrl, "JPEG", leftMargin, y, imgWidth, imgHeight);
            y += imgHeight + 10;
          }
        } catch (err) {
          console.error("Image embed failed:", err);
        }
      }
    }

    doc.save(`conversation_${userId}_${serviceId}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Mobile view: Full viewport width */}
      <div className="w-full mx-auto md:max-w-4xl md:mt-6 bg-white shadow-lg md:rounded-xl overflow-hidden flex flex-col h-[calc(100vh-79px)] md:h-[95vh]">
        {/* Header - More compact for mobile */}
        {data?.role === "admin" || data?.role === "moderator" ? (
          <div className="w-full bg-gradient-to-r from-blue-500 to-blue-600 px-2 py-2 md:p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <Link to={`/admin-dashboard/client-messages`} className="text-white hover:bg-blue-600 p-1.5 rounded-full transition-all">
                <FaArrowLeft className="text-sm md:text-lg" />
              </Link>
              <div className="relative">
                <img
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-white object-cover"
                  src={clientData?.profileImage || "https://i.ibb.co.com/t9Q5HDC/f10ff70a7155e5ab666bcdd1b45b726d.jpg"}
                  alt="Profile"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm md:text-xl font-semibold text-white truncate max-w-[100px] md:max-w-full">{clientData?.name}</h1>
                <span className="text-xs text-blue-100 hidden sm:block">Online now</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 px-2 py-1 rounded-lg">
                <h1 className="text-xs md:text-sm text-white truncate max-w-[90px] md:max-w-[200px]">{service?.title}</h1>
              </div>

              {/* Payment Request Button - Only visible for admin/moderator */}
              <button 
                onClick={sendPaymentRequest}
                className="text-white bg-green-500 hover:bg-green-600 p-1.5 rounded-full transition-all flex items-center justify-center"
                title="Send Payment Request"
              >
                <FiDollarSign className="text-sm md:text-base" />
              </button>

              {/* Download Conversation PDF Button */}
              <button
                onClick={downloadConversationAsPDF}
                className="text-white bg-purple-600 hover:bg-purple-700 p-2 rounded-lg transition-all flex items-center gap-1"
                title="Download Conversation as PDF"
              >
                <FiDownload />
                <span className="hidden md:inline">Download PDF</span>
              </button>

              <button className="text-white hover:bg-blue-600 p-1.5 rounded-full transition-all">
                <BsThreeDotsVertical className="text-sm md:text-base" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full bg-gradient-to-r from-blue-500 to-blue-600 px-2 py-2 md:p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <Link to={`/service/${serviceId}`} className="text-white hover:bg-blue-600 p-1.5 rounded-full transition-all">
                <FaArrowLeft className="text-sm md:text-lg" />
              </Link>
              <div className="flex flex-col">
                <h1 className="text-sm md:text-xl font-semibold text-white truncate max-w-[160px] md:max-w-full">{service?.title}</h1>
                <span className="text-xs text-blue-100 hidden md:block">Service ID: {serviceId}</span>
              </div>
            </div>
            <button className="text-white hover:bg-blue-600 p-1.5 rounded-full transition-all">
              <BsThreeDotsVertical className="text-sm md:text-base" />
            </button>
          </div>
        )}

        {/* Messages - Dynamically adjusted height */}
        <div 
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 bg-gray-50"
        >
          {messages.map((msg, i) => {
            const isOwnMessage = msg.senderId === data?.userId;
            const prevMsg = messages[i - 1];
            const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId;
            const isSameDay = prevMsg && new Date(msg.timestamp).toDateString() === new Date(prevMsg.timestamp).toDateString();
            const isPaymentMessage = msg.type === "payment";

            return (
              <React.Fragment key={i}>
                {(!isSameDay || i === 0) && (
                 <div className="flex justify-center my-2 md:my-4">
                   <div className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                     {new Date(msg.timestamp).toLocaleDateString()}
                   </div>
                 </div>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} items-end gap-1 md:gap-2`}
                >
                  {!isOwnMessage && showAvatar && (
                    <img 
                      src={msg.profileImage || "https://i.ibb.co.com/t9Q5HDC/f10ff70a7155e5ab666bcdd1b45b726d.jpg"} 
                      alt="Avatar" 
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                    />
                  )}
                  
                  <div
                    className={`relative ${isOwnMessage ? "order-1" : "order-2"} max-w-1/2`}
                  >
                    {isPaymentMessage ? (
                      <div 
                        onClick={() => handlePaymentMessageClick(msg.paymentId)}
                        className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white cursor-pointer hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="text-lg" />
                          <div>
                            <p className="text-xs md:text-sm font-medium">Payment Request</p>
                            <p className="text-xs break-words whitespace-pre-wrap">{msg.message}</p>
                            {msg.paymentAmount && (
                              <p className="text-xs font-bold mt-1">Amount: ${msg.paymentAmount}</p>
                            )}
                            <div className="flex items-center gap-1 mt-1 text-green-200">
                              <span className="text-[10px]">Click to process payment</span>
                              <BsArrowUpRightCircleFill className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                        <span className="text-[8px] md:text-[10px] block mt-0.5 md:mt-1 text-green-100">
                          {formatMessageTime(msg.timestamp)}
                        </span>
                      </div>
                    ) : (
                      <div 
                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl ${
                          isOwnMessage 
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                            : "bg-white  text-gray-800 rounded-bl-none border border-gray-200"
                        } shadow-sm`}
                      >
                        {!isOwnMessage && showAvatar && (
                          <p className="text-xs text-gray-500 font-medium mb-0.5 md:mb-1">{msg.senderName}</p>
                        )}
                        
                        {msg.type === "text" && (
                          <p className="text-xs md:text-sm break-words whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        )}
                        
                        {msg.type === "image" && (
                          <>
                            {msg.message && (
                              <p className="text-xs md:text-sm mb-1 md:mb-2 break-words whitespace-pre-wrap">
                                {msg.message}
                              </p>
                            )}
                            <div className="rounded-lg overflow-hidden relative group">
                              <img
                                src={msg.fileUrl}
                                alt="uploaded"
                                className="w-full max-h-40 md:max-h-60 object-contain cursor-pointer"
                                onClick={() => window.open(msg.fileUrl, '_blank')}
                              />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(msg.fileUrl, msg.fileName || 'image.jpg');
                                  }}
                                  disabled={downloading}
                                  className={`bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 rounded-full`}
                                  title="Download Image"
                                >
                                  {downloading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <FiDownload size={14} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {msg.type === "pdf" && (
                          <div className={`flex items-center gap-1 md:gap-2 p-1.5 md:p-2 rounded-lg ${isOwnMessage ? "bg-blue-400" : "bg-gray-100"}`}>
                            <div className="bg-red-500 p-1 md:p-2 rounded text-white">
                              <FiFileText size={16} className="md:w-6 md:h-6" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="text-xs md:text-sm truncate break-words whitespace-pre-wrap">
                                {msg.message || msg.fileName || "Document"}
                              </p>
                              <div className="flex items-center gap-2">
                                <a
                                  href={msg.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-[10px] md:text-xs ${isOwnMessage ? "text-blue-100" : "text-blue-500"} hover:underline`}
                                >
                                  View Document
                                </a>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDownload(msg.fileUrl, msg.fileName || 'document.pdf');
                                  }}
                                  disabled={downloading}
                                  className={`flex items-center gap-0.5 text-[10px] md:text-xs ${isOwnMessage ? "text-blue-100" : "text-blue-500"} hover:underline`}
                                >
                                  {downloading ? 'Downloading...' : (
                                    <>
                                      <FiDownload size={10} className="inline" />
                                      <span>Download</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <span className={`text-[8px] md:text-[10px] block mt-0.5 md:mt-1 ${isOwnMessage ? "text-blue-100" : "text-gray-400"}`}>
                          {formatMessageTime(msg.timestamp)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {isOwnMessage && showAvatar && (
                    <img 
                      src={data?.profileImage || "https://i.ibb.co.com/t9Q5HDC/f10ff70a7155e5ab666bcdd1b45b726d.jpg"} 
                      alt="Avatar" 
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover order-2"
                    />
                  )}
                </motion.div>
              </React.Fragment>
            );
          })}

          {typing && (
            <div className="flex items-center gap-1 md:gap-2 text-gray-500 text-xs md:text-sm">
              <div className="flex space-x-0.5 md:space-x-1">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span>Typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* File Preview - More compact for mobile */}
        {filePreview && (
          <div className="p-1 md:p-2 bg-gray-100 border-t border-gray-200">
            <div className="relative inline-block">
              <img src={filePreview} alt="Preview" className="h-16 md:h-20 rounded-lg" />
              <button 
                onClick={cancelFileUpload}
                className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-white rounded-full p-0.5 md:p-1 w-4 h-4 md:w-6 md:h-6 flex items-center justify-center text-[10px] md:text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Input Box - Fixed at bottom, responsive sizing */}
        <div className="border-t p-2 md:p-3 bg-white shadow-inner">
          <div className="flex items-center gap-1 md:gap-2 bg-gray-50 rounded-full pr-1 md:pr-2 pl-2 md:pl-3 py-1 border border-gray-200 focus-within:border-blue-300 focus-within:ring-1 focus-within:ring-blue-100">
            <div className="flex space-x-1">
              <label
                htmlFor="upload-image"
                className="cursor-pointer text-gray-500 hover:text-blue-500 p-1 md:p-2 rounded-full hover:bg-gray-100 transition-all"
                title="Upload Image"
              >
                <FiImage size={16} className="md:w-5 md:h-5" />
              </label>
              <input
                id="upload-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <label
                htmlFor="upload-pdf"
                className="cursor-pointer text-gray-500 hover:text-blue-500 p-1 md:p-2 rounded-full hover:bg-gray-100 transition-all"
                title="Upload Document"
              >
                <FiFileText size={16} className="md:w-5 md:h-5" />
              </label>
              <input
                id="upload-pdf"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none py-1 md:py-2 text-sm md:text-base text-gray-700 placeholder-gray-400"
              placeholder="Type a message..."
              value={newMsg}
              onChange={(e) => {
                setNewMsg(e.target.value);
                handleTyping();
              }}
              onKeyDown={handleKeyPress}
            />

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={uploading}
              className={`${
                uploading || (!newMsg && !file) ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"
              } text-white p-1.5 md:p-2 rounded-full transition-all flex items-center justify-center w-8 h-8 md:w-10 md:h-10`}
            >
              {uploading ? (
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiSend size={16} className="md:w-5 md:h-5" />
              )}
            </motion.button>
          </div>
          
          <div className="text-[10px] md:text-xs text-center mt-1 md:mt-2 text-gray-400">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
