import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { Checkout } from './pages/Checkout';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          {/* Admin Routes - No Layout */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Customer Routes - With Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/shop" element={<Layout><Shop /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;