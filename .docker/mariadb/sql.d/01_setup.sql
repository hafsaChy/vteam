-- Create databases if they do not exists
CREATE DATABASE IF NOT EXISTS eshop;

USE eshop;

CREATE TABLE product (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` CHAR(20) DEFAULT 'Product A' 
);

INSERT INTO product (`name`) VALUES
    ('Product A'),
    ('Product B'),
    ('Product C')
;