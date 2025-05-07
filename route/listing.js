const express = require("express");
const router = express.Router();
const wrapAsync = require("../utill/wrapAsync.js");
// const Expresserror = require("../utill/expressError.js");
const Listing = require("../Models/listing.js");
const review = require("../Models/review.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

router.route("/").get(wrapAsync(listingController.index)).post(
  isloggedIn,
  upload.single("listing[image]"), // first upload file
  validateListing, // then validate fields
  wrapAsync(listingController.postRoute)
);

// New Listing form
router.get("/new", isloggedIn, listingController.renderNewForm);

// Show, Update, Delete specific listing
router
  .route("/:id")
  .get(wrapAsync(listingController.showRoutes)) // only one .get here
  .put(
    isloggedIn,
    isOwner,
    upload.single("listing[image]"), // again upload file first if updating image
    validateListing,
    wrapAsync(listingController.updateRoute)
  )
  .delete(isloggedIn, isOwner, wrapAsync(listingController.deleteRoute));

// Edit form
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
