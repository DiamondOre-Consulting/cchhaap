import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Orders from "@/components/Profile/Orders";
import Address from "@/components/Profile/Address";
import Wishlist from "@/components/Profile/Wishlist";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userSignOut } from "@/Redux/Slices/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { getNavbarCartWishlistCount } from "@/Redux/Slices/cart";
import Profile from "@/components/Profile/Profile";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "tab-1";

  const handleTabChange = (value) => {
    setSearchParams({ tab: value });
  };

  const handleLogout = async () => {
    console.log("logout trigger",1)
    const res = await dispatch(userSignOut());
    console.log(res)
    dispatch(getNavbarCartWishlistCount());
    console.log(res);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Tabs
      defaultValue={defaultTab}
      className="items-center py-6"
      onValueChange={handleTabChange}
    >
      <TabsList className="h-auto rounded-none border-b bg-transparent w-96 p-0">
          <TabsTrigger
          value="tab-1"
          className=" relative rounded-none cursor-pointer w-full py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
        Profile
        </TabsTrigger>

        <TabsTrigger
          value="tab-2"
          className=" relative rounded-none cursor-pointer w-full py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Order
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className=" relative rounded-none cursor-pointer py-2 w-full after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Address
        </TabsTrigger>
        <TabsTrigger
          value="tab-4"
          className=" relative rounded-none py-2 cursor-pointer w-full after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          WishList
        </TabsTrigger>
        <TabsTrigger
          value="tab-5"
          className=" relative rounded-none py-2 cursor-pointer w-full after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Logout
        </TabsTrigger>
      </TabsList>

      
      <TabsContent value="tab-1">
        <Profile/>
      </TabsContent>

      <TabsContent value="tab-2">
        <Orders />
      </TabsContent>
      <TabsContent value="tab-3">
        <Address />
      </TabsContent>
      <TabsContent value="tab-4">
        <Wishlist />
      </TabsContent>
      <TabsContent value="tab-5">
        <p className="text-gray-100 p-4 text-center  mt-6">
          <button
            onClick={handleLogout}
            className="bg-c2 px-10 py-2 text-c1 text-lg cursor-pointer"
          >
            Logout
          </button>
        </p>
      </TabsContent>
    </Tabs>
  );
};

export default ProfilePage;
