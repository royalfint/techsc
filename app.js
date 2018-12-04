var express = require("express"),
    parser  = require("body-parser");

var app = express();
app.use(parser.urlencoded({ extended: false }));
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

app.post("/callmeback", function(req, res) {
   var phone = req.body.phone;
   
   if(!phone || phone.length < 8)
      return res.send(JSON.stringify({data: 0, message: "Введите правильный номер!"}));
   else
      res.send(JSON.stringify({data: 1}));
});

app.post("/getconsult", function(req, res) {
   var email = req.body.email;
   var name = req.body.name;
   
   if(!name || name.length < 3)
      return res.send(JSON.stringify({data: 0, message: "Сначала введите свое имя!"}));
      
   if(!email || !validateEmail(email))
      return res.send(JSON.stringify({data: 0, message: "Введите правильный e-mail!"}));
   
   res.send(JSON.stringify({data: 1}));
});

app.post("/getcom", function(req, res) {
   var email = req.body.email;
   var name = req.body.name;
   var desc = req.body.desc;
   
   if(!name || name.length < 3)
      return res.send(JSON.stringify({data: 0, message: "Сначала введите свое имя!"}));
      
   if(!email || !validateEmail(email))
      return res.send(JSON.stringify({data: 0, message: "Введите правильный e-mail!"}));
      
   if(!desc || desc.length < 3)
      return res.send(JSON.stringify({data: 0, message: "Введите описание проекта!"}));
   
   res.send(JSON.stringify({data: 1}));
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is up and running!");
});

/*** HELPER FUNCTIONS ****/
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}