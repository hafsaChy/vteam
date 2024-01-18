-- Drop database if exists
DROP DATABASE IF EXISTS test_elcyckel;

-- create database
CREATE DATABASE test_elcyckel;

-- Use elcykel database
USE test_elcyckel;

-- use test_elcyckel database
USE test_elcyckel;

-- Drop existing user if it exists
DROP USER IF EXISTS 'test'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Create new user
CREATE USER IF NOT EXISTS 'test'@'%' IDENTIFIED BY 'P@ssw0rd';

-- Grant privileges
GRANT ALL PRIVILEGES ON * . * TO 'test'@'%' WITH GRANT OPTION;

-- Flush privileges again
FLUSH PRIVILEGES;

-- create users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    age INT,
    password VARCHAR(100),
    role VARCHAR(10) NOT NULL DEFAULT 'user',
    balance DECIMAL(10, 2) NOT NULL,
    current_balance DECIMAL(10, 2) NOT NULL
);

-- insert a test user
INSERT INTO users (username, email, age, password, balance, current_balance)
VALUES ('test_user', 'test@example.com', 25, 'test_password', 100.00, 100.00),
    ('test_user2', 'test2@example.com', 25, 'test_password2', 100.00, 100.00);

-- create cities table
CREATE TABLE cities (
    city_id INT AUTO_INCREMENT,
    city_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (city_id)
);

-- insert a test city
INSERT INTO cities (city_name) VALUES ('TestCity1'), ('TestCity2');

-- create stations table
CREATE TABLE stations (
    station_id INT AUTO_INCREMENT,
    station_name VARCHAR(50) NOT NULL,
    latitude DECIMAL(12, 9),
    longitude DECIMAL(12, 9),
    city_id INT,
    FOREIGN KEY (city_id) REFERENCES cities(city_id),
    PRIMARY KEY (station_id)
);

-- insert a test station
INSERT INTO stations (station_name, latitude, longitude, city_id)
VALUES ('TestStation', 12.345678, 23.456789, 1);

-- create scooters table
CREATE TABLE scooters (
    scooter_id INT AUTO_INCREMENT,
    latitude DECIMAL(12, 9),
    longitude DECIMAL(12, 9),
    serial_number VARCHAR(50) NOT NULL,
    battery_level INT,
    city_id INT,
    station_id INT,
    scooter_status VARCHAR(50),
    scooter_hire VARCHAR(50) DEFAULT 'Available',
    FOREIGN KEY (city_id) REFERENCES cities(city_id),
    FOREIGN KEY (station_id) REFERENCES stations(station_id),
    PRIMARY KEY (scooter_id)
);

-- insert a test scooter
INSERT INTO scooters (latitude, longitude, serial_number, battery_level, city_id, station_id, scooter_status)
VALUES (12.345678, 23.456789, 'TestScooter123', 80, 1, 1, 'Available');

-- create receipts table
CREATE TABLE receipts (
    receipt_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    scooter_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    start_time datetime,
    end_time datetime,
    distance_in_km decimal,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (scooter_id) REFERENCES scooters(scooter_id)
);

-- insert a test receipt
INSERT INTO receipts (user_id, scooter_id, amount, start_time, end_time, distance_in_km)
VALUES (1, 1, 10.00, NOW(), NOW(), 5.0);
