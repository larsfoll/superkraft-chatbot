const mysql = require('mysql')

const dbConfig = {
  host: process.env.DOMAIN,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
}

// Database connection
const db = mysql.createConnection(dbConfig)

db.connect()

module.exports = db
