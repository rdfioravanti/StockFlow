import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [registrationKey, setRegistrationKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          birthDate: birthdate.toISOString().split('T')[0], // Convert date to string in YYYY-MM-DD format
          password,
          registrationKey // Include registration key in the request JSON
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error);
      }
  
      // Save idToken in localStorage
      localStorage.setItem('idToken', data.idToken.encryptedToken);
  
      // Save refreshToken as a secure session cookie
      document.cookie = `refreshToken=${data.refreshToken.encryptedToken}; Secure; HttpOnly`;
  
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
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            style={{ borderRadius: '5px', padding: '8px', width: '300px', color: '#999' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            style={{ borderRadius: '5px', padding: '8px', width: '300px', color: '#999' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ borderRadius: '5px', padding: '8px', width: '300px', color: '#999' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder="Confirm Email"
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
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            style={{ borderRadius: '5px', padding: '8px', width: '300px', color: '#999' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Birthdate:</label>
          <Calendar
            onChange={setBirthdate}
            value={birthdate}
            maxDate={new Date()} // Restrict selection to past dates
            style={{ width: '300px', color: '#999' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={registrationKey}
            onChange={(e) => setRegistrationKey(e.target.value)}
            placeholder="Registration Key"
            style={{ borderRadius: '5px', padding: '8px', width: '300px', color: '#999' }}
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ padding: '8px 16px', borderRadius: '5px', backgroundColor: '#fff', color: '#555', border: 'none' }}>Register</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default RegisterPage;
