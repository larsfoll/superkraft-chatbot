const mysql = require('mysql')

const db = mysql.createConnection({
  host: process.env.DOMAIN,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
})

db.connect()

module.exports = db
