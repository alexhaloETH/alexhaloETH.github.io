import React, { useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onImageSelect, multiple = false }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onImageSelect(multiple ? files : files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="image-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button type="button" className="image-upload-btn" onClick={handleClick}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        Add Image
      </button>
    </div>
  );
};

export default ImageUpload;
