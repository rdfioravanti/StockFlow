import React from 'react';
import Navbar from '../functional components/Navbar';
import NotLoggedInPage from '../functional components/NotLoggedInRender'; // Importing the NotLoggedInPage component

const UserManagementPage = () => {
if (!localStorage.getItem('idToken')) {
    return <NotLoggedInPage />;
}

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>User Management Page</h2>
        {/* Your user management page content goes here */}
      </div>
    </div>
  );
};

export default UserManagementPage;
