import React, { useState } from 'react';

const LoginPage = () => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          employeeId: userID,
          password
         }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      // Store idToken in localStorage
      localStorage.setItem('idToken', data.idToken.encryptedToken);
      // Store privilegeLevel in localStorage
      localStorage.setItem('privilegeLevel', data.privilegeLevel);
      // Store refreshToken as a secure session cookie
      document.cookie = `refreshToken=${data.refreshToken.encryptedToken}; Secure; SameSite=None`;
      // Redirect to homepage
      window.location.href = '/homepage';
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#555', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            placeholder="UserID"
            style={{ borderRadius: '5px', padding: '8px', width: '300px', color: '#999' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ borderRadius: '5px', padding: '8px', width: '300px', color: '#999' }}
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ padding: '8px 16px', borderRadius: '5px', backgroundColor: '#fff', color: '#555', border: 'none' }}>Login</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default LoginPage;
