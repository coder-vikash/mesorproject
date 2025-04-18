const Listing = require("../models/listing");
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
