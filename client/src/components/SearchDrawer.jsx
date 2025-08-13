import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { userProductSearch } from "@/Redux/Slices/productsSlice";
import { FaSpinner } from "react-icons/fa";

const SearchDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [searchItem, setSearchItem] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loader, setLoader] = useState(false); // Initialize as false
  const navigate = useNavigate();

  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedInputValue = useDebounce(searchItem, 1000);

  const fetchSearchResults = async (query) => {
    try {
      setLoader(true);
      const res = await dispatch(userProductSearch(query));
      if(res?.payload?.success){
        setSearchResults(res?.payload?.data || []);    
      }
     
    } catch (error) {
      setSearchResults([]);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (debouncedInputValue) {
      fetchSearchResults(debouncedInputValue);
    } else {
      setSearchResults([]);
    }
  }, [debouncedInputValue]);

  return (
    <div>
      <>
        <div
          className={`fixed inset-0 bg-black bg-opacity-20 transition-opacity duration-300 ${
            isOpen ? "opacity-20 visible" : "opacity-0 invisible"
          }`}
          onClick={onClose}
        ></div>

        <div
          className={`fixed overflow-x-hidden top-0 right-0 h-screen w-full md:w-[30rem] z-40 overflow-y-auto bg-white shadow-lg transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex py-4 shadow-sm px-4 text-xl text-black w-full justify-between">
            <div className="flex items-center gap-x-2">
              <CiSearch />
              <input
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                type="text"
                placeholder="What are you looking for?"
                className="w-[20rem] focus:outline-none"
              />
            </div>
            <button onClick={onClose} className="cursor-pointer">
              ✕
            </button>
          </div>

          <div className="flex flex-col text-black gap-y-6 py-6">
            {loader ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl" />
              </div>
            ) : searchResults?.length > 0 ? (
              searchResults.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(`/each-product/${item._id}`);
                    onClose();
                  }}
                  className="flex border-black px-8 gap-x-4 items-center cursor-pointer hover:bg-gray-100"
                >
                  <div className="h-32 w-40 overflow-hidden">
                    <img
                      src={item?.thumbnailImage?.secureUrl}
                      className="h-full w-full object-cover"
                      alt={item?.productName || "Product image"}
                    />
                  </div>
                  <div>
                    <p className="text-md">{item.productName}</p>
                  </div>
                </div>
              ))
            ) : (
              !loader && (
                <div className="flex justify-center items-center h-64">
                  <p>No results found</p>
                </div>
              )
            )}
          </div>
        </div>
      </>
    </div>
  );
};

export default SearchDrawer;