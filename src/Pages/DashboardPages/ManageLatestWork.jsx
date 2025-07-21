import React, { useEffect, useState } from 'react';
import DashLatest from '../../Component/DashLatest';
import { toast } from 'react-hot-toast';

function ManageLatestWork() {
  const [latestWorksData, setLatestWorksData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    imageFile: null,
  });

  const fetchLatestWorks = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://servies-pro-server.onrender.com/latestWork");
      const data = await response.json();
      setLatestWorksData(data);
    } catch (error) {
      console.error("Error fetching latest works:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLatestWorks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleAddProject = async (e) => {
    e.preventDefault();

    if (!formData.imageFile) {
      toast.error('Please select an image file');
      return;
    }

    try {
      // Upload to ImgBB
      const imgbbApiKey = '8b86a561b76cd59e16d93c1098c5018a';
      const imgData = new FormData();
      imgData.append('image', formData.imageFile);

      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: 'POST',
        body: imgData,
      });

      const imgbbResult = await imgbbResponse.json();
      const imageUrl = imgbbResult.data.url;

      // Post to your backend
      const response = await fetch("https://servies-pro-server.onrender.com/latestWork", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          link: formData.link,
          image: imageUrl,
        }),
      });

      if (response.ok) {
        toast.success("Project added successfully!");
        setFormData({
          title: '',
          description: '',
          link: '',
          imageFile: null,
        });
        fetchLatestWorks();
      } else {
        toast.error("Failed to add project");
      }

    } catch (error) {
      console.error("Error uploading or adding project:", error);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      {/* Form Section */}
      <div className="mb-12 mt-6 max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Add New Project</h1>
        <form onSubmit={handleAddProject} className="grid gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          ></textarea>
          <input
            type="url"
            name="link"
            placeholder="Project Link"
            value={formData.link}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
          >
            Add Project
          </button>
        </form>
      </div>

      {/* Display Section */}
      <h1 className="text-2xl font-bold mb-4">Manage Latest Work</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {latestWorksData.map((project) => (
          <DashLatest
            key={project._id}
            title={project.title}
            description={project.description}
            image={project.image}
            link={project.link}
            id={project._id}
            onDelete={async (id) => {
              try {
                const response = await fetch(`https://servies-pro-server.onrender.com/latestWork/${id}`, {
                  method: 'DELETE',
                });
                if (response.ok) {
                  toast.success('Project deleted successfully!');
                  fetchLatestWorks();
                } else {
                  toast.error('Failed to delete project');
                }
              } catch (error) {
                toast.error('Error deleting project');
                console.error('Error deleting project:', error);
              }
            }}
            onEdit={async (id, data) => {
              try {
                const response = await fetch(`https://servies-pro-server.onrender.com/latestWork/${id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                });

                if (response.ok) {
                  toast.success('Project updated successfully!');
                  fetchLatestWorks();
                } else {
                  toast.error('Failed to update project');
                }
              } catch (error) {
                toast.error('Error updating project');
                console.error('Error updating project:', error);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ManageLatestWork;
