import React from "react";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {

  const navigate = useNavigate()

  return (
    <div className="py-10">
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={async (values, actions) => {
          console.log(values);
          try {
            const res = await fetch("http://localhost:3000/login", {
              method: "POST",
              body: JSON.stringify(values),
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            });
            const json = await res.json();
            if (!res.ok) {
              throw new Error(json);
            }
            console.log(json.user,"check this");
            
          
      
            window.localStorage.setItem("token", JSON.stringify(json));
            alert("Login Successfull");
            actions.resetForm();
             const user = JSON.parse(localStorage.getItem('token'));
            const userName = user.user.id;
      
            const response1 = await axios.get('http://localhost:3000/result');
            const results = response1.data;
            console.log(results[0].userId,"idd");
            const getId = results.find((result) => result.userId === userName);
            if (getId) {
              navigate('/questions')
            }else{
              navigate("/")
            }
            console.log(userName,"checkname");
            
         
          } catch (error) {
            actions.setErrors({
              serverError: error.message,
            });
          }
        }}
      >
        {({ values, errors, handleChange, handleSubmit }) => (
          <Form
            className="space-y-6 text-start"
            onChange={handleChange}
            onSubmit={handleSubmit}
          >
            {errors.serverError && (
              <p className="text-center pb-4 text-2xl text-red-600 font-semibold">
                {errors.serverError}
              </p>
            )}
            <div>
              
              <div >
                <input
                placeholder="E-mail"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  required
                  className="pl-2 font-semibold block w-full rounded-t-md border-0 py-1.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 "
                />
              </div>
         

              
              <div>
                <input
                placeholder="Password"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="Password"
                  value={values.password}
                  onChange={handleChange}
                  required
                  className="pl-2 font-semibold block w-full rounded-b-md border-0 py-1.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 "
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center mt-7 rounded-md bg-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800 duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <Link
        className="text-gray-700 flex justify-center pt-5"
        to="/auth/register"
      >
        Don't have account? Register here
      </Link>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Login;
