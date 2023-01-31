var express = require("express");
var dePol = require('./dePol.json');

var app = express();


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/dePol", function(req, res) {
    res.send(dePol);
});

app.listen(5000, () => console.log('listening on port 5000'))