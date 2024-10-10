// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Layout from './layout.jsx';
import Register from './components/Register/Register';
import Client from './components/Register/Client/client';
import Login from './components/Login/Login';
import Sp from './components/Register/SP/sp';
import Forgotpassword from "./components/Forgotpassword/Forgotpassword";
import Home from './components/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="client" element={<Client />} />
          <Route path="sp" element={<Sp />} />
          <Route path="login" element={<Login />} />
          <Route path="forgotpassword" element={<Forgotpassword />} />
          {/* Add other routes as necessary */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
