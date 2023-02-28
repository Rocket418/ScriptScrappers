var express = require("express");
const dePol = require('./dePol.json');
const ofiPol = require('./ofiPol.json');
const acraPol1 = require('./acraPol/tests2.json')
const acraPol2 =require( './acraPol/tests4.json')
const acraPol3 = require('./acraPol/tests6.json')


var app = express();


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/dePol", function(req, res) {
    res.status(200).json(dePol);
});

app.get("/ofiPol", function(req, res){
    res.status(200).json(ofiPol);
})

app.get("/acraPol1", function(req, res){
    res.status(200).json(acraPol1);
})

app.get("/acraPol2", function(req, res){
    res.status(200).json(acraPol2);
})

app.get("/acraPol3", function(req, res){
    res.status(200).json(acraPol3);
})
const PORT = 5005;

app.listen(PORT, () => console.log('listening on port', PORT))