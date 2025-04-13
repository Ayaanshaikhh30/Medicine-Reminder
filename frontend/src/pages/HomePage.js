import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddMedicationPage from "./AddMedicationPage";
import MedicationList from "./MedicationList";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {
  const [medications, setMedications] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      console.log("Stored User Data:", JSON.parse(storedUser));

      if (token && storedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    toast.success(`Logout successfully.`);
    setUser(null);
    setDropdownOpen(false); 
    window.dispatchEvent(new Event("storage")); 

    navigate("/login"); 
  };



  const addMedication = (newMed) => {
    setMedications((prevMedications) => [...prevMedications, newMed]);
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 min-h-screen ">
  {/* User Dropdown */}
  <div className="absolute top-4 right-4 z-10">
    <button
      onClick={() => setDropdownOpen(!dropdownOpen)}
      className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
    >
      <i className="fas fa-user-tie text-[#4299E1]"></i>
      <span className="text-[#1A365D] dark:text-white">{user?.name || "User"}</span>
      <i className="fas fa-chevron-down text-[#4299E1] text-sm"></i>
    </button>

    {/* Dropdown Menu */}
    {dropdownOpen && (
      <div className="absolute right-0 mt-2 w-46 bg-white dark:bg-gray-800 rounded-lg shadow-xl  z-10 animate-fadeIn">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <i className="fas fa-sign-out-alt text-[#4299E1]"></i>
          <span>Logout</span>
        </button>
      </div>
    )}
  </div>

  {/* Main Content */}
  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
    <div className="w-full md:w-1/2">
      <AddMedicationPage addMedication={addMedication} />
    </div>
    <div className="w-full md:w-1/2">
      <MedicationList medications={medications} addMedication={addMedication} />
    </div>
  </div>
</div>

  );
}

export default HomePage;
