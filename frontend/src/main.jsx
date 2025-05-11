import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import router from './Routes/Router.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
   
    // <Provider  store={store}>
    <RouterProvider router={router} />
    // </Provider >


)
