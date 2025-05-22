// import { useState, useCallback, useRef } from "react";
import { useState, useCallback, useRef, useMemo } from "react";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function AddMedicationPage({ addMedication }) {
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [times, setTimes] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeError, setTimeError] = useState("");

  const dosageRef = useRef(null);
  const timesRef = useRef(null);
  const phoneRef = useRef(null);
  const buttonRef = useRef(null);

  // Regex for 12-hour format (hh:mm AM/PM)
  const time12HourRegex = useMemo(
  () => /^(0[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i,
  []
);


  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);

    if (modifier.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
    return `${hoursStr}:${minutes}`;
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  // Improved handleTimesChange to allow partial typing for last time
  const handleTimesChange = (e) => {
    const input = e.target.value;
    const timesArray = input.split(",").map((t) => t.trim());

    const allButLastValid = timesArray.slice(0, -1).every((time) => time12HourRegex.test(time));
    const lastTime = timesArray[timesArray.length - 1];
    const lastTimeValidOrEmpty = lastTime === "" || time12HourRegex.test(lastTime);

    setTimes(input);

    if (!(allButLastValid && lastTimeValidOrEmpty) && input !== "") {
      setTimeError("Invalid time format. Please use hh:mm AM/PM");
    } else {
      setTimeError("");
    }
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      toast.error("Authorization failed. Please log in again.");
      return;
    }

    // Phone number validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Invalid phone number! Please enter a 10-digit number.");
      return;
    }

    // Validate 12-hour reminder times strictly on submit
    const reminderTimes12h = times.split(",").map((t) => t.trim());
    if (!reminderTimes12h.every((time) => time12HourRegex.test(time))) {
      toast.error("Invalid time format! Please enter times in hh:mm AM/PM format.");
      return;
    }

    // Convert to 24-hour times
    const reminderTimes24h = reminderTimes12h.map(convertTo24Hour);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/medications",
        {
          user_id: user._id,
          medication_name: medicationName,
          dosage,
          reminder_times: reminderTimes24h,
          user_phone: phoneNumber,
          start_date: new Date(),
          end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Medicine added successfully!");
      addMedication(response.data);

      setMedicationName("");
      setDosage("");
      setTimes("");
      setPhoneNumber("");
      setTimeError("");
    } catch (error) {
      toast.error("Failed to add medication. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [medicationName, dosage, times, phoneNumber, addMedication,time12HourRegex]);

  return (
    <div className="bg-gradient-to-b from-[#EDF2F7] to-white dark:from-[#1A365D] dark:to-gray-900 py-6 px-4 sm:px-2 lg:px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md h-full">
      <Toaster />
      <div className="max-w-md mx-auto transform transition-all duration-500 ease-in-out">
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-block p-4 rounded-full bg-[#F7FAFC] dark:bg-gray-700 mb-4">
            <i className="fas fa-capsules text-4xl text-[#4299E1]"></i>
          </div>
          <h1 className="text-3xl font-bold text-[#1A365D] dark:text-white font-inter">
            Add Medicine
          </h1>
          <p className="mt-2 text-[#1A365D] dark:text-gray-300 font-inter">
            Enter your Medicine details below
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
          <div className="space-y-6">
            {/* Medication Name */}
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <label className="flex items-center text-lg font-semibold text-[#1A365D] dark:text-white mb-2 font-inter">
                <i className="fas fa-pills mr-2 text-[#4299E1] text-xl"></i>
                Medicine Name
              </label>
              <input
                type="text"
                name="medication"
                placeholder="Enter Medicine name"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, dosageRef)}
                className="w-full px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#F7FAFC] dark:bg-gray-700 text-lg text-[#1A365D] dark:text-white focus:border-[#4299E1] dark:focus:border-[#4299E1] outline-none transition-all duration-300 focus:ring-2 focus:ring-[#4299E1] dark:focus:ring-[#4299E1]"
              />
            </div>

            {/* Dosage */}
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <label className="flex items-center text-lg font-semibold text-[#1A365D] dark:text-white mb-2 font-inter">
                <i className="fas fa-prescription-bottle-medical mr-2 text-[#4299E1] text-xl"></i>
                Dosage
              </label>
              <input
                type="text"
                name="dosage"
                ref={dosageRef}
                placeholder="Enter dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, timesRef)}
                className="w-full px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#F7FAFC] dark:bg-gray-700 text-lg text-[#1A365D] dark:text-white focus:border-[#4299E1] dark:focus:border-[#4299E1] outline-none transition-all duration-300 focus:ring-2 focus:ring-[#4299E1] dark:focus:ring-[#4299E1]"
              />
            </div>

            {/* Reminder Times */}
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <label className="flex items-center text-lg font-semibold text-[#1A365D] dark:text-white mb-2 font-inter">
                <i className="fas fa-clock mr-2 text-[#4299E1] text-xl"></i>
                Reminder Times
              </label>
              <input
                type="text"
                name="times"
                ref={timesRef}
                placeholder="hh:mm AM/PM, hh:mm AM/PM (e.g., 08:00 AM, 02:30 PM)"
                value={times}
                onChange={handleTimesChange}
                onKeyDown={(e) => handleKeyDown(e, phoneRef)}
                className={`w-full px-5 py-2 border rounded-lg bg-[#F7FAFC] dark:bg-gray-700 text-lg text-[#1A365D] dark:text-white focus:border-[#4299E1] dark:focus:border-[#4299E1] outline-none transition-all duration-300 focus:ring-2 focus:ring-[#4299E1] dark:focus:ring-[#4299E1]
                  ${timeError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"}`}
              />
              {timeError && (
                <p className="text-red-500 text-sm mt-1">{timeError}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <label className="flex items-center text-lg font-semibold text-[#1A365D] dark:text-white mb-2 font-inter">
                <i className="fas fa-phone mr-2 text-[#4299E1] text-xl"></i>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                ref={phoneRef}
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={handlePhoneChange}
                onKeyDown={(e) => handleKeyDown(e, buttonRef)}
                className="w-full px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#F7FAFC] dark:bg-gray-700 text-lg text-[#1A365D] dark:text-white focus:border-[#4299E1] dark:focus:border-[#4299E1] outline-none transition-all duration-300 focus:ring-2 focus:ring-[#4299E1] dark:focus:ring-[#4299E1]"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              ref={buttonRef}
              className="w-full bg-[#4299E1] text-white py-3 px-5 rounded-lg hover:bg-[#2B6CB0] focus:outline-none focus:ring-2 focus:ring-[#4299E1] transform transition-all duration-300 hover:scale-[1.02] font-inter disabled:opacity-50 flex items-center justify-center space-x-2 text-lg"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin text-xl"></i>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-plus-circle text-xl"></i>
                  <span>Save Medicine</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMedicationPage;