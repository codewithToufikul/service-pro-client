import React from "react";
import Navbar from "../../Component/Navbar";
import Footer from "../../Component/Footer";

function About() {
  return (
    <div>
      <Navbar />

      <div className="bg-gray-100 px-3">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-lg font-semibold text-gray-500 py-5">
            Home / About
          </h1>
        </div>
      </div>

      <div className="p-2 max-w-[1200px] mx-auto py-10 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="md:w-3/5 space-y-4">
          <p className="text-lg font-semibold text-blue-500">ABOUT US</p>
          <h2 className="text-3xl font-bold text-gray-800">
            Helping You Thrive in the Digital World
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            At <strong>Services Pro</strong>, we are a creative and
            technology-driven digital service provider committed to helping
            businesses and individuals grow, transform, and thrive in a
            competitive digital world.
          </p>
          <p className="text-base md:text-lg text-gray-600">
            Our core services include branding, design, marketing, and
            advertising — all tailored to meet your unique needs. We believe
            every brand has a story, and our mission is to bring that story to
            life with clarity, creativity, and purpose.
          </p>
          <p className="text-base md:text-lg text-gray-600">
            Whether you're a startup or an established business, we offer
            solutions that are innovative, reliable, and results-focused.
          </p>
          <div className="bg-white border-l-4 border-[#0dc181] p-4 shadow-md mt-6 rounded-md space-y-2">
            <h3 className="text-xl font-bold text-gray-800">What We Stand For</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>
                <strong>Integrity & Transparency:</strong> We believe in honest
                communication and building long-term relationships.
              </li>
              <li>
                <strong>Quality & Excellence:</strong> We aim for the highest
                standards in every project we deliver.
              </li>
              <li>
                <strong>Client-Centric Approach:</strong> Your satisfaction is our
                top priority, and we work closely with you every step of the way.
              </li>
              <li>
                <strong>Innovation & Growth:</strong> We embrace change and
                continuously improve our methods to deliver smarter solutions.
              </li>
            </ul>
          </div>

          {/* Trade License Section */}
          <div className="bg-gray-50 border-l-4 border-blue-600 p-4 shadow-sm mt-6 rounded-md">
            <h3 className="text-lg font-semibold text-gray-800">
              Trade License Information
            </h3>
            <p className="text-base text-gray-700">
              Our Trade License Number is:{" "}
              <span className="font-bold text-blue-600">10/472</span>
            </p>
          </div>

          <p className="text-base md:text-lg text-gray-600 mt-4">
            Let us help you create impact, build your brand, and move your vision
            forward.
          </p>
        </div>

        <div className="md:w-2/5">
          <img
            src="https://i.ibb.co.com/PGTbnv2F/features.png"
            alt="About illustration"
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-14 bg-[#f9fafe] p-12 border-y-2 border-gray-300">
        <div className="max-w-[700px] mx-auto text-center">
          <h1 className="text-xl md:text-2xl font-bold pb-2 text-[#012970]">
            Join Our Newsletter
          </h1>
          <p className="text-sm md:text-lg text-gray-600">
            Subscribe to our newsletter to receive updates, exclusive offers,
            and more.
          </p>
          <div className="join mt-4">
            <input
              className="input join-item"
              placeholder="Email"
              type="email"
            />
            <button className="btn join-item rounded-r-full bg-blue-600 text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default About;
