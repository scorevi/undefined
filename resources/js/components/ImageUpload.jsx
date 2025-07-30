import React, { useState, useRef, useEffect } from 'react';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import './Styles/ImageUpload.css';

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
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const inputRef = useRef(null);

  // Reset dialog state when window regains focus (user closed dialog)
  useEffect(() => {
    const handleFocus = () => {
      if (isFileDialogOpen) {
        setIsFileDialogOpen(false);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isFileDialogOpen]);

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
    setIsFileDialogOpen(false); // Reset dialog state when file is selected

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

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // DEBUG: Increment click counter first
    setClickCounter(prev => prev + 1);
    console.log(`🔴 Admin ImageUpload click #${clickCounter + 1} detected!`);

    if (disabled) {
      console.log(`🚫 Admin click blocked - component disabled`);
      return;
    }

    if (isFileDialogOpen) {
      console.log(`🚫 Admin click blocked - dialog already open`);
      return;
    }

    console.log(`✅ Admin click proceeding - opening file dialog`);

    // Set dialog state
    setIsFileDialogOpen(true);

    // Trigger file input with immediate execution
    console.log('🔍 Input ref:', inputRef.current);
    console.log('🔍 Input disabled:', inputRef.current?.disabled);

    if (inputRef.current && !inputRef.current.disabled) {
      try {
        inputRef.current.click();
        console.log(`📁 File dialog triggered successfully`);
      } catch (error) {
        console.error('❌ Error triggering file dialog:', error);
        setIsFileDialogOpen(false);
      }
    } else {
      console.error('❌ Cannot trigger - input ref is null or disabled');
      setIsFileDialogOpen(false);
    }

    // Reset flag after timeout as backup
    setTimeout(() => {
      setIsFileDialogOpen(false);
      console.log(`🔄 Dialog state reset after timeout`);
    }, 3000);
  };  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`image-upload-container ${className}`}>
      {/* Hidden File Input - Completely separate from UI */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        style={{ display: 'none' }}
      />

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
        className={`image-upload-area ${dragActive ? 'drag-active' : ''} ${imagePreview ? 'has-image' : ''} ${isFileDialogOpen ? 'dialog-open' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          opacity: isFileDialogOpen ? 0.6 : 1,
          cursor: isFileDialogOpen ? 'wait' : 'pointer'
        }}
      >
        <div className="image-upload-content">
          <FaCloudUploadAlt className="image-upload-icon" />
          <div className="image-upload-text">
            {isFileDialogOpen ? 'Opening...' : (imagePreview ? 'Replace Image' : 'Upload Image')}
            {clickCounter > 0 && (
              <span style={{
                marginLeft: '8px',
                backgroundColor: 'red',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                Admin Clicks: {clickCounter}
              </span>
            )}
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
