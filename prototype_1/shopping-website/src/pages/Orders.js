import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You need to log in first.');
                return;
            }
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/orders', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                alert('Failed to fetch orders.');
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Order History</h1>
            {orders.length > 0 ? (
                <div>
                    {orders.map((order) => (
                        <div key={order.id} className="border p-4 rounded mb-4">
                            <h2 className="text-xl font-bold">Order ID: {order.id}</h2>
                            <p>Total Amount: ${order.total_amount}</p>
                            <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have no past orders.</p>
            )}
        </div>
    );
};

export default Orders;
