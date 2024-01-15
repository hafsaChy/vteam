-- DROP PROCEDURE IF EXISTS add_admin;
-- DROP PROCEDURE IF EXISTS add_user;
-- DROP PROCEDURE IF EXISTS add_city;
-- DROP PROCEDURE IF EXISTS add_scooter;
-- DROP PROCEDURE IF EXISTS add_receipt;
-- DROP PROCEDURE IF EXISTS delete_admin;
-- DROP PROCEDURE IF EXISTS delete_user;
-- DROP PROCEDURE IF EXISTS delete_city;
-- DROP PROCEDURE IF EXISTS delete_scooter;
-- DROP PROCEDURE IF EXISTS delete_receipt;
-- DROP VIEW IF EXISTS v_user_ride_history;


-- DELIMITER ;;

-- CREATE PROCEDURE add_admin(IN in_username VARCHAR(50), IN in_password VARCHAR(100))
-- BEGIN
--     INSERT INTO admins (username, password) VALUES (in_username, in_password);
-- END;

-- CREATE PROCEDURE add_user(IN in_username VARCHAR(100), IN in_email VARCHAR(100), IN in_password VARCHAR(100))
-- BEGIN
--     INSERT INTO users (username, email, password) VALUES (in_username, in_email, in_password);
-- END;

-- CREATE PROCEDURE add_city(IN in_city_name VARCHAR(50))
-- BEGIN
--     INSERT INTO cities (city_name) VALUES (in_city_name);
-- END;

-- CREATE PROCEDURE add_scooter(IN in_latitude DECIMAL(10, 6), IN in_longitude DECIMAL(10, 6), IN in_serial_number VARCHAR(50), 
--                             IN in_battery_level INT, IN in_city_id INT, IN in_scooter_status VARCHAR(50))
-- BEGIN
--     INSERT INTO scooters (latitude, longitude, serial_number, battery_level, city_id, scooter_status)
--     VALUES (in_latitude, in_longitude, in_serial_number, in_battery_level, in_city_id, in_scooter_status);
-- END;

-- CREATE PROCEDURE add_receipt(IN in_user_id INT, IN in_scooter_id INT, IN in_amount DECIMAL(10, 2), 
--                             IN in_start_time DATETIME, IN in_end_time DATETIME, IN in_distance_in_km DECIMAL)
-- BEGIN
--     INSERT INTO receipts (user_id, scooter_id, amount, start_time, end_time, distance_in_km)
--     VALUES (in_user_id, in_scooter_id, in_amount, in_start_time, in_end_time, in_distance_in_km);
-- END;

-- CREATE PROCEDURE delete_admin(IN in_admin_id INT)
-- BEGIN
--     DELETE FROM admins WHERE admin_id = in_admin_id;
-- END;;

-- CREATE PROCEDURE delete_user(IN in_user_id INT)
-- BEGIN
--     DELETE FROM users WHERE user_id = in_user_id;
-- END;;

-- CREATE PROCEDURE delete_city(IN in_city_id INT)
-- BEGIN
--     DELETE FROM cities WHERE city_id = in_city_id;
-- END;

-- CREATE PROCEDURE delete_scooter(IN in_scooter_id INT)
-- BEGIN
--     DELETE FROM scooters WHERE scooter_id = in_scooter_id;
-- END;;

-- CREATE PROCEDURE delete_receipt(IN in_receipt_id INT)
-- BEGIN
--     DELETE FROM receipts WHERE receipt_id = in_receipt_id;
-- END;;

-- CREATE VIEW v_user_ride_history AS
-- SELECT
--     R.receipt_id,
--     R.user_id,
--     R.scooter_id,
--     S.serial_number,
--     R.amount,
--     R.start_time,
--     R.end_time,
--     R.distance_in_km,
--     C.city_name AS start_city,
--     S.latitude AS start_latitude,
--     S.longitude AS start_longitude,
--     S.city_id AS start_city_id,  -- Use the correct alias 'S' for the start city
--     C2.city_name AS end_city_name,
--     R.end_time AS end_time,
--     S.latitude AS end_latitude,
--     S.longitude AS end_longitude
-- FROM
--     receipts R
-- JOIN scooters S ON R.scooter_id = S.scooter_id
-- JOIN cities C ON S.city_id = C.city_id
-- LEFT JOIN cities C2 ON S.city_id = C2.city_id;  -- Corrected alias to 'S'

-- DELIMITER ;;