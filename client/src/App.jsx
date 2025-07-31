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
import ResetPassword from './pages/Auth/ResetPassword';
import CheckOutPage from './pages/CheckOutPage';


const About = () => <h2 className="text-2xl text-blue-400">About Page</h2>;

const App = () => {
  return (

      <HomeLayout>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id/:categoryName" element={<Products />} />
          <Route path='/products/gender/:gender' element={<Products/>}/>
          <Route path='/all-products' element={<Products/>}/>

          <Route path='/my-account' element={<ProfilePage/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route
            path="/reset-password/:token/:email/:expiry"
            element={<ResetPassword />}
          />
          <Route path='/each-product/:id' element={<EachProductPage/>}/>
          <Route path='/checkout' element={<CheckOutPage/>}/>
        </Routes>
      </HomeLayout>
 
  );
};

export default App;
