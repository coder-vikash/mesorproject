const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Expresserror = require("./utill/expressError.js");

const listing = require("./route/listing.js");
const review = require("./route/review.js");

const mongoose_url = "mongodb://localhost:27017/wanderlust";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });
async function main() {
  await mongoose.connect(mongoose_url);
}
//Post Review route
app.get("/", (req, res) => {
  res.send("Hi I am root");
});

app.use("/listings", listing);
app.use("/listings/:id/reviews", review);

app.all("*", (req, res, next) => {
  next(new Expresserror("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  console.log(err);
  res.status(status).send(message);
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
