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
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('auth_token');

    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch current admin info and site settings
    Promise.all([
      fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      }),
      fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      })
    ])
      .then(async ([dashboardRes, settingsRes]) => {
        if (!dashboardRes.ok || !settingsRes.ok) {
          if (dashboardRes.status === 401 || settingsRes.status === 401) {
            localStorage.removeItem('auth_token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch data');
        }

        const dashboardData = await dashboardRes.json();
        const settingsData = await settingsRes.json();

        setEmail(dashboardData.user?.email || '');
        setSiteName(settingsData.settings?.site_name || '');
        setSiteDescription(settingsData.settings?.site_description || '');

        // Set document title
        const title = settingsData.settings?.site_name || 'Blog';
        document.title = `${title} - Admin Settings`;

        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load settings');
        document.title = 'Admin Settings';
        setLoading(false);
      });
  }, []);

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    setError('');
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('auth_token');
          navigate('/login');
          return;
        }
        const errorMsg = data.errors ? Object.values(data.errors).flat().join(', ') : (data.error || data.message || 'Failed to update email');
        throw new Error(errorMsg);
      }
      if (!data.success) throw new Error(data.error || data.message || 'Failed to update email');
      setFeedback('Email updated successfully!');
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
      setError('New passwords do not match.');
      setSaving(false);
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      setSaving(false);
      return;
    }
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('auth_token');
          navigate('/login');
          return;
        }
        const errorMsg = data.errors ? Object.values(data.errors).flat().join(', ') : (data.error || data.message || 'Failed to update password');
        throw new Error(errorMsg);
      }
      if (!data.success) throw new Error(data.error || data.message || 'Failed to update password');
      setFeedback('Password updated successfully!');
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
      const token = localStorage.getItem('auth_token');

      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ site_name: siteName, site_description: siteDescription }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('auth_token');
          navigate('/login');
          return;
        }
        const errorMsg = data.errors ? Object.values(data.errors).flat().join(', ') : (data.error || data.message || 'Failed to update site settings');
        throw new Error(errorMsg);
      }
      if (!data.success) throw new Error(data.error || data.message || 'Failed to update site settings');
      setFeedback('Site settings updated successfully!');

      // Update document title if site name changed
      if (siteName) {
        document.title = `${siteName} - Admin Settings`;
      }
    } catch (err) {
      setError(err.message || 'Failed to update site settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{maxWidth:600,margin:'40px auto',background:'#fff',padding:32,borderRadius:12,boxShadow:'0 2px 12px #e0e0e0'}}>
      <button onClick={() => navigate('/admin')} className="mb-4 text-blue-600 hover:underline">&larr; Back to Dashboard</button>
      <h2 className="text-xl font-bold mb-4">Admin Settings</h2>
      {loading ? <div>Loading...</div> : (
        <>
          <form onSubmit={handleSaveEmail} className="mb-8">
            <h3 className="font-semibold mb-2">Change Email</h3>
            <input type="email" className="w-full border rounded px-3 py-2 mb-2" value={email} onChange={e=>setEmail(e.target.value)} disabled={saving} required />
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded font-semibold" disabled={saving}>Save Email</button>
          </form>
          <form onSubmit={handleSavePassword} className="mb-8">
            <h3 className="font-semibold mb-2">Change Password</h3>
            <input type="password" className="w-full border rounded px-3 py-2 mb-2" placeholder="Current password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} disabled={saving} required />
            <input type="password" className="w-full border rounded px-3 py-2 mb-2" placeholder="New password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} disabled={saving} required />
            <input type="password" className="w-full border rounded px-3 py-2 mb-2" placeholder="Confirm new password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} disabled={saving} required />
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded font-semibold" disabled={saving}>Save Password</button>
          </form>
          <form onSubmit={handleSaveSite} className="mb-8">
            <h3 className="font-semibold mb-2">Site Settings</h3>
            <input type="text" className="w-full border rounded px-3 py-2 mb-2" placeholder="Site Name" value={siteName} onChange={e=>setSiteName(e.target.value)} disabled={saving} />
            <textarea className="w-full border rounded px-3 py-2 mb-2" placeholder="Site Description" value={siteDescription} onChange={e=>setSiteDescription(e.target.value)} disabled={saving} />
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded font-semibold" disabled={saving}>Save Site Settings</button>
          </form>
          {feedback && <div style={{color:'#22c55e',marginBottom:8}}>{feedback}</div>}
          {error && <div style={{color:'#dc2626',marginBottom:8}}>{error}</div>}
        </>
      )}
    </div>
  );
};

export default AdminSettings;
