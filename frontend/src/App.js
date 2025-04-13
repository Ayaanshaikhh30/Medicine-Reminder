import React from "react";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {

  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true);
    }
  }, []);


  return (
    <Routes>
      <Route path="/login" element={<Login setAuth={setIsAuth} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={isAuth ? <HomePage /> : <Login setAuth={setIsAuth} />} />
    </Routes>
  );
}

export default App;
