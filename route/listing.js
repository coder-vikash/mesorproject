const express = require("express");
const router = express.Router();
const wrapAsync = require("../utill/wrapAsync.js");
// const Expresserror = require("../utill/expressError.js");
const Listing = require("../Models/listing.js");
const review = require("../Models/review.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");

//Post Review route listingSchema

// console.log(listingsSchema)

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const AllListing = await Listing.find({});
    res.render("listings/index.ejs", { AllListing });
  })
);

// router.delete("/:id/reviews/:reviewId", isloggedIn, async (req, res) => {
//   console.log("inside delete route");

//   let { id, reviewId } = req.params;
//   await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//   await review.findByIdAndDelete(reviewId);
//   req.flash("success", "Review Deleted Successfully!");
//   res.redirect(`/listings/${id}`);
// });

// router.post("/:id/reviews", isloggedIn, async (req, res, next) => {
//   console.log(req.body);
//   let listing = await Listing.findById(req.params.id);
//   let newReview = new review(req.body.review);

//   listing.reviews.push(newReview);

//   await newReview.save();
//   await listing.save();
//   req.flash("success", "Review Added Successfully!");
//   res.redirect(`/listings/${listing._id}`);
// });

router.get("/new", isloggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//show Route
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  res.render("../views/listings/show.ejs", { listing });
});
//Show Route
// SHOW ROUTE: Show Details of a Specific Listing
router.get("/:id", async (req, res, next) => {
  const listing = await Listing.findById(req.params.id)
    .populate("reviews")
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }
  // console.log(listing);
  res.render("listings/show", { listing });
});
//Edit Route
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    req.flash("success", "Review Edit Successfully!");
    // res.render("../views/listings/edit.ejs", { listing });
    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  isloggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, location, price, description, image, country } = req.body;
    const listings = await Listing.findByIdAndUpdate(id, {
      title,
      location,
      price,
      description,
      image,
      country,
    });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  isloggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);
//Review
// // Post Route
// router.post("/:id/reviews", isloggedIn, async (req, res) => {
//   console.log(req.body);

//   let listing = await Listing.findById(req.params.id);
//   let newReview = new review(req.body.review);

//   listing.reviews.push(newReview);

//   await listing.save();
//   await newReview.save();
//   req.flash("success", "New Listing Successfully!");
//   res.redirect(`/listings/${listing._id}`);
// });

module.exports = router;
