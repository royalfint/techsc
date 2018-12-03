var express = require("express");

var app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));

app.get("/", function(req, res) {
   res.render("home", {light: false, page: "Главная"}); 
});

app.get("/contacts", function(req, res) {
   res.render("contacts", {light: true, page: "Контакты"}); 
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is up and running!");
});