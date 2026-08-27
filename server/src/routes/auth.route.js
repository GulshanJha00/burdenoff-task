const express = require("express")
const AuthRoute = express.Router()
const { registerUser, checkUser, loginUser,logoutUser } = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")



AuthRoute.post("/register",registerUser)
AuthRoute.get("/me",authMiddleware,checkUser)
AuthRoute.post("/login",loginUser)
AuthRoute.post(
  "/logout",
  authMiddleware,
  logoutUser
);

module.exports = AuthRoute