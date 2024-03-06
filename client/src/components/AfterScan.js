import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AfterScan = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePaths, setImagePaths] = useState([]); // State to store image paths

  const { token } = useParams();

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    // Append files to formData
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    try {
      const response = await axios.post(`http://192.168.100.16:8080/collection/${token}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File upload successful', response.data);

      // Update the image paths state with the response
      const uploadedFilePaths = response.data.filePaths; // Adjust according to your actual response structure
      setImagePaths(uploadedFilePaths.map(path => `http://192.168.100.16:8080${path}`)); // Prepend your server URL to the path
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
        {/* Display uploaded images */}
        {imagePaths.map((path, index) => (
          <img key={index} src={path} alt={`Uploaded Content ${index}`} style={{ width: '100px', height: '100px' }} />
        ))}
      </div>
    </div>
  );
};

export default AfterScan;
