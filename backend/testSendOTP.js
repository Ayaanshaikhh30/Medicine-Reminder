const axios = require("axios");

const testSendOTP = async () => {
 const apiUrl = "http://localhost:5000/api/auth/send-otp";
 const emailToTest = "ayaanshaikhh30@gmail.com"; 

  try {
    const response = await axios.post(apiUrl, { email: emailToTest });
    console.log("API Response:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
    } else {
      console.error("Error sending request:", error.message);
    }
  }
};

testSendOTP();
