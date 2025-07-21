import React, { useEffect, useState } from 'react'
import Navbar from '../../Component/Navbar'
import Footer from '../../Component/Footer'
import { getUserFromToken } from '../../AuthProvider/getUserFromToken';
import toast from 'react-hot-toast';
import { IoIosReverseCamera } from "react-icons/io";
import { useGetUser } from '../../AuthProvider/getUser';
import { MdOutlineMail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Link } from 'react-router-dom';

function UserProfile() {
  const { data, isLoading, isError, error, refetch } = useGetUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    address: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        email: data.email || '',
        number: data.number || '',
        address: data.address || ''
      });
    }
  }, [data]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];

      try {
        const formData = new FormData();
        formData.append("image", base64);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=8b86a561b76cd59e16d93c1098c5018a`, {
          method: "POST",
          body: formData
        });

        const result = await res.json();
        const imageUrl = result?.data?.url;

        if (imageUrl) {
          await fetch('https://servies-pro-server.onrender.com/update-profile-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: data.userId,
              profileImage: imageUrl
            })
          });
          refetch()
          toast.success("Profile picture updated!");
        }
      } catch (error) {
        console.error("Image upload failed", error);
        toast.error("Failed to upload image");
      }
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://servies-pro-server.onrender.com/update-profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: data.userId,
          name: formData.name,
          username: formData.email,
          number: formData.number,
          address: formData.address,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Profile updated successfully!");
        refetch(); // Refetch to update UI
        document.getElementById('edit_modal').close();
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Something went wrong");
    }
  };
  

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (isError) return <div className="text-center text-red-500 py-20">Error: {error.message}</div>;
  if (!data) return null;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          {/* Profile Header */}
          <div className="flex flex-col gap-3 justify-center items-center space-x-6 relative">
            <div className="relative">
              <img
                src={data?.profileImage}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border border-gray-300"
              />
              <label htmlFor="upload" className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow cursor-pointer">
                <IoIosReverseCamera />
              </label>
              <input
                id="upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div className='space-y-1'>
              <h2 className="text-2xl font-semibold">{data?.name}</h2>
              <p className="text-gray-600 flex items-center gap-1"><span className='text-2xl'><MdOutlineMail /></span>{data?.email}</p>
              <p className="text-gray-600 flex items-center gap-1"><span className='text-xl'><FiPhone /></span>{data?.number}</p>
              <p className="text-gray-600 flex items-center gap-1"><span className='text-xl'><HiOutlineLocationMarker /></span>{data?.address || 'No address added'}</p>
            </div>
            <div className="w-full flex justify-center gap-2">
              <button
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                onClick={() => document.getElementById('edit_modal').showModal()}
              >
                Edit Profile
              </button>
              <Link
              to={"/change-password"}
                className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 cursor-pointer"
              >
                Change Password
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
          <div className="form-control mb-2">
            <label className="label">Name</label>
            <input
              type="text"
              name="name"
              className="input input-bordered"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-control mb-2">
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              className="input input-bordered"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-control mb-2">
            <label className="label">Phone</label>
            <input
              type="text"
              name="number"
              className="input input-bordered"
              value={formData.number}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">Address</label>
            <textarea
              name="address"
              className="textarea textarea-bordered"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your address"
              rows="3"
            ></textarea>
          </div>
          <div className="modal-action">
            <button className="btn" onClick={() => document.getElementById('edit_modal').close()}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default UserProfile