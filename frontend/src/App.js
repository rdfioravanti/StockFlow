import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SearchPage from './components/pages/SearchPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ProfilePage from './components/pages/ProfilePage';
import ItemPage from './components/pages/ItemPage';
import HomePage from './components/pages/HomePage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the route for /homepage */}
        <Route path="/homepage" element={<HomePage />} />
        {/* Redirect only when the user enters the root URL */}
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/item/:sku" element={<ItemPage />} />
      </Routes>
    </Router>
  );
}

export default App;
