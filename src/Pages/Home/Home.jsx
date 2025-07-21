import React, { useEffect, useState } from "react";
import Navbar from "../../Component/Navbar";
import hero from "../../assets/hero.png";
import Slider from "react-slick";

// Import Slick Carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import client from "../../assets/trust.png";
import support from "../../assets/customer.png";
import fast from "../../assets/rok.png";
import security from "../../assets/cyber-security.png";
import global from "../../assets/global.png";
import success from "../../assets/success.png";
import Service from "../../Component/Service";
import LatestWork from "../../Component/LatestWork";
import logo from "../../assets/logo.png";
import Footer from "../../Component/Footer";
import Testimonial from "../../Component/Testimonial";
import HomeBlog from "../../Component/HomeBlog";
import { Link } from "react-router-dom";
import WhatsAppButton from "../../Component/WhatsAppButton";

import Contact  from '../../Component/Contact';

function Home() {
  const [servicesData, setServicesData] = useState([]);
  const [latestWorksData, setLatestWorksData] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [faqData, setFaqData] = useState([]);

  const [loading, setLoading] = useState(false);

  const settings = {
    dots: true,
    infinite: true, 
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1, // Changed to 1 for smoother mobile scrolling
    initialSlide: 0,
    autoplay: true, // Added autoplay for better engagement
    autoplaySpeed: 3000,
    pauseOnHover: true,
    swipeToSlide: true, // Better touch behavior
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, // Hide arrows on very small screens
          centerMode: true, // Center the slides
          centerPadding: "20px", // Add some padding
        },
      },
    ],
  };

  const FeatureCard = ({ image, title }) => (
    <div className="bg-blue-50 p-4 md:p-6 rounded-lg shadow-md mx-2 h-full flex flex-col items-center">
      <div className="flex justify-center">
        <div className="p-3 md:p-4 rounded-full mb-3 md:mb-4 w-16 md:w-20">
          <img className="w-full" src={image} alt={`${title} icon`} />
        </div>
      </div>
  
      <h2 className="text-lg md:text-lg font-bold text-gray-800 mb-2 text-center">
        {title}
      </h2>
  
      <div className="flex justify-center mt-auto">
      </div>
    </div>
  );

  const features = [
    { image: client, title: "Trusted by 500+ clients" },
    { image: support, title: "24/7 Customer Support" },
    { image: fast, title: "Fast & Scalable Solutions" },
    { image: security, title: "Data Security Guaranteed" },
    { image: global, title: "Global Reach & Expertise" },
    { image: success, title: "Proven Track of Success" },
  ];

  const fetchServieses = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://servies-pro-server.onrender.com/services");
      const data = await response.json();
      setLoading(false);
      setServicesData(data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching services:", error);
    }
    setLoading(false);
  };

  const fetchLatestWorks = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://servies-pro-server.onrender.com/latestWork");
      const data = await response.json();
      setLoading(false);
      setLatestWorksData(data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching latest works:", error);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://servies-pro-server.onrender.com/status");
      const data = await response.json();
      setLoading(false);
      setStatsData(data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching stats:", error);
    }
    setLoading(false);
  };

  const faqDatas = async() => {
    setLoading(true);
    try {
      const response = await fetch("https://servies-pro-server.onrender.com/faq");
      const data = await response.json();
      setLoading(false);
      setFaqData(data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching faq:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchServieses();
    fetchLatestWorks();
    fetchStats();
    faqDatas();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className=" w-full">
      <div
        className=" h-full w-full  bg-cover"
        style={{
          backgroundImage:
            "url('https://i.ibb.co.com/RGZHzyLc/bgshape1-7aade7aa-min-1-1-1.png')",
          // backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        <Navbar />
        <div className=" mt-8  lg:mt-16">
          <div className="hero">
            <div className="hero-content flex-col lg:flex-row justify-between items-center">
              <div className="w-full lg:w-1/2">
                <p className="text-green-800 text-sm lg:text-lg font-semibold">WE ARE HERE FOR</p>
                <h1 className=" text-2xl md:text-3xl lg:text-5xl font-semibold pt-3 leading-tight">
                  Smart Solutions to Grow Your Business
                </h1>
                <p className="py-6 text-base text-sm md:text-lg text-gray-700">
                We create smart, customized solutions to help your business grow and thrive. Whether it's digital transformation or creative planning, we’re here to support you every step of the way
                </p>
                <Link
                to={"/about"}
                  type="button"
                  className=" text-lg md:text-xl border-[1px] border-green-400 bg-[#0dc181] py-2 px-4 md:py-3 rounded-md text-white hover:bg-white hover:text-black transition duration-300 w-full md:w-auto mt-4 md:mt-0"
                >
                  Learn More
                </Link>
              </div>
              <div className="w-full lg:w-[800px] mt-8 lg:mt-0">
                <img src={hero} className="w-full rounded-lg" alt="Hero" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:ml-12">
      {/* Why Choose Us Slider Section */}
      <div className="slider-container max-w-[1320px] mx-auto py-6 md:py-10">
        <Slider {...settings}>
          {features.map((feature, index) => (
            <div key={index} className="px-1 md:px-2">
              <FeatureCard image={feature.image} title={feature.title} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
      </div>

      <div className=" mt-12 p-2">
        <div className=" max-w-[700px] mx-auto text-center">
          <p className="bg-gradient-to-r py-2 from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent font-semibold">
            WHAT WE OFFER
          </p>
          <h1 className=" text-2xl md:text-3xl lg:text-4xl font-bold pb-2 md:pb-4 ">OUR SERVICES</h1>
          <p className=" text-sm md:text-lg text-gray-600 ">
            We provide a wide range of services to help you achieve your
            business goals. From web development to digital marketing, we have
            got you covered.
          </p>
        </div>
      </div>

      <div className=" max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
        {servicesData.map((service) => (
          <Service
            title={service.title}
            description={service.description}
            icon={service.icon}
            id={service._id}
          ></Service>
        ))}
      </div>
      
      <div className=" mt-12 p-2">
        <div className=" max-w-[700px] mx-auto text-center">
          <p className="bg-gradient-to-r py-2 from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent font-semibold">
            OUR PORTFOLIO
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold pb-2 md:pb-4 ">Check Our Latest Work</h1>
          <p className="  text-sm md:text-lg text-gray-600 ">
            We provide a wide range of services to help you achieve your
            business goals. From web development to digital marketing, we have
            got you covered.
          </p>
        </div>
      </div>

      <div className=" p-2 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
        {latestWorksData.map((project) => (
          <LatestWork
            key={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            link={project.link}
          ></LatestWork>
        ))}
      </div>

      <div className=" mt-14 p-2">
        <div className=" max-w-[700px] mx-auto text-center">
          <p className="bg-gradient-to-r py-2 from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent font-semibold">
            F.A.Q
          </p>
          <h1 className=" text-2xl md:text-3xl lg:text-4xl font-bold pb-4 ">
            Frequently Asked Questions
          </h1>
        </div>
      </div>

      <div className=" max-w-[1200px] mx-auto mt-10 flex  justify-between items-center flex-col-reverse md:flex-row">
        <div className=" md:w-1/2">
          <div className="join join-vertical bg-base-100 w-full">
            {
              faqData.map((faq) => (
                <div className="join-item">
                  <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                      {faq.question}
                    </div>
                    <div className="collapse-content">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div>
          <img
            className=" w-[550px]"
            src="https://i.ibb.co.com/bjxj6VgZ/undraw-questions-g2px.png"
            alt=""
          />
        </div>
      </div>
      <div className="grid grid-cols-1 mt-5 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4 py-12 max-w-7xl mx-auto">
        {statsData.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <div className="mb-4">
              <img src={item.icon} alt={item.label} className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-blue-900">{item.count}</h2>
            <p className="text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>

      <div className=" mt-14">
        <div className=" max-w-[700px] mx-auto text-center">
          <p className="bg-gradient-to-r py-2 from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent font-semibold">
            Contract
          </p>
          <h1 className=" text-2xl md:text-3xl lg:text-4xl font-bold pb-4 ">Contact Us</h1>
          <p className=" text-sm md:text-lg text-gray-600 ">
            Have questions or need support? We’re here to help! Reach out to us
            anytime — we’d love to hear from you.
          </p>
        </div>
      </div>

        <Contact/>
      <div className=" mt-14">
        <div className=" max-w-[700px] mx-auto text-center">
          <p className="bg-gradient-to-r py-2 from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent font-semibold">
            Testimonial
          </p>
          <h1 className=" text-2xl md:text-3xl lg:text-4xl font-bold pb-4 ">OUR CLIENTS SAY</h1>
          <p className=" text-sm md:text-lg text-gray-600 ">
            We are honored to have worked with some of the most successful
            businesses in the world.
          </p>
        </div>
      </div>

      <Testimonial/>

      <div className=" mt-16">
        <div className=" max-w-[700px] mx-auto text-center">
          <p className="bg-gradient-to-r py-2 from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent font-semibold">
            BLOG
          </p>
          <h1 className=" text-2xl md:text-3xl lg:text-4xl font-bold pb-4 ">OUR LATEST BLOGS</h1>
          <p className=" text-sm md:text-lg text-gray-600 ">
          Discover the latest insights, trends, and tips from our expert team
          </p>
        </div>
      </div>

      <HomeBlog/>

      <div className=" mt-14 bg-[#f9fafe] p-12 border-y-2 border-gray-300">
        <div className=" max-w-[700px] mx-auto text-center">
          <h1 className=" text-xl md:text-2xl font-bold pb-2 text-[#012970]">
            Join Our Newsletter
          </h1>
          <p className=" text-sm md:text-lg text-gray-600 ">
            Subscribe to our newsletter to receive updates, exclusive offers,
            and more.
          </p>
          <div className="join mt-4">
            <input className="input join-item" placeholder="Email" />
            <button className="btn join-item rounded-r-full bg-blue-600 text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>

        <Footer/>
        <WhatsAppButton phoneNumber="+8801576408601" />
    </div>
  );
}

export default Home;
