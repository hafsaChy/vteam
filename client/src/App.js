import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './pages/login';
import Navbar from './components/navbar';
import Footer from './components/footer';
import ScooterMap from './pages/scootermap';
import MapWithPositions from './pages/scootermap-Moawya';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<Login/>}/>
          <Route path="/login/*" element={<Login/>}/>
          <Route path="/scootermap" element={<ScooterMap />}/>
          <Route path="/postion" element={<MapWithPositions />}/>
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;