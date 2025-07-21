import React from 'react'
import Navbar from '../../Component/Navbar'
import Footer from '../../Component/Footer'

function RefundPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-6">
            <h1 className="text-3xl font-bold text-white text-center">Refund Policy</h1>
          </div>
          
          {/* Content */}
          <div className="p-8">
            <p className="text-gray-700 leading-relaxed mb-8">
              Thank you for choosing our services. We are committed to delivering high-quality work in every project we undertake. 
              Please read our refund policy carefully:
            </p>
            
            <div className="space-y-8">
              {/* Policy Point 1 */}
              <div className="flex">
                <div className="mr-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">No Refunds</h2>
                  <p className="text-gray-600">
                    Once a project has been started or delivered, no refunds will be issued under any circumstances. 
                    Projects are initiated with the client's approval and involve dedicated time and effort.
                  </p>
                </div>
              </div>
              
              {/* Policy Point 2 */}
              <div className="flex">
                <div className="mr-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Bug Fixes & Revisions</h2>
                  <p className="text-gray-600">
                    If any issues or bugs are found after delivery (that fall within the original project scope), 
                    we will fix them promptly at no extra cost.
                  </p>
                </div>
              </div>
              
              {/* Policy Point 3 */}
              <div className="flex">
                <div className="mr-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Conditions for Revisions</h2>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Any issues must be reported within 7 days of project delivery.</li>
                    <li>Revision requests must align with the original agreed-upon scope of work.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Final Note */}
            <div className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-blue-800 italic">
                Our goal is to ensure your satisfaction by resolving any legitimate issues quickly and responsibly. 
                Thank you for trusting us with your project.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default RefundPolicy