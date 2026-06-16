const mysql = require("mysql2");

const mysqlConnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

const connectMySQL = () => {
    mysqlConnection.connect((err) => {
        if (err) {
            console.log("MySQL connection failed");
            console.log(err);
            return;
        }

        console.log("MySQL connected");
    });
};

module.exports = {
    connectMySQL,
    mysqlConnection,
};