import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/comments?per_page=30')
      .then(res => res.json())
      .then(data => {
        setComments(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load comments');
        setLoading(false);
      });
  }, [refresh]);

  const handleDelete = async (comment) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const res = await fetch(`/api/posts/${comment.post_id}/comments/${comment.id}`, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': csrfToken },
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      setRefresh(r => r + 1);
    } catch {
      alert('Failed to delete comment.');
    }
  };

  const handleEdit = (comment) => {
    const newContent = prompt('Edit comment:', comment.content);
    if (newContent === null || newContent.trim() === '' || newContent === comment.content) return;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    fetch(`/api/posts/${comment.post_id}/comments/${comment.id}`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content: newContent }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setRefresh(r => r + 1);
        else alert(data.error || 'Failed to update comment.');
      })
      .catch(() => alert('Failed to update comment.'));
  };

  return (
    <div style={{maxWidth:1100,margin:'40px auto',background:'#fff',padding:32,borderRadius:12,boxShadow:'0 2px 12px #e0e0e0'}}>
      <button onClick={() => navigate('/admin')} className="mb-4 text-blue-600 hover:underline">&larr; Back to Dashboard</button>
      <h2 className="text-xl font-bold mb-4">All Comments</h2>
      {loading ? <div>Loading...</div> : error ? <div style={{color:'#dc2626'}}>{error}</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comments.map(comment => (
                <tr key={comment.id}>
                  <td className="px-6 py-4 whitespace-pre-line max-w-xs">
                    <div className="text-sm text-gray-900">{comment.content}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{comment.post?.title || `Post #${comment.post_id}`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{comment.user?.name || comment.user?.email || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{comment.created_at ? new Date(comment.created_at).toLocaleString() : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{comment.updated_at ? new Date(comment.updated_at).toLocaleString() : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(comment)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button onClick={() => handleDelete(comment)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminComments;
