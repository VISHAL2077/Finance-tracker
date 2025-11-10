const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const { DB_FILE } = require('../utils/dbConnect')
const sqlite3 = require('sqlite3').verbose()
const SECRET = process.env.JWT_SECRET || 'dev_secret'

function getUserFromToken(token, cb){
  try{
    const payload = jwt.verify(token, SECRET)
    // payload contains { id, email }
    const db = new sqlite3.Database(process.env.DB_FILE || DB_FILE)
    db.get('SELECT id, name, email, profile FROM users WHERE id = ?', [payload.id], (err, row)=>{ db.close(); if(err) return cb(err); cb(null, row) })
  }catch(e){ cb(e) }
}

module.exports = (req, res, next) => {
  const auth = req.headers.authorization
  if(!auth) return res.status(401).json({ error: 'no token' })
  const token = auth.split(' ')[1]
  getUserFromToken(token, (err, user)=>{
    if(err || !user) return res.status(401).json({ error: 'invalid token' })
    req.user = user
    next()
  })
}
