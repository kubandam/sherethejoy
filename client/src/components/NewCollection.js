import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function NewCollection() {
    // State for form fields
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://192.168.100.16:8080/collection/new', {
                title,
                email,
                password
            });
            setTitle('');
            setEmail('');
            setPassword('');
            navigate(`/collection/${response.data.token}`);
        } catch (error) {
            console.error('Error creating collection:', error);
        }
    };

    return (
        <div>
            <h2>Create Collection</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Collection Name:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Create Collection</button>
            </form>
        </div>
    );
}

export default NewCollection;
