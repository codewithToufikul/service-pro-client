import React, { useState } from 'react';
import Navbar from '../../Component/Navbar';
import Footer from '../../Component/Footer';
import { useGetUser } from '../../AuthProvider/getUser';
import toast from 'react-hot-toast';

function ChangePass() {
  const { data, isLoading } = useGetUser();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      return toast.error("All fields are required");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    try {
      const res = await fetch('https://servies-pro-server.onrender.com/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: data.userId,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        })
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Password updated successfully!");
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(result.message || "Failed to update password");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex justify-center items-center bg-gray-50 py-10">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>

          <div className="form-control">
            <label className="label">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">Save</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ChangePass;
