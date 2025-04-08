const mongoose = require("mongoose");

const staffUserSchema = new mongoose.Schema({
  username: String,
  barangay: String,
  password: String,
});

module.exports = mongoose.model("StaffUser", staffUserSchema);

