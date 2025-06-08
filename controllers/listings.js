const Listing = require("../Models/listing");

module.exports.index = async (req, res) => {
  const AllListing = await Listing.find({});
  res.render("listings/index.ejs", { AllListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListigs = async (req, res) => {
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
};

module.exports.postRoute = async (req, res) => {
  let url = req.file.path;
  let fileName = req.file.filename;

  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, fileName };
  let result = await newlisting.save();
  console.log(result);
  req.flash("success", "New listing created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  req.flash("success", "Review Edit Successfully!");
  // res.render("../views/listings/edit.ejs", { listing });
  let OriginalImageurl = listing.image.url;
  OriginalImageurl = OriginalImageurl.replace(
    "upload",
    "upload/w_300,h_200,c_fill/"
  );

  res.render("listings/edit.ejs", { listing, OriginalImageurl });
};

module.exports.showRoutes = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" }, // ✅ Correct nested population
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

module.exports.updateRoute = async (req, res) => {
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
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let fileName = req.file.filename;
    listings.image = { url, fileName };
    await listings.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteRoute = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
