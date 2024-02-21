import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './components/pages/Homepage';
import SearchPage from './components/pages/SearchPage';
import LoginPage from './components/pages/LoginPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the route for /homepage */}
        <Route path="/homepage" element={<Homepage />} />
        {/* Redirect only when the user enters the root URL */}
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/search" element = {<SearchPage />} />
        <Route path="/login" element = {<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
