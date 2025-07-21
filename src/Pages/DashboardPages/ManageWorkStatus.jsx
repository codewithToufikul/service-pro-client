import React, { useEffect, useState } from 'react';

function ManageWorkStatus() {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://servies-pro-server.onrender.com/status');
      const data = await response.json();
      setStatsData(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoading(false);
  };

  // Increment handler
  const handleIncrement = async (id) => {
    try {
      const response = await fetch(`https://servies-pro-server.onrender.com/status/increment/${id}`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        // Update the local state after successful API call
        setStatsData(prevData => 
          prevData.map(item => 
            item._id === id ? { ...item, count: item.count + 1 } : item
          )
        );
      } else {
        console.error('Failed to increment count');
      }
    } catch (error) {
      console.error('Error incrementing count:', error);
    }
  };

  // Decrement handler
  const handleDecrement = async (id) => {
    try {
      const response = await fetch(`https://servies-pro-server.onrender.com/status/decrement/${id}`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        // Update the local state after successful API call
        setStatsData(prevData => 
          prevData.map(item => 
            item._id === id ? { ...item, count: Math.max(0, item.count - 1) } : item
          )
        );
      } else {
        console.error('Failed to decrement count');
      }
    } catch (error) {
      console.error('Error decrementing count:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Your Work Status</h1>
      <div className="grid grid-cols-1 mt-5 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4 py-12 max-w-7xl mx-auto">
        {statsData.map((item) => (
          <div
            key={item._id}
            className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <div className="mb-4">
              <img src={item.icon} alt={item.label} className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-blue-900">{item.count}</h2>
            <p className="text-gray-600">{item.label}</p>
            {/* Increment & Decrement Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleIncrement(item._id)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                +
              </button>
              <button
                onClick={() => handleDecrement(item._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={item.count <= 0}
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageWorkStatus;