import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const MainLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
  }, []);
  return (
    <>
  
      <Outlet />
     
    </>
  );
};

export default MainLayout;
