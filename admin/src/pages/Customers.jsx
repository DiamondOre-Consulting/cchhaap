import React, { useEffect, useState } from 'react'
import HomeLayout from '../Layout/HomeLayout'
import { useDispatch } from 'react-redux';
import { fetchAllUsers } from '@/Redux/Slices/authSlice';

const Customers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const handleGetAllUsers = async (page = 1, limit = itemsPerPage) => {
    try {
      const response = await dispatch(fetchAllUsers({ page, limit }));
      if (response.payload) {
        setAllUsers(response.payload.data.users);
        setTotalPages(response.payload.data.totalPages);
        setCurrentPage(parseInt(response.payload.data.activePage));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    handleGetAllUsers(1, newLimit); // Reset to first page with new limit
  };

  const filteredUsers = allUsers.filter(user => 
    user.email.toLowerCase().includes(searchQuery)
  );

  useEffect(() => {
    handleGetAllUsers();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    handleGetAllUsers(page, itemsPerPage);
  };

  return (
    <HomeLayout>
      <div>
        <div>
          <div className="flex justify-between ">
            <div>
              <h1 className="text-2xl">Manage Users</h1>
              <div className="w-40 h-[2px] bg-c1"></div>
            </div>
          </div>
        </div>

        <div className="relative mt-10 overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex bg-white p-3 flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <label htmlFor="items-per-page" className="sr-only">Items per page</label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by email"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Registration Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Customer Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Orders
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Spent
                </th>
              
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {user.email}
                    </td>
                    <td className="px-6 text-center py-4">
                      {user.orderData.totalOrders}
                    </td>
                    <td className="px-6 py-4">
                         {user.orderData.totalAmount.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      })}
                      {/* ${user.orderData.totalAmount.toFixed(2)} */}
                    </td>
                  
                    <td className="px-6 py-4">
                      <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td colSpan="6" className="px-6 py-4 text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
              </div>
              
              <nav className="inline-flex rounded-md shadow">
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border-t border-b border-gray-300 ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    {page}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  )
}

export default Customers;