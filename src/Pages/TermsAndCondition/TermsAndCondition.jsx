import React from 'react';
import Navbar from '../../Component/Navbar';
import Footer from '../../Component/Footer';

const TermsAndCondition = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-lg opacity-90">
            Last updated: May 15, 2025
          </p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white shadow-lg rounded-lg my-8">
        <div className="prose prose-lg max-w-none">
          <div className="p-5 bg-blue-50 border-l-4 border-blue-500 rounded mb-8">
            <p className="text-gray-700">
              Welcome to Services Pro. By accessing or using our website or services, you agree to be bound by the following Terms and Conditions. Please read them carefully.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">1</span>
                Acceptance of Terms
              </h2>
              <p className="text-gray-600 pl-11">
                By using the Services Pro website or any services provided by us, you confirm that you have read, understood, and agree to comply with these Terms and Conditions and our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">2</span>
                Use of Services
              </h2>
              <p className="text-gray-600 pl-11">
                You agree to use our services only for lawful purposes and in a way that does not infringe the rights of others, restrict or inhibit anyone else's use of the website, or violate any applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">3</span>
                Account and Information Accuracy
              </h2>
              <p className="text-gray-600 pl-11">
                If you create an account or submit personal information, you agree to provide accurate, current, and complete details. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">4</span>
                Intellectual Property
              </h2>
              <p className="text-gray-600 pl-11">
                All content on this website, including text, graphics, logos, icons, images, and software, is the property of Services Pro or its licensors and is protected by intellectual property laws. You may not use, reproduce, distribute, or create derivative works from any content without prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">5</span>
                Privacy
              </h2>
              <p className="text-gray-600 pl-11">
                Your use of the website is also governed by our Privacy Policy, which describes how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">6</span>
                Limitation of Liability
              </h2>
              <p className="text-gray-600 pl-11">
                Services Pro will not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of, or inability to access or use, our website or services. All services are provided "as is" and "as available."
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">7</span>
                Third-Party Links
              </h2>
              <p className="text-gray-600 pl-11">
                Our website may contain links to third-party websites. We do not control or endorse these sites and are not responsible for their content or practices. Your use of third-party sites is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">8</span>
                Modifications to the Service and Terms
              </h2>
              <p className="text-gray-600 pl-11">
                We reserve the right to update or modify these Terms at any time without prior notice. Changes will be effective immediately upon posting. Continued use of the site after any changes constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">9</span>
                Termination
              </h2>
              <p className="text-gray-600 pl-11">
                We reserve the right to suspend or terminate your access to the website or services at our sole discretion, without notice, for conduct that violates these Terms or is harmful to other users or Services Pro.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">10</span>
                Governing Law
              </h2>
              <p className="text-gray-600 pl-11">
                These Terms and Conditions are governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-sm">11</span>
                Contact Information
              </h2>
              <div className="text-gray-600 pl-11">
                <p className="mb-4">
                  For any questions regarding these Terms and Conditions, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg inline-block">
                  <p className="font-medium">Email: <a href="mailto:support@servicespro.com" className="text-blue-600 hover:underline">support@servicespro.com</a></p>
                </div>
              </div>
            </section>
          </div>
        </div>
        
        {/* Accept Terms Button */}
        <div className="mt-12 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-200">
            I Accept These Terms
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsAndCondition;