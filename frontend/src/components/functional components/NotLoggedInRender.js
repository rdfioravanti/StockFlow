import React from 'react';

const NotLoggedInPage = () => {
  const redirectToLogin = () => {
    window.location.href = '/login';
  };

  const redirectToRegister = () => {
    window.location.href = '/register';
  };

  return (
    <div style={{ backgroundColor: '#333', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2>You are not logged in, please register or log in to use the application.</h2>
      <div style={{ marginTop: '20px' }}>
        <button onClick={redirectToLogin}>Login</button>
        <button onClick={redirectToRegister} style={{ marginLeft: '10px' }}>Register</button>
      </div>
    </div>
  );
};

export default NotLoggedInPage;
