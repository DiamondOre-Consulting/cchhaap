import AddCategoryForm from "@/components/Forms/AddCategoryForm";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IoAdd } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import {
  createSubCategory,
  // createSubCategoryCategory,
  deleteCategory,
  deleteSubCategory,
  editSubCategory,
  getAllCategories,
} from "@/Redux/Slices/categorySlice";
// import { defaulSubCategoryValue } from "@/constant/formDefaults";

const Category = () => {
  const [addCategoryPopUp, setAddCategoryPopUp] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const dispatch = useDispatch();
  const [id, setId] = useState("");
  const [loader, setLoader] = useState(false);
  const [openSubCategoryForm, setOpenSubCategoryForm] = useState(false);
  const [editData, setEditData] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const [editSubCategoryPopUp, setEditSubCategoyPopUp] = useState(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [subcategoryIndex, setSubCategoryIndex] = useState();

  console.log(allCategories);
  const formState = [
    {
      label: "Category Name",
      name: "categoryName",
      required: true,
      inputType: "text",
      error: {
        required: "Category Name is required",
        minLength: { value: 2, message: "Minimum 2 characters required" },
      },
    },
    {
      label: "Category Image",
      name: "categoryImage",
      inputType: "file",
      required: true,
      error: {
        required: "Category Image is required",
      },
    },

    // {
    //   label: "Subcategories",
    //   name: "subCategory",
    //   inputType: "array",
    // },
  ];

  const subCategoryState = [
    {
      label: "Subcategories",
      name: "subCategory",
      inputType: "array",
    },
  ];

  const handleGetAllCategories = async () => {
    try {
      const response = await dispatch(getAllCategories());
      console.log(response);
      setAllCategories(response?.payload?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllCategories();
  }, []);

  const handleDeleteCategory = async () => {
    setLoader(true);
    try {
      const res = await dispatch(deleteCategory(id));
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
      setDeletePopUp(false);
      await handleGetAllCategories();
    }
  };

  console.log("cate", categoryId);

  const handleCreateSubCategories = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const response = await dispatch(
        createSubCategory({ categoryId, subCategoryName })
      );
      console.log(response);
      setOpenSubCategoryForm(false)
      
    } catch (error) {
      console.log(error);
      
    } finally {
      setLoader(false);
      setSubCategoryName("");
      handleGetAllCategories();
      
    }
  };

  const handleDeleteSubCategories = async (categoryId, subCategoryName) => {
    try {
      const response = await dispatch(
        deleteSubCategory({ categoryId, subCategoryName })
      );
      await handleGetAllCategories();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };



  const handleEditSubCategory = async (e) => {
    try {
      e.preventDefault();
      setLoader(true);
      console.log("data", categoryId, subCategoryName, newSubCategoryName);
      const response = await dispatch(
        editSubCategory({
          categoryId,
          subCategoryName,
          newSubCategoryName,
          subcategoryIndex,
        })
      );
      console.log(response);
   
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
      setEditSubCategoyPopUp(false);
     await handleGetAllCategories()
    }
  };

  console.log(editData);
  return (
    <div className="">
      <div className="flex justify-between ">
        <div>
          <h1 className="text-2xl">Manage Categories</h1>
          <div className="w-40 h-[2px] bg-c1"></div>
        </div>
      </div>

      <div>
        <div class="relative overflow-x-auto mt-4 shadow-md sm:rounded-lg">
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
                  placeholder="Search for users"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setEditData(null);
                setAddCategoryPopUp(true);
              }}
              className="bg-c1 text-white px-6 py-2 flex items-center gap-x-2"
            >
              {" "}
              <IoAdd /> Add Categories
            </button>
          </div>
          <table class="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 text-left uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="">
                <th scope="col" class="px-6 py-3">
                  Category
                </th>

                <th scope="col" class="px-6 py-3">
                  Category Name
                </th>
                <th scope="col" class="px-6 py-3">
                  Sub Category
                </th>
                <th scope="col" class="px-6 py-3">
                  Edit
                </th>
                <th scope="col" class="px-6 py-3">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {allCategories?.map((cate, index) => (
                <tr
                  key={index}
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    class="flex items-center  px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <img
                      class="w-20 h-24  "
                      src={cate?.categoryImage?.secureUrl}
                      alt="Jese image"
                    />
                    <div class="ps-3"></div>
                  </th>
                  <td class="py-4 px-6 text-base border  font-semibold">
                    {cate?.categoryName}
                  </td>

                  {cate?.subCategories?.length === 0 ? (
                    <td
                      onClick={() => {
                        setCategoryId(cate._id);
                        setOpenSubCategoryForm(true);
                      }}
                      className="py-4 px-6 cursor-pointer text-base font-semibold text-blue-600"
                    >
                      + Sub Category
                    </td>
                  ) : (
                    <td className="flex flex-col border">
                    
                    <td
                      onClick={() => {
                        setCategoryId(cate._id);
                        setOpenSubCategoryForm(true);
                      }}
                      className="py-2 px-6 cursor-pointer border-b text-base font-semibold text-blue-600"
                    >
                      + Sub Category
                    </td>
               {
                    cate.subCategories?.map((sub, idx) => (
                      <td
                        key={idx}
                        className="py-2 px-6 flex border-b  flex-col "
                      >
                        <div className="flex  items-center  justify-between gap-2">
                          <span>{sub}</span>
                          <MdOutlineModeEdit
                            className="text-xl cursor-pointer"
                            onClick={() => {
                            setEditSubCategoyPopUp(true);
                              setCategoryId(cate?._id);
                              setSubCategoryName(sub);
                              setSubCategoryIndex(idx);
                            }}
                          />
                          <MdOutlineDeleteOutline
                            className="text-xl text-red-600 cursor-pointer"
                              onClick={() =>
                              handleDeleteSubCategories(cate?._id, sub)
                            }
                          />
                        </div>
                      </td>
                    ))
                        
                  }

                       </td>
                  
                  )}
                  <td class="px-6 py-4 border">
                    {/* <div class="flex items-center"> */}

                    <MdOutlineModeEdit
                      onClick={() => {
                        setEditData(cate), setAddCategoryPopUp(true);
                      }}
                      className="text-2xl cursor-pointer"
                    />
                  </td>
                  <td class="px-6 py-4 border">
                    <a
                      href="#"
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      <MdOutlineDeleteOutline
                        className="text-2xl text-red-600 cursor-pointer"
                        onClick={(e) => {
                          setId(cate?._id);
                          setDeletePopUp(true);
                        }}
                      />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {addCategoryPopUp && (
        <div className="fixed inset-0 z-40 min-h-full    transition flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setAddCategoryPopUp(false)}
          ></div>

          <div className="relative w-full max-w-4xl p-4 mx-auto bg-white rounded-xl z-50">
            <button
              type="button"
              onClick={() => setAddCategoryPopUp(false)}
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
            <AddCategoryForm
              formState={formState}
              setAddCategoryPopUp={setAddCategoryPopUp}
              handleGetAllCategories={handleGetAllCategories}
              editData={editData}
              id={id}
              addCategoryPopUp={addCategoryPopUp}
              subCategoryState={subCategoryState}
            />
          </div>
        </div>
      )}

      {openSubCategoryForm && (
        <div className="fixed inset-0 z-40 min-h-full    transition flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpenSubCategoryForm(false)}
          ></div>

          <div className="relative w-full max-w-4xl p-4 mx-auto bg-white rounded-xl z-50">
            <button
              type="button"
              onClick={() => setOpenSubCategoryForm(false)}
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
            <div>
              <div className="flex flex-col items-center text-xl">
                <div className="flex items-center">
                  <IoAdd /> Add Sub Category
                </div>
                <div className="h-[1px] w-full bg-black/20 my-3"></div>
              </div>

              <form
                onSubmit={handleCreateSubCategories}
                className="space-y-3 p-4"
              >
                <h2 className="text-lg font-semibold">Add Subcategories</h2>

                <input
                  name="subCategory"
                  type="text"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  placeholder="Enter Sub Category"
                  className="w-full border border-black/30 px-2 rounded flex-1 py-2 placeholder-gray-300 outline-none "
                />

                <button
                  type="submit"
                  className="bg-c1 text-white w-full px-4 py-2 rounded "
                >
                  {loader ? (
                    <div
                      role="status"
                      className="flex items-center justify-center"
                    >
                      <svg
                        aria-hidden="true"
                        className="inline w-6 h-6 text-gray-200 animate-spin  fill-gray-600 "
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
                    "Add Sub Category"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {editSubCategoryPopUp && (
        <div className="fixed inset-0 z-40 min-h-full    transition flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setEditSubCategoyPopUp(false)}
          ></div>

          <div className="relative w-full max-w-4xl p-4 mx-auto bg-white rounded-xl z-50">
            <button
              type="button"
              onClick={() => setEditSubCategoyPopUp(false)}
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
            <div>
              <div className="flex flex-col items-center text-xl">
                <div className="flex items-center">
                  <IoAdd /> Edit Sub Category
                </div>
                <div className="h-[1px] w-full bg-black/20 my-3"></div>
              </div>

              <form onSubmit={handleEditSubCategory} className="space-y-3 p-4">
                <h2 className="text-lg font-semibold">Add Subcategories</h2>

                <input
                  name="subCategory"
                  type="text"
                  value={newSubCategoryName}
                  onChange={(e) => setNewSubCategoryName(e.target.value)}
                  placeholder="Enter Sub Category"
                  className="w-full border border-black/30 px-2 rounded flex-1 py-2 placeholder-gray-300 outline-none "
                />

                <button
                  type="submit"
                  className="bg-c1 text-white w-full px-4 py-2 rounded "
                >
                  {loader ? (
                    <div
                      role="status"
                      className="flex items-center justify-center"
                    >
                      <svg
                        aria-hidden="true"
                        className="inline w-6 h-6 text-gray-200 animate-spin  fill-gray-600 "
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
                    "Add Sub Category"
                  )}
                </button>
              </form>
            </div>
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
                onClick={handleDeleteCategory}
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
  );
};

export default Category;
