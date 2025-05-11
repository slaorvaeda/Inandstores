import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Login from '../pages/login'
import Signup from '../pages/signup'
import Dashboard from '../pages/Dashboard'
import Home from '../pages/Home'
import Pai from '../components/Pai'
import Sai from '../components/Sai'
import Notfound from '../pages/Notfound'
import ClientAdd from '../components/Clientadd'
import InvoiceList from '../components/InvoiceList'
import InvoiceView from '../components/InvoiceView'

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
                path: 'login',
                element: <Login />
            },
            {
                path: 'signup',
                element: <Signup />
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
                children: [
                    {
                        path: 'pai',
                        element: <Pai />
                    },
                    {
                        path: 'sai',
                        element: <Sai />
                    },
                    {
                        path: 'client',
                        element: <ClientAdd />
                    },
                    {
                        path: 'invoice',
                        element: <InvoiceList />
                    },{
                        path: 'invoice/:invoiceId',
                        element: <InvoiceView />
                    }
                ]
            }
        ],
    },
    {
        path: '*',
        element: <Notfound />
    }
]);

export default router;