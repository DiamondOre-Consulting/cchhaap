import React, { useEffect, useState } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import ProductForm from "@/components/Forms/ProductForm";
import { motion } from "framer-motion";
import HomeLayout from "../Layout/HomeLayout";
import { getAllAttributes } from "@/Redux/Slices/attributesSlice";
import { useDispatch } from "react-redux";
import { getAllProduct } from "@/Redux/Slices/productSlice";

const Products = () => {
  const [productPopUp, setProductPopUp] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(false);
  const [allAttributes, setAllAttributes] = useState([]); 

  const handleGetAllAttributes = async () => {
    try {
      const response = await dispatch(getAllAttributes());
      console.log("allattributs", response);
      setAllAttributes(response?.payload?.data);
    } catch (error) {
      console.log(error);
    }
  };


   const handleGetAllProducts = async() =>{
    const res = await dispatch(getAllProduct());
    console.log(res)
  }

  useEffect(()=>{
    handleGetAllProducts()
    handleGetAllAttributes()
  } , [])

  const formState = [
    {
      label: "Category",
      name: "category",
      inputType: "select",
      // required: true,
      validation: {
        // required: "Category is required",
      },
    },
    {
      label: "Sub Category",
      name: "subCategory",
      inputType: "multiselect",
      required: true,
      validation: {
        // required: "At least one subcategory is required",
      },
    },

    

    {
      label: "Product Name",
      name: "productName",
      inputType: "text",
      required: true,
      validation: {
        // required: "Product name is required",
        minLength: { value: 2, message: "Minimum 2 characters" },
      },
    },
    {
      label: "Brand Name",
      name: "brandName",
      inputType: "text",
      validation: {},
    },

    {
      label: "Gender",
      name: "gender",
      inputType: "select",
      required: true,
      options: ["Men", "Women", "Unisex", "Kids"],
      validation: {
        // required: "Gender is required",
      },
    },

    

    {
      label: "Fabric",
      name: "fabric",
      inputType: "select",
      required: true,
      options: [
        "Cotton",
        "Silk",
        "Rayon",
        "Polyester",
        "Linen",
        "Wool",
        "Blended",
        "Other",
      ],
      validation: {
        // required: "Fabric is required",
      },
    },
    {
      label: "Description",
      name: "description",
      inputType: "textarea",
      required: true,
      validation: {
        required: "Description is required",
      },
    },
    {
      label: "SKU",
      name: "sku",
      inputType: "text",
      required: true,
      validation: {
        // required: "SKU is required",
      },
    },

   
  ];


 

  

  return (
    <HomeLayout>
      <div>
        <div className="flex justify-between ">
          <div>
            <h1 className="text-2xl">Manage Products</h1>
            <div className="w-40 h-[2px] bg-c1"></div>
          </div>
        </div>

        <div class="relative overflow-x-auto mt-10 shadow-md sm:rounded-lg">
          <div class="flex px-5 py-2 items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
            <div className="flex gap-x-4">
              <div className="flex  items-center gap-x-2 ">
                <p>Showing</p>
                <select className="border rounded-md  px-2 py-1">
                  <option>10</option>
                  <option>20</option>
                </select>
              </div>

              <label for="table-search" class="sr-only">
                Search
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search-users"
                  class="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search for Products.."
                />
              </div>
            </div>

            <button
              onClick={() => {
                setProductPopUp(true);
              }}
              className="bg-c1 text-white cursor-pointer px-6 py-2 flex items-center gap-x-2"
            >
              {" "}
              <IoAdd /> Add Products
            </button>
          </div>
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Product Name
                </th>
                <th scope="col" class="px-6 py-3">
                  Category
                </th>
                <th scope="col" class="px-6 py-3">
                  SKU
                </th>
                <th scope="col" class="px-6 py-3">
                  price
                </th>
                <th scope="col" class="px-6 py-3">
                  Sale Price
                </th>
                <th scope="col" class="px-6 py-3">
                  Stock
                </th>

                <th scope="col" class="px-6 py-3">
                  Status
                </th>
                <th scope="col" class="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th
                  scope="row"
                  class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    class="w-20 h-20 "
                    src="https://shopmulmul.com/cdn/shop/files/258_93ea39ca-fb67-4945-bd43-a31738aef3da_700x.jpg?v=1751977210"
                    alt="Jese image"
                  />
                  <div class="ps-3  text-wrap">
                    <div class="text-base font-semibold">
                      Beige Organza Saree
                    </div>
                  </div>
                </th>
                <td class="px-6 py-4">Saree</td>
                <td class="px-6 py-4">S21</td>
                <td class="px-6 py-4">240</td>
                <td class="px-6 py-4">200</td>
                <td class="px-6 py-4">10</td>

                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>{" "}
                    Active
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p className="gap-x-4 flex text-xl">
                    <FaRegEdit className="cursor-pointer hover:text-red-600" />
                    <MdOutlineDeleteOutline
                      onClick={() => setDeletePopUp(true)}
                      className="cursor-pointer hover:text-red-600"
                    />
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {productPopUp && (
          <div className="fixed inset-0 z-40 min-h-full    transition flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setProductPopUp(false)}
            ></div>

            <div className="relative w-full max-w-5xl p-4 mx-auto bg-white rounded-xl z-50">
              <button
                type="button"
                onClick={() => setProductPopUp(false)}
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
              <ProductForm formState={formState} allAttributes={allAttributes}/>
            </div>
          </div>
        )}

        {deletePopUp && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 w-[90%] max-w-md"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <p className="text-lg font-semibold text-gray-800 dark:text-white mb-6 text-center">
                Are you absolutely sure you want to delete this item?
              </p>

              <div className="flex justify-center gap-x-6 p-2">
                <button
                  className="px-5 py-2 bg-c1 cursor-pointer text-white font-semibold rounded shadow transition duration-300 hover:shadow-red-500/50"
                  // onClick={handleDeleteCategory}
                >
                  {loader ? (
                    <>
                      <div class="text-center">
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            class="inline w-6 h-6 text-gray-400 animate-spin dark:text-gray-600 fill-white"
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
                          <span class="sr-only">Loading...</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p>Yes, Delete</p>
                  )}
                </button>
                <button
                  className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold cursor-pointer shadow transition duration-300"
                  onClick={() => setDeletePopUp(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </HomeLayout>
  );
};

export default Products;
