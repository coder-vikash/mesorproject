const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
  res.locals.errorMsg = req.flash("error");
  res.locals.successMsg = req.flash("success");
  next();
});

app.use("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  if (name === "anonymous") {
    req.flash("error", "user not Registerd");
  } else {
    req.flash("success", "User registered successfully!");
  }

  res.redirect("/hello"); // redirect to hello route after setting the session
});

app.get("/hello", (req, res) => {
  res.render("page.ejs", { name: req.session.name }); // render the page with the name from the session
});

// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count += 1;
//   } else req.session.count = 1;
//   console.log(req.session.count);
//   res.send(`Request Count: ${req.session.count}`);
// });

// app.get("/test", (req, res) => {
//   res.send("Session is set");
// });

// app.use(cookieParser("secretcode"));

// app.get("/getsigncookie", (req, res) => {
//   res.cookie("color", "Red", { signed: true });
//   res.send("Cookie is set");
// });
// //signed cookies
// app.get("/verify", (req, res) => {
//   console.log(req.signedCookies);
//   res.send("Cookie is verified");
// });

// //cookies
// app.get("/setcookie", (req, res) => {
//   res.cookie("Name", "John Doe");
//   res.cookie("origin", "India");
//   res.send("Cookie is set");
// });
// app.get("/greet", (req, res) => {
//   let { Name = "NoName" } = req.cookies;
//   res.send(`Welcome ${Name}`);
// });

// // app get users
// app.get("/", (req, res) => {
//   console.dir(req.cookies);
//   res.send("Hi, I am root Users");
// });

// app.use("/users", users);
// app.use("/posts", posts);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
