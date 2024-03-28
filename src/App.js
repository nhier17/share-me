import React,{ useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from "./components/Login"
import Home from "./pages/Home";
import { fetchUser } from "./utils/fetchUser";


function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const User = fetchUser();

    if (!User) navigate('/login');
  }, [navigate]);

  return (
    <div className="App">
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
    </Routes>
    </div>
  );
}

export default App;
