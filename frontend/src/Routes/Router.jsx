import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Login from '../pages/login'
import Signup from '../pages/signup'
import Dashboard from '../pages/Dashboard'
import Home from '../pages/Home'
import Pai from '../components/Pai'
import Sai from '../components/Sai'
import Notfound from '../pages/Notfound'
import ClientAdd from '../components/Client/Clientadd'
import InvoiceList from '../components/Invoice/InvoiceList'
import InvoiceView from '../components/Invoice/InvoiceView'
import ClientList from '../components/Client/ClientList'
import UserProfile from '../components/User/UserProfile'
import ItemForm from '../components/Items/ItemForm'
import ItemList from '../components/Items/ItemList'
import ClientUpdate from '../components/Client/ClientUpdate'

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
                        path: 'client/add',
                        element: <ClientAdd />
                    },
                    {
                        path: 'invoice',
                        element: <InvoiceList />
                    }, {
                        path: 'invoice/:invoiceId',
                        element: <InvoiceView />
                    },
                    {
                        path: 'client',
                        element: <ClientList />
                    },
                    {
                        path: 'user/profile',
                        element: <UserProfile />
                    }, {
                        path: 'item/list/newitem',
                        element: <ItemForm />
                    }, {
                        path: 'item/newitem',
                        element: <ItemForm />
                        // test time
                    }
                    , {
                        path: 'item/list',
                        element: <ItemList />
                    }, {
                        path: 'client/edit-client/:id',
                        element: <ClientUpdate />
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