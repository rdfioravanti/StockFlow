import React from 'react';
import Navbar from '../functional components/Navbar';
import { Link, Navigate } from 'react-router-dom';
import NotLoggedInPage from '../functional components/NotLoggedInRender'; // Importing the NotLoggedInPage component

const ManagerFunctionsPage = () => {
  const privilegeLevel = localStorage.getItem('privilegeLevel');

  if (!localStorage.getItem('idToken')) {
    return <NotLoggedInPage />;
  }

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
        <h2>Manager Functions</h2>
        <ul>
          <li><Link to="/adjustment">Inventory Adjustment</Link></li>
          <li><Link to="/userManagement">User Management</Link></li>
          {/* Add more manager functions as needed */}
        </ul>
      </div>
    </div>
  );
};

export default ManagerFunctionsPage;
