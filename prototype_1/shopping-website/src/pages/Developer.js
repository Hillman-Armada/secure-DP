import React, { useEffect, useState } from 'react';

const Developer = () => {
    const [privacyDetails, setPrivacyDetails] = useState('');

    useEffect(() => {
        // Fetch details on how differential privacy is applied (from backend if implemented)
        fetch('http://127.0.0.1:5000/api/developer')
            .then((response) => response.json())
            .then((data) => setPrivacyDetails(data.message));
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Developer Page - Differential Privacy Explanation</h1>
            <p>
                {privacyDetails || "Here we explain how Differential Privacy is implemented to protect the user's data. Our approach adds noise to billing data queries to ensure privacy."}
            </p>
        </div>
    );
};

export default Developer;
