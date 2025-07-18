import AboutSection from "@/components/AboutSection";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";
import ShopFor from "@/components/ShopFor";
import Testimonial from "@/components/Testimonial";
import React, { useState, useEffect } from "react";

const Home = () => {
  return (
    <>
      <Hero />
      <Categories/>
      <AboutSection/>
      <ShopFor/>
      <FeaturedProducts/>
      <Testimonial/>
      
    </>
  );
};

export default Home;
