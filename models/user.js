const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  profession:{type:String},
  password: { type: String, required: true },
  hobbies: [{ type: String }], // Changed to an array for better flexibility
  address: {type: String},
  city: {type: String},
  state: {type: String},
  country: {type: String},
  bio: {type: String},
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }], // Initialize as empty array
  
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash the password if it is modified or new
  const salt = await bcrypt.genSalt(10); // Generate salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});

// Compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare hash with entered password
};

const User = mongoose.model('User', userSchema);

module.exports = User;
