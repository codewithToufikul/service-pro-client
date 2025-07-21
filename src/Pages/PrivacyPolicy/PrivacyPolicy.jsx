import React from 'react';
import Navbar from '../../Component/Navbar';
import Footer from '../../Component/Footer';
import { Shield, Lock, Cookie, FileText, Bell, Users, RefreshCw, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12 bg-white shadow-lg rounded-lg my-8">
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 text-lg">Your data security and privacy is our priority</p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 mb-8">
            <p className="mb-0">
              Welcome to Services Pro. Your privacy is very important to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website or use our services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <FileText className="text-blue-600 mr-3" size={24} />
                <h2 className="text-2xl font-semibold text-gray-800">Information We Collect</h2>
              </div>
              <p>
                We may collect personal information that you voluntarily provide to us, such as your name, email address, phone number, and other contact or identifying details when you communicate with us or use our services.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Bell className="text-blue-600 mr-3" size={24} />
                <h2 className="text-2xl font-semibold text-gray-800">How We Use Your Information</h2>
              </div>
              <p className="mb-2">We use your information to:</p>
              <ul className="space-y-1 pl-6">
                <li className="flex items-start">
                  <span className="inline-block h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  <span>Provide, operate, and improve our services</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  <span>Communicate with you, including responding to inquiries</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  <span>Enhance the security and functionality of our platform</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  <span>Send you promotional offers or updates, with your consent</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Users className="text-blue-600 mr-3" size={24} />
                <h2 className="text-2xl font-semibold text-gray-800">Sharing of Information</h2>
              </div>
              <p>
                We do not sell, rent, or trade your personal information. We may share your information with trusted third-party service providers who assist in operating our website or conducting our business, as long as they agree to keep your information secure and confidential.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Cookie className="text-blue-600 mr-3" size={24} />
                <h2 className="text-2xl font-semibold text-gray-800">Cookies</h2>
              </div>
              <p>
                Our website may use cookies to personalize your experience and help us understand how visitors interact with our site. Cookies are small text files stored on your device to enhance website functionality.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Shield className="text-blue-600 mr-3" size={24} />
                <h2 className="text-2xl font-semibold text-gray-800">Data Security</h2>
              </div>
              <p>
                We implement appropriate administrative, technical, and physical safeguards to protect your personal information. However, please note that no method of data transmission over the Internet or method of electronic storage is completely secure.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Lock className="text-blue-600 mr-3" size={24} />
                <h2 className="text-2xl font-semibold text-gray-800">Your Rights</h2>
              </div>
              <p>
                You have the right to access, update, or delete the personal information we hold about you. To exercise your rights or ask questions about our privacy practices, please contact us using the information provided below.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <RefreshCw className="text-blue-600 mr-3" size={24} />
                <h2 className="text-2xl font-semibold text-gray-800">Changes to This Policy</h2>
              </div>
              <p>
                We may update this Privacy Policy periodically. Any changes will be reflected on this page with an updated effective date. We encourage you to review this policy regularly.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mt-8 border border-gray-200">
            <div className="flex items-center mb-4">
              <Mail className="text-blue-600 mr-3" size={24} />
              <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
            </div>
            <p className="mb-2">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="font-medium text-blue-600">
              Email: support@servicespro.com
            </p>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Last updated: May 15, 2025</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;