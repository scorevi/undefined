import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import './styles/admindashboard.css';

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
        fetch('/api/dashboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            credentials: 'include', // Ensure cookies are sent
        })
        .then(response => {
            if (response.ok) {
                return response.json();
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

    const handleLogout = async () => {
        console.log('Admin Logout clicked');
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'include', // Ensure cookies are sent
            });

            const data = await response.json();
            if (data.success) {
                logout();
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Admin Logout error:', error);
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
    <>     
    {/* Navigation */}
    <nav className="admin-navbar">
        <Link to="/" className="text-xl font-semibold text-gray-900">
            Admin Dashboard
        </Link>
        <div className="admin-logout" style={{zIndex:2, position:'relative'}}>
            <span>
                Welcome, {user?.name || 'Admin'}
            </span>
                <button
                    onClick={handleLogout}
                    className="logout-btn">
                        Logout
            </button>
        </div>
    </nav>

    {/* Main Content */}
    <div className="container">    
        {/* Page Header */}
        <div className="dashboard-header">
            <h2>Admin Dashboard Overview</h2>
            <p>Manage your blog content and track performance</p>
        </div>
        <hr />
            {/* Statistics Cards */}
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
        <hr />
        {/* Quick Actions */}
        <h2>Admin Quick Actions</h2>
        <div className="quick-act-cont">
            
            <div className="quick-act-grid">
                <Link to="/admin/posts/new" className='action-btn'>
                <button>
                    New Post
                </button></Link>
                <Link to="/admin/posts" className='action-btn'>
                    <button>Edit Posts</button>
                </Link>
                <Link to="/admin/comments" className='action-btn'>
                    <button>Manage Comments</button>
                </Link>
                <Link to="/admin/settings" className='action-btn'>
                    <button>Admin Settings</button>
                </Link>
            </div>
        </div>

        <hr />
        {/* Recent Posts */}
        <h2>Recent Posts</h2>
        <div className='table-cont'>
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
                        {stats.recent_posts.map((post, index) => (
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
                                    <a href="#" className="edit-btn">Edit</a>
                                    <a href="#" className="delete-btn">Delete</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    </div>
    </>
    );
};

export default AdminDashboard; 