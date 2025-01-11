// import React, { useState } from "react";
// import axios from "axios";
// import "../style.css";

// const Signup = () => {
//     const [formData, setFormData] = useState({
//         firstname: "",
//         lastname: "",
//         phone: "",
//         email: "",
//         username: "",
//         password: "",
//         confirmPassword: "",
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Trim passwords before comparison
//         const trimmedPassword = formData.password.trim();
//         const trimmedConfirmPassword = formData.confirmPassword.trim();

//         if (trimmedPassword !== trimmedConfirmPassword) {
//             alert("Passwords do not match!");
//             return;
//         }

//         try {
//             // Use Axios to send the request
//             const response = await axios.post("http://localhost:5000/signup", formData);

//             console.log(response.data);
//             alert("Signup Successful!");
//         } catch (error) {
//             if (error.response) {
//                 // Server responded with a status other than 2xx
//                 console.error("Error Response:", error.response.data);
//                 alert(`Signup failed: ${error.response.data.message || "An error occurred"}`);
//             } else if (error.request) {
//                 // Request was made but no response was received
//                 console.error("No Response:", error.request);
//                 alert("Signup failed: No response from the server");
//             } else {
//                 // Something else went wrong
//                 console.error("Error:", error.message);
//                 alert(`Signup failed: ${error.message}`);
//             }
//         }
//     };

//     return (
//         <form className="form-container" onSubmit={handleSubmit}>
//             <h2>Signup</h2>
//             <input type="text" name="firstname" placeholder="First Name" onChange={handleChange} required />
//             <input type="text" name="lastname" placeholder="Last Name" onChange={handleChange} required />
//             <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required />
//             <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//             <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
//             <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//             <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
//             <button type="submit">Signup</button>
//         </form>
//     );
// };

// export default Signup;
