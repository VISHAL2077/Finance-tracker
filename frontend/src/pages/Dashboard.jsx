import React from 'react'
import Navbar from '../components/Navbar'

export default function Dashboard(){
  return (
    <div className="container">
      <Navbar />
      <h1>Welcome to Finance Tracker</h1>
      <p>Quick links: Transactions | Reports</p>
    </div>
  )
}
