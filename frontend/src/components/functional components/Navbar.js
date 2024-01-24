import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navbarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

  return (
    <nav style={navbarStyle}>
      <ul style={listContainerStyle}>
        <li style={listItemStyle}><Link to="/homepage" style={linkStyle}>Home</Link></li>
        <li style={listItemStyle}><Link to="/about" style={linkStyle}>About</Link></li>
        <li style={listItemStyle}><Link to="/contact" style={linkStyle}>Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
