const express = require("express");
const router = express.Router();
const asyncError = require("../utilities/asyncError");
const Campground = require("../models/campSchema");
const multer = require("multer")
const {storage} = require("../cloudinary/index")
const upload = multer({storage})

//controller object call which have differ logics as method
const campgrounds = require("../controller/campgrounds");

const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middlewarePassport");

//index of campgrounds routr

router.route("/")
    .get(asyncError(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, asyncError(campgrounds.postNewCampground));

    
router.get("/new", isLoggedIn, campgrounds.makeNewCampground);
//show route

router.route("/:id")
    .get(asyncError(campgrounds.showCampground))
    .put( isLoggedIn, isAuthor, upload.array("image"), asyncError(campgrounds.editCampground))
    .delete( isLoggedIn, isAuthor, asyncError(campgrounds.destroy));
    

router.get("/:id/edit", isLoggedIn, isAuthor, asyncError(campgrounds.editPage));



module.exports = router;
