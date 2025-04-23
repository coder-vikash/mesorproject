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

const reviewController = require("../controllers/reviews.js");

// Post Route
router.post(
  "/",
  isloggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);
// Delete Route
router.delete(
  "/:reviewId",
  isloggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.distroyReview)
);

module.exports = router;
