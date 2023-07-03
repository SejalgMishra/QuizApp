import React, { useContext } from "react";
import { Form, Formik } from "formik";
import { useNavigate, useNavigation } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="text-start">
      <Formik
        initialValues={{
          email: "",
          username: "",
          password: "",
          confirmpassword: "",
        }}
        onSubmit={async (values , actions) => {
          try {
            const res = await fetch("http://localhost:3000/users", {
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
            window.localStorage.setItem("token", JSON.stringify(json));
            actions.resetForm();
            navigate("/auth");
          } catch (error) {
            actions.setErrors({
              serverError: error.message,
            });
          }
        }}
      >
        {({ values, handleChange }) => (
          <Form className="mt-4">
            <div>
              <div className="flex flex-col">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="pl-2 font-semibold block w-full rounded-t-md border-0 py-1.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 "
                />
              </div>

              <div>
                <input
                  placeholder="Username"
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={values.username}
                  onChange={handleChange}
                  required
                  className="pl-2 font-semibold block w-full  border-0 py-1.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 "
                />
              </div>

              
              <div>
                <input
                placeholder="Password"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={values.password}
                  onChange={handleChange}
                  required
                  className="pl-2 font-semibold block w-full  border-0 py-1.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 "
                />
              </div>
              
              <div>
                <input
                placeholder="Confirm Password"
                  id="confirmpassword"
                  name="confirmpassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={values.confirmpassword}
                  onChange={handleChange}
                  className="pl-2 font-semibold block w-full rounded-b-md border-0 py-1.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 "
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center mt-7 rounded-md bg-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800 duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
