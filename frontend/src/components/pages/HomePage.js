import React from 'react';
import Navbar from '../functional components/Navbar'; 
import NotLoggedInPage from '../functional components/NotLoggedInRender'; // Importing the NotLoggedInPage component

const HomePage = () => {
  if (!localStorage.getItem('idToken')) {
    return <NotLoggedInPage />;
  }

  return (
    <div>
      <Navbar />
      <div className="main-content" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Welcome to StockFlow</h1>
        <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '20px', maxWidth: '800px', margin: '20px auto 0' }}>
          <p style={{ fontSize: '1.2rem' }}>StockFlow is an inventory management system designed to help you manage your products efficiently.</p>
          <p style={{ fontSize: '1.2rem' }}>Please use the search feature to find products based on their information.</p>
          <p style={{ fontSize: '1.2rem' }}>You can also navigate to your profile to view and edit your personal details.</p>
          <p style={{ fontSize: '1.2rem' }}>If you're a new user, you can register for an account to get started.</p>
          <p style={{ fontSize: '1.2rem' }}>Thank you for using StockFlow. We hope it helps streamline your inventory management process!</p>
          {/* Add more content as needed */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
