import React, { useEffect } from "react";
import logo from "../assets/logo.png";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutSection = () => {

 

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Video Section - Takes full width on mobile, half on desktop */}
        <div 
          className="w-full lg:w-1/2 overflow-hidden rounded-lg shadow-lg"
          // data-aos="fade-right"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto object-cover"
            poster="https://via.placeholder.com/800x450"
          >
            <source 
              src="https://videos.pexels.com/video-files/853800/853800-hd_1920_1080_25fps.mp4" 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Content Section - Takes full width on mobile, half on desktop */}
        <div 
          className="w-full lg:w-1/2 flex flex-col items-center text-center px-4 lg:px-8"
          // data-aos="fade-left"
        >
          <img 
            src={logo} 
            alt="Chhaapp Collection Logo" 
            className="w-40 mb-6 transition-transform hover:scale-105"
          />
          <p className="text-gray-100 text-lg leading-relaxed">
            At Chhaapp collection, we are dedicated to redefining elegance through
            our meticulously crafted apparel, founded by Ananta Singhal. As we
            continue to grow, we remain focused on our mission - to elevate your
            wardrobe with pieces that exude sophistication & style. At Chhaapp
            we invite you to explore our offerings & discover the transformative
            power of fashion.
          </p>
          {/* <button className="mt-6 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
            Discover More
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default AboutSection;