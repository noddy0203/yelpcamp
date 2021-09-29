const Review = require("../models/review");
const Campground = require("../models/campSchema");

module.exports.createReview = async (req, res) => {
    try {
      const campground = await Campground.findById(req.params.id);
      const review = new Review(req.body.review);
      review.author = req.user._id
      campground.review.push(review)
      await campground.save();
      await review.save();
      req.flash("success", "Successfuly created new review.");
      res.redirect(`/campgrounds/${campground._id}`);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }


  // here in this route we are having some problem
module.exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    // here using mongo $pull operator to catch the entire array
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfuly deleted review.");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    console.log(`this causes the error ${error}`);
  }
}

