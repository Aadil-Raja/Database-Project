import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layout.jsx';
import Home from './components/Home/Home.jsx'
import About from './components/About/About.jsx'

import Register from './components/Register/Register.jsx'
import SP from './components/Register/SP/sp.jsx'
import Client from './components/Register/Client/client.jsx'
import Login from './components/Login/Login.jsx'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import Forgotpassword from './components/Forgotpassword/Forgotpassword.jsx'
import ResetPassword from './components/Resetpassword/Resetpassword.jsx'

import ClientChat from './components/Chat/ClientChat.jsx';
import SpChat from './components/Chat/SpChat.jsx';
import Categories from './components/Categories/Categories.jsx'
import Services from './components/Categories/Services.jsx';
import ServiceRequestForm from './components/Categories/ServiceRequestForm.jsx';
import Requests from './components/Requests/Requests.jsx';
import ServiceProviderForm from './components/ServiceProviderForm/ServiceProviderForm.jsx'
import SpProfile from './components/SpProfile/SpProfile.jsx';

import AddCategory from './components/About/Add-Category/Add-Category.jsx'
import ClientDashboard from './components/ClientDashboard/ClientDashboard.jsx'
import SpHistory from './components/Sp_History/SpHistory.jsx'
import SpBilling from './components/SpBilling/SpBilling.jsx'
import SpProtectedRoute from './components/utils/SpProtectedRoute.jsx'
import ClientProtectedRoute from './components/utils/ClientProtectedRoute.jsx'
import AdminLogin from './components/Admin/AdminLogin.jsx'
import AdminDashboard from './components/Admin/Admin.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,

    children: [
      {
        path : 'admin/dashboard',
        element :<AdminDashboard/>
       },
      
      // Public Routes
      {
        path: 'admin/login',
        element: <AdminLogin/>
      },
      {
              path : '/Home',
              element : <Home/>
      },
      {
        path : '/',
        element : <Home/>
},


      {
        path: 'About',
        element: <About />
      },
  
    
      {
        path: 'forgotpassword',
        element: <Forgotpassword />
      },
      {
        path: 'Login',
        element: <Login />
      },
      {
        path: 'Client',
        element: <Client />
      },
      {
        path: 'SP',
        element: <SP />
      },
      {
        path: 'Register',
        element: <Register />
      },
     {
        path:'resetpassword',
        element:<ResetPassword/>
     },
     {
      element :<ClientProtectedRoute/>
      ,children : [
        {
          path:'Clientchat',
          element:<ClientChat/>
     },
     {
      path :'Categories',
      element :<Categories/>
  },
  { 
    path :'Categories/:categoryId',
    element:<Services/>
},
{
  path: 'Categories/:categoryId/:serviceId/servicerequestform',
  element: <ServiceRequestForm />
},
{
  path :'ClientDashBoard',
  element :<ClientDashboard/>
},

  
{
  path: "Categories/:serviceId/servicerequestform",
  element :<ServiceRequestForm />
 },
      ]
     },
   
      {
        
          
        element: <SpProtectedRoute />, // Apply ProtectedRoute to secure these paths
        children: [
          {
            
              path:'Spchat',
              element:<SpChat/>
            ,
          },
           
     
     
     
       {
           path :'Requests',
           element : <Requests/>
       },
       {
             path:'ServiceProviderForm',
             element :<ServiceProviderForm/>
       },
       {
           path :'SpProfile',
           element : <SpProfile/>
       },
       
       ,
      {
      path :'RequestCategory',
      element :<AddCategory/>
      },
      
      {
        path :'SpHistory',
        element : <SpHistory/>
      },
      {
        path :'SpBilling',
        element :<SpBilling/>
      },
         

         
        ]
      
  }

    
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);