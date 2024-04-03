import React, { useEffect, useState } from 'react';
import Navbar from '../functional components/Navbar';
import NotLoggedInPage from '../functional components/NotLoggedInPage'; // Importing the NotLoggedInPage component

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve JWT token from localStorage
        const jwtToken = localStorage.getItem('idToken');

        if (!jwtToken) {
          // If no JWT token found, set loading to false to render the NotLoggedInPage
          setIsLoading(false);
          return;
        }

        // Fetch user details from the backend
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/userById`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}` // Include JWT token in the 'Authorization' header
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUser(data); // Set the user data
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!localStorage.getItem('idToken')) {
    return <NotLoggedInPage />;
  }


  if (error) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '20px', color: 'red', fontSize: '1.2rem' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>Profile</h1>
        <div style={{ margin: 'auto', width: '50%' }}>
          <p><strong>Employee ID:</strong> {user.employeeId}</p>
          <p><strong>First Name:</strong> {user.firstName}</p>
          <p><strong>Last Name:</strong> {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Birth Date:</strong> {user.birthDate}</p>
          <p><strong>Privilege Level:</strong> {user.privilegeLevel}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
