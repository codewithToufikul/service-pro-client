import React, { useEffect, useState } from "react";
import Navbar from "../../Component/Navbar";
import Footer from "../../Component/Footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import { MdOutlinePhone } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io";
import { getUserFromToken } from "../../AuthProvider/getUserFromToken";
import { FaFacebookMessenger } from "react-icons/fa6";
import { useGetUser } from "../../AuthProvider/getUser";
import toast from "react-hot-toast";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const { data, isLoading, isError } = useGetUser();
  const [showModal, setShowModal] = useState(false);
  
  // Separate state for each policy
  const [policies, setPolicies] = useState({
    privacy: false,
    refund: false,
    terms: false
  });
  
  // Check if user has agreed to all policies before
  const [hasAgreedBefore, setHasAgreedBefore] = useState(
    localStorage.getItem('allPoliciesAgreed') === 'true'
  );

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`https://servies-pro-server.onrender.com/services/${id}`);
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchService();
  }, [id]);

  const handleBookNow = () => {
    // If user has already agreed to all policies, navigate directly
    if (hasAgreedBefore) {
      navigateToChat();
    } else {
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPolicies({
      privacy: false,
      refund: false,
      terms: false
    });
  };

  const navigateToChat = () => {
    navigate(`/chat/${data?.userId}/${service?._id}`);
  };

  const handlePolicyChange = (policyType) => {
    setPolicies(prev => ({
      ...prev,
      [policyType]: !prev[policyType]
    }));
  };

  const allPoliciesAccepted = policies.privacy && policies.refund && policies.terms;

  const handleProceed = () => {
    if (!allPoliciesAccepted) {
      toast.error("Please agree to all policies to continue.");
      return;
    }
    
    // Save agreement to localStorage
    localStorage.setItem('allPoliciesAgreed', 'true');
    setHasAgreedBefore(true);
    
    // Close modal and redirect
    setShowModal(false);
    navigateToChat();
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 px-3">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-lg font-semibold text-gray-500 py-5">
            Home / Services Details
          </h1>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto flex flex-col-reverse md:flex-row jusbify-between gap-10 mt-12 px-2">
        <div className="rounded-md w-full md:w-1/3 bg-blue-200 h-fit p-5">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Contact Details</h2>
            <p className="flex items-center gap-2 mt-4">
              <AiOutlineMail className="text-2xl font-bold" />{" "}
              <span className="text-lg">servicepro24x@gmail.com</span>
            </p>
            <p className="flex items-center gap-2 mt-2">
              <MdOutlinePhone className="text-2xl font-bold" />{" "}
              <span className="text-lg">+880 1576-408601</span>
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleBookNow}
                className="btn bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-md"
              >
                <FaFacebookMessenger className="text-xl" />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-md w-full md:w-2/3">
          <div className="w-full">
            <img className="w-full" src={service?.banner} alt="" />
          </div>
          <div className="flex justify-between items-center mt-5">
            <h1 className="text-2xl md:text-3xl font-bold">{service?.title}</h1>
            <button 
              onClick={handleBookNow}
              className="btn bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Book Now
            </button>
          </div>
          <div className="mt-5">
            <p className="text-base md:text-lg text-gray-600">{service?.description}</p>
          </div>
          <div className="mt-5">
            <h2 className="text-2xl font-bold">Overview:</h2>
            <p className="text-base md:text-lg whitespace-pre-wrap text-gray-600">
              {service?.overview}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Policy Agreement Modal */}
      {showModal && !hasAgreedBefore && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl transform transition-all">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Terms & Policies</h2>
              <p className="text-sm text-gray-500 mt-2">Please review and accept our policies to continue</p>
            </div>

            {/* Policy Checkboxes */}
            <div className="space-y-4 mb-6">
              {/* Privacy Policy */}
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={policies.privacy}
                    onChange={() => handlePolicyChange('privacy')}
                    className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-gray-700 flex-1">
                    I have read and agree to the{" "}
                    <Link 
                      to="/privacy-policy" 
                      className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-2"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Refund & Return Policy */}
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={policies.refund}
                    onChange={() => handlePolicyChange('refund')}
                    className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-gray-700 flex-1">
                    I have read and agree to the{" "}
                    <Link 
                      to="/refund-policy" 
                      className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-2"
                      target="_blank"
                    >
                      Refund & Return Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={policies.terms}
                    onChange={() => handlePolicyChange('terms')}
                    className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-gray-700 flex-1">
                    I have read and agree to the{" "}
                    <Link 
                      to="/terms-condition" 
                      className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-2"
                      target="_blank"
                    >
                      Terms & Conditions
                    </Link>
                  </span>
                </label>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span>Progress</span>
                <span className="font-semibold">
                  {Object.values(policies).filter(Boolean).length}/3 completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(Object.values(policies).filter(Boolean).length / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleModalClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                disabled={!allPoliciesAccepted}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all transform ${
                  allPoliciesAccepted 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                I Agree & Continue
              </button>
            </div>

            {/* Help Text */}
            {!allPoliciesAccepted && (
              <p className="text-xs text-center text-gray-500 mt-4">
                Please accept all policies to proceed with booking
              </p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ServiceDetails;