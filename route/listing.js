const express = require("express");
const router = express.Router();
const wrapAsync = require("../utill/wrapAsync.js");
const Expresserror = require("../utill/expressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../Models/listing.js");
const review = require("../Models/review.js");

//Post Review route

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new Expresserror(msg, 400);
  } else {
    next();
  }
};

//Index Route
router.get(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const AllListing = await Listing.find({});
    res.render("../views/listings/index.ejs", { AllListing });
  })
);

router.delete("/:id/reviews/:reviewId", async (req, res) => {
  console.log("inside delete route");

  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
});

router.post("/:id/reviews", async (req, res, next) => {
  console.log(req.body);
  let listing = await Listing.findById(req.params.id);
  let newReview = new review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
});

// const validateListing = (req, res, next) => {
//   const { error } = listingSchema.validate(req.body);
//   if (error) {
//     const msg = error.details.map((el) => el.message).join(",");
//     throw new Expresserror(msg, 400);
//   } else {
//     next();
//   }
// };

//New Route
//this is the not for me

router.get("/new", (req, res) => {
  res.render("../views/listings/new.ejs");
});

//show Route
router.get(" /:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("../views/listings/show.ejs", { listing });
});
//Show Route

router.post("/listings", async (req, res) => {
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
router.get("/ :id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("../views/listings/edit.ejs", { listing });
});

//Update Route
router.put("/ :id", async (req, res) => {
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
router.delete("/ :id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
//Review
// Post Route
router.post("/ :id/reviews", async (req, res) => {
  console.log(req.body);

  let listing = await Listing.findById(req.params.id);
  let newReview = new review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
});

module.exports = router;
