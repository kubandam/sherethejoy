import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AfterScan = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePaths, setImagePaths] = useState([]);
  const { token } = useParams();

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/collection/${token}/photos`);
      if(response.data.message !== 'FILE_NOT_EXISTS')
        setImagePaths(response.data.filePaths.map(path => `${process.env.REACT_APP_API}${path}`));
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchPhotos(); 
  }, [fetchPhotos]); 

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  function getFileExtension(filename) {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  }

  const handleUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      const uniqueFilename = generateRandomString(16) + '_' + Date.now() + '.' + getFileExtension(selectedFiles[i].name);
      formData.append('files', selectedFiles[i], uniqueFilename);
    }
    try {
      const response = await axios.post(process.env.REACT_APP_API+`/collection/${token}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form/data',
        },
      });
      const uploadedFilePaths = response.data.filePaths.map(path => process.env.REACT_APP_API+`${path}`);
      setImagePaths(prevPaths => [...prevPaths, ...uploadedFilePaths]); 
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className='app'>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload</button>
      <div>
        {imagePaths.map((path, index) => (
          <img key={index} src={path} alt={`Uploaded Content ${index}`} style={{ width: 'auto', height: 'auto' }} />
        ))}
      </div>
    </div>
  );
};

export default AfterScan;
