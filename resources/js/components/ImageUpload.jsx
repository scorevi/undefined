import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import './styles/ImageUpload.css';

const ImageUpload = ({
  image,
  imagePreview,
  onChange,
  onRemove,
  disabled = false,
  accept = "image/jpeg,image/jpg,image/png,image/gif,image/webp",
  maxSize = 50 * 1024 * 1024, // 50MB
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (disabled) return;

    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed.');
      return;
    }

    if (file.size > maxSize) {
      alert(`Image size must be less than ${Math.round(maxSize / (1024 * 1024))}MB.`);
      return;
    }

    onChange(file);
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`image-upload-container ${className}`}>
      {/* Image Preview */}
      {imagePreview && (
        <div className="image-preview-container">
          <img
            src={imagePreview}
            alt="Preview"
            className="image-preview"
          />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="remove-image-btn"
              disabled={disabled}
            >
              <FaTimes style={{ marginRight: '0.5rem' }} />
              Remove Image
            </button>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`image-upload-area ${dragActive ? 'drag-active' : ''} ${imagePreview ? 'has-image' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="image-upload-input"
        />

        <div className="image-upload-content">
          <FaCloudUploadAlt className="image-upload-icon" />
          <div className="image-upload-text">
            {imagePreview ? 'Replace Image' : 'Upload Image'}
          </div>
          <div className="image-upload-subtext">
            {imagePreview
              ? 'Click or drag a new image to replace the current one'
              : 'Click to browse or drag and drop an image here'
            }
          </div>
          <div className="image-upload-formats">
            Supported formats: JPEG, PNG, GIF, WEBP • Max size: {formatFileSize(maxSize)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
