const mongoose = require("mongoose");

let mainConnection;
let staffConnection;

const connectDB = async () => {
  try {
    mainConnection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    staffConnection = await mongoose.createConnection(process.env.MONGO_URI_STAFF, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Reservation DB Connected: ${mainConnection.connection.host}`);
    console.log(`✅ Staff DB Connected to: ${process.env.MONGO_URI_STAFF}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed", error);
    process.exit(1);
  }
};

const getStaffConnection = () => {
  return mongoose.connections.find(conn => conn.name === "staff") || mongoose.createConnection(process.env.MONGO_URI_STAFF);
};

module.exports = {
  connectDB,
  getStaffConnection
};
