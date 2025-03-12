const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const path = require("path");
const { encode } = require("punycode");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utill/wrapAsync.js");
const Expresserror = require("./utill/expressError.js");
const { reviewSchema } = require("./schema.js");
const listingSchema = require("./schema.js");
const Joi = require("joi");
const review = require("./Models/review.js");

const mongoose_url = "mongodb://localhost:27017/wanderlust";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
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
//Review Post Route
//Post Review route

app.post("/listings/:id/reviews", async (req, res, next) => {
  console.log(req.body);
  let listing = await Listing.findById(req.params.id);
  let newReview = new review(req.body.review);
  
  listing.reviews.push(newReview);
  
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
});
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    console.log("inside delete route");

    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

//Delete Review Route

// app.get("/Lesting", async (req, res) => {
//   let SimpleListing = new Listing({
//     title: "My New Villa",
//     location: "Noida",
//     price: 100,
//     description: "Simple Description",
//     // image: "Simple Image",
//     country: "India",
//   });
//   await SimpleListing.save();
//   console.log("samle was save successgully");
//   res.send("Listing Created");
// });

app.get("/", (req, res) => {
  res.send("Hello World");
});

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new Expresserror(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new Expresserror(msg, 400);
  } else {
    next();
  }
};

//Index Route
app.get("/listings", async (req, res) => {
  const AllListing = await Listing.find({});
  res.render("../views/listings/index.ejs", { AllListing });
});

//New Route

app.get("/listings/new", (req, res) => {
  res.render("../views/listings/new.ejs");
});

//show Route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("../views/listings/show.ejs", { listing });
});
//Show Route

app.post("/listings", async (req, res) => {
  const { title, location, price, description, image, country } = req.body;
  let result = listingSchema.validate({
    title,
    location,
    price,
    description,
    image,
    country,
  });
  console.log(result);
  const listing = new Listing({
    title,
    location,
    price,
    description,
    image,
    country,
  });
  await listing.save();
  res.redirect("/listings");
});
//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("../views/listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const { title, location, price, description, image, country } = req.body;
  const listing = await Listing.findByIdAndUpdate(id, {
    title,
    location,
    price,
    description,
    image,
    country,
  });
  res.redirect("/listings");
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
//Review
// Post Route
// app.post(
//   "/listings/:id/reviews",async (req, res) => {
//     console.log(req.body);

//     // let listing = await Listing.findById(req.params.id);
//     // let newReview = new review(req.body.review);

//     // listing.reviews.push(newReview);

//     // await newReview.save();
//     // await listing.save();
//     // res.redirect(`/listings/${listing._id}`);
//   }
// );

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
