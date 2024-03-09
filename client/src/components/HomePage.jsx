import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/HomePage.css';
import gradient from '../assets/img/gradient.svg';

function HomePage() {
  const [isLogin, setIsLogin] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});  
  const navigate = useNavigate();


  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !collectionName) {
      newErrors.collectionName = 'Názov kolekcie je povinný';
    }
    if (!email) {
      newErrors.email = 'Email je povinný';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Zadajte platný email';
    }
    if (!password) {
      newErrors.password = 'Heslo je povinné';
    } else if (password.length < 6) {
      newErrors.password = 'Heslo musí mať aspoň 6 znakov';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const payload = isLogin ? { email, password } : { title: collectionName, email, password };
    const endpoint = isLogin ? 'http://192.168.1.30:8080/collection/verify' : 'http://192.168.1.30:8080/collection/new';
    
    try {
        const response = await axios.post(endpoint, payload);
        navigate(`/collection/${response.data.token}`);
    } catch (error) {
        console.log(error);
        setErrors({ ...errors, form: 'Zlý email alebo heslo.' }); // Updated to spread existing errors
    }
};


  return (
    <div className='page'>
      <img src={gradient} alt="gradient" className='gradient' />
      <div className='container'>
        <div className="left">
          <form onSubmit={handleSubmit} className={isLogin ? 'form login_page' :'form'}>
            <h2 className='mb-5'>{isLogin ? 'Prihlás sa do zbierky' : 'Vytvor si vlastnú zbierku fotografií'}</h2>
            
            {!isLogin && (
              <div className="form-floating mt-5">
                <input
                  type="text"
                  className={`form-control ${errors.collectionName ? 'is-invalid' : ''}`}
                  id="floatingInputName"
                  placeholder="Názov kolekcie"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                />
                <label htmlFor="floatingInputName">Názov kolekcie</label>
                {errors.collectionName && <div className="invalid-feedback">{errors.collectionName}</div>}
              </div>
            )}
            
            {!isLogin && <div className="line mt-4 mb-4"></div>}
            
            <div className="form-floating mb-3">
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="floatingInputEmail"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="floatingInputEmail">Email</label>
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="floatingInputPassword"
                placeholder="HESLO"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="floatingInputPassword">Heslo kolekcie</label>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              {!isLogin && <small>Heslo kolekcie je potrebne si zapamätať, bude priradené ku kolekcií a je potrebne pri prihlásovani.</small>}
            </div>
            {errors.form && <div className="invalid-feedback">{errors.form}</div>}
            <button type="submit" className="custom-button mt-4">{isLogin ? 'Prihlásiť sa' : 'Vytvoriť'}</button>
            <span className='login mt-3' onClick={toggleForm}>
              {isLogin ? 'vytvoriť účet' : 'prihlásiť sa'}
            </span>
          </form>
        </div>
        <div className="right">
        </div>
      </div>
    </div>
  );
}

export default HomePage;
