import { useState } from "react";
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