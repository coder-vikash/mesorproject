const express = require("express");
const router = express.Router();

// Init router
router.get("/users", (req, res) => {
  res.send("Get for Users");
});
//Show users
router.get("/users/:id", (req, res) => {
  res.send("Get for Users with ID");
});
//Create users
router.post("/users", (req, res) => {
  res.send("Post for Users");
});
//Update users
router.put("/users/:id", (req, res) => {
  res.send("Put for Users with ID");
});
//Delete users
router.delete("/users/:id", (req, res) => {
  res.send("Delete for Users with ID");
});

module.exports = router;
