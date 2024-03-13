import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideMenu = () => {
  const location = useLocation();

  const isActive = (pathname) => location.pathname === pathname;

  return (
    <aside
      style={{
        height: '100vh', 
        width: '200px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '10px' }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                color: isActive('/') ? '#14458B' : '#333', 
                fontWeight: isActive('/') ? 'bold' : 'normal',
              }}
            >
              ISQ Questionare
            </Link>
            </li>
            <li style={{ padding: '10px' }}>
            <Link
              to="/modeldata"
              style={{
                textDecoration: 'none',
                color: isActive('/modeldata') ? '#14458B' : '#333', 
                fontWeight: isActive('/modeldata') ? 'bold' : 'normal',
              }}
            >
              Verfied Questionare
            </Link>
          </li>
          {/* <li style={{ padding: '10px' }}>
            <Link
              to="/data"
              style={{
                textDecoration: 'none',
                color: isActive('/data') ? '#14458B' : '#333', 
                fontWeight: isActive('/data') ? 'bold' : 'normal',
              }}
            >
              Data
            </Link>
          </li> */}
        </ul>
      </nav>
    </aside>
  );
};

export default SideMenu;
