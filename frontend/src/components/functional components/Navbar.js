import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const navbarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Adjusted to evenly space elements
    backgroundColor: '#555',
    padding: '10px',
  };

  const listContainerStyle = {
    display: 'flex',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    justifyContent: 'space-between', // Space buttons apart evenly
    width: '50%',
  };

  const listItemStyle = {
    margin: '0',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'white',
  };

  const searchContainerStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle = {
    marginRight: '10px',
  };

  const handleSearch = () => {
    // Navigate to the search page with the search query as a parameter
    navigate(`/search?search=${searchQuery}`);
  };

  return (
    <nav style={navbarStyle}>
      <ul style={listContainerStyle}>
        <li style={listItemStyle}><Link to="/homepage" style={linkStyle}>Home</Link></li>
        <li style={listItemStyle}><Link to="/profile" style={linkStyle}>Profile</Link></li>
      </ul>
      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="Search"
          style={inputStyle}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </nav>
  );
};

export default Navbar;
