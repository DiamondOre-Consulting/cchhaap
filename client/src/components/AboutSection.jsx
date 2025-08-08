import React from "react";
import logo from "../assets/logo.png";

const AboutSection = () => {
  return (
    <div className="grid grid-cols-1 px-2 md:px-0 md:grid-cols-2 md:gap-y-0 gap-y-4">
      <video
        src="https://videos.pexels.com/video-files/853800/853800-hd_1920_1080_25fps.mp4
      "
        autoPlay
      />

      <div className="flex  flex-col max-w-md  mx-auto text-center justify-center items-center">
        <img src={logo} alt="" className="w-40 mb-4" />
        <p>
          At Chhaapp collection, we are dedicated to redefining elegance through
          our meticulously crafted apparel, founded by Ananta Singhal. As we
          continue to grow, we remain focused on our mission - to elevate your
          wardrobe with pieces that exude sophistication & style... At Chhaapp
          we invite you to explore our offerings & discover the transformative
          power of fashion.
        </p>
      </div>
    </div>
  );
};

export default AboutSection;
