import React from 'react';
import Collection from './components/Collection';
import AfterScan from './components/AfterScan';
import HomePage from './components/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collection/:token" element={<Collection />} />
            <Route path="/collection/:token/qr" element={<AfterScan />} />
          </Routes>
      </Router>
    )
}

export default App;
