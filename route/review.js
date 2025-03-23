const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utill/wrapAsync.js");
const Expresserror = require("../utill/expressError.js");
const { reviewSchema } = require("../schema.js");
const { listingSchema } = require("../schema.js");
const review = require("../Models/review.js");
const Listing = require("../Models/listing.js");

const validateReview = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new Expresserror(msg, 400);
  } else {
    next();
  }
};

// Post Route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    console.log(req.body);
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  })
);
// Delete Route
router.delete("/listings/:id/reviews/:reviewId", async (req, res) => {
  console.log("inside delete route");

  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
});

module.exports = router;
