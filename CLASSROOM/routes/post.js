const express = require("express");
const router = express.Router();

// app post users
router.get("/", (req, res) => {
  res.send("get for post");
});
// app put users with id
router.get("/:id", (req, res) => {
  res.send("get for post ID");
});

// Init router
router.post("/posts ", (req, res) => {
  res.send("post for posts");
});
//Show users
router.delete("/posts/:id", (req, res) => {
  res.send("Delet for post ID");
});

module.exports = router;
