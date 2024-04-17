import React from 'react';
import Navbar from '../functional components/Navbar';
import { Link, Navigate } from 'react-router-dom';

const ManagerFunctionsPage = () => {
  const privilegeLevel = localStorage.getItem('privilegeLevel');

  if (privilegeLevel === 'admin') {
    return <Navigate to="/admin" />;
  }

  if (privilegeLevel !== 'manager') {
    return (
      <div>
        <h2>You do not have permission to view this page.</h2>
        <p><Link to="/homepage">Go back to Homepage</Link></p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>Manager Functions Page</h2>
        {/* Add manager functions */}
      </div>
    </div>
  );
};

export default ManagerFunctionsPage;
