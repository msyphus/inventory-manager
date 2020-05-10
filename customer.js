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
    setTimeout(userPrompt, 100);
    // connection.end();
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

function userPrompt() {
    inquirer
    .prompt([
        {
            type: "input",
            message: "Please enter the Product Number for the item you would like to purchase.",
            name: "prodSku"
        },
        {
            type: "input",
            message: "How many would you like to purchase?",
            name: "quantity"
        }
    ])
    .then(function(response) {
        connection.query("SELECT stock_quantity FROM products WHERE sku = ?",
        [response.prodSku],
        function(err,res) {
            if(err) throw err;
            if(res[0].stock_quantity < response.quantity){
                console.log("I'm sorry, we only have "  + res[0].stock_quantity + " in stock.");
            } else {
                connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: res[0].stock_quantity - response.quantity
                },
                {
                    sku: response.prodSku
                }
            ],
            );
            }
        });
    });
};