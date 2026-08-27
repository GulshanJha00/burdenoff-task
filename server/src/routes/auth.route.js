const express = require("express")
const AuthRoute = express.Router()
const { registerUser, checkUser, loginUser } = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")



AuthRoute.post("/register",registerUser)
AuthRoute.get("/me",authMiddleware,checkUser)
AuthRoute.post("/login",loginUser)


module.exports = AuthRoute