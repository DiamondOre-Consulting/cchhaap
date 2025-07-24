import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import EachProductPage from './pages/EachProductPage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ProfilePage from './pages/ProfilePage';
import Wishlist from './components/Profile/Wishlist';

const About = () => <h2 className="text-2xl text-blue-400">About Page</h2>;

const App = () => {
  return (
    <Router>
      <HomeLayout>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/products' element={<Products/>}/>
          <Route path="/each-product" element={<EachProductPage/>} /> 
          <Route path='/my-account' element={<ProfilePage/>}/>
          {/* <Route path='/login' element={<Login/>}/> */}
          {/* <Route path='/signup' element={<Signup/>}/> */}
        </Routes>
      </HomeLayout>
    </Router>
  );
};

export default App;
