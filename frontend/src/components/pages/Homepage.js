import React from 'react';
import Navbar from '../functional components/Navbar'; 

const Homepage = () => {
  return (
    <div>
      <Navbar />
      <div className="main-content">
        <h1>StockFlow</h1>
        <p>This is a basic homepage. Customize it as per your needs!</p>
        {/* Add more content as needed */}
      </div>
    </div>
  );
};

export default Homepage;
