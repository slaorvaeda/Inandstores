import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import axios from 'axios'
import Login from './pages/login'
import Signup from './pages/signup'
import PrivateRoute from './assets/PrivateRoute'
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './assets/AuthContext'

function App() {
  return (
    <>
      <AuthProvider>
        <main>
          <Outlet />
        </main>
      </AuthProvider>
    </>

  )
}

export default App