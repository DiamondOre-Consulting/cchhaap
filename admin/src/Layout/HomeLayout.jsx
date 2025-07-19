import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  Home,
  Package,
  ShoppingCart,
  Tag,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// import { useDispatch } from "react-redux";
// import { toast } from "sonner";
// import { logout } from "@/Redux/AuthSlice";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Tag, label: "Manage Category", path: "/manage-category" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: ShoppingCart, label: "Orders", path: "/orders" },
  { icon: Tag, label: "Coupons", path: "/coupons" },
  { icon: Users, label: "Customers", path: "/customers" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const AdminLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  // const handleLogout = () => {
  //   dispatch(logout());
  //   toast.success("Logged out successfully");
  //   navigate("/login");
  // };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const MenuItem = ({ item, isMobile = false }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        className={`group flex items-center gap-3 px-4 py-3.5  mb-2 transition-all duration-200 relative overflow-hidden
                    ${
                      isActive
                        ? " border-l-4  border-[#620A1A] text-[#620A1A] transparent "
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#620A1A]"
                    }
                    ${!isOpen && !isMobile ? "justify-center px-2" : ""}
                `}
        onClick={isMobile ? toggleMobileSidebar : undefined}
        title={!isOpen && !isMobile ? item.label : ""}
      >
        <div
          className={`relative z-10 transition-transform duration-200 ${
            isActive ? "scale-110" : "group-hover:scale-110"
          }`}
        >
          <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        {(isOpen || isMobile) && (
          <span
            className={`font-medium transition-all duration-200 ${
              isActive ? "font-semibold" : ""
            }`}
          >
            {item.label}
          </span>
        )}
        {isActive && <div className="absolute inset-0 bg-transparent" />}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleMobileSidebar}
            className="p-2  hover:bg-gray-50 text-gray-600 hover:text-[#620A1A] transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8  bg-gradient-to-r from-[#f76d04] to-[#FF8C00] flex items-center justify-center text-white font-bold"></div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#f76d04] to-[#FF8C00] bg-clip-text text-transparent">
              छाप
            </h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={toggleMobileSidebar}
            />
            <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 lg:hidden overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10  bg-gradient-to-r from-[#f76d04] to-[#FF8C00] flex items-center justify-center text-white font-bold text-lg">
                    छाप
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-[#f76d04] to-[#FF8C00] bg-clip-text text-transparent">
                    छाप
                  </h2>
                </div>
                <button
                  onClick={toggleMobileSidebar}
                  className="p-2  hover:bg-gray-50 text-gray-600 hover:text-[#620A1A] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="p-4">
                {menuItems.map((item) => (
                  <MenuItem key={item.path} item={item} isMobile={true} />
                ))}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    // onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3.5 w-full text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors group"
                  >
                    <LogOut
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-30 hidden lg:block transition-all duration-300 ${
          isOpen ? "w-72" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          {isOpen && (
            <div className="flex items-center gap-3">
              {/* <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#f76d04] to-[#FF8C00] flex items-center justify-center text-white font-bold text-lg">
                CB
              </div> */}
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#f76d04] to-[#FF8C00] bg-clip-text text-transparent">
                छाप
              </h2>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2  hover:bg-gray-50 text-gray-600 hover:text-[#620A1A] transition-colors"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100vh-5rem)]">
          {menuItems.map((item) => (
            <MenuItem key={item.path} item={item} />
          ))}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              // onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-3.5  w-full text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors group
                                ${!isOpen ? "justify-center px-2" : ""}`}
              title={!isOpen ? "Logout" : ""}
            >
              <LogOut
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isOpen ? "lg:ml-72" : "lg:ml-20"
        } pt-16 lg:pt-0`}
      >
        <main className="p-6 max-w-8xl mx-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
