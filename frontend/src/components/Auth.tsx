import { SigninInput, SignupInput } from "@mrunal121/codelogs-blog-common";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { backendUrl } from "../config";
import { useAuth } from "../hooks/useAuth";

export const Auth = ({ type }: { type: "signin" | "signup" }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [signupInputs, setSignupInputs] = useState<SignupInput>({
    username: "",
    email: "",
    password: "",
  });

  const [signinInput, setsigninInput] = useState<SigninInput>({
    emailusername: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const endpoint = type === "signup" ? "/user/signup" : "/user/signin";
      const data = type === "signup" ? signupInputs : signinInput;

      const response = await axios.post(`${backendUrl}${endpoint}`, data);

      if (response.data.token) {
        login(response.data.token);
        console.log("Authentication successful:", response.data);
        navigate("/blogs");
      }
    } catch (error) {
      alert("Error while signing up");
      console.error("Authentication failed:", error);
    }
  }

  return (
    <div className="h-full flex justify-center items-center bg-white dark:bg-gray-900">
      <div className="">
        <div className="mb-6 text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            {type === "signup" ? "Create an account" : "Welcome back"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
            {type === "signup"
              ? "Already have an account? "
              : "Don't have an account? "}
            <Link
              to={type === "signup" ? "/signin" : "/signup"}
              className="text-blue-600 dark:text-blue-400 underline"
            >
              {type === "signup" ? "Login" : "Sign Up"}
            </Link>
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {type === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) =>
                  setSignupInputs({ ...signupInputs, username: e.target.value })
                }
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="m@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) =>
                type === "signup"
                  ? setSignupInputs({ ...signupInputs, email: e.target.value })
                  : setsigninInput({ ...signinInput, emailusername: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) =>
                type === "signup"
                  ? setSignupInputs({
                      ...signupInputs,
                      password: e.target.value,
                    })
                  : setsigninInput({ ...signinInput, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-200 mt-3"
          >
            {type == "signup" ? "Sign Up" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};
