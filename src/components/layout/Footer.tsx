import React from 'react';
import '../../styles/index.css';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-gray-600">
          © 2023 E-commerce. CND - All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
