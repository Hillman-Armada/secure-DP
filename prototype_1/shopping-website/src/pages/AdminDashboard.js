import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);  // Holds the product being edited
    const [editedName, setEditedName] = useState('');
    const [editedPrice, setEditedPrice] = useState('');
    const [editedDescription, setEditedDescription] = useState('');  // Added description
    const [editedCategory, setEditedCategory] = useState('');  // Added category
    const [editedImageUrl, setEditedImageUrl] = useState('');  // Added image URL
    const [showModal, setShowModal] = useState(false);  // Controls modal visibility
    const navigate = useNavigate();
    
    // Check if the user is an admin
    useEffect(() => {
        const isAdmin = localStorage.getItem('is_admin') === 'true';
        if (!isAdmin) {
            navigate('/');  // Redirect to home page if not admin
        }
    }, [navigate]);

    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem('token');  // Retrieve the token inside this useEffect
            if (!token) {
                navigate('/login');  // Redirect to login if token is missing
                return;
            }

            try {
                const response = await axios.get('http://127.0.0.1:5000/api/admin-dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                if (error.response && error.response.status === 403) {
                    alert('Access denied.');
                    navigate('/login');  // Redirect to login if token is invalid
                }
            }
        };

        fetchAdminData();  // Call the function inside the useEffect
    }, [navigate]);

    // Delete product
    const deleteProduct = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://127.0.0.1:5000/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh the product list after deletion
            setProducts(products.filter((product) => product.id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete the product.');
        }
    };

    // Edit product
    const editProduct = (product) => {
        setEditingProduct(product);  // Set the product being edited
        setEditedName(product.name);  // Pre-fill form with existing name
        setEditedPrice(product.price);  // Pre-fill form with existing price
        setEditedDescription(product.description);  // Pre-fill description
        setEditedCategory(product.category);  // Pre-fill category
        setEditedImageUrl(product.image_url);  // Pre-fill image URL
        setShowModal(true);  // Show the edit modal
    };

    // Submit the edited product
    const submitEdit = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://127.0.0.1:5000/api/products/${editingProduct.id}`, {
                name: editedName,
                price: editedPrice,
                description: editedDescription,  // Include description
                category: editedCategory,  // Include category
                image_url: editedImageUrl  // Include image URL
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update product list with the edited product
            setProducts(products.map((product) => (
                product.id === editingProduct.id ? { ...product, name: editedName, price: editedPrice, description: editedDescription, category: editedCategory, image_url: editedImageUrl } : product
            )));
            setEditingProduct(null);  // Clear the editing form
            setShowModal(false);  // Close the modal after saving changes
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update the product.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <h2 className="text-xl mb-4">Manage Products</h2>
            <ul>
                {products.map((product) => (
                    <li key={product.id} className="mb-4 border p-4 rounded">
                        <p className="font-bold">{product.name}</p>
                        <p>Price: ${product.price}</p>
                        <button onClick={() => editProduct(product)} className="bg-blue-500 text-white p-2 rounded mr-2">Edit</button>
                        <button onClick={() => deleteProduct(product.id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
                    </li>
                ))}
            </ul>

            {/* Modal for Editing Product */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/2">
                        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
                        <form onSubmit={(e) => { e.preventDefault(); submitEdit(); }}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Product Price</label>
                                <input
                                    type="number"
                                    value={editedPrice}
                                    onChange={(e) => setEditedPrice(e.target.value)}
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Description</label>
                                <textarea
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Category</label>
                                <input
                                    type="text"
                                    value={editedCategory}
                                    onChange={(e) => setEditedCategory(e.target.value)}
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Image URL</label>
                                <input
                                    type="text"
                                    value={editedImageUrl}
                                    onChange={(e) => setEditedImageUrl(e.target.value)}
                                    className="border p-2 w-full"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white p-2 rounded mr-2">Close</button>
                                <button type="submit" className="bg-green-500 text-white p-2 rounded">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
