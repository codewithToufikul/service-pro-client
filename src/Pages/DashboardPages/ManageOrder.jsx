import React, { useEffect, useState } from 'react';
import { Clock, Package, CheckCircle, Truck, AlertCircle, DollarSign, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageOrder() {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetch('https://servies-pro-server.onrender.com/payment-history')
      .then((res) => res.json())
      .then((data) => {
        setOrderData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching order data:', error);
        setLoading(false);
      });
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    fetch(`https://servies-pro-server.onrender.com/update-order-status/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStatus }),
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success("ststus update success!")
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
        });
      
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <AlertCircle className="text-yellow-500" />;
      case 'Confirmed': return <CheckCircle className="text-blue-500" />;
      case 'Processing': return <Clock className="text-orange-500" />;
      case 'Complete': return <CheckCircle className="text-green-500" />;
      case 'Delivered': return <Truck className="text-purple-500" />;
      default: return <AlertCircle className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-orange-100 text-orange-800';
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Delivered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Sample data in case the real API isn't available during development
  const sampleData = [
    {
      _id: 'ObjectId("682573025a0346a526fe4788")',
      userId: '6824d048d20afe66cd0967f7',
      userName: 'Rahamat Ali',
      userProfileImage: 'https://i.ibb.co/p6hG43xN/7e4a805adef3.jpg',
      serviceId: '6804b12fece769de95d8e2d7',
      serviceName: 'International Payment Receive',
      amount: '400',
      transactionId: 'pi_3ROtm1EPhxEoR7aa0DIA5Trq',
      status: 'succeeded',
      date: '2025-05-15T04:52:18.340+00:00',
      method: 'stripe',
      orderStatus: 'Pending'
    }
  ];

  // Use real data if available, otherwise use sample data
  const displayData = orderData.length > 0 ? orderData : sampleData;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
        <div className="flex gap-2">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Total Orders: {displayData.length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-gray-200">
          {displayData.map((order) => (
            <div key={order._id} className="p-6 hover:bg-gray-50 transition duration-150">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Order header section */}
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      <img 
                        src={order.userProfileImage} 
                        className="h-full w-full object-cover"
                      />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{order.serviceName}</h3>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <User size={14} />
                      <span>{order.userName}</span>
                    </div>
                  </div>
                </div>

                {/* Order details indicators */}
                <div className="flex flex-wrap gap-3 mt-2 lg:mt-0">
                  <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    <DollarSign size={16} className="text-green-600" />
                    <span className="text-sm font-medium">${order.amount}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    <Calendar size={16} className="text-blue-600" />
                    <span className="text-sm">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    <span className="text-sm font-medium">{order.orderStatus}</span>
                  </div>
                </div>
                
                {/* Expand button */}
                <button 
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mt-2 lg:mt-0"
                >
                  {expandedOrder === order._id ? "Hide Details" : "Show Details"}
                  <svg className={`w-4 h-4 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
              
              {/* Expanded details section */}
              {expandedOrder === order._id && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3">Order Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transaction ID:</span>
                          <span className="font-medium text-gray-800">{order.transactionId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium text-gray-800 capitalize">{order.method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Status:</span>
                          <span className="font-medium text-green-600 capitalize">{order.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date & Time:</span>
                          <span className="font-medium text-gray-800">
                            {new Date(order.date).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status update section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3">Update Order Status</h4>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'Pending')}
                          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors 
                            ${order.orderStatus === 'Pending' 
                              ? 'bg-yellow-500 text-white' 
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
                        >
                          <AlertCircle size={16} />
                          Pending
                        </button>
                        
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'Confirmed')}
                          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors 
                            ${order.orderStatus === 'Confirmed' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                        >
                          <CheckCircle size={16} />
                          Confirmed
                        </button>
                        
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'Processing')}
                          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors 
                            ${order.orderStatus === 'Processing' 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-orange-100 text-orange-800 hover:bg-orange-200'}`}
                        >
                          <Clock size={16} />
                          Processing
                        </button>
                        
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'Complete')}
                          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors 
                            ${order.orderStatus === 'Complete' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                        >
                          <CheckCircle size={16} />
                          Complete
                        </button>
                        
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'Delivered')}
                          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors 
                            ${order.orderStatus === 'Delivered' 
                              ? 'bg-purple-500 text-white' 
                              : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
                        >
                          <Truck size={16} />
                          Delivered
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}