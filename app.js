var express = require("express");

var app = express();
app.set("view engine", "ejs");

app.get("/", function(req, res) {
   res.render("coming"); 
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is up and running!");
});