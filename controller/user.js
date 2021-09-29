const User = require("../models/user");


module.exports.getRegister =  (req, res) => {
    res.render("users/register");
  }

  module.exports.registerNewUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);

      //to login automatically passport has method req.login
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        console.log(registeredUser);
        req.flash("success", "User successfully registered");
        res.redirect("/campgrounds");
      });
    } catch (error) {
      req.flash("error", error.message);
      console.log(error);
      res.redirect("/register");
    }
  }

  module.exports.getLogin = (req, res) => {
    res.render("users/login");
  }

  module.exports.loginUser = (req, res) => {
    req.flash("success", "login successfull");
    const redirectUrl = req.session.returnTo || "/campgrounds"
    delete req.session.returnTo //it will delete the memory from returnTo
    res.redirect(redirectUrl);

  }

  module.exports.userLogout =  (req, res) => {
    req.logout();
    req.flash("success", "See you soon!");
    res.redirect("/campgrounds");
  }