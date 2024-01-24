import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './components/pages/Homepage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the route for /homepage */}
        <Route path="/homepage" element={<Homepage />} />
        
        {/* Redirect only when the user enters the root URL */}
        <Route path="/" element={<Navigate to="/homepage" />} />
      </Routes>
    </Router>
  );
}

export default App;
