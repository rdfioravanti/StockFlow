import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import SearchPage from './components/pages/SearchPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the route for /homepage */}
        <Route path="/homepage" element={<HomePage />} />
        {/* Redirect only when the user enters the root URL */}
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/search" element = {<SearchPage />} />
        <Route path="/login" element = {<LoginPage />} />
        <Route path="/register" element = {<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
