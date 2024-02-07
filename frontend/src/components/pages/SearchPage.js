import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../functional components/Navbar';

const SearchPage = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchQuery === null || searchQuery === '') {
      setIsLoading(false);
      setError('No search query provided');
      return;
    }

    // Reset error state
    setError(null);

    // Fetch search results from the backend using the search query
    fetch(`${process.env.REACT_APP_BACKEND_URI}/search?search=${searchQuery}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        return response.json();
      })
      .then(data => {
        setSearchResults(data); // Assuming data is an array of search results
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div>Error: {error}</div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div>
        <Navbar />
        {searchQuery ? (
          <div>No search results found</div>
        ) : (
          <div>No search query provided</div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <h1>Search Results for: {searchQuery}</h1>
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>On Hand Quantity</th>
            <th>Last Received Date</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {searchResults.map(result => (
            <tr key={result.sku}>
              <td>{result.sku}</td>
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
  );
};

export default SearchPage;
