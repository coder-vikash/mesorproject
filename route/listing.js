const express = require("express");
const router = express.Router();
const wrapAsync = require("../utill/wrapAsync.js");
// const Expresserror = require("../utill/expressError.js");
const Listing = require("../Models/listing.js");
const review = require("../Models/review.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

//Post Review route listingSchema

//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isloggedIn, listingController.renderNewForm);

//show Route
router.get("/:id", listingController.showListigs);

// SHOW ROUTE: Show Details of a Specific Listing
router.get("/:id", wrapAsync(listingController.showRoutes));


//Edit Route
router.get(
  "/:id/edit",
  isloggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//Update Route
router.put(
  "/:id",
  isloggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateRoute)
);

//Delete Route
router.delete(
  "/:id",
  isloggedIn,
  isOwner,
  wrapAsync( listingController.deleteRoute)
);
 

router.post(
  "/",
  isloggedIn,
  validateListing,
  wrapAsync(listingController.postRoute)
);

module.exports = router;
