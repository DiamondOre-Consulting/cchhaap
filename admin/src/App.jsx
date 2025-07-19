import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';
import Category from './pages/Category';
import Coupons from './pages/Coupons';
import Products from './pages/Products';

const About = () => <h2 className="text-2xl text-blue-400">About Page</h2>;

const App = () => {
  return (
   
      <HomeLayout>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path='/manage-category' element={<Category/>}/>
          <Route path='/manage-coupons' element={<Coupons/>}/>
          <Route path='/manage-products' element={<Products/>}/>
        </Routes>
      </HomeLayout>
    
  );
};

export default App;
