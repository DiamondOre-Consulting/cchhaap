import AboutSection from "@/components/AboutSection";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturesSection from "@/components/FeaturesSection";
import Hero from "@/components/Hero";
import ShopFor from "@/components/ShopFor";
import Testimonial from "@/components/Testimonial";
import React, { useState, useEffect } from "react";

const Home = () => {
   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    
  return (
    <>
      <Hero />
      <Categories/>
      <AboutSection/>
      <ShopFor/>
      <FeaturedProducts/>
      <Testimonial/>
      <FeaturesSection/>
      
    </>
  );
};

export default Home;
