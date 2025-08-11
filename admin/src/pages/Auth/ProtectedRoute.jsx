import { adminData } from '@/Redux/Slices/authSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom';


const ProtectedRoute = () => {
    const dispatch = useDispatch();
    const [isLoggedIn, setIsLoggedIn] = useState();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await dispatch(adminData());
                if (res?.payload?.success) {
                    setIsLoggedIn(true);
                }
                else {
                    setIsLoggedIn(false)
                }
            } catch (error) {
                return
            }
        }
        fetchData()
    }, [dispatch, isLoggedIn, location?.pathname]);

    if (isLoggedIn == null) {
        return <div>Loading....</div>
    }


    if (!isLoggedIn) {
        return <Navigate to={'/'} />
    }

    return (
        <Outlet />
    )
}

export default ProtectedRoute