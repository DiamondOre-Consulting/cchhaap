import {
  deleteCoupon,
  EditCoupon,
  getAllCoupons,
} from "@/Redux/Slices/couponSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import CouponsForm from "@/components/Forms/CouponsForm";
import HomeLayout from '../Layout/HomeLayout'

const Coupons = () => {
  const [allCoupons, setAllCoupons] = useState([]);
  const dispatch = useDispatch();
  const [editCouponPopUp, setEditCouponPopUp] = useState(false);
  const [loader, setLoader] = useState(false);
  const [addCouponPopUp, setAddCouponPopUp] = useState(false);
  const [addCouponFormData, setAddCouponFormData] = useState({
    couponCode: "",
    discountType: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    discountValue: "",
    isActive: false,
  });

  const [couponId, setCouponId] = useState();
  const [editCouponFormData, setEditCouponFormData] = useState({
    couponCode: "",
    discountType: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    discountValue: "",
    isActive: null,
  });

  const handleDeleteCoupons = async (id) => {
    try {
      const response = await dispatch(deleteCoupon(id));
      console.log(response);
      await handleGetAllCoupons();
    } catch (error) {
      console.log(error);
    }
  };

  const openEditPopup = (coupon, couponData) => {
    setCouponId(coupon);
    setEditCouponFormData(couponData);
    console.log("ads", editCouponFormData);
    setEditCouponPopUp(true);
  };

  console.log("editformdata", editCouponFormData);

  const handleEditInputChange = (e) => {
    let { name, value } = e.target;
    setEditCouponFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditCoupons = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await dispatch(
        EditCoupon({ couponId, editCouponFormData })
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
      setEditCouponPopUp(false);
      await handleGetAllCoupons();
    }
  };

  const handleGetAllCoupons = async () => {
    try {
      const response = await dispatch(getAllCoupons());
      console.log(response?.payload?.data);
      setAllCoupons(response?.payload?.data);
    } catch (error) {}
  };

  useEffect(() => {
    handleGetAllCoupons();
  }, []);

  return (
    <HomeLayout>
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Manage Coupons</h1>
            <div className="w-40 h-[2px] bg-c1"></div>
          </div>
          <button
            onClick={() => setAddCouponPopUp(true)}
            className="bg-c1 cursor-pointer text-white px-4 py-2 md:px-6 md:py-2 flex items-center gap-x-2 text-sm md:text-base"
          >
            <IoAdd /> Add Coupon
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
        

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Coupon Code
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Discount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Active/Inactive
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    End Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allCoupons?.map((coupon) => (
                  <tr key={coupon._id} className="bg-white border-b hover:bg-gray-50">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {coupon?.couponCode}
                    </th>
                    <td className="px-6 py-4">
                      {coupon?.discountType === "fixed"
                        ? `₹${coupon?.discountValue}`
                        : `${coupon?.discountValue}%`}
                    </td>
                    <td className="px-6 py-4">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={coupon?.isActive === true}
                          readOnly
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-[#620A1A]"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(coupon?.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(coupon?.endDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(coupon?.endDate) < new Date() ? (
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                          Expired
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                          Active
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-x-4 text-lg">
                        <FaRegEdit
                          className="cursor-pointer hover:text-red-600"
                          onClick={() => openEditPopup(coupon?._id, coupon)}
                        />
                        <MdOutlineDeleteOutline
                          className="cursor-pointer hover:text-red-600"
                          onClick={() => handleDeleteCoupons(coupon?._id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {allCoupons?.map((coupon) => (
              <div key={coupon._id} className="p-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{coupon?.couponCode}</p>
                    <p className="text-sm text-gray-600">
                      {coupon?.discountType === "fixed"
                        ? `₹${coupon?.discountValue}`
                        : `${coupon?.discountValue}%`} discount
                    </p>
                  </div>
                  <div className="flex gap-x-3">
                    <FaRegEdit
                      className="cursor-pointer hover:text-red-600 text-lg"
                      onClick={() => openEditPopup(coupon?._id, coupon)}
                    />
                    <MdOutlineDeleteOutline
                      className="cursor-pointer hover:text-red-600 text-lg"
                      onClick={() => handleDeleteCoupons(coupon?._id)}
                    />
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Start Date</p>
                    <p>
                      {new Date(coupon?.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">End Date</p>
                    <p>
                      {new Date(coupon?.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <div className="flex items-center">
                      {new Date(coupon?.endDate) < new Date() ? (
                        <>
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                          <span>Expired</span>
                        </>
                      ) : (
                        <>
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                          <span>Active</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">Active</p>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={coupon?.isActive === true}
                        readOnly
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-[#620A1A]"></div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      
        {addCouponPopUp && (
          <div className="fixed inset-0 z-40 min-h-full transition flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setAddCouponPopUp(false)}
            ></div>
            <div className="relative w-full max-w-4xl p-4 mx-auto bg-white rounded-xl z-50">
              <button
                type="button"
                onClick={() => setAddCouponPopUp(false)}
                className="absolute top-2 right-2 cursor-pointer"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414 5.707 15.707a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <CouponsForm
                addCouponFormData={addCouponFormData}
                handleGetAllCoupons={handleGetAllCoupons}
                setAddCouponFormData={setAddCouponFormData}
                setAddCouponPopUp={setAddCouponPopUp}
              />
            </div>
          </div>
        )}

        {editCouponPopUp && (
          <div className="fixed inset-0 z-40 min-h-full transition flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setEditCouponPopUp(false)}
            ></div>
            <div className="relative w-full max-w-4xl p-4 mx-auto bg-white rounded-xl z-50">
              <button
                type="button"
                onClick={() => setEditCouponPopUp(false)}
                className="absolute top-2 right-2 cursor-pointer"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414 5.707 15.707a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <form onSubmit={handleEditCoupons}>
                <div className="flex flex-col text-sm space-y-6">
                  <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
                    <div className="flex flex-col w-full justify-start items-start">
                      <label>Coupon Code</label>
                      <input
                        name="couponCode"
                        type="text"
                        value={editCouponFormData?.couponCode}
                        onChange={handleEditInputChange}
                        className="w-full border rounded border-black/30 px-3 py-2 mt-1 placeholder-gray-300 outline-none"
                      />
                    </div>
                    <div className="flex flex-col w-full justify-start items-start">
                      <label>Discount Type</label>
                      <select
                        name="discountType"
                        value={editCouponFormData.discountType}
                        onChange={handleEditInputChange}
                        className="w-full border rounded border-black/30 px-3 py-2 mt-1 placeholder-gray-300 outline-none"
                      >
                        <option value={""}>Select</option>
                        <option value={"percentage"}>percentage</option>
                        <option value={"fixed"}>fixed</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
                    <div className="flex flex-col w-full justify-start items-start">
                      <label>Start Date</label>
                      <input
                        name="startDate"
                        type="date"
                        value={
                          editCouponFormData?.startDate
                            ? editCouponFormData.startDate.split("T")[0]
                            : ""
                        }
                        onChange={handleEditInputChange}
                        className="w-full border rounded border-black/30 px-3 py-2 mt-1 placeholder-gray-300 outline-none"
                      />
                    </div>
                    <div className="flex flex-col w-full justify-start items-start">
                      <label>End Date</label>
                      <input
                        name="endDate"
                        type="date"
                        value={
                          editCouponFormData?.endDate
                            ? editCouponFormData.endDate.split("T")[0]
                            : ""
                        }
                        onChange={handleEditInputChange}
                        className="w-full border rounded border-black/30 px-3 py-2 mt-1 placeholder-gray-300 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
                    <div className="flex flex-col w-full justify-start items-start">
                      <label>Minimum Order Value</label>
                      <input
                        name="minAmount"
                        type="number"
                        value={editCouponFormData?.minAmount}
                        onChange={handleEditInputChange}
                        className="w-full border rounded border-black/30 px-3 py-2 mt-1 placeholder-gray-300 outline-none"
                      />
                    </div>
                    <div className="flex flex-col w-full justify-start items-start">
                      <label>Discount Value</label>
                      <input
                        name="discountValue"
                        type="number"
                        value={editCouponFormData?.discountValue}
                        onChange={handleEditInputChange}
                        className="w-full border rounded border-black/30 px-3 py-2 mt-1 placeholder-gray-300 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <p className="mb-2 font-semibold">Coupon Status :</p>
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="isActive"
                          value={true}
                          checked={editCouponFormData?.isActive === true}
                          onChange={() => {
                            setEditCouponFormData((pre) => ({
                              ...pre,
                              isActive: true,
                            }));
                          }}
                        />
                        <span>Active</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="isActive"
                          value={false}
                          checked={editCouponFormData?.isActive === false}
                          onChange={() =>
                            setEditCouponFormData((prev) => ({
                              ...prev,
                              isActive: false,
                            }))
                          }
                        />
                        <span>InActive</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-c1 cursor-pointer rounded-md w-full mt-6 py-3 text-white font-medium"
                >
                  {loader ? (
                    <div role="status" className="flex items-center justify-center">
                      <svg
                        aria-hidden="true"
                        className="inline w-6 h-6 text-gray-200 animate-spin fill-gray-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="ml-2">Loading...</span>
                    </div>
                  ) : (
                    "Update Coupon"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default Coupons;