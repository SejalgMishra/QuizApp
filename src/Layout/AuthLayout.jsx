import React, { useEffect } from 'react'
import Logo from '/download.jpg';

import { Outlet, useNavigate } from 'react-router-dom';

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  return (
   
    <div className=" sm:mx-auto sm:w-full sm:max-w-lg ">
      <div className="flex min-h-full flex-1 flex-col justify-center  py-8 lg:px-8 m-5 ">
        <div className="sm:mx-auto sm:w-full pb-5 sm:max-w-lg">
          <img className="mx-auto h-28  w-auto" src={Logo} alt="Your Company" />
          
        </div>
     <Outlet/>
            </div>
            </div>
  )
}

export default AuthLayout