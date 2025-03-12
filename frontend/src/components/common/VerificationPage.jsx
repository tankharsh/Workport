import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL, API_ENDPOINTS } from '../../config/config';

const VerificationPage = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [isServiceProvider, setIsServiceProvider] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        // Get email and account type from URL params
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email');
        const typeParam = params.get('type');
        
        if (emailParam) {
            setEmail(emailParam);
        }
        
        if (typeParam === 'sp') {
            setIsServiceProvider(true);
        }
    }, [location]);
    
    // Countdown timer for resend button
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && resendDisabled) {
            setResendDisabled(false);
        }
    }, [countdown, resendDisabled]);
    
    const handleVerify = async () => {
        if (!otp) {
            setMessage('Please enter the OTP');
            return;
        }
        
        setIsLoading(true);
        
        try {
            // First verify the OTP
            const verifyResponse = await fetch(API_ENDPOINTS.VERIFY_OTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });
            
            const verifyData = await verifyResponse.json();
            
            if (!verifyResponse.ok) {
                setMessage(verifyData.message || 'Invalid OTP. Please try again.');
                setIsLoading(false);
                return;
            }
            
            // If OTP is valid, update the user/SP verification status
            const verifyEmailEndpoint = isServiceProvider 
                ? API_ENDPOINTS.SP_VERIFY_EMAIL
                : API_ENDPOINTS.USER_VERIFY_EMAIL;
            
            const emailVerifyResponse = await fetch(verifyEmailEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            
            const emailVerifyData = await emailVerifyResponse.json();
            
            if (emailVerifyResponse.ok) {
                setMessage('Email verified successfully! Redirecting to login...');
                
                // Store the token and user/SP data
                localStorage.setItem('token', emailVerifyData.token);
                
                if (isServiceProvider) {
                    localStorage.setItem('serviceProvider', JSON.stringify(emailVerifyData.serviceProvider));
                    setTimeout(() => navigate('/dashboard'), 2000);
                } else {
                    localStorage.setItem('user', JSON.stringify(emailVerifyData.user));
                    setTimeout(() => navigate('/'), 2000);
                }
            } else {
                setMessage(emailVerifyData.message || 'Error verifying email. Please try again.');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleResendOTP = async () => {
        if (!email) {
            setMessage('Email is required');
            return;
        }
        
        setIsLoading(true);
        setResendDisabled(true);
        setCountdown(60); // Disable resend for 60 seconds
        
        try {
            const response = await fetch(API_ENDPOINTS.SEND_OTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    isServiceProvider 
                }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setMessage('OTP sent successfully. Please check your email.');
            } else {
                setMessage(data.message || 'Failed to send OTP. Please try again.');
                setResendDisabled(false);
                setCountdown(0);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            setMessage('An error occurred. Please try again.');
            setResendDisabled(false);
            setCountdown(0);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Email Verification</h2>
                
                <div className="mb-6">
                    <p className="text-gray-600 text-center">
                        We've sent a verification code to <span className="font-semibold">{email}</span>
                    </p>
                </div>
                
                <div className="mb-6">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Verification Code
                    </label>
                    <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                    />
                </div>
                
                {message && (
                    <div className={`mb-4 p-3 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
                
                <div className="flex flex-col space-y-3">
                    <button
                        onClick={handleVerify}
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </button>
                    
                    <button
                        onClick={handleResendOTP}
                        disabled={isLoading || resendDisabled}
                        className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition duration-300 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        {resendDisabled 
                            ? `Resend OTP (${countdown}s)` 
                            : 'Resend Verification Code'}
                    </button>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>
                        Didn't receive the email? Check your spam folder or{' '}
                        <button 
                            onClick={() => navigate(isServiceProvider ? '/sp-provider-login' : '/login')}
                            className="text-blue-600 hover:underline"
                        >
                            try another email
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerificationPage; 