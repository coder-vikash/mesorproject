const Listing = require("../Models/listing");
const Review = require("../Models/review");

module.exports.createReview = async (req, res) => {
  console.log(req.body);
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "Review Created Successfully!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.distroyReview = async (req, res) => {
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
};
