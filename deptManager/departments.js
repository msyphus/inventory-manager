var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");
var sqlpass = require("../key");

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
                choices: ["View Sales By Department", "Create New Department"],
                name: "task"
            }
        ])
        .then(function(response) {
            switch(response.task) {
                case "View Sales By Department":
                    viewDepts();
                    break;
                case "Create New Department":
                    newDept();
            };
        });
};

function viewDepts() {
    connection.query("SELECT * FROM departments",
    function(err,res) {
        if(err) throw err;
        var table = new Table({
            head: ["Department ID".bold.brightYellow, "Department Name".bold.brightYellow, "Overhead Costs".bold.brightYellow, "Product Sales".bold.brightYellow, "Profit/Loss".bold.brightYellow],
            colWidths: [20, 20, 20, 20, 20]
        });

        console.log("----- Sales By Department -----".bold.brightYellow);
        for(var i = 0; i < res.length; i++){
            table.push(
                [res[i].dept_id, res[i].dept_name, res[i].overhead, res[i].prod_sales, (res[i].prod_sales - res[i].overhead).toFixed(0)]
            );
        }
        console.log(table.toString());
        renewPrompt();
    })
};

function newDept() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Please enter the department name.",
                name: "deptName"
            },
            {
                type: "input",
                message: "What are the overhead costs?",
                name: "costs"
            }
        ])
        .then(function(response) {
            connection.query("INSERT INTO departments SET ?",
            [
                {
                    dept_name: response.deptName,
                    overhead: response.costs,
                    prod_sales: 0
                }
            ],
            );
            viewDepts();
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