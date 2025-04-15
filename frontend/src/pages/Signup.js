import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, {Toaster} from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!formData.email) {
      toast.error(" Please enter an email first.");
      return;
    }
  
    console.log("Sending OTP to:", formData.otp); // <-- Debug
  
    setLoading(true);
    try {
      const response = await fetch("https://medicine-reminder-backend.onrender.com/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
  
      const data = await response.json();
      console.log("Send OTP response:", data); // <-- Debug
  
      setLoading(false);
      if (response.ok) {
        setOtpSent(true);
        toast.success(" OTP sent to your email!");
      } else {
        toast.error(` ${data.message || "Failed to send OTP."}`);
      }
    } catch (error) {
      setLoading(false);
      console.error("Send OTP Error:", error); // <-- Debug
      toast.error(" Server error. Please try again.");
      console.log("OTP is:", formData.otp); 

    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.otp) {
      toast.error(" Please enter the OTP.");
      return;
    }
 
    
    setLoading(true);
    try {
      const response = await fetch("https://medicine-reminder-backend.onrender.com/api/auth/verify-otp", {  // Correct API for OTP verification
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          otp: formData.otp,
          password: formData.password, 
        }),
      });
  
      const data = await response.json();
      setLoading(false);
  
      if (response.ok) {
        toast.success(` Congratulations, Your account created successfully.`);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(` ${data.message || "Incorrect OTP or Signup failed."}`);
      }
    } catch (error) {
      setLoading(false);
      toast.error(" Server error. Please try again.");
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
          Create Account
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
        Sign up today for smart medicine reminders!
        </p>
      </div>

      <div className="space-y-4">
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <label className="flex items-center text-sm font-medium text-[#1A365D] dark:text-white mb-2">
            <i className="fas fa-user mr-2 text-[#4299E1]"></i>
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your Name"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-[#F7FAFC] dark:bg-gray-700 text-[#1A365D] dark:text-white focus:border-[#4299E1] dark:focus:border-[#4299E1] outline-none transition-all duration-300 focus:ring-2 focus:ring-[#4299E1]"
            required
          />
        </div>
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <label className="flex items-center text-sm font-medium text-[#1A365D] dark:text-white mb-2">
            <i className="fas fa-envelope mr-2 text-[#4299E1]"></i>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-[#F7FAFC] dark:bg-gray-700 text-[#1A365D] dark:text-white focus:border-[#4299E1] dark:focus:border-[#4299E1] outline-none transition-all duration-300 focus:ring-2 focus:ring-[#4299E1]"
            required
          />
        </div>

        <button
          type="button"
          onClick={sendOtp}
          disabled={loading}
          className="w-full bg-[#48BB78] dark:bg-[#38A169] text-white py-2 px-4 rounded-lg hover:bg-[#38A169] dark:hover:bg-[#2F855A] focus:outline-none focus:ring-2 focus:ring-[#48BB78] transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <i className="fas fa-key mr-2"></i>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {otpSent && (
          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <label className="flex items-center text-sm font-medium text-[#1A365D] dark:text-white mb-2">
              <i className="fas fa-shield-alt mr-2 text-[#4299E1]"></i>
              Enter OTP
            </label>
            <input
              type="text"
              name="otp"
              placeholder="Enter the OTP sent to your email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-[#F7FAFC] dark:bg-gray-700 text-[#1A365D] dark:text-white focus:border-[#4299E1] dark:focus:border-[#4299E1] outline-none transition-all duration-300 focus:ring-2 focus:ring-[#4299E1]"
              required
            />
          </div>
        )}

        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <label className="flex items-center text-sm font-medium text-[#1A365D] dark:text-white mb-2">
            <i className="fas fa-lock mr-2 text-[#4299E1]"></i>
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-[#F7FAFC] dark:bg-gray-700 text-[#1A365D] dark:text-white focus:border-[#4299E1] dark:focus:border-[#4299E1] outline-none transition-all duration-300 focus:ring-2 focus:ring-[#4299E1]"
            required
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
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <i className="fas fa-user-plus"></i>
              <span>Create Account</span>
            </>
          )}
        </button>
        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#4299E1] hover:text-[#2B6CB0] ml-1 transition-colors duration-300"
            >
              Sign In
            </Link>
          </p>
      </div>
    </form>

  </div>
  );
};

export default Signup;