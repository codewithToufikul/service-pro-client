import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUser } from "../../AuthProvider/getUser";
import { PlusCircle, Edit, Trash2, X, Image, Tag, FileText, Info, Save, AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";

function ManageBlogs() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const { data, isLoading, isError } = useGetUser();

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    
    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Upload and create blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnail) {
      showNotification("Please upload a thumbnail image", "error");
      return;
    }

    try {
      setIsUploading(true);
      const imgData = new FormData();
      imgData.append("image", thumbnail);
      const imgbbApiKey = "8b86a561b76cd59e16d93c1098c5018a";
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        imgData
      );
      const imageUrl = response.data.data.url;

      const blogPost = {
        ...formData,
        authorName: data.name,
        authorId: data.userId,
        authorAvater: data?.profileImage || "https://i.ibb.co.com/t9Q5HDC/f10ff70a7155e5ab666bcdd1b45b726d.jpg",
        authorRole: data?.moderatorRole || "Moderator",
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        thumbnailUrl: imageUrl,
        createdAt: new Date().toISOString(),
      };

      await axios.post("https://servies-pro-server.onrender.com/api/blogs", blogPost);
      showNotification("Blog published successfully!");
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("Submit error:", error);
      showNotification("Failed to publish blog", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      tags: "",
    });
    setThumbnail(null);
    setThumbnailPreview(null);
    setIsFormVisible(false);
  };

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get("https://servies-pro-server.onrender.com/api/blogs");
      setBlogs(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
      showNotification("Failed to load blogs", "error");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Delete blog
  const handleDelete = async (id) => {

    Swal.fire({
        title: "Are you sure?",
        text: "You wan't be delete this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async(result) => {
        if (result.isConfirmed) {
            try {
                await axios.delete(`https://servies-pro-server.onrender.com/api/blogs/${id}`);
                showNotification("Blog deleted successfully");
                fetchBlogs();
                Swal.fire({
                    title: "Deleted!",
                    text: "Your blog has been deleted.",
                    icon: "success"
                  });
              } catch (error) {
                console.error("Delete error:", error);
                showNotification("Failed to delete blog", "error");
              }
        }
      });
  };

  // Save edited blog
  const handleEditSave = async () => {
    try {
      const { _id, ...updatedData } = editBlog;
      await axios.put(`https://servies-pro-server.onrender.com/api/blogs/${_id}`, updatedData);
      setEditBlog(null);
      showNotification("Blog updated successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Update error:", error);
      showNotification("Failed to update blog", "error");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Notification */}
      {notification.show && (
        <div 
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 flex items-center gap-2 ${
            notification.type === "error" ? "bg-red-500 text-white" : "bg-teal-500 text-white"
          }`}
        >
          {notification.type === "error" ? <AlertTriangle size={18} /> : <Info size={18} />}
          <p>{notification.message}</p>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
        <button 
          onClick={() => setIsFormVisible(!isFormVisible)} 
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition-all transform hover:scale-105"
        >
          {isFormVisible ? (
            <>
              <X size={18} /> Hide Form
            </>
          ) : (
            <>
              <PlusCircle size={18} /> Create New Blog
            </>
          )}
        </button>
      </div>

      {/* Create Blog Form */}
      {isFormVisible && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-10 transition-all duration-300">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Create New Blog Post</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="Enter an engaging title" 
                    required 
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Summary</label>
                  <textarea 
                    name="excerpt" 
                    value={formData.excerpt} 
                    onChange={handleChange} 
                    placeholder="Brief preview of your blog post" 
                    required 
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent h-24"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <div className="bg-gray-100 p-3 text-gray-500">
                      <Tag size={18} />
                    </div>
                    <input 
                      type="text" 
                      name="tags" 
                      value={formData.tags} 
                      onChange={handleChange} 
                      placeholder="tech, news, tutorial (comma separated)" 
                      className="w-full p-3 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
                  <div className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center ${thumbnailPreview ? 'border-teal-300' : 'border-gray-300'}`}>
                    {thumbnailPreview ? (
                      <div className="relative w-full">
                        <img 
                          src={thumbnailPreview} 
                          alt="Thumbnail preview" 
                          className="h-48 w-full object-cover rounded-md"
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            setThumbnail(null);
                            setThumbnailPreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Image size={48} className="text-gray-400 mb-2" />
                        <p className="text-gray-500 text-sm mb-2">Drop your image here or click to browse</p>
                        <label className="bg-teal-50 hover:bg-teal-100 text-teal-600 px-4 py-2 rounded-md cursor-pointer text-sm">
                          Select Image
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleThumbnailChange} 
                            className="hidden"
                          />
                        </label>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blog Content</label>
                  <div className="flex items-center border border-gray-300 rounded-t-md overflow-hidden bg-gray-100">
                    <div className="p-2 text-gray-500">
                      <FileText size={16} />
                    </div>
                    <span className="text-sm text-gray-500">Full Article Content</span>
                  </div>
                  <textarea 
                    name="content" 
                    value={formData.content} 
                    onChange={handleChange} 
                    placeholder="Write your full blog post content here..." 
                    rows={7} 
                    required 
                    className="w-full border border-gray-300 border-t-0 p-3 rounded-b-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={resetForm} 
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isUploading} 
                className={`bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 flex items-center gap-2 transition-colors ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    <span>Publish Blog</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blog List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2 flex items-center gap-2">
          <FileText size={20} className="text-teal-600" />
          Published Blogs ({blogs.length})
        </h2>
        
        {blogs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText size={48} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">No blog posts found. Create your first blog!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className="relative h-48">
                  <img 
                    src={blog.thumbnailUrl} 
                    alt={blog.title} 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-xs">
                      {formatDate(blog.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{blog.excerpt}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {blog.tags?.map((tag, index) => (
                      <span key={index} className="bg-teal-50 text-teal-600 text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={blog.authorAvater} 
                        alt={blog.authorName} 
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-gray-600">{blog.authorName}</span>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => setEditBlog(blog)} 
                        className="p-1.5 rounded-md text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                        title="Edit blog"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(blog._id)}
                        className="p-1.5 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete blog"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editBlog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Edit size={20} className="text-yellow-500" />
                  Edit Blog Post
                </h2>
                <button 
                  onClick={() => setEditBlog(null)} 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editBlog.title}
                    onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Summary</label>
                  <textarea
                    value={editBlog.excerpt}
                    onChange={(e) => setEditBlog({ ...editBlog, excerpt: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blog Content</label>
                  <textarea
                    value={editBlog.content}
                    onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
                    rows={8}
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    value={editBlog.tags?.join(', ') || ''}
                    onChange={(e) =>
                      setEditBlog({ ...editBlog, tags: e.target.value.split(',').map(tag => tag.trim()) })
                    }
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Thumbnail</label>
                  <img 
                    src={editBlog.thumbnailUrl} 
                    alt="Thumbnail" 
                    className="h-40 w-full object-cover rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">To change the thumbnail, please create a new blog post</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setEditBlog(null)} 
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEditSave} 
                  className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 flex items-center gap-2 transition-colors"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageBlogs;