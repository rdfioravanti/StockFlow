import React, { useState } from 'react';
import Navbar from '../functional components/Navbar';
import { Link } from 'react-router-dom';
import { refreshTokens } from '../functions/RefreshFunction'; // Import the refreshTokens function
import NotLoggedInPage from '../functional components/NotLoggedInRender'; // Importing the NotLoggedInPage component

const InventoryAdjustmentPage = () => {
  const privilegeLevel = localStorage.getItem('privilegeLevel');
  const [sku, setSku] = useState('');
  const [item, setItem] = useState(null);
  const [adjustment, setAdjustment] = useState('');
  const [isAddition, setIsAddition] = useState(true);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling


  const handleAdjustmentSubmit = async () => {
    try {
      const jwtToken = localStorage.getItem('idToken');
  
      if (!jwtToken) {
        throw new Error('User not logged in');
      }
  
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/item/${sku}/adjust`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          quantity: adjustment,
          isAddition
        })
      });
  
      if (!response.ok) {
        // Check for 402 (Unauthorized) response
        if (response.status === 402) {
          // Attempt to refresh tokens
          try {
            await refreshTokens();
          } catch (refreshError) {
            throw new Error('Failed to refresh tokens');
          }
          // Retry adjustment after token refresh
          const refreshedResponse = await fetch(`${process.env.REACT_APP_BACKEND_URI}/item/${sku}/adjust`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('idToken')}`
            },
            body: JSON.stringify({
              quantity: adjustment,
              isAddition
            })
          });
          if (!refreshedResponse.ok) {
            throw new Error('Failed to adjust quantity after token refresh');
          }
          setMessage('Adjustment successful after token refresh');
          // Fetch updated item details after adjustment
          handleFetchItem();
          return;
        }
        throw new Error('Failed to adjust quantity');
      }
  
      setMessage('Adjustment successful');
      // Fetch updated item details after adjustment
      handleFetchItem();
    } catch (error) {
      console.error('Adjustment error:', error);
      setMessage('Adjustment failed');
    }
  };
  
  

  const handleFetchItem = async () => {
    try {
      const jwtToken = localStorage.getItem('idToken');
  
      if (!jwtToken) {
        setIsLoading(false);
        return;
      }
  
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/item/${sku}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        }
      });
  
      if (!response.ok) {
        // Check for 402 (Unauthorized) response
        if (response.status === 402) {
          // Attempt to refresh tokens
          try {
            await refreshTokens();
          } catch (refreshError) {
            throw new Error('Failed to refresh tokens');
          }
          // Retry fetching item data after token refresh
          const refreshedResponse = await fetch(`${process.env.REACT_APP_BACKEND_URI}/item/${sku}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('idToken')}`
            }
          });
          if (!refreshedResponse.ok) {
            throw new Error('Failed to fetch item details after token refresh');
          }
          const refreshedData = await refreshedResponse.json();
          setItem(refreshedData[0]);
          return;
        }
        throw new Error('Failed to fetch item details');
      }
  
      const data = await response.json();
  
      if (Array.isArray(data) && data.length > 0) {
        setItem(data[0]);
      } else {
        throw new Error('No item found');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
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

  if (privilegeLevel !== 'manager' && privilegeLevel !== 'admin') {
    return (
      <div>
        <h2>You do not have permission to view this page.</h2>
        <p><Link to="/homepage">Go back to Homepage</Link></p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>Inventory Adjustment Page</h2>
        <input
          type="text"
          placeholder="SKU Number"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
        <button onClick={handleFetchItem}>Fetch Item</button>
        
        {item && (
          <div>
            <p>Item SKU: {item.sku}</p>
            <p>Item Name: {item.name}</p>
            <p>Item Quantity: {item.onHandQuantity}</p>
            <input
              type="number"
              placeholder="Adjustment"
              value={adjustment}
              onChange={(e) => setAdjustment(e.target.value)}
            />
            <select value={isAddition} onChange={(e) => setIsAddition(e.target.value === 'true')}>
              <option value={true}>Add</option>
              <option value={false}>Subtract</option>
            </select>
            <button onClick={handleAdjustmentSubmit}>Submit Adjustment</button>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryAdjustmentPage;
