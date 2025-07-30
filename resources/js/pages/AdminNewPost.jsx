import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FBLayout from '../components/FBLayout';
import { 
  FaArrowLeft, 
  FaImage, 
  FaTimes, 
  FaPlus, 
  FaNewspaper,
  FaEdit,
  FaEye
} from 'react-icons/fa';

const AdminNewPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      setImage(null);
      setImagePreview(null);
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('Image size must be less than 50MB.');
      setImage(null);
      setImagePreview(null);
      return;
    }
    setError('');
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) formData.append('image', image);
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': csrfToken },
        credentials: 'include',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || data.message || 'Failed to create post');
      } else {
        setSuccess('Post created successfully!');
        setTitle('');
        setContent('');
        setImage(null);
        setImagePreview(null);
        setTimeout(() => navigate('/admin/posts'), 1200);
      }
    } catch (err) {
      setError('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  const fbStyles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
    },
    header: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '20px',
      border: '1px solid #e4e6ea',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1c1e21',
      margin: '0 0 8px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#65676b',
      margin: '0',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: '#e4e6ea',
      color: '#1c1e21',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'background-color 0.2s',
      marginBottom: '20px',
    },
    formContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #e4e6ea',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '15px',
      fontWeight: '600',
      color: '#1c1e21',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: '1px solid #e4e6ea',
      borderRadius: '8px',
      outline: 'none',
      transition: 'border-color 0.2s',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    textarea: {
      width: '100%',
      minHeight: '200px',
      padding: '12px 16px',
      fontSize: '16px',
      border: '1px solid #e4e6ea',
      borderRadius: '8px',
      outline: 'none',
      resize: 'vertical',
      transition: 'border-color 0.2s',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      lineHeight: '1.5',
    },
    imageUploadSection: {
      border: '2px dashed #e4e6ea',
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      transition: 'border-color 0.2s',
      position: 'relative',
    },
    imageUploadSectionActive: {
      borderColor: '#1877f2',
      backgroundColor: '#f0f8ff',
    },
    imageInput: {
      display: 'none',
    },
    imageUploadButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      backgroundColor: '#1877f2',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'background-color 0.2s',
    },
    imageUploadText: {
      fontSize: '14px',
      color: '#65676b',
      marginTop: '8px',
    },
    imagePreviewContainer: {
      position: 'relative',
      marginTop: '16px',
      display: 'inline-block',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    imagePreview: {
      maxWidth: '100%',
      maxHeight: '300px',
      borderRadius: '8px',
      display: 'block',
    },
    removeImageButton: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      transition: 'background-color 0.2s',
    },
    submitButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#1877f2',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background-color 0.2s',
      marginTop: '24px',
    },
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    loadingSpinner: {
      width: '16px',
      height: '16px',
      border: '2px solid transparent',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    errorMessage: {
      backgroundColor: '#ffebee',
      color: '#c62828',
      padding: '12px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      marginTop: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    successMessage: {
      backgroundColor: '#e8f5e8',
      color: '#2e7d32',
      padding: '12px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      marginTop: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    previewSection: {
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '20px',
      border: '1px solid #e4e6ea',
    },
    previewTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1c1e21',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    previewContent: {
      backgroundColor: '#ffffff',
      borderRadius: '6px',
      padding: '16px',
      border: '1px solid #e4e6ea',
    },
    previewPostTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1c1e21',
      marginBottom: '12px',
      margin: '0 0 12px 0',
    },
    previewPostContent: {
      fontSize: '15px',
      color: '#1c1e21',
      lineHeight: '1.5',
      whiteSpace: 'pre-wrap',
    },
  };

  return (
    <FBLayout showAdminActions={true}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={fbStyles.container}>
        {/* Header */}
        <div style={fbStyles.header}>
          <h1 style={fbStyles.title}>
            <FaPlus style={{ color: '#1877f2' }} />
            Create New Post
          </h1>
          <p style={fbStyles.subtitle}>
            Share your thoughts and ideas with the community
          </p>
        </div>

        {/* Back Button */}
        <button
          style={fbStyles.backButton}
          onClick={() => navigate(-1)}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#d8dadf'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#e4e6ea'}
        >
          <FaArrowLeft />
          Back
        </button>

        {/* Form Container */}
        <div style={fbStyles.formContainer}>
          <form onSubmit={handleSubmit}>
            {/* Title Field */}
            <div style={fbStyles.formGroup}>
              <label style={fbStyles.label}>Post Title</label>
              <input
                type="text"
                style={fbStyles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                required
                placeholder="Enter an engaging title for your post..."
                onFocus={(e) => e.target.style.borderColor = '#1877f2'}
                onBlur={(e) => e.target.style.borderColor = '#e4e6ea'}
              />
            </div>

            {/* Content Field */}
            <div style={fbStyles.formGroup}>
              <label style={fbStyles.label}>Post Content</label>
              <textarea
                style={fbStyles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
                required
                placeholder="Write your post content here... Share your insights, experiences, or thoughts with your readers."
                onFocus={(e) => e.target.style.borderColor = '#1877f2'}
                onBlur={(e) => e.target.style.borderColor = '#e4e6ea'}
              />
            </div>

            {/* Image Upload */}
            <div style={fbStyles.formGroup}>
              <label style={fbStyles.label}>Featured Image (Optional)</label>
              <div style={{
                ...fbStyles.imageUploadSection,
                ...(imagePreview ? fbStyles.imageUploadSectionActive : {})
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                  id="image-upload"
                  style={fbStyles.imageInput}
                />
                
                {!imagePreview ? (
                  <>
                    <label 
                      htmlFor="image-upload" 
                      style={fbStyles.imageUploadButton}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#166fe5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#1877f2'}
                    >
                      <FaImage />
                      Choose Image
                    </label>
                    <p style={fbStyles.imageUploadText}>
                      Upload a featured image for your post (max 50MB)
                    </p>
                  </>
                ) : (
                  <div style={fbStyles.imagePreviewContainer}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={fbStyles.imagePreview}
                    />
                    <button
                      type="button"
                      style={fbStyles.removeImageButton}
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                ...fbStyles.submitButton,
                ...(loading ? fbStyles.submitButtonDisabled : {})
              }}
              disabled={loading || !title.trim() || !content.trim()}
              onMouseEnter={(e) => {
                if (!loading && title.trim() && content.trim()) {
                  e.target.style.backgroundColor = '#166fe5';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && title.trim() && content.trim()) {
                  e.target.style.backgroundColor = '#1877f2';
                }
              }}
            >
              {loading ? (
                <>
                  <div style={fbStyles.loadingSpinner}></div>
                  Creating Post...
                </>
              ) : (
                <>
                  <FaNewspaper />
                  Create Post
                </>
              )}
            </button>

            {/* Messages */}
            {error && (
              <div style={fbStyles.errorMessage}>
                <FaTimes />
                {error}
              </div>
            )}
            {success && (
              <div style={fbStyles.successMessage}>
                <FaNewspaper />
                {success}
              </div>
            )}
          </form>
        </div>

        {/* Live Preview */}
        {(title.trim() || content.trim()) && (
          <div style={fbStyles.previewSection}>
            <h3 style={fbStyles.previewTitle}>
              <FaEye style={{ color: '#1877f2' }} />
              Preview
            </h3>
            <div style={fbStyles.previewContent}>
              {title.trim() && (
                <h2 style={fbStyles.previewPostTitle}>{title}</h2>
              )}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    marginBottom: '12px'
                  }}
                />
              )}
              {content.trim() && (
                <div style={fbStyles.previewPostContent}>{content}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </FBLayout>
  );
};

export default AdminNewPost;
