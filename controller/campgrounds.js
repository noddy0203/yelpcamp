const Campground = require("../models/campSchema");
const { cloudinary } = require("../cloudinary/index");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken : mapboxToken})

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campground/index", { campgrounds });
};

module.exports.makeNewCampground = (req, res) => {
  res.render("campground/new");
};

module.exports.showCampground = async (req, res, next) => {
  const { id } = req.params;
  //here we are populating the review collection onj the existing campground to get the enterewd the review
  const campground = await Campground.findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  if (!campground) {
    req.flash("error", "Can't find Campground");
    return res.redirect("/campgrounds");
  }
  res.status(200).render("campground/show", { campground });
};

module.exports.postNewCampground = async (req, res, next) => {
  
const geodata = await geoCoder.forwardGeocode({
    query: req.body.campground.locations,
    limit:1
}).send()

  const newCampground = new Campground(req.body.campground);
  newCampground.geometry = geodata.body.features[0].geometry;
  newCampground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  
  newCampground.author = req.user._id; //gettinguser info to create user by passport
  await newCampground.save();
  console.log(newCampground);
  req.flash("success", "successfully created new campground");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.editPage = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.status(200).render("campground/edit", { campground });
};


module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const img = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...img);
  await campground.save();
  // to delete selected image from array
  if (req.body.deleteImage) {
    for (let filename of req.body.deleteImage) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne(
      { $pull: { images: { filename: req.body.deleteImage } } },
      { multi: true }
    );
  //   campground.images = campground.images.filter(image => image.filename !== req.body.deleteImage);
  // await campground.save();
    console.log(campground);
  }
  req.flash("success", "successfully updated existing campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.destroy = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfuly deleted campground.");
  res.redirect("/campgrounds");
};