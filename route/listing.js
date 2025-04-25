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

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isloggedIn,
    // validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.postRoute)
  );

router.get("/new", isloggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(listingController.showListigs)
  .get(wrapAsync(listingController.showRoutes))
  .put(
    isloggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateRoute)
  )
  .delete(isloggedIn, isOwner, wrapAsync(listingController.deleteRoute));

//New Route

//show Route

// SHOW ROUTE: Show Details of a Specific Listing

//Edit Route
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//Update Route

//Delete Route

module.exports = router;
