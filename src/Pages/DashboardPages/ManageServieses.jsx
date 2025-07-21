import React, { useEffect, useState } from "react";
import DashServies from "../../Component/DashServies";
import toast from "react-hot-toast";

function ManageServieses() {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState(""); // 🆕 overview field
  const [iconFile, setIconFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const fetchServieses = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://servies-pro-server.onrender.com/services");
      const data = await response.json();
      setServicesData(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServieses();
  }, []);

  const handleImageUpload = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const imgbbAPI = "8b86a561b76cd59e16d93c1098c5018a"; // Replace with your actual API

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPI}`, {
      method: "POST",
      body: formData,
    });

    const imgData = await res.json();
    return imgData?.data?.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!iconFile || !bannerFile) {
      alert("Please upload both banner and icon");
      return;
    }

    try {
      const bannerUrl = await handleImageUpload(bannerFile);
      const iconUrl = await handleImageUpload(iconFile);

      const newService = {
        title,
        description,
        overview, // 🆕 included
        icon: iconUrl,
        banner: bannerUrl,
      };

      const response = await fetch("https://servies-pro-server.onrender.com/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newService),
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        setOverview(""); // clear overview
        setIconFile(null);
        setBannerFile(null);
        fetchServieses();
        toast.success("Service added successfully!");
      }
    } catch (err) {
      console.error("Error uploading or adding service:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Service</h1>

      {/* 🧾 Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-100 p-4 rounded max-w-md"
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        {/* 🆕 Overview field */}
        <textarea
          placeholder="Overview"
          className="w-full p-2 border rounded"
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
          required
        ></textarea>

        {/* Banner upload */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Add Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBannerFile(e.target.files[0])}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded cursor-pointer bg-white file:bg-blue-300 file:text-white file:px-4 file:py-2 file:rounded file:border-0"
            required
          />
        </div>

        {/* Icon upload */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Add Icon</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setIconFile(e.target.files[0])}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded cursor-pointer bg-white file:bg-blue-300 file:text-white file:px-4 file:py-2 file:rounded file:border-0"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition duration-200"
        >
          Add Service
        </button>
      </form>

      {/* 📋 Services Display */}
      <h1 className="text-2xl font-bold mt-12">Manage Your Services</h1>
      {loading ? (
        <div className="mt-4">Loading...</div>
      ) : (
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          {servicesData.map((service) => (
            <DashServies
              key={service._id}
              title={service.title}
              description={service.description}
              overview={service.overview} // 🆕 pass to component if used there
              icon={service.icon}
              banner={service.banner}
              id={service._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageServieses;
