import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Admin.css';

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
    }, [navigate]);

    const handleLogout = async () => {
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
                navigate('/');
            }
        } catch (error) {
            console.error('Logout error:', error);
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
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-semibold text-gray-900">
                                Admin Dashboard
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                Welcome, {user?.name || 'Admin'}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard Overview</h2>
                    <p className="mt-1 text-sm text-gray-600">Manage your blog content and track performance</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Posts */}
                    <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <i className="fas fa-file-alt text-blue-600 text-2xl"></i>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Posts</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.total_posts}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Published Posts */}
                    <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <i className="fas fa-check-circle text-green-600 text-2xl"></i>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Published</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.published_posts}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Views */}
                    <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <i className="fas fa-eye text-purple-600 text-2xl"></i>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.total_views.toLocaleString()}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Comments */}
                    <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <i className="fas fa-comments text-yellow-600 text-2xl"></i>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Comments</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.total_comments}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/90 backdrop-blur-sm shadow rounded-lg mb-8">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Admin Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <a href="#" className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                                <i className="fas fa-plus text-blue-600 mr-3"></i>
                                <span className="text-sm font-medium text-gray-900">New Post</span>
                            </a>
                            <a href="#" className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                                <i className="fas fa-edit text-green-600 mr-3"></i>
                                <span className="text-sm font-medium text-gray-900">Edit Posts</span>
                            </a>
                            <a href="#" className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                                <i className="fas fa-comment text-purple-600 mr-3"></i>
                                <span className="text-sm font-medium text-gray-900">Manage Comments</span>
                            </a>
                            <a href="#" className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                                <i className="fas fa-cog text-gray-600 mr-3"></i>
                                <span className="text-sm font-medium text-gray-900">Admin Settings</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="bg-white/90 backdrop-blur-sm shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Posts</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stats.recent_posts.map((post, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{post.views.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    post.status === 'published' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                                                <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 