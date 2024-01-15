-- use database
USE test_elcyckel;

-- Drop tables
DROP TABLE IF EXISTS receipts;
DROP TABLE IF EXISTS scooters;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS users;

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

-- Create cities table
CREATE TABLE cities (
    city_id INT AUTO_INCREMENT,
    city_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (city_id)
);

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

-- create scooters table
CREATE TABLE scooters (
    scooter_id INT AUTO_INCREMENT,
    latitude DECIMAL(12, 9),
    longitude DECIMAL(12, 9),
    serial_number VARCHAR(50) NOT NULL,
    battery_level INT,
    city_id INT,
    station_id INT,
    scooter_status varchar(50),
    FOREIGN KEY (city_id) REFERENCES cities(city_id),
    FOREIGN KEY (station_id) REFERENCES stations(station_id),
    PRIMARY KEY (scooter_id)
);

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