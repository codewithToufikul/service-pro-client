import { useState } from "react";

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      const [loading, setLoading] = useState(false);
      const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    
      // Handle input changes
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
    
      // Show notification
      const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
          setNotification({ show: false, type: '', message: '' });
        }, 5000);
      };
    
      // Handle form submission
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
          const response = await fetch('https://servies-pro-server.onrender.com/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });
    
          const result = await response.json();
    
          if (response.ok && result.success) {
            showNotification('success', 'Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
          } else {
            showNotification('error', result.message || 'Failed to send message. Please try again.');
          }
        } catch (error) {
          console.error('Error sending email:', error);
          showNotification('error', 'Network error. Please check your connection and try again.');
        } finally {
          setLoading(false);
        }
      };
  return (
      <div>
        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <span>{notification.message}</span>
              <button 
                onClick={() => setNotification({ show: false, type: '', message: '' })}
                className="ml-4 text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <section className="bg-gray-50 py-10 mt-8">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 col-span-2">
              <div className="bg-white shadow-sm p-6 rounded">
                <div className="flex items-start gap-4">
                  <div className="text-blue-600 text-3xl">📍</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-600">
                      North Zone B, LP 80/2, Road No. 276 <br />
                      Khalishpur, Khulna 9000, Bangladesh
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm p-6 rounded">
                <div className="flex items-start gap-4">
                  <div className="text-blue-600 text-3xl">📞</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Call Us</h4>
                    <p className="text-sm text-gray-600">+880 1576-408601</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm p-6 rounded">
                <div className="flex items-start gap-4">
                  <div className="text-blue-600 text-3xl">✉️</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Email Us</h4>
                    <p className="text-sm text-gray-600">help@servicepro24x7.com</p>
                    <p className="text-sm text-gray-600">servicepro24x@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm p-6 rounded">
                <div className="flex items-start gap-4">
                  <div className="text-blue-600 text-3xl">🕒</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">Open Hours</h4>
                    <p className="text-sm text-gray-600">Monday - Sunday</p>
                    <p className="text-sm text-gray-600">24 Hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white shadow-sm p-6 rounded">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                ></textarea>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-2 rounded text-white transition ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        <div className="mt-14 bg-[#f9fafe] p-12 border-y-2 border-gray-300">
          <div className="max-w-[700px] mx-auto text-center">
            <h1 className=" text-xl md:text-2xl font-bold pb-2 text-[#012970]">Join Our Newsletter</h1>
            <p className=" text-sm md:text-lg text-gray-600">
              Subscribe to our newsletter to receive updates, exclusive offers, and more.
            </p>
            <div className="join mt-4">
              <input className="input join-item" placeholder="Email" />
              <button className="btn join-item rounded-r-full bg-blue-600 text-white">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Contact