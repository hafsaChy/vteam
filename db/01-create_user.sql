-- Drop existing user if it exists
DROP USER IF EXISTS 'vteam_user'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Create new user
CREATE USER IF NOT EXISTS 'vteam_user'@'%' IDENTIFIED BY 'P@ssw0rd';

-- Grant privileges
GRANT ALL PRIVILEGES ON * . * TO 'vteam_user'@'%' WITH GRANT OPTION;

-- Flush privileges again
FLUSH PRIVILEGES;
