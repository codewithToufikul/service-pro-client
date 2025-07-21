import React, { useEffect, useState } from 'react'
import Navbar from '../../Component/Navbar'
import Footer from '../../Component/Footer'
import Service from '../../Component/Service'

function Servies() {
    const [servicesData, setServicesData] = useState([]);
  
    const [loading, setLoading] = useState(false);

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

      useEffect(() => {
        fetchServieses();
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
    <div>
        <Navbar/>
        <div>
        <div className=" bg-gray-100 px-3">
        <div className=" max-w-[1200px] mx-auto">
          <h1 className=" text-lg font-semibold text-gray-500  py-5">
            Home / Servies
          </h1>
        </div>
      </div>
      <div className=" mt-12 px-2">
        <div className=" max-w-[700px] mx-auto text-center">
          <p className="bg-gradient-to-r py-2 from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent font-semibold">
            WHAT WE OFFER
          </p>
          <h1 className=" text-2xl md:text-3xl lg:text-4xl font-bold pb-2 lg:pb-4 ">OUR SERVICES</h1>
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
        </div>
        <Footer/>
    </div>
  )
}

export default Servies