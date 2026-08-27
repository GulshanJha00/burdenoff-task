const express = require("express")

const app = express();
app.use(express.json());
require('dotenv').config()
var cors = require('cors')
const PORT = process.env.PORT || 4000
const connection = require("./src/utils/db")
const cookieParser = require("cookie-parser");

const HabitRoute = require("./src/routes/habits.route");
const AuthRoute = require("./src/routes/auth.route")

app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URI,
  optionsSuccessStatus: 200,
  credentials: true,
}))

app.use("/api/auth",AuthRoute)
app.use("/api/habits",HabitRoute)


const startServer = async () => {
  try {
    await connection();

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

startServer()