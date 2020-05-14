CREATE DATABASE inventory;

USE inventory;

CREATE TABLE products(
sku INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(100),
department VARCHAR(100),
price DECIMAL (6, 2),
stock_quantity INTEGER(5)
);

DROP TABLE products;

ALTER TABLE products AUTO_INCREMENT=102859;

INSERT INTO products(product_name, department, price, stock_quantity)
	VALUES('aquarium', 'pet', 54.99, 18);

SELECT * FROM products

UPDATE products
	SET stock_quantity = 0
    WHERE sku = 102859;

CREATE TABLE departments(
dept_id INT(2) ZEROFILL NOT NULL AUTO_INCREMENT PRIMARY KEY,
dept_name VARCHAR(100),
overhead INTEGER(7)
);

DROP TABLE departments

ALTER TABLE departments
	ADD prod_sales DECIMAL(9,2);
    
SELECT * FROM departments

INSERT INTO departments(dept_name, overhead, prod_sales)
 VALUES("toys", 200, 0);
    
    VALUES("electronics", 3000, 0);
	VALUES("food", 200, 0);
     VALUES("pet", 300, 0);
    

UPDATE departments
	SET overhead = 100000
    WHERE dept_id = 01;
    
