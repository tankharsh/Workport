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
import User_Dashboard from './pages/user_pages/User_Dashboard';
import AdminDashboard from './admin/AdminDashboard';
import AdminGetAllServiceProvider from './admin/AdminGetAllServiceProvider';
import AdminGetAllUser from './admin/AdminGetAllUser';


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/myshop' element={<Myshop />} />
          <Route path='/order' element={<Orders />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='/user-login' element={<UserLogin />} />
          <Route path='user-registrationFrom' element={<UserRegistrationFrom />} />
          <Route path='/sp-provider' element={<SP_RegistrationForm />} />
          <Route path='/User-Dashboard' element={<User_Dashboard />} />



          {/* Admin routes */}
          <Route path='/Admin-Dashboard' element={<AdminDashboard />} />
          <Route path='/Admin-Dashboard/all-serviceproviders' element={<AdminGetAllServiceProvider />} />
          <Route path='/Admin-Dashboard/all-users' element={<AdminGetAllUser />} />
          {/* <Route path='/Admin-Dashboard' element={<AdminDashboard />} /> */}


        </Routes>
      </Router>


    </>
  )
}

export default App
