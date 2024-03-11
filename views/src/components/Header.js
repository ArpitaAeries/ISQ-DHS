// components/Header.js
import React from 'react';

const Header = () => {
  const logoUrl = 'YourLogo.png';
  const username = 'MS'; 

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        backgroundColor: '#14458B', 
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* <img src={logoUrl} alt="Logo" style={{ height: '50px', width: '50px', marginRight: '10px' }} /> */}
        <span style={{ color: '#fff', fontWeight: '500',fontSize:'30px' }}>ISQ</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px', color: '#fff',fontWeight:'bold' }}>{username}</span>
     </div>
    </header>
  );
};

export default Header;
