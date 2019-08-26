var express         = require("express"),
    app             = express(),
    path            = require("path"),
    session         = require("express-session"),
    bodyParser      = require("body-parser"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    mongoose        = require("mongoose"),
    User            = require("./models/userModel"),
    authRoutes      = require("./routes/authRoutes"),
    isLoggedIn      = require("./middleware/isLoggedIn") // Middleware which checks if user is authenticated, if not the user gets redirected to /login. Look useage as in the app.get call before authRoutes
    
mongoose.connect("mongodb://localhost/boilerplate_auth", { useNewUrlParser: true, useCreateIndex: true }); // establish connection to MongoDB

// Express Setup / Configuration
app.set("view engine", "ejs");
app.use(session({
    secret: "RandomString",
    httpOnly: true,
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/public")));

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Making the variable "user" accessible on all templates
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

app.get("/", isLoggedIn, (req, res) => { // use the middleware like shown here
    res.render("index");
});

// In that Route file we find all our Auth Logic
app.use(authRoutes);

app.listen(3000, () => console.log("Starting Server"));