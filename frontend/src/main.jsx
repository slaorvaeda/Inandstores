import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './Routes/Router.jsx'
import { DarkModeProvider } from './assets/DarkModeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <DarkModeProvider>
    <RouterProvider router={router} />
  </DarkModeProvider>
)
