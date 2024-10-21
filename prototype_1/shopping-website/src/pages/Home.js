import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/products')
            .then((response) => response.json())
            .then((data) => setProducts(data));
    }, []);

    return (
        <div>
            <Hero /> {/* Added the Hero section */}
            <Features /> {/* Added the Features section */}
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Our Products</h1>
                <div className="grid grid-cols-3 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
