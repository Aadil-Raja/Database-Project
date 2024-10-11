import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layout.jsx';
import Home from './components/Home/Home.jsx'
import About from './components/About/About.jsx'
import Contact from './components/Contact/Contact.jsx'
import Register from './components/Register/Register.jsx'
import SP from './components/Register/SP/sp.jsx'
import Client from './components/Register/Client/client.jsx'
import Login from './components/Login/Login.jsx'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import Forgotpassword from './components/Forgotpassword/Forgotpassword.jsx'


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
              path : '/Home',
              element : <Home/>
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
     
     


    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);