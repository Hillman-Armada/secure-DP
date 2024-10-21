import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You need to log in first.');
                return;
            }
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/cart', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCartItems(response.data);
                calculateTotal(response.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                alert('Failed to fetch cart items.');
            }
        };
        fetchCartItems();
    }, []);

    const calculateTotal = (items) => {
        const total = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        setTotal(total);
    };

    const placeOrder = async () => {
        const token = localStorage.getItem('token');
        if (cartItems.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        try {
            await axios.post('http://127.0.0.1:5000/api/orders', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Order placed successfully!');
            setCartItems([]);  // Clear cart after placing the order
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
            {cartItems.length > 0 ? (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="border p-4 rounded mb-4">
                            <h2 className="text-xl font-bold">{item.product_name}</h2>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.price}</p>
                        </div>
                    ))}
                    <div className="mt-4 text-xl font-bold">Total: ${total}</div>
                    <button onClick={placeOrder} className="bg-green-500 text-white p-2 rounded mt-4">
                        Place Order
                    </button>
                </div>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default Cart;
