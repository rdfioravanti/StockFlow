import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom'; // Import Link from react-router-dom
import Navbar from '../functional components/Navbar';
import NotLoggedInPage from '../functional components/NotLoggedInRender';
import { refreshTokens } from '../functions/RefreshFunction'; // Import the function

const SearchPage = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery === null || searchQuery === '') {
        setIsLoading(false);
        setError('No search query provided');
        return;
      }
  
      // Reset error state
      setError(null);
  
      try {
        // Retrieve JWT token from localStorage
        const jwtToken = localStorage.getItem('idToken');
  
        // Check if user is logged in
        if (!jwtToken) {
          setIsLoading(false);
          return;
        }
  
        // Fetch search results from the backend using the search query
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/search?search=${searchQuery}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}` // Include JWT token in the 'Authorization' header
          }
        });
  
        if (!response.ok) {
          // Check if response status is 401 (Unauthorized)
          if (response.status === 402) {
            // Call refreshTokens function
            try {
              await refreshTokens();
            } catch (refreshError) {
              throw new Error('Failed to refresh tokens');
            }
              // Retry fetching search results after token refresh
              const refreshedResponse = await fetch(`${process.env.REACT_APP_BACKEND_URI}/search?search=${searchQuery}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('idToken')}` // Include the refreshed JWT token
                }
              });
              if (!refreshedResponse.ok) {
                throw new Error('Failed to fetch search results after token refresh');
              }
              const refreshedData = await refreshedResponse.json();
              setSearchResults(refreshedData);
              return;
            }
          throw new Error('Failed to fetch search results');
        }
  
        const data = await response.json();
        setSearchResults(data); // Assuming data is an array of search results
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    // Call fetchSearchResults initially and whenever searchQuery changes
    fetchSearchResults();
  }, [searchQuery]); // Dependency array for useEffect  

  if (!localStorage.getItem('idToken')) {
    return <NotLoggedInPage />;
  }

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

  if (searchResults.length === 0) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {searchQuery ? (
            <div>No search results found</div>
          ) : (
            <div>No search query provided</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>Search Results for: {searchQuery}</h1>
        <table style={{ margin: 'auto' }}>
          <thead>
            <tr>
              <th style={{ paddingRight: '20px', textAlign: 'left' }}>SKU</th>
              <th style={{ paddingRight: '20px', textAlign: 'left' }}>Name</th>
              <th style={{ paddingRight: '20px', textAlign: 'left' }}>Description</th>
              <th style={{ paddingRight: '20px', textAlign: 'left' }}>Price</th>
              <th style={{ paddingRight: '20px', textAlign: 'left' }}>On Hand Quantity</th>
              <th style={{ textAlign: 'left' }}>Last Received Date</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {searchResults.map(result => (
              <tr key={result.sku}>
                <td>
                  <Link to={`/item/${result.sku}`}>{result.sku}</Link> {/* Make SKU clickable */}
                </td>
                <td>{result.name}</td>
                <td>{result.description}</td>
                <td>{result.price}</td>
                <td>{result.onHandQuantity}</td>
                <td>{result.lastReceivedDate}</td>
                {/* Render more columns as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchPage;
