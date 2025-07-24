import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';

const HomeLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#6d0c04] text-[#edb141] ">
     <Navbar/>

      <main className="flex-1">
        {children}
      </main>


      <Footer/>

      {/* <footer className="bg-black/50 backdrop-blur-md py-6 px-6 border-t border-white/10">
        <div className="container mx-auto text-center text-gray-400">
          &copy; {new Date().getFullYear()} Devi. All rights reserved.
        </div>
      </footer> */}
    </div>
  );
};

export default HomeLayout;
