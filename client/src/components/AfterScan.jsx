import React, { useRef, useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import camera1 from '../assets/img/camera1.svg';
import camera2 from '../assets/img/camera2.svg';
import camera3 from '../assets/img/camera3.svg';
import camera4 from '../assets/img/camera4.svg';
import camera5 from '../assets/img/camera5.svg';
import camera6 from '../assets/img/camera6.svg';

const AfterScan = () => {
  require("../assets/css/AfterScan.css"); // css

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePaths, setImagePaths] = useState([]);
  const [cameraStyle, setCameraStyle] = useState(camera1);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const { token } = useParams();
  const fileInputRef = useRef(null);

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

  
  useEffect(() => {
    const backgrounds = ['#FFEEA699','#ADD2BC99','#6AA4DB99','#468BC799','#FFBCCE99','#F9F69B99'];
    const textColors = ['#fccc00', '#51946c', '#25639d', '#25537b', '#fe0a4c', '#e4dd0d'];
    const cameras = [camera1, camera2, camera3, camera4, camera5, camera6];
    const randomValue = Math.floor(Math.random() * cameras.length);
    setCameraStyle(cameras[randomValue]);
    setBackgroundColor(backgrounds[randomValue]);
    setTextColor(textColors[randomValue]);
  }, []); // Empty dependency array to run only on initial render


  const handleFileChange = async (event) => {
    setSelectedFiles(event.target.files);
    
    // Automatically start uploading after files are selected
    const files = event.target.files;
    if (files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        const uniqueFilename = generateRandomString(16) + '_' + Date.now() + '.' + getFileExtension(files[i].name);
        formData.append('files', files[i], uniqueFilename);
      }
  
      try {
        const response = await axios.post(`${process.env.REACT_APP_API}/collection/${token}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form/data',
          },
        });
        const uploadedFilePaths = response.data.filePaths.map(path => `${process.env.REACT_APP_API}${path}`);
        setImagePaths(prevPaths => [...prevPaths, ...uploadedFilePaths]);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
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


  return (
    <div className='page'>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the file input
      />
      <div
        onClick={() => { fileInputRef.current.click(); }}
        className='input_box'
        style={{ backgroundColor: backgroundColor }} // Apply the random background color here
      >
        <img src={cameraStyle} alt="" className='camera_img' /> {/* Use the randomly selected camera style */}
        <h1 style={{ color: textColor }} 
            className='input_text'>Kliknutím odfoť alebo pridaj fotku do albumu!</h1>
      </div>
      {/* <button onClick={handleUpload}>Upload</button> */}
      <div>
        {imagePaths.map((path, index) => (
          <img key={index} src={path} alt={`Uploaded Content ${index}`} style={{ width: '100%', height: 'auto' }} />
        ))}
      </div>
    </div>
  );
};

export default AfterScan;
