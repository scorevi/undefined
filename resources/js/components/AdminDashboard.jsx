import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import AdminHeader from './AdminHeader';
import './Styles/admindashboard.css';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        total_posts: 25,
        published_posts: 20,
        draft_posts: 5,
        total_views: 15420,
        total_comments: 89,
        recent_posts: [
            { title: 'Getting Started with Laravel', views: 1250, status: 'published' },
            { title: 'Advanced PHP Techniques', views: 890, status: 'published' },
            { title: 'Web Development Best Practices', views: 650, status: 'draft' },
        ]
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('auth_token');

        if (!token) {
            console.error('No auth token found');
            navigate('/login');
            return;
        }

        fetch('/api/admin/dashboard', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                // Token is invalid or expired
                localStorage.removeItem('auth_token');
                throw new Error('Token expired');
            } else {
                throw new Error('Not authenticated');
            }
        })
        .then(data => {
            setUser(data.user);
            setStats(data.stats || stats);
            setLoading(false);
        })
        .catch(error => {
            console.error('Authentication error:', error);
            navigate('/login');
        });
    }, []); // Removed navigate from dependency array

    const handleViewPost = (e, postId) => {
        console.log('View button clicked! Post ID:', postId);
        e.preventDefault();
        e.stopPropagation();

        // Simple alert to test if the function is called
        alert(`Viewing post ID: ${postId}`);

        // Try navigation instead of window.open for now
        const url = `/blog/post/${postId}`;
        console.log('Navigating to:', url);
        navigate(url);
    };

    const handleEditPost = (postId) => {
        // Navigate to the edit post page
        navigate(`/admin/posts/${postId}/edit`);
    };

    const handleDeletePost = async (postId, postTitle) => {
        if (!confirm(`Are you sure you want to delete the post "${postTitle}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const token = localStorage.getItem('auth_token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('auth_token');
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to delete post');
            }

            const data = await response.json();

            if (data.success) {
                // Refresh the dashboard data
                window.location.reload();
            } else {
                alert('Failed to delete post: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Delete post error:', error);
            alert('Failed to delete post. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
    <div className="admin-dashboard">
    {/* Navigation */}
    <AdminHeader />

    {/* Main Content */}
    <div className="container">
        {/* Page Header */}
        <div className="dashboard-header">
            <h2>Admin Dashboard Overview</h2>
            <p>Manage your blog content and track performance</p>
        </div>
        <hr />
            {/* Statistics Cards */}
        <div className="stats-cont">
            <h2>Statistics</h2>
            <div className="grid-stats">
                {/* Total Posts */}
                <div className="stats-card">
                    <dl>
                        <dt>Total Posts</dt>
                        <dd>{stats.total_posts}</dd>
                    </dl>
                </div>

                {/* Total Views */}
                <div className="stats-card">
                    <dl>
                        <dt>Total Views</dt>
                        <dd>{stats.total_views.toLocaleString()}</dd>
                    </dl>
                </div>

                {/* Total Comments */}
                <div className="stats-card">
                    <dl>
                        <dt>Comments</dt>
                        <dd>{stats.total_comments}</dd>
                    </dl>
                </div>
            </div>
        </div>
        <hr />
        {/* Quick Actions */}

        <div className="quick-act-cont">
            <h2>Admin Quick Actions</h2>
            <div className="quick-act-grid">
                <Link to="/admin/posts/new" className='action-btn'>
                    New Post
                </Link>
                <Link to="/admin/posts" className='action-btn'>
                    Edit Posts
                </Link>
                <Link to="/admin/comments" className='action-btn'>
                    Manage Comments
                </Link>
                <Link to="/admin/settings" className='action-btn'>
                    Admin Settings
                </Link>
            </div>
        </div>

        <hr />
        {/* Recent Posts */}

        <div className='table-cont'>
            <h2>Recent Posts</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Likes</th>
                            <th>Views</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recent_posts?.map((post, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>{post.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{post.likes_count ?? 0}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{post.views.toLocaleString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        type="button"
                                        onClick={(e) => handleViewPost(e, post.id)}
                                        className="view-btn"
                                        style={{marginRight: '8px'}}
                                    >
                                        View
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleEditPost(post.id)}
                                        className="edit-btn"
                                        style={{marginRight: '8px'}}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeletePost(post.id, post.title)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    </div>
    </div>
    );
};

export default AdminDashboard;
