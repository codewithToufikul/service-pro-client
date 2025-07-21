import React, { useEffect, useState } from 'react';
import Navbar from '../../Component/Navbar';
import Footer from '../../Component/Footer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function EmailVerify() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying your email');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (token && email) {
      axios.get(`https://servies-pro-server.onrender.com/verify-email?token=${token}&email=${email}`)
        .then(res => {
          setStatus('success');
          setMessage('Email verified successfully!');
          // Navigate after a brief delay to show success message
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        })
        .catch(err => {
          setStatus('error');
          setMessage('Verification failed. Invalid or expired token.');
        });
    } else {
      setStatus('error');
      setMessage('Invalid verification link.');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden text-center p-8">
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800">{message}</h2>
              <p className="text-gray-600 mt-2">Please wait while we verify your email address...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{message}</h2>
              <p className="text-gray-600 mt-2">Redirecting you to login page...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{message}</h2>
              <p className="text-gray-600 mt-2">Please try again or contact support.</p>
              <button 
                onClick={() => navigate('/login')}
                className="mt-6 bg-indigo-600 text-white rounded-lg py-2 px-4 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default EmailVerify;