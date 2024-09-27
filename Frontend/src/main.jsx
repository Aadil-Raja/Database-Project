import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './components/Home/Home.jsx'
import About from './components/About/About.jsx'
import Contact from './components/Contact/Contact.jsx'
import Register from './components/Register/Register.jsx'
import SP from './components/Register/SP/sp.jsx'
import Client from './components/Register/Client/client.jsx'
import Login from './components/Login/Login.jsx'
import ProtectedRoute from './components/utils/ProtectedRoute.jsx';
import ServicePage from './components/ServicePage/ServicePage.jsx'
import Final from './components/Requests/Final.jsx'
import Forgotpassword from './components/Forgotpassword/Forgotpassword.jsx'

import Resetpassword from './components/Resetpassword/Resetpassword.jsx'
import ServiceProviderForm from './components/ServiceProviderForm/ServiceProviderForm.jsx'
import Categories from './components/Categories/Categories.jsx'
import CategoryDetails from './components/Categories/CategoryDetails.jsx'

import Sp from './components/ServiceProviderTemporaryPage/sp1.jsx'
import  SpProfile  from './components/SpProfile/SpProfile.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,

    children: [

      // Public Routes
      {
        path: '',
        element: <Home />
      },

      {
        path: 'About',
        element: <About />
      },
      {
        path: 'Contact',
        element: <Contact />
      },
      {
        path: 'resetPassword',
        element: <Resetpassword />
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
        path: 'ServicePage',
        element: <ServicePage />
      },
      {
        path: "service-provider-form",
        element: <ServiceProviderForm />
      },
      {
        path: 'Categories',
        element: <Categories />
      },
      {
        // Dynamic route for CategoryDetails
        path: 'Categories/:categoryId',  // Adds dynamic routing based on categoryId
        element: <CategoryDetails />
      },
      {
        
          
            element: <ProtectedRoute />, // Apply ProtectedRoute to secure these paths
            children: [
              {
                path: 'Requests',
                element: <Final/>
              },
             {
                     path : 'ServiceProviderHome',
                     element :<Sp/>
             },
             {
                   path : 'SpProfile',
                   element : <SpProfile/>
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