import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import SearchPage from './components/pages/SearchPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ProfilePage from './components/pages/ProfilePage';
import ItemPage from './components/pages/ItemPage';
import InventoryAdjustmentPage from './components/pages/InventoryAdjustmentPage';
import AboutPage from './components/pages/AboutPage';
import ManagerFunctionsPage from './components/pages/ManagerFunctionsPage';
import AdminFunctionsPage from './components/pages/AdminFunctionsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the route for /homepage */}
        <Route path="/homepage" element={<HomePage />} />
        {/* Redirect when the user enters the root URL */}
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/item/:sku" element={<ItemPage />} />
        <Route path="/adjustment" element={<InventoryAdjustmentPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/manager" element={<ManagerFunctionsPage />} />
        <Route path="/admin" element={<AdminFunctionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
