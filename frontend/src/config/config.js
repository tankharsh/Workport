// API URLs
export const API_URL = "http://localhost:4000";
export const API_ENDPOINTS = {
    // User endpoints
    USER_LOGIN: `${API_URL}/api/users/login`,
    USER_REGISTER: `${API_URL}/api/users/register`,
    USER_VERIFY_EMAIL: `${API_URL}/api/users/verify-email`,
    
    // Service Provider endpoints
    SP_LOGIN: `${API_URL}/api/sp/sp_login`,
    SP_REGISTER: `${API_URL}/api/sp/sp_register`,
    SP_VERIFY_EMAIL: `${API_URL}/api/sp/verify-email`,
    
    // Verification endpoints
    SEND_OTP: `${API_URL}/api/verification/send-otp`,
    VERIFY_OTP: `${API_URL}/api/verification/verify-otp`,
    
    // Categories
    CATEGORIES: `${API_URL}/api/categories`,
    
    // Services
    SERVICES: `${API_URL}/api/services`,
    
    // Inquiries
    INQUIRIES: `${API_URL}/api/inquiries`,
}; 