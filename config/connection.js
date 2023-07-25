const mysql = require('mysql2');
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'employees'
    },
    console.log(`Connected to the employees_db database.`)
  );
  
  module.exports = db;
 