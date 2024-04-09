import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const navbarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#555',
    padding: '10px',
  };

  const listContainerStyle = {
    display: 'flex',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    justifyContent: 'space-between', // Space buttons apart evenly
    width: '70%',
  };

  const listItemStyle = {
    margin: '0 10px',
    listStyle: 'none', // Remove bullet point
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
    marginRight: '5px', // Adjusted margin to move closer to button
  };

  const handleSearch = () => {
    navigate(`/search?search=${searchQuery}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('idToken');
    document.cookie = 'refreshToken=; Max-Age=0; Secure; SameSite=None';
    window.location.reload();
  };

  return (
    <nav style={navbarStyle}>
      <ul style={listContainerStyle}>
        <li style={listItemStyle}><Link to="/homepage" style={linkStyle}>Home</Link></li>
        <li style={listItemStyle}><Link to="/about" style={linkStyle}>About</Link></li>
        <li style={listItemStyle}><Link to="/adjustment" style={linkStyle}>Inventory Adjustment</Link></li>
        <li style={listItemStyle}><Link to="/profile" style={linkStyle}>Profile</Link></li>
        <li style={listItemStyle} onClick={handleLogout}><span style={linkStyle}>Log Out</span></li>
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
