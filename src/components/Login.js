// import React, { useState } from "react";
// import axios from "axios";
// import "../style.css";

// const Login = () => {
//     const [loginData, setLoginData] = useState({
//         identifier: "",
//         password: "",
//     });

//     const handleChange = (e) => {
//         setLoginData({
//             ...loginData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         // Log the login data to check before sending it
//         console.log("Sending login data:", loginData);

//         axios
//             .post("http://localhost:5000/api/login", loginData)  // Use axios for POST request
//             .then((response) => {
//                 console.log(response.data);
//                 alert("Login Successful!");
//                 // Optionally, store a token or navigate to another page
//             })
//             .catch((error) => {
//                 console.error("Error:", error.response?.data?.message || error.message);
//                 alert(error.response?.data?.message || error.message); // Display error message from backend
//             });
//     };

//     return (
//         <form className="form-container" onSubmit={handleSubmit}>
//             <h2>Login</h2>
//             <input
//                 type="text"
//                 name="identifier"
//                 placeholder="Username or Phone"
//                 onChange={handleChange}
//                 required
//             />
//             <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 onChange={handleChange}
//                 required
//             />
//             <button type="submit">Login</button>
//         </form>
//     );
// };

// export default Login;
