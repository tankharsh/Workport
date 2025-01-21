import React from 'react'
import Dashboard from './pages/sp_pages/Dashboard';
import './App.css'
import Layout from './pages/user_pages/Layout';
import { BrowserRouter as Router, Routes, Route, Link, createBrowserRouter } from "react-router-dom";
import Profile from './pages/sp_pages/Profile';
import Myshop from './pages/sp_pages/Myshop';
import Orders from './pages/sp_pages/Orders';
import Feedback from './pages/sp_pages/Feedback'
import UserLogin from './components/user_components/UserLogin';
import UserRegistrationFrom from './components/user_components/UserRegistrationFrom';
import SP_RegistrationForm from './components/sp_components/SP_RegistrationForm';


function App() {

  return (
    <>
    <Router>
      <Routes>
      <Route path="/" element={<Layout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/myshop' element={<Myshop/>}/>
        <Route path='/order' element={<Orders/>}/>
        <Route path='/feedback' element={<Feedback />}/>
        <Route path='/user-login' element={<UserLogin />} />
        <Route path='user-registrationFrom' element={<UserRegistrationFrom />} />
        <Route path='/sp-provider' element={<SP_RegistrationForm />} />
        
      </Routes>
    </Router>


    </>
  )
}

export default App
