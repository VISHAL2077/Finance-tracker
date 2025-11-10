const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')

const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', '..', 'database', 'finance.db')
function initDb(){
  const dir = path.dirname(DB_FILE)
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const db = new sqlite3.Database(DB_FILE)
  // Create tables if not exist
  db.serialize(()=>{
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      profile JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`)
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT,
      type TEXT,
      name TEXT,
      amount REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`)
    db.run(`CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      text TEXT,
      due TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`)
  })
  db.close()
  console.log('Database initialized at', DB_FILE)
}

if(require.main === module){
  initDb()
}

module.exports = { initDb, DB_FILE }
