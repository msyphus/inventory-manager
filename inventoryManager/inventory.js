var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");
var sqlpass = require("../assets/key");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3308,
    user: "root",
    password: sqlpass.password.pass,
    database: "inventory"
});

connection.connect(function(err) {
    if(err) throw err;
    userPrompt();
});

function userPrompt() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["View All Products", "View Low Inventory Items", "Add Inventory", "Add New Product"],
                name: "task"
            }
        ])
        .then(function(response) {
            switch(response.task) {
                case "View All Products":
                    viewProducts();
                    break;
                case "View Low Inventory Items":
                    lowInventory();
                    break;
                case "Add Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    addProduct();
            };
        });
};

function viewProducts() {
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
        renewPrompt();
    });
};

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 10",
    function(err, res) {
        if(err) throw err;
        var lowTable = new Table({
            head: ["Product Number".bold.brightYellow, "Product Name".bold.brightYellow, "Department".bold.brightYellow, "Price".bold.brightYellow, "Amount in Stock".bold.brightYellow],
            colWidths: [20, 20, 20, 20, 20]
        });
        console.log("----- Products With Low Inventory -----".bold.brightYellow);
        for(var j = 0; j < res.length; j++){
            lowTable.push(
                [res[j].sku, res[j].product_name, res[j].department, res[j].price, res[j].stock_quantity]
            );
        }
        console.log(lowTable.toString());
        setTimeout(renewPrompt, 500);
    });
};

function addInventory() {
    connection.query("SELECT sku, product_name FROM products",
    function(err, res) {
        if(err) throw err;
        var prodArr = [];
        for (var x = 0; x < res.length; x++) {
            prodArr.push(res[x].sku + " " + res[x].product_name);   
        };
        inquirer
        .prompt([
            {
                type: "checkbox",
                message: "Add inventory to which product?",
                choices: prodArr,
                name: "chooseProduct"
            },
            {
                type: "input",
                message: "How many units would you like to add?",
                name: "inputInventory"
            }
        ])
        .then(function(response) {
            connection.query("SELECT stock_quantity FROM products WHERE sku = ?",
            [response.chooseProduct],
            function(err, res) {
                if(err) throw err;
                connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: Number(response.inputInventory) + res[0].stock_quantity
                    },
                    {
                        sku: response.chooseProduct
                    }
                ],
                );
            });
            setTimeout(viewProducts, 2000);
        });
    });
};

function addProduct() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Please enter the product name.",
                name: "prodName"
            },
            {
                type: "checkbox",
                message: "Please select the department.",
                choices: ["Electronics", "Food", "Pet", "Toys"],
                name: "dept"
            },
            {
                type: "input",
                message: "What is the sales price of the product?",
                name: "salesPrice"
            },
            {
                type: "input",
                message: "How many units would you like to add?",
                name: "newUnits"
            }
        ])
        .then(function(response) {
            connection.query("INSERT INTO products SET ?",
            [
                {
                    product_name: response.prodName,
                    department: response.dept,
                    price: response.salesPrice,
                    stock_quantity: response.newUnits
                }
            ],
            function(err, res) {
                if(err) throw err;
            }
            );
            viewProducts();
        });
};

function renewPrompt() {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "Is there anything else you would like to do?",
                name: "continue",
                default: true
            }
        ])
        .then(function(response) {
            if(response.continue) {
                userPrompt();
            } else {
                console.log("Keep up the good work!")
                disconnect();
            }
        });
};

function disconnect() {
    connection.end();
};