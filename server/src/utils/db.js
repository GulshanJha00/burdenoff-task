const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connection