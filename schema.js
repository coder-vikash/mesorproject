const Joi = require("joi");

const listingsSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(), // Make sure it's "description", not "discription"
  location: Joi.string().required(),
  price: Joi.number().required().min(1),
  image: Joi.string().optional().allow("", null),
  country: Joi.string().required(),
});

module.exports = { listingsSchema }; // Ensure this matches your import

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
