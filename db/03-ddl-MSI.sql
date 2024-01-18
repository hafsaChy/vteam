-- USE elcyckel;

-- CREATE TABLE users (
--     user_id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(100) NOT NULL,
--     email VARCHAR(100) NOT NULL,
--     age INT,
--     password VARCHAR(100), -- check can be null or not,
-- 	role VARCHAR(10) NOT NULL DEFAULT 'user'
-- );

-- CREATE TABLE cities (
--     city_id INT AUTO_INCREMENT PRIMARY KEY,
--     city_name VARCHAR(50) NOT NULL
-- );

-- CREATE TABLE stations (
--     station_id INT AUTO_INCREMENT PRIMARY KEY,
--     station_name VARCHAR(50) NOT NULL,
--     latitude DECIMAL(12, 9), -- Example precision for latitude
--     longitude DECIMAL(12, 9), -- Example precision for longitude
--     city_id INT,
--     FOREIGN KEY (city_id) REFERENCES cities(city_id)
-- );

-- CREATE TABLE scooters (
--     scooter_id INT AUTO_INCREMENT PRIMARY KEY,
--     latitude DECIMAL(12, 9), -- Example precision for latitude
--     longitude DECIMAL(12, 9), -- Example precision for longitude
--     serial_number VARCHAR(50) NOT NULL,
--     battery_level INT,
--     city_id INT,
--     station_id INT,
--     scooter_status varchar(50),
--     FOREIGN KEY (city_id) REFERENCES cities(city_id),
--     FOREIGN KEY (station_id) REFERENCES stations(station_id)
-- );

-- -- CREATE TABLE receipts (
-- --     receipt_id INT AUTO_INCREMENT PRIMARY KEY,
-- -- 	user_id INT,
-- -- 	scooter_id INT,
-- --     amount DECIMAL(10, 2) NOT NULL,
-- --     start_time datetime,
-- --     end_time datetime,
-- --     distance_in_km decimal,
-- --     FOREIGN KEY (user_id) REFERENCES users(user_id),
-- --     FOREIGN KEY (scooter_id) REFERENCES scooters(scooter_id)
-- -- );