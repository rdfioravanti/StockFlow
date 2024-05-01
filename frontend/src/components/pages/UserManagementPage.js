import React, { useState, useEffect } from 'react';
import Navbar from '../functional components/Navbar';
import NotLoggedInPage from '../functional components/NotLoggedInRender'; // Importing the NotLoggedInPage component
import { refreshTokens } from '../functions/RefreshFunction'; // Import the function to refresh tokens

const UserManagementPage = () => {
  const [privilegeLevel, setPrivilegeLevel] = useState('');
  const [privilegeLevelChoice, setPrivilegeLevelChoice] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check localStorage for privilegeLevel
    const storedPrivilegeLevel = localStorage.getItem('privilegeLevel');
    if (storedPrivilegeLevel) {
      setPrivilegeLevel(storedPrivilegeLevel);
    }
  }, []);

  const handleDropdownChange = (e) => {
    setPrivilegeLevelChoice(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('idToken');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/generateRegistrationKey`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ privilegeLevel })
      });

      if (response.status === 402) {
        // Refresh tokens if status is 402
        await refreshTokens();
        // Resubmit the request with refreshed token
        const refreshedToken = localStorage.getItem('idToken');
        const refreshedResponse = await fetch(`${process.env.REACT_APP_BACKEND_URI}/generateRegistrationKey`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${refreshedToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ privilegeLevelChoice })
        });

        const data = await refreshedResponse.json();
        setResponse(data.key);
        setError('');
      } else {
        const data = await response.json();
        setResponse(data.key);
        setError('');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse('');
      setError('Error occurred while fetching data');
    }
  };

  if (!localStorage.getItem('idToken')) {
    return <NotLoggedInPage />;
  }

  const renderOptions = () => {
    if (privilegeLevel === 'admin') {
      return (
        <>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </>
      );
    } else if (privilegeLevel === 'manager') {
      return (
        <>
          <option value="employee">Employee</option>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>User Management Page</h2>
        {/* Display drop down menu */}
        <select onChange={handleDropdownChange}>
          <option value="">Select Privilege Level</option>
          {renderOptions()}
        </select>
        {/* Submit button */}
        <button onClick={handleSubmit}>Submit</button>
        {/* Display response */}
        {error && <p>Error: {error}</p>}
        {response && <p>Key: {response}</p>}
        {/* Your user management page content goes here */}
      </div>
    </div>
  );
};

export default UserManagementPage;
