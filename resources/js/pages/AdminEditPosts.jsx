import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './styles/admineditpost.css'

const AdminEditPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/posts?per_page=20')
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load posts');
        setLoading(false);
      });
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      // Get auth token for admin operations
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      setRefresh(r => r + 1);
    } catch {
      alert('Failed to delete post.');
    }
  };

  return (
    <div className='container'>
      <button className='back-btn' onClick={() => navigate('/admin')}>&larr; Back to Dashboard</button>

      <h2>Manage Posts</h2>
      {loading ? <div className='loading'>Loading...</div> : error ? <div style={{color:'#dc2626'}}>{error}</div> : (

        <div className="table-cont">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
                <th>Likes</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td className='row-title'>
                    {post.title}
                  </td>
                  <td className='row-author'>
                    {post.user?.name || post.user?.email || 'Unknown'}
                  </td>
                  <td>
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    {post.likes_count ?? 0}
                  </td>
                  <td>
                    {post.views ?? 0}
                  </td>
                  <td>
                    <button onClick={() => navigate(`/admin/posts/${post.id}/edit`)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="delete-btn">Delete</button>
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

export default AdminEditPosts;