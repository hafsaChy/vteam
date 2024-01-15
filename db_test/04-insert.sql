SELECT 'Running 04-insert.sql';
--
DELETE FROM reciepts;
DELETE FROM users;
DELETE FROM cities;
DELETE FROM stations;
DELETE FROM scooters;

--
-- Insert into users
--
--
-- /docker-entrypoint-initdb.d/ innehåller alla sql,csv filer i containern
--
LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/users.csv'
INTO TABLE users
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
(username, email, age, password, role, balance, current_balance);
SELECT 'Insert completed';



--
-- Insert into cities.
--

LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/cities.csv'
INTO TABLE `cities`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
(city_name);

--
-- Insert into stations.
--
LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/stations.csv'
INTO TABLE `stations`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
(station_name, latitude, longitude, city_id);

--
-- Insert into scooters.
--
LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/scooters.csv'
INTO TABLE scooters
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
(latitude, longitude, serial_number, battery_level, city_id, station_id, scooter_status);


LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/receipts.csv'
INTO TABLE receipts
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
(user_id, scooter_id, amount, start_time, end_time, distance_in_km);