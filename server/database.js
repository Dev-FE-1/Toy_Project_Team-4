import sqlite3 from "sqlite3"
// import sqlite3 from "better-sqlite3"
// export const sqlite3 = require("sqlite3").verbose()

// const database = new sqlite3.Database("/api/toyprj1_team4.db")
const databaseName = "toyprj1_team4"
const database = new sqlite3.Database(`${databaseName}.db`)

// try {
//   const sqlite3 = require("sqlite3").verbose()
//   console.log("sqlite3 is installed and loaded.")
// } catch (err) {
//   console.log("sqlite3 is not installed.")
// }

// const databaseName = "toyprj1_team4"
// const database = new sqlite3.Database(`./${databaseName}.db`)

database.serialize(() => {
  database.run(`
    CREATE TABLE IF NOT EXISTS userInfo (
	unique_id	INTEGER,
	email	TEXT NOT NULL,
	password	TEXT,
	name	TEXT,
	user_type	INTEGER,
	insert_dt	BLOB,
	update_dt	REAL,
	PRIMARY KEY("unique_id" AUTOINCREMENT)
);`)
})
export default database
// CREATE TABLE "userInfo" (
// 	"unique_id"	INTEGER,
// 	"email"	TEXT NOT NULL,
// 	"password"	TEXT,
// 	"name"	TEXT,
// 	"user_type"	INTEGER,
// 	"insert_dt"	BLOB,
// 	"update_dt"	REAL,
// 	PRIMARY KEY("unique_id" AUTOINCREMENT)
// );

// database.serialize(() => {
//   database.run(`
//     CREATE TABLE IF NOT EXISTS Users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       userId TEXT NOT NULL,
//       email TEXT NOT NULL,
//       password TEXT NOT NULL
//     )`)
// })

// export function getUserByEmail(email, callback) {
//   database.get(
//     `
//     SELECT * FROM Users WHERE email = ?
//   `,
//     [email],
//     (err, row) => {
//       if (err) {
//         return console.log(err.message)
//       }
//       callback(row)
//     }
//   )
// }

/*
// 회원정보 불러오기 (GET)
export function selectUserInfo() {
  let resultData = []

  // select 쿼리
  const selectUserInfoSQL = "SELECT * FROM userInfo"

  // 파라미터 삽입 및 쿼리 실행
  database.get(selectUserInfoSQL, "", (err, rows) => {
    if (err) {
      throw err
    }
    if (rows === undefined) {
      console.log("no data")
    }
    resultData = rows
  })

  // 실행 후 데이터베이스 연결 끊기
  database.close()

  return resultData
}

// 회원정보 추가하기 (POST)
function insertUserInfo() {
  // insert 쿼리
  const insertUserInfoSQL =
    "INSERT INTO userInfo (email, password, name, user_type, insert_dt, update_dt) VALUES (?, ?, ?, ?, ?, ?)"

  // 파라미터 받을 수 있게 처리
  const insertStmt = database.prepare(insertUserInfoSQL)

  // 파라미터 삽입 및 쿼리 실행
  insertStmt.run()

  // 실행 후 데이터베이스 연결 끊기
  database.close()
}
export default database
*/

/*
export function selectUserInfo() {
  return new Promise((resolve, reject) => {
    let resultData = []

    // select 쿼리
    const selectUserInfoSQL = "SELECT * FROM userInfo"

    // 파라미터 삽입 및 쿼리 실행
    database.all(selectUserInfoSQL, [], (err, rows) => {
      if (err) {
        reject(err)
        return
      }
      if (!rows || rows.length === 0) {
        console.log("no data")
        resolve([])
        return
      }
      resultData = rows
      resolve(resultData)
    })
  })
}

// 회원정보 추가하기 (POST)
function insertUserInfo(userInfo) {
  return new Promise((resolve, reject) => {
    // insert 쿼리
    const insertUserInfoSQL =
      "INSERT INTO userInfo (email, password, name, user_type, insert_dt, update_dt) VALUES (?, ?, ?, ?, ?, ?)"

    // 파라미터 받을 수 있게 처리
    const insertStmt = database.prepare(insertUserInfoSQL)

    // 파라미터 삽입 및 쿼리 실행
    insertStmt.run(
      userInfo.email,
      userInfo.password,
      userInfo.name,
      userInfo.user_type,
      userInfo.insert_dt,
      userInfo.update_dt,
      function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve(this.lastID)
      }
    )

    // 실행 후 데이터베이스 연결 끊기
    insertStmt.finalize()
  })
}

// 데이터베이스 닫기 함수 추가
function closeDatabase() {
  database.close((err) => {
    if (err) {
      console.error(err.message)
    }
    console.log("Database connection closed.")
  })
}

module.exports = { selectUserInfo, insertUserInfo, closeDatabase }
*/
