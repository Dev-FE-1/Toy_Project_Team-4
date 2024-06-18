import sqlite3 from 'sqlite3'

const databaseName = 'toyprj1'
const database = new sqlite3.Database(`./${databaseName}.db`)

database.serialize(() => {
  database.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    )`)
})

export function getUserByEmail(email, callback) {
  database.get(`
    SELECT * FROM Users WHERE email = ?
  `, [email], (err, row) => {
    if (err) {
      return console.log(err.message);
    }
    callback(row);
  });
}

export default database
