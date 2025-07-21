import React, { useState, useEffect } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import Navbar from '../../Component/Navbar';
import Footer from '../../Component/Footer';
import { useGetUser } from '../../AuthProvider/getUser';
import toast from 'react-hot-toast';

function GiveFeedback() {
  const [formData, setFormData] = useState({
    name: '',
    roll: '', // This is used as email field based on placeholder
    rating: '',
    message: '',
    status: 'pending',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { data, isLoading, isError, error } = useGetUser();

  // Pre-fill form with user data if available
  useEffect(() => {
    if (data) {
      setFormData(prevData => ({
        ...prevData,
        name: data.name || '',
        roll: data.email || '',
      }));
    }
  }, [data]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    if (!formData.roll.trim()) {
      newErrors.roll = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.roll)) {
      newErrors.roll = "Please enter a valid email address";
    }
    
    if (!formData.rating) newErrors.rating = "Please select a rating";
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message should be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const finalData = { 
        ...formData, 
        image: data?.profileImage || "https://i.ibb.co/t9Q5HDC/f10ff70a7155e5ab666bcdd1b45b726d.jpg" 
      };

      const response = await fetch('https://servies-pro-server.onrender.com/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        toast.success('Thank you! Your feedback has been submitted successfully!');
        setFormData({ 
          name: '', 
          roll: '', 
          rating: '', 
          message: '', 
          status: 'pending' 
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to submit feedback.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <label key={i} className="cursor-pointer">
          <input
            type="radio"
            name="rating"
            value={i}
            onChange={handleChange}
            checked={Number(formData.rating) === i}
            className="hidden"
          />
          <Star
            className={`w-8 h-8 ${
              Number(formData.rating) >= i
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            } hover:text-yellow-400 transition-colors`}
          />
        </label>
      );
    }
    return stars;
  };
    
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
      <span className="ml-3 text-lg font-medium text-gray-700">Loading...</span>
    </div>
  );
  
  if (isError) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center text-red-500 py-8">
        <h3 className="text-xl font-semibold mb-2">Error Loading User Data</h3>
        <p>{error.message || "Something went wrong"}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-md transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-teal-400 py-6 px-8">
            <h2 className="text-3xl font-bold text-white">We Value Your Feedback</h2>
            <p className="text-teal-50 mt-2">
              Your opinion helps us improve our services
            </p>
          </div>
          
          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="roll"
                value={formData.roll}
                onChange={handleChange}
                className={`w-full border ${
                  errors.roll ? 'border-red-500' : 'border-gray-300'
                } rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition`}
                placeholder="Enter your email"
              />
              {errors.roll && (
                <p className="mt-1 text-sm text-red-500">{errors.roll}</p>
              )}
            </div>

            {/* Rating - Star UI */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                How would you rate your experience?
              </label>
              <div className="flex space-x-2">
                {renderStars()}
              </div>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-500">{errors.rating}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Your Feedback
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className={`w-full border ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                } rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition`}
                placeholder="Please share your thoughts, suggestions, or concerns..."
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-medium py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="bg-gray-50 px-8 py-4 text-center">
            <p className="text-gray-600 text-sm">
              Thank you for taking the time to provide feedback. We truly appreciate it!
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default GiveFeedback;