// components/Header.js
import React from 'react';
import logo from '../assets/blue-logo.svg'
const Header = () => {
  const logoUrl = 'YourLogo.png';
  const username = 'Guest'; 

  return (
    <header
      
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* <img src={logoUrl} alt="Logo" style={{ height: '50px', width: '50px', marginRight: '10px' }} /> */}
      
          <img src={logo} className='dh_logo'/>
       
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px',fontWeight:'bold' }}>{username}</span>
     </div>
    </header>
  );
};

export default Header;
