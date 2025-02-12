// src/App.tsx
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/layout/Layout';
import ProductList from './components/products/ProductList.js';

function App() {
    return (
        <Router>
            <CartProvider>
                <Layout>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/products" element={<ProductList />} />
                </Layout>
            </CartProvider>
        </Router>
    );
}

export default App;
