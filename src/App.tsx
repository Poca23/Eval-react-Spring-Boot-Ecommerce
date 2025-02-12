import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProductList from './components/products/ProductList';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products" element={<ProductList />} />
      </Routes>
    </Layout>
  );
};

export default App;
