import React, { useEffect, useState } from 'react';
import Navbar from '../functional components/Navbar';
import NotLoggedInPage from '../functional components/NotLoggedInRender'; // Importing the NotLoggedInPage component
import { refreshTokens } from '../functions/RefreshFunction'; // Import the function

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
          // Check if response status is 402 (Unauthorized)
          if (response.status === 402) {
            // Call refreshTokens function
            try {
              await refreshTokens();
            } catch (refreshError) {
              throw new Error('Failed to refresh tokens');
            }
            // Retry fetching user data after token refresh
            const refreshedResponse = await fetch(`${process.env.REACT_APP_BACKEND_URI}/userById`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('idToken')}` // Include the refreshed JWT token
              }
            });
            if (!refreshedResponse.ok) {
              throw new Error('Failed to fetch user details after token refresh');
            }
            const refreshedData = await refreshedResponse.json();
            setUser(refreshedData);
            return;
          }
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

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>Profile</h1>
        <div style={{ margin: 'auto', width: '50%' }}>
          <p><strong style={{fontSize: '1.2rem'}}>Employee ID:</strong> {user.employeeId}</p>
          <p><strong style={{fontSize: '1.2rem'}}>First Name:</strong> {user.firstName}</p>
          <p><strong style={{fontSize: '1.2rem'}}>Last Name:</strong> {user.lastName}</p>
          <p><strong style={{fontSize: '1.2rem'}}>Email:</strong> {user.email}</p>
          <p><strong style={{fontSize: '1.2rem'}}>Birth Date:</strong> {formatDate(user.birthDate)}</p>
          <p><strong style={{fontSize: '1.2rem'}}>Privilege Level:</strong> {user.privilegeLevel}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
