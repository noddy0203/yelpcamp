const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

//neeed to modify this
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_250");
});

//campground sub schema for geo locations

const campgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: {
      type: [Number],
      required: true,
    }
  },
  price: Number,
  description: String,
  locations: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//using middleware to delete reviews when deleting entire campground
//bcz we are using findByIdAndDelete so using findOneDelete
campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.review,
      },
    });
  }
});

const Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;
