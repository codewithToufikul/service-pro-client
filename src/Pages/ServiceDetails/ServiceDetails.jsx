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
import toast from "react-hot-toast"; // Make sure to install react-hot-toast if you haven't

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const { data, isLoading, isError } = useGetUser();
  const [showModal, setShowModal] = useState(false);
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  // Initialize hasAgreedBefore directly from localStorage
  const [hasAgreedBefore, setHasAgreedBefore] = useState(
    localStorage.getItem('privacyPolicyAgreed') === 'true'
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
    // If user has already agreed to the policy, navigate directly
    if (hasAgreedBefore) {
      navigateToChat();
    } else {
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setAgreeToPolicy(false);
  };

  const navigateToChat = () => {
      navigate(`/chat/${data?.userId}/${service?._id}`);

  };

  const handleProceed = () => {
    if (!agreeToPolicy) {
      toast.error("Please agree to the privacy policy to continue.");
      return;
    }
    
    // Save agreement to local storage
    localStorage.setItem('privacyPolicyAgreed', 'true');
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

      {/* Privacy Policy Modal - Only shown if user hasn't agreed before */}
      {showModal && !hasAgreedBefore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Privacy Policy Agreement</h2>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="privacyCheckbox"
                checked={agreeToPolicy}
                onChange={(e) => setAgreeToPolicy(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="privacyCheckbox" className="text-sm">
                I have read and agree to the <span className="underline font-medium text-blue-400"><Link to={"/privacy-policy"}>Privacy Policy</Link></span>
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className={`px-4 py-2 rounded text-white ${
                  agreeToPolicy ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 cursor-not-allowed"
                }`}
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ServiceDetails;