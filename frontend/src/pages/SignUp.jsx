import React, { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '../services/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const occupations = ['Student','Engineer','Doctor','Lawyer','Teacher','Startup Owner','Other']

export default function SignUp(){
  const [form, setForm] = useState({name:'',age:'',gender:'',hobbies:'',interest:'',city:'',purpose:'personal',occupation:'',workplace:'',companyName:'',businessType:'',email:'',password:''})
  const nav = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    const { email, password, name } = form
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    await setDoc(doc(db, 'users', cred.user.uid), { ...form, uid: cred.user.uid, createdAt: new Date() })
    nav('/')
  }

  return (
    <div className="auth-card container">
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <input required placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input placeholder="Age" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} />
        <input placeholder="Gender" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})} />
        <input placeholder="Hobbies (comma)" value={form.hobbies} onChange={e=>setForm({...form,hobbies:e.target.value})} />
        <input placeholder="Interests (comma)" value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})} />
        <input placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} />
        <select value={form.purpose} onChange={e=>setForm({...form,purpose:e.target.value})}>
          <option value="personal">Personal</option>
          <option value="business">Business</option>
        </select>

        {form.purpose === 'personal' ? (
          <>
            <select value={form.occupation} onChange={e=>setForm({...form,occupation:e.target.value})}>
              <option value="">--occupation--</option>
              {occupations.map(o=> <option key={o} value={o}>{o}</option>)}
            </select>
            <input placeholder="Workplace (college/company)" value={form.workplace} onChange={e=>setForm({...form,workplace:e.target.value})} />
          </>
        ) : (
          <>
            <input placeholder="Company / Startup name" value={form.companyName} onChange={e=>setForm({...form,companyName:e.target.value})} />
            <input placeholder="Business type (edtech, textile...)" value={form.businessType} onChange={e=>setForm({...form,businessType:e.target.value})} />
          </>
        )}

        <input required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input required type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button type="submit">Create account</button>
      </form>
    </div>
  )
}
