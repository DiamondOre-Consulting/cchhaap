import { editUserProfile, getUserData } from "@/Redux/Slices/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Profile = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);

  const handleGetUserData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getUserData());
      if (response?.payload?.data) {
        setUserData(response.payload.data);
        setFormData({
          fullName: response.payload.data.fullName || "",
          phoneNumber: response.payload.data.phoneNumber || "",
          email: response.payload.data.email || ""
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await dispatch(
        editUserProfile({fullName : formData.fullName,phoneNumber: formData.phoneNumber})
      );
      if (response?.payload?.success) {
        setUserData({
          ...userData,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
        });
        setEditMode(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    handleGetUserData();
  }, []);

  if (loading && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#6d0c04]">
        <div className="text-[#edb141]">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#6d0c04] py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:min-w-4xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-[#edb141]/10 backdrop-blur-sm border border-[#edb141]/20 rounded-xl p-6 mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#edb141]">
            Welcome back, <span className="underline">{userData?.fullName || userData?.email}</span>
          </h1>
          <p className="mt-2 text-[#f8d7a3]">
            Manage your profile information and account settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#ffffff08] backdrop-blur-sm border border-[#edb141]/10 rounded-xl overflow-hidden shadow-lg">
          {/* Card Header */}
          <div className="bg-[#edb141]/20 px-6 py-4 border-b border-[#edb141]/10 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#edb141]">Profile Information</h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-[#edb141] text-[#6d0c04] cursor-pointer rounded-lg hover:bg-[#f8c050] transition-all font-medium shadow-sm"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Card Content */}
          <div className="p-6">
            {editMode ? (
              <form onSubmit={handleEditProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#f8d7a3] mb-2 font-medium" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#ffffff12] border border-[#edb141]/20 rounded-lg text-white focus:ring-2 focus:ring-[#edb141] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#f8d7a3] mb-2 font-medium" htmlFor="phoneNumber">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#ffffff12] border border-[#edb141]/20 rounded-lg text-white focus:ring-2 focus:ring-[#edb141] focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[#f8d7a3] mb-2 font-medium" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#ffffff12] border border-[#edb141]/20 rounded-lg text-white focus:ring-2 focus:ring-[#edb141] focus:border-transparent"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 bg-transparent border border-[#edb141] text-[#edb141] rounded-lg hover:bg-[#edb141]/10 transition-all font-medium"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#edb141] cursor-pointer text-[#6d0c04] rounded-lg hover:bg-[#f8c050] transition-all font-medium shadow-sm flex items-center justify-center min-w-[120px]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#6d0c04]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#ffffff08] p-4 rounded-lg border border-[#edb141]/10">
                  <p className="text-[#f8d7a3] text-sm font-medium">Full Name</p>
                  <p className="text-white font-semibold mt-1">
                    {userData?.fullName || "Not provided"}
                  </p>
                </div>

                <div className="bg-[#ffffff08] p-4 rounded-lg border border-[#edb141]/10">
                  <p className="text-[#f8d7a3] text-sm font-medium">Phone Number</p>
                  <p className="text-white font-semibold mt-1">
                    {userData?.phoneNumber || "Not provided"}
                  </p>
                </div>

                <div className="md:col-span-2 bg-[#ffffff08] p-4 rounded-lg border border-[#edb141]/10">
                  <p className="text-[#f8d7a3] text-sm font-medium">Email</p>
                  <p className="text-white font-semibold mt-1">{userData?.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;