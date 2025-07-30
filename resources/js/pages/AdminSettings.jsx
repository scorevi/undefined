import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const [activeTab, setActiveTab] = useState('account');
  const navigate = useNavigate();

  // Get CSRF token helper
  const getCSRFToken = () => {
    try {
      return decodeURIComponent(document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1] || '');
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError('');
      try {
        const csrfToken = getCSRFToken();
        const response = await fetch('/api/admin/dashboard', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'X-XSRF-TOKEN': csrfToken,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load settings');
        }

        const data = await response.json();
        setEmail(data?.user?.email || '');
        setSiteName(data?.stats?.site_name || 'Erikanoelvi\'s Blog');
        setSiteDescription(data?.stats?.site_description || 'A modern blog platform');
      } catch (err) {
        console.error('Settings fetch error:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    setError('');

    try {
      const csrfToken = getCSRFToken();
      const response = await fetch('/api/admin/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to update email');
      }

      setFeedback('Email updated successfully!');
    } catch (err) {
      console.error('Email update error:', err);
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

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      setSaving(false);
      return;
    }

    try {
      const csrfToken = getCSRFToken();
      const response = await fetch('/api/admin/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to update password');
      }

      setFeedback('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password update error:', err);
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
      const csrfToken = getCSRFToken();
      const response = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          site_name: siteName,
          site_description: siteDescription
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to update site settings');
      }

      setFeedback('Site settings updated successfully!');
    } catch (err) {
      console.error('Site settings update error:', err);
      setError(err.message || 'Failed to update site settings');
    } finally {
      setSaving(false);
    }
  };

  // Facebook-style horizontal layout styles
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '20px',
    },
    settingsWrapper: {
      display: 'flex',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      maxWidth: '1200px',
      width: '100%',
    },
    sidebar: {
      width: '280px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e4e6ea',
      padding: '20px 0',
    },
    sidebarHeader: {
      padding: '0 20px 20px',
      borderBottom: '1px solid #e4e6ea',
      marginBottom: '20px',
    },
    sidebarTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1c1e21',
      margin: '0 0 8px 0',
    },
    sidebarSubtitle: {
      fontSize: '15px',
      color: '#65676b',
      margin: '0',
    },
    tabList: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
    },
    tab: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 20px',
      color: '#1c1e21',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      borderLeft: '3px solid transparent',
    },
    tabActive: {
      backgroundColor: '#e7f3ff',
      borderLeftColor: '#1877f2',
      color: '#1877f2',
    },
    tabIcon: {
      marginRight: '12px',
      fontSize: '18px',
    },
    mainContent: {
      flex: '1',
      padding: '20px 40px',
      maxWidth: '600px',
    },
    contentHeader: {
      marginBottom: '32px',
    },
    contentTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1c1e21',
      margin: '0 0 8px 0',
    },
    contentSubtitle: {
      fontSize: '15px',
      color: '#65676b',
      margin: '0',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: '#e4e6ea',
      color: '#1c1e21',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '20px',
      textDecoration: 'none',
      transition: 'background-color 0.2s',
    },
    section: {
      background: '#ffffff',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '16px',
      border: '1px solid #e4e6ea',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1c1e21',
      marginBottom: '16px',
    },
    formRow: {
      display: 'flex',
      gap: '16px',
      marginBottom: '16px',
      alignItems: 'flex-start',
    },
    formGroup: {
      flex: '1',
      marginBottom: '16px',
    },
    formGroupHalf: {
      flex: '0 0 48%',
    },
    label: {
      display: 'block',
      fontSize: '15px',
      fontWeight: '600',
      color: '#1c1e21',
      marginBottom: '6px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #dddfe2',
      borderRadius: '6px',
      fontSize: '15px',
      backgroundColor: '#ffffff',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
    },
    inputFocus: {
      borderColor: '#1877f2',
      outline: 'none',
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #dddfe2',
      borderRadius: '6px',
      fontSize: '15px',
      backgroundColor: '#ffffff',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
      resize: 'vertical',
      minHeight: '100px',
    },
    button: {
      background: '#1877f2',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    buttonSecondary: {
      background: '#e4e6ea',
      color: '#1c1e21',
    },
    buttonDisabled: {
      background: '#e4e6ea',
      color: '#bcc0c4',
      cursor: 'not-allowed',
    },
    alert: {
      padding: '12px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      marginTop: '16px',
    },
    alertSuccess: {
      background: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb',
    },
    alertError: {
      background: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
    },
    loading: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#65676b',
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid #e4e6ea',
      borderTop: '3px solid #1877f2',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 16px',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={styles.settingsWrapper}>
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderAccountTab = () => (
    <>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Email Settings</h3>
        <form onSubmit={handleSaveEmail}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saving}
              required
              placeholder="Enter your email address"
              onFocus={(e) => e.target.style.borderColor = '#1877f2'}
              onBlur={(e) => e.target.style.borderColor = '#dddfe2'}
            />
          </div>
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(saving ? styles.buttonDisabled : {})
            }}
            disabled={saving}
            onMouseEnter={(e) => !saving && (e.target.style.backgroundColor = '#166fe5')}
            onMouseLeave={(e) => !saving && (e.target.style.backgroundColor = '#1877f2')}
          >
            {saving ? 'Updating...' : 'Update Email'}
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Password Settings</h3>
        <form onSubmit={handleSavePassword}>
          <div style={styles.formRow}>
            <div style={styles.formGroupHalf}>
              <label style={styles.label}>Current Password</label>
              <input
                type="password"
                style={styles.input}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={saving}
                required
                placeholder="Enter current password"
                onFocus={(e) => e.target.style.borderColor = '#1877f2'}
                onBlur={(e) => e.target.style.borderColor = '#dddfe2'}
              />
            </div>
            <div style={styles.formGroupHalf}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                style={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={saving}
                required
                placeholder="Enter new password"
                onFocus={(e) => e.target.style.borderColor = '#1877f2'}
                onBlur={(e) => e.target.style.borderColor = '#dddfe2'}
              />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm New Password</label>
            <input
              type="password"
              style={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={saving}
              required
              placeholder="Confirm new password"
              onFocus={(e) => e.target.style.borderColor = '#1877f2'}
              onBlur={(e) => e.target.style.borderColor = '#dddfe2'}
            />
          </div>
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(saving ? styles.buttonDisabled : {})
            }}
            disabled={saving}
            onMouseEnter={(e) => !saving && (e.target.style.backgroundColor = '#166fe5')}
            onMouseLeave={(e) => !saving && (e.target.style.backgroundColor = '#1877f2')}
          >
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </>
  );

  const renderSiteTab = () => (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>Site Configuration</h3>
      <form onSubmit={handleSaveSite}>
        <div style={styles.formRow}>
          <div style={styles.formGroupHalf}>
            <label style={styles.label}>Site Name</label>
            <input
              type="text"
              style={styles.input}
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              disabled={saving}
              placeholder="Enter site name"
              onFocus={(e) => e.target.style.borderColor = '#1877f2'}
              onBlur={(e) => e.target.style.borderColor = '#dddfe2'}
            />
          </div>
          <div style={styles.formGroupHalf}>
            <label style={styles.label}>Site Description</label>
            <textarea
              style={styles.textarea}
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              disabled={saving}
              placeholder="Enter site description"
              rows={3}
              onFocus={(e) => e.target.style.borderColor = '#1877f2'}
              onBlur={(e) => e.target.style.borderColor = '#dddfe2'}
            />
          </div>
        </div>
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(saving ? styles.buttonDisabled : {})
          }}
          disabled={saving}
          onMouseEnter={(e) => !saving && (e.target.style.backgroundColor = '#166fe5')}
          onMouseLeave={(e) => !saving && (e.target.style.backgroundColor = '#1877f2')}
        >
          {saving ? 'Updating...' : 'Update Site Settings'}
        </button>
      </form>
    </div>
  );

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={styles.settingsWrapper}>
        {/* Sidebar Navigation */}
        <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h1 style={styles.sidebarTitle}>Settings</h1>
          <p style={styles.sidebarSubtitle}>Manage your account and site</p>
        </div>

        <ul style={styles.tabList}>
          <li
            style={{
              ...styles.tab,
              ...(activeTab === 'account' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('account')}
            onMouseEnter={(e) => activeTab !== 'account' && (e.target.style.backgroundColor = '#f2f3f5')}
            onMouseLeave={(e) => activeTab !== 'account' && (e.target.style.backgroundColor = 'transparent')}
          >
            <span style={styles.tabIcon}>👤</span>
            Account Settings
          </li>
          <li
            style={{
              ...styles.tab,
              ...(activeTab === 'site' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('site')}
            onMouseEnter={(e) => activeTab !== 'site' && (e.target.style.backgroundColor = '#f2f3f5')}
            onMouseLeave={(e) => activeTab !== 'site' && (e.target.style.backgroundColor = 'transparent')}
          >
            <span style={styles.tabIcon}>⚙️</span>
            Site Settings
          </li>
        </ul>

        <div style={{padding: '20px', borderTop: '1px solid #e4e6ea', marginTop: '20px'}}>
          <button
            onClick={() => navigate('/admin')}
            style={{
              ...styles.backButton,
              width: '100%',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#d8dadf'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e4e6ea'}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.contentHeader}>
          <h2 style={styles.contentTitle}>
            {activeTab === 'account' ? 'Account Settings' : 'Site Settings'}
          </h2>
          <p style={styles.contentSubtitle}>
            {activeTab === 'account'
              ? 'Manage your email and password settings'
              : 'Configure your site name and description'
            }
          </p>
        </div>

        {activeTab === 'account' ? renderAccountTab() : renderSiteTab()}

        {/* Feedback Messages */}
        {feedback && (
          <div style={{...styles.alert, ...styles.alertSuccess}}>
            {feedback}
          </div>
        )}
        {error && (
          <div style={{...styles.alert, ...styles.alertError}}>
            {error}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
