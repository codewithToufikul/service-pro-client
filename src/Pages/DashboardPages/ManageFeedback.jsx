import React, { useEffect, useState } from "react";
import { Star, CheckCircle, XCircle, Home, Loader } from "lucide-react";

function ManageFeedback() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://servies-pro-server.onrender.com/feedback")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch feedback data");
        }
        return response.json();
      })
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleShowInHome = (id, currentStatus) => {
    const newStatus = currentStatus === "approved" ? "pending" : "approved";
    
    fetch(`https://servies-pro-server.onrender.com/feedback/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update status");
        return response.json();
      })
      .then(() => {
        // Update the local state
        setTestimonials(
          testimonials.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
      })
      .catch((error) => console.error("Error updating feedback:", error));
  };

  const renderStars = (rating) => {
    const stars = [];
    const ratingNum = parseInt(rating, 10);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={18}
          className={i < ratingNum ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
        />
      );
    }
    
    return <div className="flex">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-lg font-medium text-gray-700">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Feedback</h3>
        <p className="text-red-700">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Feedback Management</h1>
          <p className="text-gray-600 mt-2">Review and manage customer testimonials</p>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">All Testimonials</h2>
            <div className="text-sm text-gray-500">
              Total: <span className="font-semibold">{testimonials.length}</span>
            </div>
          </div>
          
          {testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No testimonials found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial._id} 
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                        {testimonial.image ? (
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-500">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.roll}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-gray-700">
                      {testimonial.message.length > 120
                        ? `${testimonial.message.substring(0, 120)}...`
                        : testimonial.message}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-1">Status:</span>
                      {testimonial.status === "approved" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} className="mr-1" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Loader size={12} className="mr-1" />
                          Pending
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleShowInHome(testimonial._id, testimonial.status)}
                      className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                        testimonial.status === "approved"
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      } transition-colors`}
                    >
                      <Home size={16} className="mr-1" />
                      {testimonial.status === "approved" ? "Hide from Home" : "Show in Home"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageFeedback;