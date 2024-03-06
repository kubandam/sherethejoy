import React from 'react';
import NewCollection from './components/NewCollection';
import OpenCollection from './components/OpenCollection';
import Collection from './components/Collection';
import AfterScan from './components/AfterScan';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function App() {
    return (
        <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/collection/new">Create New Collection</Link>
              </li>
              <li>
                <Link to="/collection/open">Open Collection</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/collection/new" element={<NewCollection />} />
            <Route path="/collection/open" element={<OpenCollection />} />
            <Route path="/collection/:token" element={<Collection />} />
            <Route path="/collection/:token/qr" element={<AfterScan />} />
          </Routes>
        </div>
      </Router>
    )
}

export default App;
