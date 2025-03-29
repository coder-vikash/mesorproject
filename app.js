const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Expresserror = require("./utill/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const listing = require("./route/listing.js");
const review = require("./route/review.js");
const { date } = require("joi");

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

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  },
};

//Post Review route
app.get("/", (req, res) => {
  res.send("Hi I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
