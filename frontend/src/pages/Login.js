import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("https://medicine-reminder-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Welcome, ${data.user?.name}! Login successful.`);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
       
        setAuth(true);
         navigate("/");
      } else {
        toast.error(data.message || "Please check your email and password.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDF2F7] to-white dark:from-[#1A365D] dark:to-gray-900 flex items-center justify-center p-4">
      <Toaster/>
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 transform transition-all duration-300 hover:shadow-2xl"
    >
      <div className="text-center mb-6">
        <div className="inline-block p-4 rounded-full bg-[#F7FAFC] dark:bg-gray-700 mb-4">
          <i className="fas fa-user-tie text-4xl text-[#4299E1]"></i>
        </div>
        <h2 className="text-2xl font-bold text-[#1A365D] dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
        Login now and never miss a dose!
        </p>
      </div>

      <div className="space-y-4">
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <label className="flex items-center text-sm font-medium text-[#1A365D] dark:text-white mb-2">
            <i className="fas fa-envelope mr-2 text-[#4299E1]"></i>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-[#F7FAFC] dark:bg-gray-700 text-[#1A365D] dark:text-white focus:border-[#4299E1] dark:focus:border-[#4299E1] outline-none transition-all duration-300 focus:ring-2 focus:ring-[#4299E1]"
            required
            disabled={loading}
          />
        </div>

        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <label className="flex items-center text-sm font-medium text-[#1A365D] dark:text-white mb-2">
            <i className="fas fa-lock mr-2 text-[#4299E1]"></i>
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-[#F7FAFC] dark:bg-gray-700 text-[#1A365D] dark:text-white focus:border-[#4299E1] dark:focus:border-[#4299E1] outline-none transition-all duration-300 focus:ring-2 focus:ring-[#4299E1]"
            required
            disabled={loading}
          />
        </div>

        

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4299E1] text-white py-2 px-4 rounded-lg hover:bg-[#2B6CB0] focus:outline-none focus:ring-2 focus:ring-[#4299E1] transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <i className="fas fa-sign-in-alt"></i>
              <span>Login</span>
            </>
          )}
        </button>

        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link
  to="/signup"
  className="text-[#4299E1] hover:text-[#2B6CB0] ml-1 transition-colors duration-300"
>
  Sign Up
</Link>
        </p>
      </div>
    </form>

   
  </div>
  );
};

export default Login;
