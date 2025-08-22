import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, User, Tag, Clock } from "lucide-react";
import { Link } from "react-router-dom";

function HomeBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://servies-pro-server.onrender.com/api/blogs"
      );
      setBlogs(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className=" max-w-[1280px] mx-auto mt-14 px-2">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

function BlogCard({ blog }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-1">
      {/* Blog Image */}
      <div className="h-56 overflow-hidden">
        <img
          src={blog.thumbnailUrl}
          alt={blog.title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Blog Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800"
            >
              {tag}
            </span>
          ))}
          {blog.tags.length > 3 && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800">
              +{blog.tags.length - 3}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
          {blog.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Author Info */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={blog.authorAvater}
                alt={blog.authorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {blog.authorName}
              </p>
              <p className="text-xs text-gray-500">{blog.authorRole}</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center text-xs text-gray-500">
            <Clock size={14} className="mr-1" />
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Read More Button */}
      <div className="px-6 pb-6">
        <Link
          to={`/blog-details/${blog._id}`}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

export default HomeBlog;
