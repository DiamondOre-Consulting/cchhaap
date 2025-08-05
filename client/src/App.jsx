import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import HomeLayout from "./Layout/HomeLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import EachProductPage from "./pages/EachProductPage";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ProfilePage from "./pages/ProfilePage";
import Wishlist from "./components/Profile/Wishlist";
import ResetPassword from "./pages/Auth/ResetPassword";
import CheckOutPage from "./pages/CheckOutPage";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "./Redux/Slices/authSlice";
import { getNavbarCartWishlistCount } from "./Redux/Slices/cart";

const About = () => <h2 className="text-2xl text-blue-400">About Page</h2>;

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { cartCount, wishlistCount } = useSelector((state) => state.cart);
  console.log("hello", cartCount, wishlistCount);
  const fetchData = async () => {
    await dispatch(getUserData());
    await dispatch(getNavbarCartWishlistCount());
  };

  useEffect(() => {
    fetchData();
  }, [location.pathname]);

  const { user } = useSelector((state) => state.user);
  console.log("data", user);

  return (
    <HomeLayout cartCount={cartCount} wishlistCount={wishlistCount}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/all-products" element={<Products />} />

        <Route path="/products/:id/:categoryName" element={<Products />} />
        <Route path="/products/gender/:gender" element={<Products />} />
        <Route path="/each-product/:id" element={<EachProductPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/my-account" element={<ProfilePage />} />
          <Route
            path="/reset-password/:token/:email/:expiry"
            element={<ResetPassword />}
          />
          <Route path="/checkout" element={<CheckOutPage />} />
        </Route>
      </Routes>
    </HomeLayout>
  );
};

export default App;
