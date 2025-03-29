const express = require("express");
const router = express.Router();
const wrapAsync = require("../utill/wrapAsync.js");
const Expresserror = require("../utill/expressError.js");
const { listingsSchema } = require("../schema.js");
const Listing = require("../Models/listing.js");
const review = require("../Models/review.js");

//Post Review route listingSchema

// console.log(listingsSchema)
const validateListing = (req, res, next) => {
  console.log(req.body);
  let { error } = listingsSchema.validate(req.body);
  console.log(error);
  if (error) {
    throw new Expresserror(400, error.details.map((e) => e.message).join(", "));
  } else {
    next();
  }
};

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const AllListing = await Listing.find({});
    res.render("listings/index.ejs", { AllListing });
  })
);

router.delete("/:id/reviews/:reviewId", async (req, res) => {
  console.log("inside delete route");

  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted Successfully!");
  res.redirect(`/listings/${id}`);
});

router.post("/:id/reviews", async (req, res, next) => {
  console.log(req.body);
  let listing = await Listing.findById(req.params.id);
  let newReview = new review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "Review Added Successfully!");
  res.redirect(`/listings/${listing._id}`);
});

router.get("/new", (req, res) => {
  res.render("../views/listings/new.ejs");
});

//show Route
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("../views/listings/show.ejs", { listing });
});
//Show Route

router.post("/", validateListing, async (req, res) => {
  console.log(req.body);
  const { title, location, price, description, image, country } = req.body;
  const listing = new Listing({
    title,
    location,
    price,
    description,
    image,
    country,
  });
  await listing.save();
  req.flash("success", "New Listing Successfully!");
  console.log(listing);
  res.redirect("/listings");
});
//Edit Route
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  req.flash("success", "Review Edit Successfully!");
  res.render("../views/listings/edit.ejs", { listing });
});

//Update Route
router.put("/:id", async (req, res) => {
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
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
});

//Delete Route
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
});
//Review
// Post Route
router.post("/:id/reviews", async (req, res) => {
  console.log(req.body);

  let listing = await Listing.findById(req.params.id);
  let newReview = new review(req.body.review);

  listing.reviews.push(newReview);

  await listing.save();
  await newReview.save();
  req.flash("success", "New Listing Successfully!");
  res.redirect(`/listings/${listing._id}`);
});

module.exports = router;
