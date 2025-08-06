import VariationsForm from "@/components/Forms/VariationsForm";
import {
  deleteAttribute,
  getAllAttributes,
} from "@/Redux/Slices/attributesSlice";
import { getAllCategories } from "@/Redux/Slices/categorySlice";
import React, { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdOutlineModeEdit } from "react-icons/md";
import { SquarePen } from "lucide-react";
import { motion } from "framer-motion";
import HomeLayout from '../Layout/HomeLayout'

const Variations = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [variationsPopUp, setVariationsPopUp] = useState(false);
  const [allAttributes, setAllAttributes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [loader, setLoader] = useState(false);
  const [editAttributeData, setEditAttributeData] = useState(null);

  const dispatch = useDispatch();
  console.log("allatributes", allAttributes);
  const handleGetAllCategories = async () => {
    try {
      const response = await dispatch(getAllCategories());
      console.log(response);
      setAllCategories(response?.payload?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllAttributes = async () => {
    try {
      const response = await dispatch(getAllAttributes());
      console.log("allattributs", response);
      setAllAttributes(response?.payload?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAttribute = async () => {
    setLoader(true);
    try {
      const res = await dispatch(deleteAttribute(selectedCategory));
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
      setDeletePopUp(false);
      await handleGetAllAttributes();
    }
  };

  useEffect(() => {
    handleGetAllCategories();
    handleGetAllAttributes();
  }, []);

  useEffect(() => {
  if (!variationsPopUp) {
    setEditAttributeData(null);
  }
}, [variationsPopUp]);

  return (
    <HomeLayout>
    <div>
      <div className="flex  w-full justify-between">
        <div className="flex justify-between ">
          <div>
            <h1 className="text-md md:text-2xl">Manage Attribute Definations</h1>
            <div className="w-40 h-[2px] bg-c1"></div>
          </div>
        </div>

        <button
          onClick={() => setVariationsPopUp(true)}
          className="bg-c1 text-white px-6 py-2 flex items-center gap-x-2"
        >
          {" "}
          <IoAdd /> Add Attribute
        </button>
      </div>

      <div className="relative mt-10 overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs border text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Category Name</th>
              <th className="px-6 py-3">Label</th>
              <th className="px-6 py-3">Options</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {allAttributes.map((att, index) =>
              att?.attributes?.map((lab, i) => (
                <tr
                  key={`${index}-${i}`}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 "
                >
                  {i === 0 ? (
                    <>
                      <td
                        rowSpan={att.attributes.length}
                        className="px-6 py-4 font-medium border text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {att?.category?.categoryName}
                      </td>
                    </>
                  ) : null}
                  <td className="px-6 py-4 border">{lab.name}</td>
                  <td className="px-6 py-4  border">
                    {lab.options?.join(", ")}
                  </td>

                  {i === 0 ? (
                    <td
                      rowSpan={att.attributes.length}
                      className="px-6 py-4  border text-center align-center"
                    >
                      <div className="flex  space-x-4">
                        <SquarePen
                          onClick={() => {
                            setEditAttributeData(att);
                            setVariationsPopUp(true);
                          }}
                          className="text-[20px] hover:text-red cursor-pointer"
                        />
                        <MdOutlineDeleteOutline
                          onClick={() => {
                            setSelectedCategory(att?.category?._id);
                            setDeletePopUp(true);
                          }}
                          className="text-[28px] hover:text-red-500 cursor-pointer"
                        />
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {variationsPopUp && (
        <div className="fixed inset-0 z-40 min-h-full    transition flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setVariationsPopUp(false)}
          ></div>

          <div className="relative w-full max-w-4xl p-4 mx-auto bg-white rounded-xl z-50">
            <button
              type="button"
              onClick={() => setVariationsPopUp(false)}
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
            <VariationsForm
              allCategories={allCategories}
              setVariationsPopUp={setVariationsPopUp}
              handleGetAllAttributes={handleGetAllAttributes}
               editAttributeData={editAttributeData}
            />
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
              Are you absolutely sure you want to delete this Variation?
            </p>

            <div className="flex justify-center gap-x-6 p-2">
              <button
                className="px-5 py-2 bg-c1 cursor-pointer text-white font-semibold rounded shadow transition duration-300 hover:shadow-red-500/50"
                onClick={handleDeleteAttribute}
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

export default Variations;
