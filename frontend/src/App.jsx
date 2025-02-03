import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';
import Loader from './admin/Loader';
import './App.css';
import Dashboard from './pages/sp_pages/Dashboard';
import Layout from './pages/user_pages/Layout';
import Profile from './pages/sp_pages/Profile';
import Myshop from './pages/sp_pages/Myshop';
import Orders from './pages/sp_pages/Orders';
import Feedback from './pages/sp_pages/Feedback';
import UserLogin from './components/user_components/UserLogin';
import UserRegistrationFrom from './components/user_components/UserRegistrationFrom';
import SP_RegistrationForm from './components/sp_components/SP_RegistrationForm';
import User_Dashboard from './pages/user_pages/User_Dashboard';
import AdminDashboard from './admin/AdminDashboard';
import AdminGetAllServiceProvider from './admin/AdminGetAllServiceProvider';
import AdminGetAllUser from './admin/AdminGetAllUser';
import SP_LoginForm from './components/sp_components/SP_LoginForm';
import Shop_Dashboard from './pages/user_pages/Shop_Dashboard';
import AdminAddCategory from './admin/AdminAddCategory';
import AdminAllCategory from './admin/AdminAllCategory';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import SPProtectedRoute from './pages/Protected';


function App() {
  const [loading, setLoading] = useState(false);

  // let timer; // Declare timer outside to avoid resetting
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        console.log("API Request Started"); // Debugging
        setLoading(true); // Show loader only when API starts
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        console.log("API Request Completed"); // Debugging
        setTimeout(() => setLoading(false), 1000); // Keep loader for at least 1s
        return response;
      },
      (error) => {
        setTimeout(() => setLoading(false), 1000);
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);



  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Work Port</title>
          <meta name="description" content="Description of my website" />
        </Helmet>

        <Router>
          <Loader show={loading} />
          <Routes>
            {/* users routes  */}
            <Route path="/" element={<Layout />} />
            <Route path='/user-login' element={<UserLogin />} />
            <Route path='/user-registrationFrom' element={<UserRegistrationFrom />} />
            <Route path='/User-Dashboard' element={<User_Dashboard />} />
            <Route path='/Shop-Dashboard' element={<Shop_Dashboard />} />

            {/* Service Provider routes  */}
            <Route path='/sp-provider' element={<SP_RegistrationForm />} />
            <Route path='/sp-provider-login' element={<SP_LoginForm />} />
            <Route element={<SPProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/myshop' element={<Myshop />} />
              <Route path='/order' element={<Orders />} />
              <Route path='/feedback' element={<Feedback />} />
            </Route>
            {/* Admin routes */}
            <Route path='/Admin-Dashboard' element={<AdminDashboard />} />
            <Route path='/Admin-Dashboard/all-serviceproviders' element={<AdminGetAllServiceProvider />} />
            <Route path='/Admin-Dashboard/all-users' element={<AdminGetAllUser />} />
            <Route path='/Admin-Dashboard/add-category' element={<AdminAddCategory />} />
            <Route path='/Admin-Dashboard/all-categories' element={<AdminAllCategory />} />

            <Route path="*" element={<Navigate to="/sp-provider-login" />} />
          </Routes>
        </Router>
      </HelmetProvider>
    </>
  );
}

export default App;
