import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './styles/admincomments.css';

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
    <div className="admin-comments-container">
      <div className="admin-comments-header">
        <a onClick={() => navigate('/admin')} className="back-link">Back to Dashboard</a>
        <h2>All Comments</h2>
      </div>
      <div className="admin-comments-content">
        {loading ? (
          <div className="loading-message">Loading comments...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : comments.length === 0 ? (
          <div className="empty-state">
            <h3>No comments found</h3>
            <p>There are no comments to display at the moment.</p>
          </div>
        ) : (
          <div className="comments-table-container">
            <table className="comments-table">
              <thead>
                <tr>
                  <th>Content</th>
                  <th>Post</th>
                  <th>User</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map(comment => (
                  <tr key={comment.id}>
                    <td className="content-cell">{comment.content}</td>
                    <td>
                      <div className="post-title">{comment.post?.title || `Post #${comment.post_id}`}</div>
                    </td>
                    <td>
                      <div className="user-name">{comment.user?.name || comment.user?.email || 'Unknown'}</div>
                    </td>
                    <td className="date-cell">
                      {comment.created_at ? new Date(comment.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="date-cell">
                      {comment.updated_at ? new Date(comment.updated_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="actions-cell">
                      <button onClick={() => handleEdit(comment)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(comment)} className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComments;
