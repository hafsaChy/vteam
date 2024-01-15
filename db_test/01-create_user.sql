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
