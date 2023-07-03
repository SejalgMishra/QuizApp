import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout.jsx";
import Register from "./component/Register";
import Main from "./component/Main";
import MainLayout from "./Layout/MainLayout";
import Login from "./component/Login";
import Questions from "./component/questions";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/auth"
        element={
            <AuthLayout />
        }
      >
        <Route index element={<Login />} />
        <Route path="Register" element={<Register />} />
      </Route>

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Main />} />
        <Route path="/questions" element={<Questions />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
