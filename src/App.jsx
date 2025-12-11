// export default App;
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthAPI } from '@/entities/all';

import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import Layout from '@/components/Layout';

// Pages
import Dashboard from '@/pages/Dashboard';
import Leads from '@/pages/Leads';
import Activities from '@/pages/Activities';
import LeadDetail from '@/pages/LeadDetail';
import { createPageUrl } from '@/lib/utils';
import { Toaster } from 'react-hot-toast'; // Import Toaster

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log('🚀 App component mounted');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('user_token'); // Use 'user_token' as per AuthAPI
      const user = localStorage.getItem('user_data');   // Use 'user_data' as per AuthAPI
      
      const authenticated = !!token && !!user; // Both token and user data must exist
      const userData = user ? JSON.parse(user) : null;
      
      console.log('🔐 Auth Check:', { authenticated, user: userData });
      
      // Removed demo auto-login to ensure actual authentication flow
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setIsAuthenticated(false);
      localStorage.removeItem('user_token'); // Clear invalid data
      localStorage.removeItem('user_data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading CRM...</p>
        </div>
      </div>
    );
  }

  console.log('🔐 Rendering App - Authenticated:', isAuthenticated);
  console.log('🔐 Current user:', AuthAPI.getCurrentUser());

  return (
    <>
      <Toaster /> {/* React Hot Toast Toaster */}
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to={createPageUrl('dashboard')} replace />
            ) : (
              <LoginForm onLoginSuccess={() => {
                console.log('✅ Login successful, updating auth state');
                checkAuth();
                navigate(createPageUrl('dashboard'), { replace: true });
              }} />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to={createPageUrl('dashboard')} replace />
            ) : (
              <RegisterForm onRegisterSuccess={() => {
                console.log('✅ Register successful, updating auth state');
                checkAuth();
                navigate(createPageUrl('dashboard'), { replace: true });
              }} />
            )
          } 
        />

        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout> {/* user prop is derived inside Layout from AuthAPI.getCurrentUser() */}
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/leads/:id" element={<LeadDetail />} />
                  <Route path="/activities" element={<Activities />} />
                  <Route path="/" element={<Navigate to={createPageUrl('dashboard')} replace />} />
                  <Route path="*" element={<Navigate to={createPageUrl('dashboard')} replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to={createPageUrl('login')} replace />
            )
          }
        />
      </Routes>  
    </>
  );
}

export default App;