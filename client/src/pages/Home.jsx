import React, { useState, useEffect, lazy, Suspense } from "react";
import Hero from "@/components/Hero"; 


const Categories = lazy(() => import("@/components/Categories"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const FeaturedProducts = lazy(() => import("@/components/FeaturedProducts"));
const Testimonial = lazy(() => import("@/components/Testimonial"));
const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));


const LoadingPlaceholder = () => (
  <div className="min-h-[300px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-c2"></div>
  </div>
);

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
    
  return (
    <>
      <Hero />
      
      <Suspense fallback={<LoadingPlaceholder />}>
        <Categories />
      </Suspense>
      
      <Suspense fallback={<LoadingPlaceholder />}>
        <AboutSection />
      </Suspense>
      
      <Suspense fallback={<LoadingPlaceholder />}>
        <FeaturedProducts />
      </Suspense>
      
      <Suspense fallback={<LoadingPlaceholder />}>
        <Testimonial />
      </Suspense>
      
      <Suspense fallback={<LoadingPlaceholder />}>
        <FeaturesSection />
      </Suspense>
    </>
  );
};

export default Home;