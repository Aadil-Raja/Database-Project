import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Register from './components/Register/Register';
import Client from './components/Register/Client/client';
import Login from './components/Login/Login';
import Sp from './components/Register/SP/sp';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="Register" element={<Register />}/>
          <Route path="Client" element={<Client />}/>
          <Route path="Sp" element={<Sp />}/>
          <Route path="login" element={<Login />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
