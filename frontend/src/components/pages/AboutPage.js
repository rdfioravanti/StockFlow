import React from 'react';
import Navbar from '../functional components/Navbar';
import NotLoggedInPage from '../functional components/NotLoggedInRender'; // Importing the NotLoggedInPage component

const AboutPage = () => {
  if (!localStorage.getItem('idToken')) {
    return <NotLoggedInPage />;
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2 style={{textAlign: 'center'}}>About StockFlow</h2>
        <div style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto'}}>
          <p>
            StockFlow is an inventory management application developed by Richard Fioravanti.
            It was created using the SERN stack (SQL, Express, React, Node.js), with dynamic rendering from React and other technologies.
            The backend is powered by Node.js with Express, featuring custom middleware, and utilizes a PostgreSQL database.
          </p>
          <p>
            For more information, you can visit the application's GitHub repository:
            <a href="https://github.com/rdfioravanti/StockFlow" target="_blank" rel="noopener noreferrer">GitHub</a>
          </p>
          <p>
            Connect with Richard on LinkedIn:
            <a href="https://www.linkedin.com/in/richard-fioravanti-6801b4275/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
