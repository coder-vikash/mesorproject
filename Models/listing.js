const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,

    default:
      "https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg",
    set: (v) =>
      v === ""
        ? "https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg"
        : v,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    const res = await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
