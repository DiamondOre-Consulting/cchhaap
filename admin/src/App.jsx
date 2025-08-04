import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomeLayout from "./Layout/HomeLayout";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Coupons from "./pages/Coupons";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Variations from "./pages/Variations";
import Login from "./pages/Auth/Login";
import ManageBanners from "./pages/ManageBanners";
import { useDispatch } from "react-redux";

const About = () => <h2 className="text-2xl text-blue-400">About Page</h2>;




const App = () => {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route element={<HomeLayout />}> */}
        <Route path="/" element={<Home />} />
        <Route path="/manage-category" element={<Category />} />
        <Route path="/manage-coupons" element={<Coupons />} />
        <Route path="/manage-products" element={<Products />} />
        <Route path="/manage-orders" element={<Orders />} />
        <Route path="/manage-variations" element={<Variations />} />
        <Route path="/manage-banner" element={<ManageBanners/>}/>
      {/* </Route> */}
    </Routes>
  );
};

export default App;
