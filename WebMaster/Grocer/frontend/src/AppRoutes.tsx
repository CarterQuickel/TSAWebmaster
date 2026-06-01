import React from 'react';
import PantryInventory from './components/PantryInventory';
import FavoritesList from './components/FavoritesList';
import StoreAPI from './components/StoreAPI';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const AppRoutes: React.FC = () => (
  <Router>
    <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <Link to="/">Pantry</Link>
      <Link to="/favorites">Favorites</Link>
      <Link to="/store">Store API</Link>
    </nav>
    <Routes>
      <Route path="/" element={<PantryInventory />} />
      <Route path="/favorites" element={<FavoritesList />} />
      <Route path="/store" element={<StoreAPI />} />
    </Routes>
  </Router>
);

export default AppRoutes;
