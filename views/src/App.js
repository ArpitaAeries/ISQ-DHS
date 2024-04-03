import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import IsqQuestionare from './Screens/IsqQuestionare'
import './App.css'
import Data from './Screens/Data';
import SideMenu from './components/SideMenu';
import ModelData from './Screens/ModelData';
import Login from './Screens/Login';

const App = () => {
  return (
    <Router>
      <div>
        {/* <Header /> */}
        {/* <div style={{ display: 'flex' }}>  */}
          {/* <SideMenu /> */}
          <main>
            <Routes>
              <Route path="/" element={<IsqQuestionare />} />
              <Route path="/data" element={<Data />} />
              <Route path="/login" element={<Login />} />
              <Route path="/modeldata" element={<ModelData />} />
              {/* Add more routes for other pages */}
            </Routes>
          </main>
        </div>
      {/* </div>  */}
    </Router>
  );
};

export default App;
