import React, { useEffect, useState } from 'react'
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import TransactionForm from '../components/TransactionForm'

export default function Transactions(){
  const { user } = useAuth()
  const [list, setList] = useState([])

  useEffect(() => {
    if(!user) return
    const q = query(collection(db, 'users', user.uid, 'transactions'), orderBy('date','desc'))
    const unsub = onSnapshot(q, snap => setList(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
    return () => unsub()
  }, [user])

  async function del(id){
    await deleteDoc(doc(db, 'users', user.uid, 'transactions', id))
  }

  return (
    <div className="container">
      <h2>Transactions</h2>
      <TransactionForm uid={user.uid} />
      <ul>
        {list.map(tx => (
          <li key={tx.id}>{new Date(tx.date.seconds ? tx.date.seconds*1000 : tx.date).toLocaleDateString()} — {tx.name} — {tx.type} — {tx.amount} <button onClick={()=>del(tx.id)}>Delete</button></li>
        ))}
      </ul>
    </div>
  )
}
