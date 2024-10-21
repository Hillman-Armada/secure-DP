import React, { useState } from 'react';
import axios from 'axios';
import gamingConsoleImage from '../assets/images/gaming_console.jpg';
import smartphoneImage from '../assets/images/smartphone.png';
import headphonesImage from '../assets/images/headphones.jpg';
import speakerImage from '../assets/images/speaker.png'

const ProductCard = ({ product }) => {
    const imageMapping = {
        "Gaming Console": gamingConsoleImage,
        "Smartphone": smartphoneImage,
        "Headphones": headphonesImage,
        "speaker": speakerImage
      };
    const [loading, setLoading] = useState(false);

    const addToCart = async () => {
        const token = localStorage.getItem('token');
    
        if (!token) {
            alert('You need to log in first.');
            return;
        }

        setLoading(true);
    
        try {
            await axios.post(
                'http://127.0.0.1:5000/api/cart',
                { product_id: product.id, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Product added to cart successfully!');
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Failed to add product to cart.');
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <div className="bg-white border p-6 rounded-lg shadow-lg transform transition hover:scale-105 duration-200">
            <img src={imageMapping[product.name]} alt={product.name} className="w-full h-48 object-cover rounded" />
            <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
            <p className="text-gray-700 mt-2">{product.description}</p>
            <p className="text-lg font-semibold text-blue-600 mt-2">${product.price}</p>
            <button 
                onClick={addToCart} 
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded mt-4 w-full"
                disabled={loading}
            >
                {loading ? 'Adding to Cart...' : 'Add to Cart'}
            </button>
        </div>
    );
};

export default ProductCard;
