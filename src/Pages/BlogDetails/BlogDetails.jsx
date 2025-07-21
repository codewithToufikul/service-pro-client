import React, { useEffect, useState } from "react";
import Navbar from "../../Component/Navbar";
import Footer from "../../Component/Footer";
import { useParams } from "react-router-dom";
import Linkify from "react-linkify";

function BlogDetails() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://servies-pro-server.onrender.com/api/blogs/${blogId}`)
      .then((res) => res.json())
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog:", error);
        setLoading(false);
      });
  }, [blogId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-base md:text-lg font-medium text-gray-600">
            Loading blog...
          </p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center p-6 md:p-8 bg-white rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl md:text-2xl font-bold text-red-500 mb-2">
            Blog Not Found
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Sorry, we couldn't find the blog you're looking for.
          </p>
        </div>
      </div>
    );
  }

  // Format date properly
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero section with image and overlay - responsive height */}
      <div className="relative h-72 sm:h-76 md:h-80 lg:h-96 w-full">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img
          src={blog.thumbnailUrl || blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-12 text-white w-full">
          <div className="max-w-5xl mx-auto w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center  md:mt-4">
              <img
                src={blog.authorAvater}
                alt={blog.authorName}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white"
              />
              <div className="ml-2 md:ml-4">
                <p className="font-medium text-sm sm:text-base">{blog.authorName}</p>
                <p className="text-xs sm:text-sm opacity-80">
                  {blog.authorRole} • {formatDate(blog.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - with responsive padding and width */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6 sm:-mt-8 md:-mt-10 z-30 relative px-4 sm:px-6 md:px-8 lg:px-0">
        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Tags - responsive spacing */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6 md:mb-8">
            {blog.tags &&
              blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 sm:px-3 text-xs sm:text-sm bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
          </div>

          {/* Content - responsive typography */}
          <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
            <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-4 sm:mb-6 whitespace-pre-wrap">
              {blog.excerpt}
            </p>
            <div className="text-gray-800 leading-relaxed space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg">
              {blog.content.split("\n").map((line, index) => (
                <p key={index}>
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a
                        href={decoratedHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={key}
                        className="text-blue-600 underline"
                      >
                        {decoratedText}
                      </a>
                    )}
                  >
                    {line}
                  </Linkify>
                </p>
              ))}
            </div>
          </div>

          {/* Author bio - responsive layout */}
          <div className="mt-8 sm:mt-12 md:mt-16 pt-4 sm:pt-6 md:pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <img
                src={blog.authorAvater}
                alt={blog.authorName}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
              />
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <h3 className="font-bold text-base sm:text-lg">{blog.authorName}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{blog.authorRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 md:py-12"></div>
      <Footer />
    </div>
  );
}

export default BlogDetails;