import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white py-4 shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">Safe Shop</h1>
        <ul className="flex space-x-8 text-lg">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
