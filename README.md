# Store Manager Simulation

### Demo
Since this is a back-end application, testing the app cannot be done without proper setup.  You can view a video demo [here.](https://youtu.be/aOX4Em-rMhk)

### General Information
This app simulates a store operation with interaction between customers, inventory clerks, and the store manager.  Each of these users has their own file (customer.js, inventory.js, and departments.js) stored in separate locations and connected to each other through a database on a server.  Changes made in one file affect data displayed in the other files.

#### Customer
The customer can view items in the store and purchase what they want.  If they try to purchase more units than what are available in inventory, they will get a message notifying them that the order cannot be filled.  When the order is placed, the total price is displayed.  The customer then chooses to continue shopping or to leave.

When purchases are made, the inventory is updated for the inventory clerk and customer to see.  The total sales price is updated in the store manager's department table as well.

#### Inventory Clerk
The inventory clerk can view all items in the store or view only items that have less than 10 units in stock.  Additionally, the clerk can add inventory to existing items or create new products.  Additions made by the inventory clerk are displayed to the customer.

#### Store Manager
The store manager can view details about each department that include overhead costs, total product sales, and profit/loss.  Product sales is updated every time a customer makes a purchase.  Profit/loss is calculated within the report rather than within the database.

Additionally, the store manager can add new departments.  When a new department is created, it updates the list of available departments for the inventory clerk to allow the clerk to add new products to it, which will then be displayed to the customer.

### Technical Information
This app was developed by Mark Syphus, 2020, using the following technologies:
* Node.js
* JavaScript
* MySQL
* WAMP

Node packages include mysql, inquirer, colors, and cli-table.
