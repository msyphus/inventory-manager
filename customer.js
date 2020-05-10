var mysql = require("mysql");
var inquirer = require("inquirer");
var sqlpass = require("./assets/key");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3308,
    user: "root",
    password: sqlpass.password.pass,
    database: "inventory"
});

connection.connect(function(err) {
    if(err) throw err;
    console.log("Connected");
    connection.end();
});