import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../functional components/Navbar';
import NotLoggedInPage from '../functional components/NotLoggedInRender'; // Importing the NotLoggedInPage component

const ItemPage = () => {
  const { sku } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemBySku = async () => {
      try {
        // Retrieve JWT token from localStorage
        const jwtToken = localStorage.getItem('idToken');
    
        // Check if JWT token exists
        if (!jwtToken) {
          // If not, set loading to false to render NotLoggedInPage
          setIsLoading(false);
          return;
        }

        // Fetch item details from the backend using the SKU
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/item/${sku}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}` // Include JWT token in the 'Authorization' header
          }
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch item details');
        }
    
        const data = await response.json();
    
        // Check if data is an array and has at least one item
        if (Array.isArray(data) && data.length > 0) {
          setItem(data[0]); // Set the first item in state
        } else {
          throw new Error('No item found');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemBySku();
  }, [sku]);

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

  if (!item) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          No item found with SKU: {sku}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>Item Details</h1>
        <div style={{ margin: 'auto', width: '50%' }}>
          <p><strong>SKU:</strong> {item.sku}</p>
          <p><strong>Name:</strong> {item.name}</p>
          <p><strong>Description:</strong> {item.description}</p>
          <p><strong>Price:</strong> {item.price}</p>
          <p><strong>On Hand Quantity:</strong> {item.onHandQuantity}</p>
          <p><strong>Last Received Date:</strong> {item.lastReceivedDate}</p>
          {/* Add more fields as needed */}
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
