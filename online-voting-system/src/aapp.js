import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import './aapp.js';

// Import Pages
import Home from './pages/Home';  // Home page
import LoginPage from './pages/LoginPage';  // Login page
import RegistrationForm from './pages/RegistrationForm';  // Registration form page
import ContactUs from './pages/ContactUs';  // Contact Us page
import Search from './pages/Search';  // Search page
import AdminLogin from './pages/AdminLogin';  // Admin login page
import NewDashboard from './pages/NewDashboard.js';  // New Dashboard page

// Home Page Content
function HomePage() {
    return (
        <div className="white-background">
            <h1>Election Commission</h1>
            <p>Explore the features and details here.</p>
            {/* Add content here */}
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />  {/* Home Route */}
                <Route path="/login" element={<LoginPage />} />  {/* Login Page */}
                <Route path="/new-registration" element={<RegistrationForm />} />  {/* Registration Form */}
                <Route path="/contact-us" element={<ContactUs />} />  {/* Contact Us */}
                <Route path="/search" element={<Search />} />  {/* Search Page */}
                <Route path="/admin-login" element={<AdminLogin />} />  {/* Admin Login */}
                <Route path="/new-dashboard" element={<NewDashboard />} />  {/* Dashboard Page */}
            </Routes>
        </Router>
    );
}

export default App;
