import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import "@fortawesome/fontawesome-free/css/all.min.css";

function MedicationList({ addMedication }) {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);

  



  
 
  const fetchMedications = useCallback(async () => {
    setLoading(true);
   
  
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
  
      
      if (!storedUser || !token) {
        setLoading(false);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return;
      }
  
     
      let user;
      try {
        user = JSON.parse(storedUser);
      } catch (error) {
        toast.error("Invalid user data.");
        setLoading(false);
        return;
      }
  
     
      if (!user) {
        toast.error("Invalid user session.");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/medications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        setMedications(response.data);
      } else {
        toast.error("Failed to load medications.");
      }
    } catch (err) {
      
      toast.error("Pleas Login again.");
    } finally {
      setLoading(false);
    }
  }, []);
  
  
  
  
  


  useEffect(() => {
    fetchMedications();
  }, [fetchMedications, addMedication]);

  

  const handleDelete = async (id, userId) => {
    if (!userId) {
      console.error("User ID is missing.");
      return;
    }

    toast(
      (t) => (
        <div className="flex flex-col items-center">
          <p className="font-medium text-gray-900 dark:text-white">
            Are you sure you want to delete this medication?
          </p>
          <div className="flex space-x-3 mt-3">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete(id, userId);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
      }
    );
  };

  const confirmDelete = async (id) => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      toast.error("Authentication failed. Please log in again.");
      return;
    }
  
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/medications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
  
      if (response.status === 200) {
        setMedications((prevMedications) => prevMedications.filter((med) => med._id !== id));
        toast.success("Medication deleted successfully.");
      } else {
        toast.error("Failed to delete medication.");
      }
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast.error("Failed to delete medication.");
    }
  };
  
  

  return (
    
      
      
    <div className="bg-gradient-to-b from-[#EDF2F7] to-white dark:from-[#1A365D] dark:to-gray-900 
    py-6 px-4 sm:px-2 lg:px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md h-screen" >
      

          <div className="max-w-5xl mx-auto transform transition-all duration-500 ease-in-out">
          <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-block p-4 rounded-full bg-[#F7FAFC] dark:bg-gray-700 mb-4 text-ce">
          <i className="fas fa-capsules text-4xl text-[#4299E1]"></i>
          </div>
        <h1 className="text-3xl font-bold text-[#1A365D] dark:text-white font-inter">
                  Medicine Dashboard
                </h1>
                <p className="mt-2 text-[#1A365D] dark:text-gray-300 font-inter">
          List of your Medicine details below
        </p>
                </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl h-max-[200px]">
              <div className="p-8 ">
               

                
                  <div className="flex items-center mb-6 text-center justify-center">
                    <h2 className="text-2xl font-semibold text-[#1A365D] dark:text-white">
                      Active Medicine
                    </h2>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4299E1] border-t-transparent"></div>
                    </div>
                  ) :  medications.length === 0 ? (
                    <div className="text-center py-12">
                      <i className="fas fa-prescription-bottle text-[#4299E1] text-5xl mb-4"></i>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        No medicine added yet
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto scrollbar-hide max-h-[400px] overflow-y-auto">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-white shadow-md z-10">
                        <tr className="bg-[#EDF2F7] dark:bg-gray-600 ">
  <th className="px-6 py-4 text-center">
    <label className="flex items-center text-lg font-medium text-[#1A365D] dark:text-white font-inter">
      <i className="fas fa-pills mr-2 text-[#4299E1]"></i>
      Medicine
    </label>
  </th>
  <th className="px-6 py-4 text-center">
    <label className="flex items-center text-lg font-medium text-[#1A365D] dark:text-white font-inter">
      <i className="fas fa-prescription-bottle-medical mr-2 text-[#4299E1]"></i>
      Dosage
    </label>
  </th>
  <th className="px-6 py-4 text-center">
    <label className="flex items-center text-lg font-medium text-[#1A365D] dark:text-white font-inter">
      <i className="fas fa-clock mr-2 text-[#4299E1]"></i>
      Times
    </label>
  </th>
  <th className="px-6 py-4 text-center">
    <label className="flex items-center text-lg font-medium text-[#1A365D] dark:text-white font-inter">
      <i className="fas fa-eraser mr-2 text-[#4299E1]"></i>
      Actions
    </label>
  </th>
</tr>

                        </thead>
                        
                        <tbody>
                          {medications.map((med) => (
                           <motion.tr
                           key={med._id}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, x: -10 }}
                           transition={{ duration: 0.3 }}
                           whileHover={{ scale: 1.05 }} 
                           className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                         >
                           <td className="px-6 py-4">
                             <div className="flex items-center space-x-3">
                               <span className="font-medium text-[#1A365D] dark:text-white">
                                 {med.medication_name}
                               </span>
                             </div>
                           </td>
                           <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                             {med.dosage}
                           </td>
                           <td className="px-6 py-4">
                             <div className="flex flex-wrap gap-2">
                               {med.reminder_times.map((time, index) => (
                                 <span
                                   key={index}
                                   className="px-2 py-1 bg-[#EDF2F7] dark:bg-gray-600 rounded text-sm text-[#1A365D] dark:text-white"
                                 >
                                   {time}
                                 </span>
                               ))}
                             </div>
                           </td>
                           <td className="px-6 py-4 flex justify-center">
                           <button 
  onClick={() => handleDelete(med._id, med.user_id)} 
  className="p-2 flex items-center justify-center"
>
  <motion.i
    className="fa-solid fa-trash-can text-red-500 text-xl"
    initial={{ opacity: 0.8 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.2 }}
    onMouseEnter={(e) => e.currentTarget.classList.replace("fa-trash-can", "fa-circle-xmark")}
    onMouseLeave={(e) => e.currentTarget.classList.replace("fa-circle-xmark", "fa-trash-can")}
  ></motion.i>
</button>

</td>

                         </motion.tr>
                         
                          ))}
                        </tbody>
                        
                      </table>
                    </div>
                  )}
                
              </div>
            </div>
          </div>
        </div>
  
    
  );
}

export default MedicationList;
