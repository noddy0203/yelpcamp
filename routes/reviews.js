const express = require("express");
const router = express.Router({ mergeParams: true }); //here we need to mention mergeParams because review depends on camp ID so its not parant its child
const asyncError = require("../utilities/asyncError");
const { validateReview , isLoggedIn , isReviewAuthor } = require("../middlewarePassport");

//requiring review controller
const review = require("../controller/review")

//review post route for particular campground
router.post(
  "/",
  isLoggedIn,
  validateReview,
  asyncError(review.createReview)
);

// deleting review from the campground and updating campground

router.delete(
  "/:reviewId",
   isLoggedIn,
   isReviewAuthor,
  validateReview,
  asyncError(review.deleteReview )
);

module.exports = router;
