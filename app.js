var express = require("express");

var app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));

app.get("/", function(req, res) {
   res.render("home", {light: false, page: "Главная"}); 
});

app.get("/portfolio", function(req, res) {
   res.render("portfolio", {light: true, page: "Портфолио"}); 
});

app.get("/blog", function(req, res) {
   res.render("blog", {light: true, page: "Блог"}); 
});

app.get("/about", function(req, res) {
   res.render("about", {light: true, page: "О Нас"}); 
});

app.get("/certificates", function(req, res) {
   res.render("certificates", {light: true, page: "Аккредитация"}); 
});

app.get("/contacts", function(req, res) {
   res.render("contacts", {light: true, page: "Контакты"}); 
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is up and running!");
});