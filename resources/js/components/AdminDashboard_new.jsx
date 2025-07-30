import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../authContext';
import FBLayout from './FBLayout';
import {
  FaUsers,
  FaNewspaper,
  FaComments,
  FaEye,
  FaHeart,
  FaPlus,
  FaEdit,
  FaCog,
} from 'react-icons/fa';

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
    const [error, setError] = useState('');
    const { user: contextUser } = useAuth();

    useEffect(() => {
        if (!contextUser || contextUser.role !== 'admin') {
            setError('Authentication required');
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        fetch('/api/admin/dashboard', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': decodeURIComponent(document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1] || ''),
            },
            signal: controller.signal
        })
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setUser(data.user);
            if (data.stats) {
                setStats(prevStats => ({
                    ...prevStats,
                    ...data.stats
                }));
            }
            setLoading(false);
        })
        .catch(error => {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                setError('Request timed out');
            } else {
                setError('Failed to load dashboard data');
            }
            setLoading(false);
        });

        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, [contextUser]);

    if (loading) {
        return (
            <FBLayout showSidebar={false}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid #e4e6ea',
                        borderTop: '3px solid #1877f2',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ color: '#65676b', fontSize: '16px' }}>Loading dashboard...</p>
                </div>
            </FBLayout>
        );
    }

    if (error) {
        return (
            <FBLayout showSidebar={false}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <p style={{ color: '#e41e5f', fontSize: '16px' }}>{error}</p>
                    <Link
                        to="/admin/login"
                        style={{
                            background: '#1877f2',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            textDecoration: 'none'
                        }}
                    >
                        Go to Admin Login
                    </Link>
                </div>
            </FBLayout>
        );
    }

    const fbStyles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
        },
        header: {
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '20px',
            border: '1px solid #e4e6ea',
        },
        title: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#1c1e21',
            margin: '0 0 8px 0',
        },
        subtitle: {
            fontSize: '16px',
            color: '#65676b',
            margin: '0',
        },
        grid: {
            display: 'grid',
            gap: '20px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            marginBottom: '20px',
        },
        card: {
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '20px',
            border: '1px solid #e4e6ea',
            transition: 'box-shadow 0.2s',
        },
        cardTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#1c1e21',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        statValue: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#1877f2',
            margin: '0',
        },
        statLabel: {
            fontSize: '14px',
            color: '#65676b',
            margin: '4px 0 0 0',
        },
        actionGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '20px',
        },
        actionCard: {
            backgroundColor: '#ffffff',
            border: '1px solid #e4e6ea',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            textDecoration: 'none',
            color: '#1c1e21',
            transition: 'all 0.2s',
            cursor: 'pointer',
        },
        actionIcon: {
            fontSize: '24px',
            color: '#1877f2',
            marginBottom: '8px',
        },
        actionTitle: {
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 4px 0',
        },
        actionDescription: {
            fontSize: '14px',
            color: '#65676b',
            margin: '0',
        },
        recentPostsList: {
            listStyle: 'none',
            padding: '0',
            margin: '0',
        },
        recentPostItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #f0f2f5',
        },
        postTitle: {
            fontSize: '15px',
            fontWeight: '500',
            color: '#1c1e21',
            margin: '0',
        },
        postStats: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '14px',
            color: '#65676b',
        },
        badge: {
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
        },
        badgePublished: {
            backgroundColor: '#d4edda',
            color: '#155724',
        },
        badgeDraft: {
            backgroundColor: '#fff3cd',
            color: '#856404',
        },
    };

    const quickActions = [
        {
            title: 'New Post',
            description: 'Create a new blog post',
            icon: FaPlus,
            link: '/admin/posts/new',
            color: '#42b883'
        },
        {
            title: 'Manage Posts',
            description: 'Edit existing posts',
            icon: FaEdit,
            link: '/admin/posts',
            color: '#1877f2'
        },
        {
            title: 'Comments',
            description: 'Moderate comments',
            icon: FaComments,
            link: '/admin/comments',
            color: '#fd7e14'
        },
        {
            title: 'Settings',
            description: 'Admin configuration',
            icon: FaCog,
            link: '/admin/settings',
            color: '#6f42c1'
        }
    ];

    return (
        <FBLayout showAdminActions={true}>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            <div style={fbStyles.container}>
                {/* Header */}
                <div style={fbStyles.header}>
                    <h1 style={fbStyles.title}>Admin Dashboard</h1>
                    <p style={fbStyles.subtitle}>
                        Welcome back, {user?.name || contextUser?.name || 'Admin'}! Here's your blog overview.
                    </p>
                </div>

                {/* Statistics Grid */}
                <div style={fbStyles.grid}>
                    <div
                        style={fbStyles.card}
                        onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'}
                        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                    >
                        <h3 style={fbStyles.cardTitle}>
                            <FaNewspaper style={{ color: '#1877f2' }} />
                            Total Posts
                        </h3>
                        <p style={fbStyles.statValue}>{stats.total_posts}</p>
                        <p style={fbStyles.statLabel}>Published & Draft</p>
                    </div>

                    <div
                        style={fbStyles.card}
                        onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'}
                        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                    >
                        <h3 style={fbStyles.cardTitle}>
                            <FaEye style={{ color: '#42b883' }} />
                            Total Views
                        </h3>
                        <p style={fbStyles.statValue}>{stats.total_views.toLocaleString()}</p>
                        <p style={fbStyles.statLabel}>All time views</p>
                    </div>

                    <div
                        style={fbStyles.card}
                        onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'}
                        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                    >
                        <h3 style={fbStyles.cardTitle}>
                            <FaComments style={{ color: '#fd7e14' }} />
                            Comments
                        </h3>
                        <p style={fbStyles.statValue}>{stats.total_comments}</p>
                        <p style={fbStyles.statLabel}>User interactions</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={fbStyles.card}>
                    <h3 style={fbStyles.cardTitle}>Quick Actions</h3>
                    <div style={fbStyles.actionGrid}>
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                to={action.link}
                                style={fbStyles.actionCard}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#f8f9fa';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#ffffff';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <action.icon style={{ ...fbStyles.actionIcon, color: action.color }} />
                                <h4 style={fbStyles.actionTitle}>{action.title}</h4>
                                <p style={fbStyles.actionDescription}>{action.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Posts */}
                <div style={fbStyles.card}>
                    <h3 style={fbStyles.cardTitle}>
                        <FaNewspaper style={{ color: '#1877f2' }} />
                        Recent Posts
                    </h3>
                    <ul style={fbStyles.recentPostsList}>
                        {stats.recent_posts.map((post, index) => (
                            <li key={index} style={fbStyles.recentPostItem}>
                                <div>
                                    <h4 style={fbStyles.postTitle}>{post.title}</h4>
                                    <div style={fbStyles.postStats}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FaEye /> {post.views}
                                        </span>
                                        <span
                                            style={{
                                                ...fbStyles.badge,
                                                ...(post.status === 'published' ? fbStyles.badgePublished : fbStyles.badgeDraft)
                                            }}
                                        >
                                            {post.status}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </FBLayout>
    );
};

export default AdminDashboard;
