import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

function Collection() {
  const { token } = useParams();
  const [collection, setCollection] = useState(null);
  const [error, setError] = useState('');
  const [qrValue, setQrValue] = useState('');
  
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API+`/collection/${token}`);
        setCollection(response.data.collection); 
        setError(''); 
        setQrValue(process.env.REACT_APP_QR+`/collection/${token}/qr`);
      } catch (error) {
        if (error.response) {
          setError(error.response.data.message);
        } else if (error.request) {
          setError('No response received from server');
        } else {
          setError('Error ' + error.message);
        }
        setCollection(null);
      }
    };

    fetchCollection();
  }, [token]); 

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!collection) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Collection Details</h2>
      <p>{collection.title}</p>
      {qrValue && <QRCodeSVG value={qrValue} />}
    </div>
  );
}

export default Collection;
