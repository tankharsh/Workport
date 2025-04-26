import { useEffect, useState } from 'react';
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
import Shop_Dashboard from './pages/user_pages/Shop_Dashboard';
import AdminAddCategory from './admin/AdminAddCategory';
import AdminAllCategory from './admin/AdminAllCategory';
import AdminChatbotFAQs from './admin/AdminChatbotFAQs';
import AdminContact from './admin/AdminContact';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import SPProtectedRoute from './pages/Protected';
import Cartpage from './components/user_components/Cartpage';
import { ToastContainer } from 'react-toastify';
import Addservice from './pages/sp_pages/Addservice';
import About from './pages/user_pages/About';
import UserRoutesProtection from './pages/UserRoutesProtection';
import Contact from './pages/user_pages/Contact';
import UserServicesView from './pages/user_pages/UserServicesView';
import VerificationPage from './components/common/VerificationPage';
import NewUserAuth from './components/user_components/NewUserAuth';
import NewSPAuth from './components/sp_components/NewSPAuth';
import ChatBot from './components/common/ChatBot';

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
          <title>Workport - Connect with Service Providers</title>
          <meta name="description" content="Find and connect with service providers in your area" />
        </Helmet>

        {/* toast  */}
        <ToastContainer />

        <Router>
          <ChatBot />
          <Loader show={loading} />
          <Routes>
            {/* users routes  */}
            <Route element={<UserRoutesProtection />}>
              <Route path="/" element={<Layout />} />
              <Route path='/user-login' element={<UserLogin />} />
              <Route path='/user-registrationFrom' element={<UserRegistrationFrom />} />
              <Route path='/User-Dashboard' element={<User_Dashboard />} />
              <Route path='//User-Serivices-history' element={<UserServicesView />} />
              <Route path='/Shop-Dashboard/:providerId' element={<Shop_Dashboard />} />
              <Route path='/shop/:shopName' element={<Shop_Dashboard />} />
              <Route path='/Aboutpage' element={<About />} />
              <Route path='/contactpage' element={<Contact />} />
              <Route path='/cart' element={<Cartpage />} />
            </Route>

            {/* Service Provider routes  */}
            <Route path='/sp-provider' element={<SP_RegistrationForm />} />
            <Route path='/sp-provider-login' element={<Navigate to="/sp-provider-login-new" replace />} />
            <Route path='/sp-provider-login-new' element={<NewSPAuth />} />
            <Route element={<SPProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/myshop' element={<Myshop />} />
              <Route path='/order' element={<Orders />} />
              <Route path='/addservice' element={<Addservice />} />
              <Route path='/feedback' element={<Feedback />} />
            </Route>

            {/* Email Verification Route */}
            <Route path='/verify-email' element={<VerificationPage />} />

            {/* Admin routes */}
            <Route path='/Admin-Dashboard' element={<AdminDashboard />} />
            <Route path='/Admin-Dashboard/all-serviceproviders' element={<AdminGetAllServiceProvider />} />
            <Route path='/Admin-Dashboard/all-users' element={<AdminGetAllUser />} />
            <Route path='/Admin-Dashboard/add-category' element={<AdminAddCategory />} />
            <Route path='/Admin-Dashboard/all-categories' element={<AdminAllCategory />} />
            <Route path='/Admin-Dashboard/chatbot-faqs' element={<AdminChatbotFAQs />} />
            <Route path='/Admin-Dashboard/contact-messages' element={<AdminContact />} />

            {/* New User Authentication routes */}
            <Route path='/user-login-new' element={<NewUserAuth />} />
            <Route path='/user-register-new' element={<NewUserAuth />} />

            {/* Universal routes  */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </HelmetProvider>
    </>
  );
}

export default App;



// muje ab asa karna he ki jab me contact button ke alava card me click karu to new page opne hona chahi a or usme all deatile hogi like provider ka pura information or all provides ki sari service dikhe gi mene statiac page bana diya he ab hame dynamically banana he a sab kuch

// - or jis bhi provider ko clcik karenge sirf uska hio data ana chahi he to me tumko files dunga tumhe jo jo need ho uske abhi me frountend ka code de raha hu jisme user_dashboard me providers ke shop ki list a rahi he usme clcik karte hi redirect hona chahi a