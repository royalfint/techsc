var express        = require("express"),
    parser         = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy  = require("passport-local"),
    flash          = require("connect-flash"),
    sender         = require("@sendgrid/mail");
    
var User        = require("./models/user"),
    indexRoutes = require("./routes"),
    postRoutes  = require("./routes/posts"),
    authRoutes  = require("./routes/auth");


var app       = express(),
    redirect  = require('express-http-to-https').redirectToHTTPS,
    api       = "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";
    
//global.siteurl = "https://techsc-royalfint.c9users.io";
global.siteurl = "https://www.techsc.kz";
mongoose.connect("mongodb://techsc_admin:YtEpyftimVjq1Gfhjkm@ds135798.mlab.com:35798/techsc",
   { useNewUrlParser: true });
app.use(redirect([/localhost:(\d{4})/], [/\/insecure/], 301));
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
sender.setApiKey(api);
app.use(parser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   res.locals.url = global.siteurl;
   res.locals.status = req.session.status;
   next();
});

app.use("/",indexRoutes);
app.use("/", authRoutes);
app.use("/posts/", postRoutes);
/*
app.use("/", adminRoutes);
app.use("/post/:id/comments",commentRoutes);
app.use("/post", postRoutes);
*/

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is up and running!");
});