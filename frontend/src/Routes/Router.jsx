import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Login from '../pages/login'
import Signup from '../pages/signup'
import Dashboard from '../pages/Dashboard'
import Home from '../pages/Home'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: '/dashboard',
                element: <Dashboard />
            }
        ]
    }
]);

export default router