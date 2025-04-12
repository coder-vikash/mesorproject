const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utill/wrapAsync");
const { route } = require("./listing");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        console.log(err);
        req.flash("success", "Welcome to wanderlust!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome to wanderlust ! You are logged In !");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
    req.flash("success", "Logged Out Successfully!");
    res.redirect("/listings");
  });
});

module.exports = router;
