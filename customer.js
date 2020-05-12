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
                [res[i].sku, res[i].product_name, res[i].department, res[i].price.toFixed(2), res[i].stock_quantity]
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
        connection.query("SELECT stock_quantity, price, department FROM products WHERE sku = ?",
        [response.prodSku],
        function(err, res) {
            if(err) throw err;
            if(res[0].stock_quantity < response.quantity){
                console.log("I'm sorry, we only have "  + res[0].stock_quantity + " in stock.");
                renewPrompt();
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
            var subtotal = res[0].price * response.quantity;
            console.log("Your total will be $" + subtotal);
            var dept = res[0].department;
            connection.query("SELECT prod_sales FROM departments WHERE dept_name = ?",
            [dept],
            function(err, res) {
                if(err) throw err;
                connection.query("UPDATE departments SET ? WHERE ?",
                [
                    {
                        prod_sales: (subtotal + res[0].prod_sales).toFixed(0)
                    },
                    {
                        dept_name: dept
                    }
                ],
                );
            });
            renewPrompt();  
            }
        });
    });
};

function renewPrompt() {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "Is there anything else you would like to buy?",
                name: "continue",
                default: true
            }
        ])
        .then(function(response) {
            if(response.continue) {
                inStock();
                setTimeout(userPrompt, 1000);
            } else {
                console.log("Thank you for shopping with us.  Have a nice day!")
                disconnect();
            }
        });
};

function disconnect() {
    connection.end();
};