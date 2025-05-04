import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import axios from 'axios' 
import Login from './pages/login'
import Signup from './pages/signup'
import PrivateRoute from './assets/PrivateRoute'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <>
    <main>
      <Outlet />
    </main>
    </>
  
  )
}

export default App