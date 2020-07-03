const express = require("express");
const BodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const cors = require("cors");
const config = require("./config/config");
const { ensureAuthenticated, forwardAuthenticated } = require("./config/auth");

const app = express();
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());
app.set("view-engine", "ejs");
app.use(express.static(__dirname + "/public"));

require("./config/passport")(passport);

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// global variable
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

const folderName = "./uploads";
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.log(err);
}

let storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    callback(
      null,
      hours +
        "_" +
        minutes +
        "_" +
        seconds +
        "_" +
        date +
        "_" +
        month +
        "_" +
        year +
        "_" +
        file.originalname
    );
  },
});

let upload = multer({
  storage: storage,
}).single("csv-files");

const PORT = process.env.PORT || 3000;
const db = require("./models/index");

db.authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

const app_db = require("./models/app_db");
const user = require("./models/user");

app.get("/", ensureAuthenticated, (req, res) => {
  app_db
    .findAll({
      order: [["category"]],
    })
    .then((apps) => {
      res.render("index.ejs", { apps });
    })
    .catch((err) => res.send(err));
});

app.get("/add-apps-bulk", ensureAuthenticated, (req, res) => {
  res.render("add-apps-bulk.ejs");
});

// search functionality
app.post("/search", ensureAuthenticated, (req, res) => {
  const searchCategory = req.body.searchCategory;
  app_db
    .findAll({ where: { category: searchCategory }, order: [["name"]] })
    .then((apps) => {
      res.render("index.ejs", { apps });
    })
    .catch(() => {
      res.redirect("/");
    });
});

app.post("/search/name", ensureAuthenticated, (req, res) => {
  const searchName = req.body.searchName;
  app_db
    .findAll({ where: { name: searchName }, order: [["name"]] })
    .then((apps) => {
      res.render("index.ejs", { apps });
    })
    .catch(() => {
      res.redirect("/");
    });
});

app.post("/add-apps-bulk", ensureAuthenticated, (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.end("Something went wrong!");
    }
    return res.redirect("/add-apps-bulk");
  });
});

app.get("/add-app", ensureAuthenticated, (req, res) => {
  res.render("add-single-app.ejs");
});

// API
app.post("/api/submit/apps", cors(), (req, res) => {
  const recommendedApps = req.body.app_names.map(async (x) => {
    const resp = await app_db.findOne({ where: { name: x } });
    if (!resp || !resp.dataValues) {
      console.log(x + " not found");
    }
    return resp && resp.dataValues
      ? {
          id: resp.dataValues.id,
          name: resp.dataValues.name,
          category: resp.dataValues.category,
          alt1_name: resp.dataValues.alt1_name,
          alt1_origin: resp.dataValues.alt1_origin,
          alt1_playstore: resp.dataValues.alt1_playstore,
          alt1_appstore: resp.dataValues.alt1_appstore,
          alt2_name: resp.dataValues.alt2_name,
          alt2_origin: resp.dataValues.alt2_origin,
          alt2_playstore: resp.dataValues.alt2_playstore,
          alt2_appstore: resp.dataValues.alt2_appstore,
          alt3_name: resp.dataValues.alt3_name,
          alt3_origin: resp.dataValues.alt3_origin,
          alt3_playstore: resp.dataValues.alt3_playstore,
          alt3_appstore: resp.dataValues.alt3_appstore,
        }
      : null;
  });
  Promise.all(recommendedApps)
    .then((results) => {
      res.send(results.filter(Boolean));
    })
    .catch((err) => console.log(err));
});

// save single app
app.post("/save/single-app", ensureAuthenticated, (req, res) => {
  const {
    name,
    category,
    origin,
    alt1_name,
    alt1_origin,
    alt1_playstore,
    alt1_appstore,
    alt2_name,
    alt2_origin,
    alt2_playstore,
    alt2_appstore,
    alt3_name,
    alt3_origin,
    alt3_playstore,
    alt3_appstore,
  } = req.body;
  app_db
    .findOne({ where: { name: name } })
    .then((resp) => {
      if (resp === null) {
        app_db
          .create({
            name: name,
            category: category.toLowerCase(),
            origin: origin,
            alt1_name: alt1_name,
            alt1_origin: alt1_origin,
            alt1_playstore: alt1_playstore,
            alt1_appstore: alt1_appstore,
            alt2_name: alt2_name,
            alt2_origin: alt2_origin,
            alt2_playstore: alt2_playstore,
            alt2_appstore: alt2_appstore,
            alt3_name: alt3_name,
            alt3_origin: alt3_origin,
            alt3_playstore: alt3_playstore,
            alt3_appstore: alt3_appstore,
          })
          .then(() => res.redirect("/"))
          .catch((err) => console.log(err));
      } else {
        res.send("Already present in database");
      }
    })
    .catch((err) => console.log(err));
});

// update a single app
app.get("/update/:id", ensureAuthenticated, (req, res) => {
  const id = req.params.id;
  app_db
    .findOne({
      where: { id: id },
    })
    .then((app) => {
      res.render("update-single-app.ejs", { app });
    })
    .catch((err) => console.log(err));
});

app.post("/update/:id", ensureAuthenticated, (req, res) => {
  const id = req.params.id;
  const {
    name,
    category,
    origin,
    alt1_name,
    alt1_origin,
    alt1_playstore,
    alt1_appstore,
    alt2_name,
    alt2_origin,
    alt2_playstore,
    alt2_appstore,
    alt3_name,
    alt3_origin,
    alt3_playstore,
    alt3_appstore,
  } = req.body;
  app_db
    .update(
      {
        name: name,
        category: category,
        origin: origin,
        alt1_name: alt1_name,
        alt1_origin: alt1_origin,
        alt1_playstore: alt1_playstore,
        alt1_appstore: alt1_appstore,
        alt2_name: alt2_name,
        alt2_origin: alt2_origin,
        alt2_playstore: alt2_playstore,
        alt2_appstore: alt2_appstore,
        alt3_name: alt3_name,
        alt3_origin: alt3_origin,
        alt3_playstore: alt3_playstore,
        alt3_appstore: alt3_appstore,
      },
      {
        where: {
          id: id,
        },
      }
    )
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

// delete route
app.get("/delete/:id", ensureAuthenticated, (req, res) => {
  app_db
    .destroy({ where: { id: req.params.id } })
    .then(() => res.redirect("/"))
    .catch((err) => res.send(err));
});

// AUTHENTICATION
// register page
// app.get("/register", forwardAuthenticated, (req, res) => {
//   res.render("register.ejs");
// });

// app.post("/register", forwardAuthenticated, async (req, res) => {
//   try {
//     if (req.body.password === req.body.retypepassword) {
//       const hashedPassword = await bcrypt.hash(req.body.password, 10);
//       user
//         .create({
//           username: req.body.username,
//           password: hashedPassword,
//         })
//         .then(() => res.redirect("/login"))
//         .catch((err) => res.send(err));
//     } else {
//       res.send("retype password correctly");
//     }
//   } catch {
//     res.redirect("/register");
//   }
// });

// login
app.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

// logout
app.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
