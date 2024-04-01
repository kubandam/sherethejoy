import React, { useRef, useState, useEffect, useCallback } from "react";
import imageCompression from 'browser-image-compression';
import axios from "axios";
import { useParams } from "react-router-dom";
import camera1 from "../assets/img/camera1.svg";
import camera2 from "../assets/img/camera2.svg";
import camera3 from "../assets/img/camera3.svg";
import camera4 from "../assets/img/camera4.svg";
import camera5 from "../assets/img/camera5.svg";
import camera6 from "../assets/img/camera6.svg";

const AfterScan = () => {
  require("../assets/css/AfterScan.css"); // css
  const [isClosing, setIsClosing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePaths, setImagePaths] = useState([]);
  const [cameraStyle, setCameraStyle] = useState(camera1);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const { token } = useParams();
  const fileInputRef = useRef(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/collection/${token}/photos`
      );
      if (response.data.message !== "FILE_NOT_EXISTS")
        setImagePaths(
          response.data.filePaths.map(
            (path) => `${process.env.REACT_APP_API}${path}`
          )
        );
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    const backgrounds = [
      "#FFEEA6",
      "#ADD2BC",
      "#6AA4DB",
      "#468BC7",
      "#FFBCCE",
      "#F9F69B",
    ];
    const textColors = [
      "#fccc00",
      "#51946c",
      "#25639d",
      "#25537b",
      "#fe0a4c",
      "#e4dd0d",
    ];
    const cameras = [camera1, camera2, camera3, camera4, camera5, camera6];
    const randomValue = Math.floor(Math.random() * cameras.length);
    setCameraStyle(cameras[randomValue]);
    setBackgroundColor(backgrounds[randomValue]);
    setTextColor(textColors[randomValue]);
  }, []);

  const FullScreenImage = ({ src, onClose }) => (
    <div
      className={`fullscreen-container ${isClosing ? "close_image" : ""}`}
      onAnimationEnd={() => isClosing && onClose()}
    >
      <img src={src} className="fullscreen-image" alt="Fullscreen" />
      <span
        className="close-btn"
        onClick={() => {
          handleClose();
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.97363 28.0263L28.0263 1.97363M1.97363 1.97363L28.0263 28.0263"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>
  );

  const handleClose = () => {
    setIsClosing(true); 
  };

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setSelectedImage(null);
        setIsClosing(false); 
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        try {
          // Options for the compression
          const options = {
            maxSizeMB: 1, // (max file size in MB)
            maxWidthOrHeight: 1920, // (compressed files will be resized to these dimensions)
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(files[i], options);
          const uniqueFilename = generateRandomString(16) + '_' + Date.now() + '.' + getFileExtension(compressedFile.name);
          formData.append('files', compressedFile, uniqueFilename);
        } catch (error) {
          console.error('Error compressing the file:', error);
        }
      }
      if (formData.has('files')) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_API}/collection/${token}/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data', 
            },
          });
          const uploadedFilePaths = response.data.filePaths.map(path => `${process.env.REACT_APP_API}${path}`);
          setImagePaths(prevPaths => [...prevPaths, ...uploadedFilePaths]);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }
  };

  function generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  function getFileExtension(filename) {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  }

  return (
    <div className="page" style={{ backgroundColor: backgroundColor+'77' }}>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }} 
      />
      <div
        onClick={() => {
          fileInputRef.current.click();
        }}
        className="input_box"
        style={{ backgroundColor: backgroundColor }} 
      >
        <img src={cameraStyle} alt="" className="camera_img" />{" "}
        <h1 style={{ color: textColor }} className="input_text">
          Kliknutím odfoť alebo pridaj fotku do albumu!
        </h1>
      </div>
      <div id="gallery">
        {imagePaths.map((path, index) => (
          <img
            key={index}
            src={path}
            alt={`Uploaded Content ${index}`}
            style={{ width: "100%", height: "auto" }}
            onClick={() => setSelectedImage(path)}
          />
        ))}
      </div>
      {selectedImage && (
        <FullScreenImage
          src={selectedImage}
          onClose={() => {
            setSelectedImage(null);
            setIsClosing(false);
          }}
          isClosing={isClosing}
        />
      )}
    </div>
  );
};

export default AfterScan;
