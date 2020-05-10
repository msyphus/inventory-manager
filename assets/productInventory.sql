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
	VALUES('car', 'toys', 1.50, 130);

SELECT * FROM products