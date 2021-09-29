// const mongoose = require("mongoose")
// const Campground = require("../models/campSchema")
// const cities = require("./cities")
// const {descriptors, places} = require("./seedHelpers")
// mongoose.connect('mongodb://localhost:27017/yelp-camp',
// {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex:true
// }).then(res=>{
//     console.log("database connection established")
// }).catch(err=>{
//     console.log(err)
// })

// const sample = (array)=>{
//     Math.floor(Math.random() * array.length)
// }

// const seedDB  = async ()=>{
//     await Campground.deleteMany({});
//     for (let i = 0; i < 51; i++) {
//       const random1000 = Math.floor (Math.random() * 1000)
//       const camp = new Campground({
//           locations: `${cities[random1000].city} - ${cities[random1000].state}`,
//           title: `${sample.descriptors} ${sample(places)}`
//       })
//       await camp.save()
//     }
// }
// seedDB();

//demo connection with city data and camp titles

const mongoose = require("mongoose");
const Campground = require("../models/campSchema");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((res) => {
    console.log("database connection established");
  })
  .catch((err) => {
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const data = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 51; i++) {
    const randomCity = Math.floor(Math.random() * 1000);
    const campPrice = Math.floor(Math.random() * 20) + 10;
    const newCamp = new Campground({
      author: "60cc7f6dfd280e250c7f35d9",
      locations: `city:${cities[randomCity].city}  state:${cities[randomCity].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis suscipit minus voluptatibus earum praesentium nulla assumenda inventore excepturi, qui cum.",
      price: campPrice,
      images: [
        {
          url: 'https://res.cloudinary.com/noddy0203/image/upload/v1625748978/YelpCamp/vikbs28uvgb0a1dnwvlg.jpg',
          filename: 'YelpCamp/vikbs28uvgb0a1dnwvlg'
        },
        {
          url: 'https://res.cloudinary.com/noddy0203/image/upload/v1625748995/YelpCamp/sktoksnignmtvthnpsid.jpg',
          filename: 'YelpCamp/sktoksnignmtvthnpsid'
        },
      ],
    });
    newCamp.save();
  }
};

data();
