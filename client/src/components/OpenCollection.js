import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OpenCollection = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      const response = await axios.post('http://192.168.100.16:8080/collection/verify', { email, password });
      navigate(`/collection/${response.data.token}`);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Incorrect email or password.');
      } else {
        setError('An error occurred while trying to open the collection.');
      }
    }
  };

  return (
    <div>
      <h2>Open Collection</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Open Collection</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default OpenCollection;
