const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    description: Joi.string().required(),
    locations: Joi.string().required(),
    reviews: Joi.string(),
  }).required(),
    deleteImage: Joi.array()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    ratings: Joi.number().min(1).max(5).required(),
  }).required(),
});
