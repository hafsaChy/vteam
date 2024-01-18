// test/test-db-config.js
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
module.exports = {
    host: 'mariadb',
    user: 'test',
    password: 'P@ssw0rd',
    database: 'test_elcyckel',
    connectionLimit: 200,
    connectTimeout: 30000,
};


// module.exports = {
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
//     connectionLimit: 50,
//     connectTimeout: 30000,
//     multipleStatements: true,
// };
