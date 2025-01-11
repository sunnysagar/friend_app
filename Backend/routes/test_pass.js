const argon2 = require("argon2");

const storedHash = "$argon2id$v=19$m=65536,t=3,p=4$Fq6BT/28sNsrdsvZkxorVw$JnlyWakbTbcQAbL0caiTfQCOwPELdQCjnD4KgxYe0eE"; // Hash from DB
const enteredPassword = "sunny02"; // Password entered by user

async function verifyPassword() {
  try {
    // Verify the entered password against the stored hash
    const isPasswordValid = await argon2.verify(storedHash, enteredPassword);

    if (isPasswordValid) {
      console.log("Password is valid");
    } else {
      console.log("Invalid password");
    }
  } catch (error) {
    console.error("Error verifying password:", error);
  }
}

// Call the async function
verifyPassword();



// const argon2 = require("argon2");

// const enteredPassword = "sunny02"; // Password entered by the user

// async function hashPassword() {
//   try {
//     // Hash the entered password manually using argon2
//     const hashedPassword = await argon2.hash(enteredPassword);
//     console.log("Hashed Password:", hashedPassword); // Log the new hash
//   } catch (error) {
//     console.error("Error hashing password:", error);
//   }
// }

// // Call the async function
// hashPassword();
