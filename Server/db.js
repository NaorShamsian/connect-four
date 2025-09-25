let mysql = require('mysql2');
let connParams = {
    host: "localhost",
    user:"root",
    password:"Naor2000",
    database:"my_db"
};

let conn = mysql.createConnection(connParams);
conn.connect((err) => {
    if(err) {
        console.log("we have an error while connecting to db: " + err);
        return;
    }
    console.log("Connected to db.");
});

module.exports = conn;