var express     = require("express"),
    User        = require("../models/user"),
    passport    = require("passport"),
    sgMail      = require("@sendgrid/mail"),
    Post        = require("../models/post"),
    router      = express.Router(),
    help        = require("../middleware");

//SIGN UP POST ROUTE
router.post("/signup", function(req, res){
    var post = {
        username: req.body.username.trim(),
        email:    req.body.email.trim(),
        password: req.body.password.trim()
    };
    
    req.session.rf = post;
        
    if(!post.username || !post.username.match(/^[a-zA-Z0-9]+$/) || post.username.length < 3 || post.username.length > 20) {
        req.flash("error", "Логин должен быть на латинице от 3 до 20 символов!");
        return res.redirect("/signup");
    }
    
    if(!post.email || !post.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
        req.flash("error", "Введите правильный E-mail!");
        return res.redirect("back");
    }
    
    if(!post.password || !post.password.match(/^[a-zA-Z0-9]+$/) || post.password.length < 6 || post.password.length > 30) {
        req.flash("error", "Пароль должен быть на латинице от 6 до 30 символов!");
        return res.redirect("/signup");
    }
    
    var newUser = new User({username: post.username});
    User.register(newUser, post.password, function(err, user){
        if(err) return res.redirect("/signup");
        
        user.token = String(help.folder());
        user.email = post.email;
        user.status = 0;
        user.active = true;
        user.registered = help.toLocalTime(new Date());
        console.log("signed up: ", user.registered);
        user.save(function(err){ if (err) console.log(err); });
        console.log("new user: ", user);
        passport.authenticate("local")(req, res, function(){
            req.session.rf = {};
            res.redirect("/posts");
        });
    });
});

//SIGN UP PAGE ROUTE
router.get("/signup", function(req, res){
    if(!req.session.rf)
        req.session.rf = {};
        
    res.render("auth/signup", { rf: req.session.rf});
});

//SIGN IN PAGE ROUTE
router.get("/signin", function(req, res){
    if(!req.session.rf)
        req.session.rf = {};
        
    res.render("auth/signin", { rf: req.session.rf});
});

//SIGN IN POST ROUTE
router.post("/signin", passport.authenticate("local", 
    {
        successRedirect: "/logged",
        failureFlash: 'Неправильный логин или пароль!',
        successFlash: 'Добро пожаловать в Bazarlar!',
        failureRedirect: "/signin"
    }), function(req, res){
});

//SIGNED IN PAGE ROUTE
router.get("/logged", function(req, res) {
    User.findOne({username: req.user.username}, function(err, user) {
        if(err) console.log(err);
        if(user) req.session.status = user.status;
        console.log("new status set", req.session.status);
        res.redirect("/posts");
    });
});

//PASSWORD RESET PAGE ROUTE
router.get("/reset", function(req, res){
    res.render("reset");
});

//PASSWORD RESET POST ROUTE
router.post("/reset", function(req, res) {
    
    if(!req.body.email) {
        req.flash("error", "Введите вашу почту!");
        return res.redirect("/reset");
    }   
   
    User.findOne({email: req.body.email.trim()}, function(err, founduser) {
        if(err) console.log(err);
           
        if(!founduser) {
            req.flash("error", "Пользователя с такой почтой не существует!");
            return res.redirect("/reset");
        }
            
        const msg = {
            to: req.body.email,
            from: 'no-reply@bazarlar.kz',
            subject: 'Сброс пароля',
            html: 'Ваш логин: ' + founduser.username + '. Пройдите по ссылке для смены вашего пароля: <a href="' + res.locals.url +'/reset/' + founduser.token + '">Нажмите здесь.</a>',
        };
        sgMail.send(msg); 
            
        req.flash("success", "Проверьте вашу почту.");
        res.redirect("/reset");
    });
});

//LOG OUT ROUTE
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Выход из системы!");
    res.redirect("/posts");
});

module.exports = router;