const mongoose = require("mongoose");

const friendRequestSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who sent the request
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who received the request
    status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" }, // Status of the request
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
