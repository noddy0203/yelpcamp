if(process.env.NODE_ENV !== "production"){
  require("dotenv").config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 1000;
const path = require("path");
const ExpressError = require("./utilities/ExpressError");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

//it is to be used for generating session id with the passportJS.
//const session = require("express -session")


const passport = require("passport");
const LocalStrategy = require("passport-local");

//schemas
const Review = require("./models/review");
const Campground = require("./models/campSchema");
const User = require("./models/user");

//routes
const user = require("./routes/user");
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((res) => {
    console.log("database connection established");
  })
  .catch((err) => {
    console.log(err);
  });
  
//for ejs-mate
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//to parse the body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//setting up sessions and cookies
const sessionConfig = {
  secret: "thisissecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.currentUser= req.user;  //gvs info of users after triggering the middleware req.usAuthenticated while logging in
  res.locals.success = req.flash("success");  // for flash
  res.locals.error = req.flash("error"); //for flash
  next()
})

//route setup
app.use("/", user);
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.render("home");
});

//in case invalid url address
app.all("*", (req, res, next) => {
  next(
    new ExpressError(
      "page not found!!!! nothings found for nothings searched",
      404
    )
  );
});

//if campground post route has validation error then next will pass that err handling to this middleware
app.use((err, req, res, next) => {
  const { statuscode = 500 } = err;
  if (!err.message) err.message = "Oh Boi!!! I dont know whats going on";
  res.status(statuscode).render("error", { err });
});

app.listen(port, function () {
  console.log(`server has started at port number - ${port}`);
});
