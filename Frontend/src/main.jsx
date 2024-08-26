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


const router = createBrowserRouter ([
  {
    path: '/',
    element: <Layout/>,
    children:[
      {
        path: "",
        element:<Home/>
      },
      {
        path: "About",
        element:<About/>
      },
      {
        path: "Contact",
        element:<Contact/>
      },
      {
        path: "Register",
        element:<Register/>,
        children:[
          
          
          ]
      },
      {
        path: "Client",
        element:<Client/>
      },
      {
        path: "SP",
        element:<SP/>
      },
      {
        path: "Login",
        element: <Login/>
      },
    ]

  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router ={router}/>
  </React.StrictMode>,
)
