import React from 'react'
import { AuthProvider } from './assets/AuthContext'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <AuthProvider>
  {/* <GoogleAuthHandler /> removed: now handled only in /auth/google/callback route */}
        <main className='dark:bg-black '>
          <Outlet />
        </main>
      </AuthProvider>
    </>
  )
}

export default App