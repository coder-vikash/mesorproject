const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utill/wrapAsync.js");
const Expresserror = require("../utill/expressError.js");
const {
  validateReview,
  isloggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");

// Post Route
router.post(
  "/",
  isloggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    console.log(req.body);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review Created Successfully!");
    res.redirect(`/listings/${listing._id}`);
  })
);
// Delete Route
router.delete(
  "/:reviewId",
  isloggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    console.log("inside delete route");
    let { id, reviewId } = req.params;

    res.redirect(`/listings/${id}`);
    const review = await Review.findById(reviewId);
    if (review.author.equals(req.user._id)) {
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success", "Review Deleted Successfully!");
      res.redirect(`/listings/${id}`);
    } else {
      req.flash("error", "U can not delete");
      res.redirect(`/listings/${id}`);
    }
  })
);

module.exports = router;
