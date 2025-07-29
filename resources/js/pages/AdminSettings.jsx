import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './styles/adminsettings.css';

const AdminSettings = () => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    // Fetch current admin info and site settings
    fetch('/api/dashboard', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setEmail(data.user?.email || '');
        setSiteName(data.stats?.site_name || '');
        setSiteDescription(data.stats?.site_description || '');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load settings');
        setLoading(false);
      });
  }, []);

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    setError('');
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || data.message || 'Failed to update email');
      setFeedback('Email updated!');
    } catch (err) {
      setError(err.message || 'Failed to update email');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setSaving(false);
      return;
    }
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || data.message || 'Failed to update password');
      setFeedback('Password updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSite = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    setError('');
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ site_name: siteName, site_description: siteDescription }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || data.message || 'Failed to update site settings');
      setFeedback('Site settings updated!');
    } catch (err) {
      setError(err.message || 'Failed to update site settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-settings-container">
      <div className="admin-settings-header">
        <h2>Admin Settings</h2>
        <p>Manage your account and site configuration</p>
      </div>

      <div className="admin-settings-content">
        <div className="back-btn-container">
          <button onClick={() => navigate('/admin')} className="back-btn">&larr; Back to Dashboard</button>
        </div>

        {loading ? (
          <div className="loading-container">
            <span className="loading-spinner">⟳</span>
            Loading settings...
          </div>
        ) : (
          <div className="settings-grid">
            {/* Email Settings Section */}
            <div className="settings-section">
              <h3>
                <svg className="icon" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                Email Settings
              </h3>
              <div className="settings-section-content">
                <form onSubmit={handleSaveEmail}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={e=>setEmail(e.target.value)}
                      disabled={saving}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                  <button type="submit" className="submit-btn" disabled={saving}>
                    {saving ? 'Saving...' : 'Update Email'}
                  </button>
                </form>
              </div>
            </div>

            {/* Password Settings Section */}
            <div className="settings-section">
              <h3>
                <svg className="icon" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                Password Settings
              </h3>
              <div className="settings-section-content">
                <form onSubmit={handleSavePassword}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Enter your current password"
                      value={currentPassword}
                      onChange={e=>setCurrentPassword(e.target.value)}
                      disabled={saving}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={e=>setNewPassword(e.target.value)}
                      disabled={saving}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={e=>setConfirmPassword(e.target.value)}
                      disabled={saving}
                      required
                    />
                  </div>
                  <button type="submit" className="submit-btn" disabled={saving}>
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>

            {/* Site Settings Section */}
            <div className="settings-section">
              <h3>
                <svg className="icon" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                </svg>
                Site Settings
              </h3>
              <div className="settings-section-content">
                <form onSubmit={handleSaveSite}>
                  <div className="form-group">
                    <label className="form-label">Site Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter your site name"
                      value={siteName}
                      onChange={e=>setSiteName(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Site Description</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Enter your site description"
                      value={siteDescription}
                      onChange={e=>setSiteDescription(e.target.value)}
                      disabled={saving}
                      rows={4}
                    />
                  </div>
                  <button type="submit" className="submit-btn" disabled={saving}>
                    {saving ? 'Saving...' : 'Update Site Settings'}
                  </button>
                </form>
              </div>
            </div>

            {/* Feedback Messages */}
            <div className="feedback-messages">
              {feedback && <div className="alert alert-success">{feedback}</div>}
              {error && <div className="alert alert-error">{error}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
