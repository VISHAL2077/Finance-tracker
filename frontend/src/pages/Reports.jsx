import React, { useEffect, useState } from 'react'
import { collection, query, onSnapshot } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import { monthlySummary, annualSummary } from '../utils/reports'
import Charts from '../components/Charts'
import { addDoc, collection as addCollection } from 'firebase/firestore'

export default function Reports(){
  const { user } = useAuth()
  const [tx, setTx] = useState([])
  const [month, setMonth] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [startMonth, setStartMonth] = useState(1)

  useEffect(()=>{
    if(!user) return
    const q = query(collection(db, 'users', user.uid, 'transactions'))
    const unsub = onSnapshot(q, snap => setTx(snap.docs.map(d=>({ id:d.id, ...d.data() }))))
    return ()=>unsub()
  },[user])

  const ms = month ? monthlySummary(tx, year, Number(month)) : null
  const as = annualSummary(tx, year, Number(startMonth))

  return (
    <div className="container">
      <h2>Reports</h2>
      <section>
        <h3>Monthly</h3>
        <label>Year <input type="number" value={year} onChange={e=>setYear(Number(e.target.value))} /></label>
        <label>Month <input type="number" min="1" max="12" value={month} onChange={e=>setMonth(e.target.value)} /></label>
        {ms && (
          <div>
            <p>Income: {ms.income} Expense: {ms.expense} {ms.saving>=0?`Saving: ${ms.saving}`:`Overspending: ${-ms.saving}`}</p>
            <h4>Ledger by name</h4>
            <ul>
              {(() => {
                const map = {}
                ms.entries.forEach(e=>{ map[e.name] = map[e.name] || []; map[e.name].push(e) })
                return Object.entries(map).map(([name,arr]) => <li key={name}>{name} <ul>{arr.map(a=> <li key={a.id}>{new Date(a.date.seconds? a.date.seconds*1000 : a.date).toLocaleDateString()} — {a.type} — {a.amount}</li>)}</ul></li>)
              })()}
            </ul>
            <Charts summary={ms} />
          </div>
        )}
      </section>

      <section>
        <h3>Annual</h3>
        <label>Year <input type="number" value={year} onChange={e=>setYear(Number(e.target.value))} /></label>
        <label>Start Month <input type="number" min="1" max="12" value={startMonth} onChange={e=>setStartMonth(Number(e.target.value))} /></label>
        <div>
          <p>Total Income: {as.totalIncome} Total Expense: {as.totalExpense} {as.saving>=0?`Saving: ${as.saving}`:`Overspending: ${-as.saving}`}</p>
          <ul>
            {as.months.map(m=> <li key={m.month}>Month {m.month}: Income {m.income} Expense {m.expense} Saving {m.saving}</li>)}
          </ul>
        </div>
      </section>

      <section>
        <h3>Notes & Goals</h3>
        <Notes uid={user.uid} />
      </section>
    </div>
  )
}

function Notes({ uid }){
  const [notes, setNotes] = useState([])
  const [text, setText] = useState('')
  const [due, setDue] = useState('')

  useEffect(()=>{
    const q = query(collection(db, 'users', uid, 'notes'))
    const unsub = onSnapshot(q, snap=> setNotes(snap.docs.map(d=>({ id:d.id, ...d.data() }))))
    return ()=>unsub()
  }, [uid])

  async function addNote(){
    await addDoc(addCollection(db, 'users', uid, 'notes'), { text, due: new Date(due), createdAt: new Date() })
    setText(''); setDue('')
  }

  return (
    <div>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Goal / Note" />
      <input type="date" value={due} onChange={e=>setDue(e.target.value)} />
      <button onClick={addNote}>Add note</button>
      <ul>
        {notes.map(n=> <li key={n.id}>{n.text} — due {new Date(n.due.seconds? n.due.seconds*1000 : n.due).toLocaleDateString()}</li>)}
      </ul>
    </div>
  )
}
