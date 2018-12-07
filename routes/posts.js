var express      = require("express"),
    Post      = require("../models/post"),
    User         = require("../models/user"),
    path         = require("path"),
    router       = express.Router(),
    help   = require("../middleware");
    
//SHOW ALL POSTS - BLOG PAGE
router.get("/", function(req, res) {
    Post.find({}).sort({created: -1}).exec(function(err, allPosts){
        if(err) console.log(err);
        
        var formquery = {};
        
        if(req.session.search)
            formquery = req.session.search;
        
        res.render("posts/index", {posts: allPosts, q: formquery, light: true, page: "Блог"});
    });
});

//NEW PRODUCT FORM
router.get("/new", help.isLoggedIn, function(req, res) {
    
    if(!req.session.fc)
        req.session.fc = {photos: []};
        
    res.render("posts/new", {fc: req.session.fc, folder: help.folder});
});

//CLEAR CLIPBOARD OF SORTS
router.get("/clear", help.isLoggedIn, function(req, res) {
    req.session.fc = {photos: []};
    res.redirect("/admin");
});

//POST NEW PRODUCT INTO DB
router.post("/", help.isLoggedIn, function(req, res) {
    var post = {
        title: req.body.title,
        desc: req.body.desc,
        image: req.body.image,
        content: req.body.content,
        author: { id: req.user._id, username: req.user.username }
    };
        
    req.session.fc = post;
        
    if(!post.title || post.title.length < 3 ) {
        req.flash("error", "Введите имя статьи!");
        return res.redirect("/posts/new");
    }
        
    if(!post.desc || post.desc.length < 10){
        req.flash("error", "Описание должно быть не короче 10 символов!");
        return res.redirect("/posts/new");
    }
    
    if(!post.image || post.image.length < 6){
        req.flash("error", "Ссылка на картинку должна быть не короче 6 символов!");
        return res.redirect("/posts/new");
    }
        
    if(!post.content || post.content.length < 10){
        req.flash("error", "Содержание должно быть не короче 10 символов!");
          return res.redirect("/posts/new");
    }
        
    var newPost = {
        title: post.title,
        image: post.image,
        desc: post.desc,
        author: post.author,
        content: post.content,
        created: help.toLocalTime(new Date())
    };
    Post.create(newPost, function(err, newlyCreated){
        if(err){ console.log(err); }
        
        req.session.fc = {};
        res.redirect("/posts");
    });
});

//UPDATE POST ROUTE
router.put("/:id", help.checkPostOwnership, function(req, res){
    var post = {
        id: req.params.id,
        title: req.body.title,
        image: req.body.image,
        desc: req.body.desc,
        content: req.body.content,
        author: { id: req.user._id, username: req.user.username }
    };
        
    if(!post.title || post.title.length < 3 ) {
        req.flash("error", "Введите имя статьи!");
        return res.redirect("/posts/new");
    }
        
    if(!post.desc || post.desc.length < 10){
        req.flash("error", "Описание должно быть не короче 10 символов!");
        return res.redirect("/posts/new");
    }
    
    if(!post.image || post.image.length < 6){
        req.flash("error", "Ссылка на картинку должна быть не короче 6 символов!");
        return res.redirect("/posts/new");
    }
        
    if(!post.content || post.content.length < 10){
        req.flash("error", "Содержание должно быть не короче 10 символов!");
          return res.redirect("/posts/new");
    }
    
    var newPost = {
        title: post.title,
        image: post.image,
        content: post.content,
        desc: post.desc,
        author: post.author,
    };
    Post.findByIdAndUpdate(post.id, newPost, function(err, justUpdated){
        if(err){ console.log(err); } else {
            console.log(justUpdated);
            return res.redirect("/posts");
        }
    });
});

//POST SHOWPAGE MOREEE
router.get("/:id",function(req, res){
    Post.findById(req.params.id).populate({ path: 'author.id' }).exec(function(err, foundPost){
        if(err) console.log(err);
        
        res.render("posts/show", {post: foundPost, light: true, page: foundPost.title});
    });
});

//EDIT PRODUCT ROUTE
router.get("/:id/edit", help.checkPostOwnership, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }else{
            console.log(foundPost);
            res.render("posts/edit", {post: foundPost});
        }
    });
});

//DESTROY PRODUCT ROUTE
router.delete("/:id", help.checkPostOwnership, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/posts");
        } else {
            req.flash("success", "Вы только что удалили статью!");
            res.redirect("/posts");
        }
    });
});


module.exports = router;