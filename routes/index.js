var express = require("express"),
    sender  = require("@sendgrid/mail"),
    help    = require("../middleware"),
    Post    = require("../models/post"),
    app     = express.Router(),
    User    = require("../models/user");

var adminEmail = "royalfint@hotmail.com";

app.get("/", function(req, res) { res.render("home", {light: false, page: "Главная"});  });
app.get("/portfolio", function(req, res) { res.render("portfolio", {light: true, page: "Портфолио"});  });
app.get("/about", function(req, res) { res.render("about", {light: true, page: "О Нас"});  });
app.get("/contacts", function(req, res) { res.render("contacts", {light: true, page: "Контакты"}); });

app.get("/certificates", function(req, res) {
   res.render("certificates", {light: true, page: "Аккредитация"}); 
});

app.post("/callmeback", function(req, res) {
   var phone = req.body.phone;
   
   if(!phone || phone.length < 8)
      return res.send(JSON.stringify({data: 0, message: "Введите правильный номер!"}));
   else {
      const msg = {
         to: adminEmail,
         from: 'inbox@techsc.kz',
         subject: 'Запрос обратного звонка на TechSC.kz',
         html: 'Телефон: ' + phone,
      };
      sender.send(msg);
      res.send(JSON.stringify({data: 1}));
   }
});

app.post("/getconsult", function(req, res) {
   var email = req.body.email;
   var name = req.body.name;
   
   if(!name || name.length < 3)
      return res.send(JSON.stringify({data: 0, message: "Сначала введите свое имя!"}));
      
   if(!email || !help.validateEmail(email))
      return res.send(JSON.stringify({data: 0, message: "Введите правильный e-mail!"}));
   
   const msg = {
      to: adminEmail,
      from: 'inbox@techsc.kz',
      subject: 'Запрос на косультацию на TechSC.kz',
      html: 'Имя: ' + name + '<br>E-mail: ' + email,
   };
   sender.send(msg);
      
   res.send(JSON.stringify({data: 1}));
});

app.post("/getcom", function(req, res) {
   var email = req.body.email;
   var name = req.body.name;
   var desc = req.body.desc;
   
   if(!name || name.length < 3)
      return res.send(JSON.stringify({data: 0, message: "Сначала введите свое имя!"}));
      
   if(!email || !help.validateEmail(email))
      return res.send(JSON.stringify({data: 0, message: "Введите правильный e-mail!"}));
      
   if(!desc || desc.length < 3)
      return res.send(JSON.stringify({data: 0, message: "Введите описание проекта!"}));
      
   const msg = {
      to: adminEmail,
      from: 'inbox@techsc.kz',
      subject: 'Запрос на КП на TechSC.kz',
      html: 'Имя: ' + name + '<br>E-mail: ' + email + '<br>Описание: ' + desc,
   };
   sender.send(msg);
   
   res.send(JSON.stringify({data: 1}));
});

/*** BAZARLAR FUNCTIONS ****/
app.get("/reset/:token", function(req, res) {
    res.render("resetform", {token: req.params.token});
});

app.post("/reset/:token", function(req, res){
    var post = {
        password: req.body.password.trim(),
        password2: req.body.password2.trim(),
        token: req.params.token.trim()
    };
    
    if(!post.password || !post.password.match(/^[a-zA-Z0-9]+$/) || post.password.length < 6 || post.password.length > 30) {
        req.flash("error", "Пароль должен быть на латинице от 6 до 30 символов!");
        return res.redirect("back");
    }
    
    if(post.password != post.password2){
        req.flash("error", "Пароли должны совпадать!");
        return res.redirect("back");
    }
    
    if(!post.token){
        req.flash("error", "Нет токена!");
        return res.redirect("back");
    }
        
    User.findOne({token: post.token}, function(err, user){
        if(err) console.log(err);
            
        if(!user){
            req.flash("error", "Нет пользователя с таким токеном!");
            return res.redirect("back");
        }
    
        user.setPassword(req.body.password, function(err, newuser){
            if(err) console.log(err);
            
            user.token = help.folder();
            user.save();
            
            req.flash("success", "Пароль успешно сменен!");
            return res.redirect("/login");
        });
    });
});

/*
app.post("/search", function(req, res) {
    var formquery = {
        term: req.body.query,
        city: req.body.city,
        bazar: req.body.bazar,
        sort: req.body.sort,
        type: req.body.type
    };
    req.session.search = formquery;
    
    var dbquery = [
        { $lookup: {
          from: 'users',
          localField: "author.id",
          foreignField: "_id",
          as: "author"
        }},
        { "$unwind": "$author" }
    ];
    
    if(formquery.term && formquery.term.length > 0)
        dbquery.push({ "$match": { "name": { "$regex": formquery.term, "$options": "i" } }});
        
    if(formquery.city && formquery.city != "Город")
        dbquery.push({ "$match": { "author.city": { "$in": [ formquery.city ] } }});
        
    if(formquery.bazar && formquery.bazar != "Базар")
        dbquery.push({ "$match": { "author.bazar": { "$in": [ formquery.bazar ] } }});
    
    if(formquery.type && formquery.type != "Оптом и в розницу")
        dbquery.push({ "$match": { "type": { "$in": [ formquery.type ] } }});
    
    if (formquery.sort && formquery.sort == "Самые дешевые") {
        dbquery.push({ "$sort": { "price": 1 }});
    } else if(formquery.sort && formquery.sort == "Самые дорогие") {
        dbquery.push({ "$sort": { "price": -1 }});
    } else if(formquery.sort && formquery.sort == "Самые первые") {
        dbquery.push({ "$sort": { "created": 1 }});
    } else {
        dbquery.push({ "$sort": { "created": -1 }}); //new products always go first
    }
    
    Product.aggregate(dbquery, function(err, allProducts){
        if(err) console.log(err);

        res.render("product/index", {products: allProducts, countries: countries, cities: cities, q: formquery, bazars: bazars});
    });
});
*/

module.exports = app;