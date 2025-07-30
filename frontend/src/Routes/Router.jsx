import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Login from '../pages/login'
import Signup from '../pages/signup'
import Dashboard from '../pages/Dashboard'
import Home from '../pages/Home'
import Notfound from '../pages/Notfound'
import ClientAdd from '../components/Client/Clientadd'
import InvoiceList from '../components/Invoice/InvoiceList'
import InvoiceView from '../components/Invoice/InvoiceView'
import ClientList from '../components/Client/ClientList'
import UserProfile from '../components/User/UserProfile'
import ItemForm from '../components/Items/ItemForm'
import ItemList from '../components/Items/ItemList'
import ClientUpdate from '../components/Client/ClientUpdate'
import InvoiceAdd from '../components/Invoice/InvoiceAdd'
import ItemEdit from '../components/Items/ItemEdit'
import VendorForm from '../components/Vendor/VendorForm'
import VendorList from '../components/Vendor/VendorList'
import VendorEdit from '../components/Vendor/VenderEdit'
import VendorView from '../components/Vendor/VenderView'
import PurchaseBillForm from '../components/PurchaseBill/PurchaseBillForm'
import PurchaseBillList from '../components/PurchaseBill/PurchaseBillList'
import PurchaseBillEdit from '../components/PurchaseBill/PurchaseBillEdit'
import PurchaseBillView from '../components/PurchaseBill/PurchaseBillView'
import DashboardContent from '../components/DashboardContent'
import InvoiceEdit from '../components/Invoice/InvoiceEdit'
import CreateOrder from '../components/Orders/CreateOrde'
import ViewOrder from '../components/Orders/OrderList'
import OrderList from '../components/Orders/OrderList'
import OrderView from '../components/Orders/OrderView'
import OrderEdit from '../components/Orders/OrderEdit'
import About from '../pages/About'
import Contact from '../pages/Contact'

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
                path: 'about',
                element: <About />
            },
            {
                path: 'contact',
                element: <Contact />
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
                children: [
                    {
                        path: '',
                        element: <DashboardContent />
                    },
                    {
                        path: 'invoice/add',
                        element: <InvoiceAdd />
                    },
                    {
                        path: 'client/add',
                        element: <ClientAdd />
                    },
                    {
                        path: 'invoice',
                        element: <InvoiceList />
                    }, 
                    {
                        path: 'item/list/edit/:id',
                        element: <ItemEdit />
                    }, 
                    {
                        path: 'invoice/:invoiceId',
                        element: <InvoiceView />
                    },
                    {
                        path: 'invoice/edit/:invoiceId',
                        element: <InvoiceEdit />
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
                    },{
                        path: 'vendor/add',
                        element: <VendorForm />
                    },{
                        path: 'vendor',
                        element: <VendorList />
                    },{
                        path: 'vendor/edit/:id',
                        element: <VendorEdit />
                    },{
                        path: 'vendor/view/:id',
                        element: <VendorView />
                    },{
                        path: 'purchasebill/add',
                        element: <PurchaseBillForm />
                    },{
                        path: 'purchasebill/',
                        element: <PurchaseBillList />
                    },{
                        path: 'purchasebill/edit/:id',
                        element: <PurchaseBillEdit />
                    },{
                        path: 'purchasebill/:id',
                        element: <PurchaseBillView />
                    },{
                        path: 'Order/add',
                        element: <CreateOrder />
                    },
                    {
                        path: 'Order',
                        element: <OrderList />
                    },{
                        path: 'Order/:id',
                        element: <OrderView />
                    },{
                        path: 'Order/edit/:id',
                        element: <OrderEdit />
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