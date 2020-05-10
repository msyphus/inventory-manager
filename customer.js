var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");
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
    inStock();
    connection.end();
});

function inStock() {
    connection.query("SELECT * FROM products",
    function(err, res) {
        if(err) throw err;
        var table = new Table({
            head: ["Product Number".bold.brightYellow, "Product Name".bold.brightYellow, "Department".bold.brightYellow, "Price".bold.brightYellow, "Amount in Stock".bold.brightYellow],
            colWidths: [20, 20, 20, 20, 20]
        });

        console.log("----- Products in Stock -----".bold.brightYellow);
        for(var i = 0; i < res.length; i++){
            table.push(
                [res[i].sku, res[i].product_name, res[i].department, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
    });
};