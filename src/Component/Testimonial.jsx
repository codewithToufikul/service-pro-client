import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Testimonial() {
  const [sliderRef, setSliderRef] = useState(null);
  const [settings, setSettings] = useState({
    dots: true,
    infinite: true,
    speed: 700,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      }
    ]
  });
  const [testimonials, setTestimonials] = useState([]);

  // Make sure the slider updates when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (sliderRef) {
        sliderRef.slickGoTo(0);
        sliderRef.refresh();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sliderRef]);

  useEffect(() => {
    fetch('https://servies-pro-server.onrender.com/feedback')
      .then(response => response.json())
      .then(data => setTestimonials(data.filter(testi => testi.status !== "pending")))
      .catch(error => console.error(error));
  }, []);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const ratingNum = parseInt(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < ratingNum) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    
    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      <Slider ref={slider => setSliderRef(slider)} {...settings}>
        {testimonials.map((t, index) => (
          <div key={index} className="px-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-60 transform transition-transform duration-300 hover:scale-105">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-500">
                    {t.image ? (
                      <img 
                        src={t.image} 
                        alt={t.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500 font-semibold text-lg">
                          {t.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">{t.name}</h3>
                    <p className="text-sm text-gray-600">{t.roll}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {renderStars(t.rating)}
                </div>
                
                <div className="relative flex-grow">
                  <span className="text-blue-500 text-4xl absolute -top-5 -left-2 opacity-20">"</span>
                  <p className="text-gray-700 italic text-sm leading-relaxed mb-4 z-10 relative line-clamp-5 overflow-hidden">
                    {t.message}
                  </p>
                  <span className="text-blue-500 text-4xl absolute bottom-0 right-0 opacity-20">"</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Testimonial;