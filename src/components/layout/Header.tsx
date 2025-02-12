import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            E-commerce
          </Link>
          <div className="flex gap-4">
            <Link to="/products" className="hover:text-gray-600">
              Products
            </Link>
            <Link to="/cart" className="hover:text-gray-600">
              Cart
            </Link>
            <Link to="/orders" className="hover:text-gray-600">
              Orders
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
