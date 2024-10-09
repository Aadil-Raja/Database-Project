// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import your components
import Home from './components/Home/Home.jsx';
import About from './components/About/About.jsx';
import Contact from './components/Contact/Contact.jsx';
import Register from './components/Register/Register.jsx';
import SP from './components/Register/SP/sp.jsx';
import Client from './components/Register/Client/client.jsx';
import Login from './components/Login/Login.jsx';
import ProtectedRoute from './components/utils/ProtectedRoute.jsx';
import ServicePage from './components/ServicePage/ServicePage.jsx';
import Final from './components/Requests/Final.jsx';
import Forgotpassword from './components/Forgotpassword/Forgotpassword.jsx';
import Resetpassword from './components/Resetpassword/Resetpassword.jsx';
import ServiceProviderForm from './components/ServiceProviderForm/ServiceProviderForm.jsx';
import Categories from './components/Categories/Categories.jsx';
import CategoryDetails from './components/Categories/CategoryDetails.jsx';
import Sp from './components/ServiceProviderTemporaryPage/sp1.jsx';
import SpProfile from './components/SpProfile/SpProfile.jsx';
import ServiceRequestForm from './components/Categories/ServiceRequestForm.jsx';
import AdminDashboard from './components/Admin/Admin.jsx';
import AddCategory from './components/Add-Category/Add-Category.jsx';
import SpChat from './components/Chat/ServiceProviderChat.jsx';
import ClientChat from './components/Chat/ClientChat.jsx';
import Notification from './components/Notification/NotifcationComponent.jsx';

function App() {
  return (
<>

      {/* If you want to include headers and footers, you can add them here */}
      {/* Since you don't want to include header/footer logic in App.jsx, we'll proceed without them */}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/resetPassword" element={<Resetpassword />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Client" element={<Client />} />
        <Route path="/SP" element={<SP />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ServicePage" element={<ServicePage />} />
        <Route path="/service-provider-form" element={<ServiceProviderForm />} />
        <Route path="/Requests" element={<Final />} />
        <Route path="/Admin" element={<AdminDashboard />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/Categories/:categoryId" element={<CategoryDetails />} />
        <Route path="/SPchat" element={<SpChat />} />
        <Route path="/Clientchat" element={<ClientChat />} />
        <Route path="/ClientDashBoard" element={<Notification />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/SpProfile" element={<SpProfile />} />
          <Route path="/Add-Category" element={<AddCategory />} />
          <Route
            path="/categories/:serviceId/servicerequestform"
            element={<ServiceRequestForm />}
          />
          <Route path="/ServiceProviderHome" element={<Sp />} />
        </Route>
      </Routes>

      {/* If you have common components like notifications, you can include them here */}
      </>
  );
}

export default App;
