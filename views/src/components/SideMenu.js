import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideMenu = () => {
  const location = useLocation();

  const isActive = (pathname) => location.pathname === pathname;

  return (
    <aside className='sidebar'
     
    >
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '10px' }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                color: isActive('/') ? '#fff' : '#4dd7ce', 
                fontWeight: isActive('/') ? 'bold' : 'normal',
              }}
            >
              ISQ Questionnaire
            </Link>
            </li>
            <li style={{ padding: '10px' }}>
            <Link
              to="/modeldata"
              style={{
                textDecoration: 'none',
                color: isActive('/modeldata') ? '#fff' : '#4dd7ce', 
                fontWeight: isActive('/modeldata') ? 'bold' : 'normal',
              }}
            >
              Verified Questionnaire
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
