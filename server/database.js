import sqlite3 from "sqlite3"

const databaseName = "toyprj1_team4"
const database = new sqlite3.Database(`${databaseName}.db`)

database.serialize(() => {
  database.run("DROP TABLE IF EXISTS users")
  database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      pw TEXT,
      userType TEXT
)`)

  const stmt = database.prepare("INSERT INTO users (name, email, pw, userType) VALUES(?,?,?,?)")

  const users = [
    { name: "김수민", email: "tnalsdl2046@gmail.com", pw: "1234", userType: "student" },
    { name: "김도형", email: "ddhkim11@gmail.com", pw: "1234", userType: "student" },
    { name: "임효정", email: "gywjd@gmail.com", pw: "1234", userType: "student" },
    { name: "최원지", email: "wonjichoe@gmail.com", pw: "1234", userType: "student" },
    { name: "김수민 M", email: "tnalsdl20461@gmail.com", pw: "1111", userType: "manager" },
    { name: "김도형 M", email: "ddhkim111@gmail.com", pw: "1111", userType: "manager" },
    { name: "임효정 M", email: "gywjd1@gmail.com", pw: "1111", userType: "manager" },
    { name: "최원지 M", email: "wonjichoe1@gmail.com", pw: "1111", userType: "manager" },
  ]
  for (let user of users) {
    stmt.run(user.name, user.email, user.pw, user.userType)
  }
  stmt.finalize()

  database.each("SELECT rowid AS id, name, email, pw, userType FROM users", (err, row) => {
    console.log(`${row.id}:${row.name}, ${row.email}, ${row.pw},${row.userType}`)
  })
})
export default database
