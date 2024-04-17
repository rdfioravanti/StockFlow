import React from 'react';
import Navbar from '../functional components/Navbar';
import { Link } from 'react-router-dom';

const AdminFunctionsPage = () => {
  const privilegeLevel = localStorage.getItem('privilegeLevel');

  if (privilegeLevel !== 'admin') {
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
        <h2>Admin Functions Page</h2>
        {/* Add admin functions */}
      </div>
    </div>
  );
};

export default AdminFunctionsPage;
