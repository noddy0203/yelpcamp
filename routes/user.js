const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const catchAsync = require("../utilities/asyncError");
const user = require("../controller/user")

router.route("/register")
   .get( user.getRegister)
   .post( catchAsync(user.registerNewUser));

router.route("/login")
  .get( user.getLogin)
  .post( passport.authenticate("local", {failureFlash: true, failureRedirect: "/login",}),user.loginUser)

router.get("/logout", user.userLogout);

module.exports = router;
