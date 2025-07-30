import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FBLayout from '../components/FBLayout';
import {
  FaUsers,
  FaSearch,
  FaNewspaper,
  FaEye,
  FaHeart,
  FaComment,
  FaCalendar,
  FaUser,
  FaEnvelope,
  FaCrown,
  FaUserTie
} from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        const usersData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
        // Set some mock data for demonstration
        const mockUsers = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            posts_count: 15,
            total_views: 2340,
            total_likes: 156,
            created_at: '2025-01-15T00:00:00Z'
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'user',
            posts_count: 8,
            total_views: 1120,
            total_likes: 89,
            created_at: '2025-02-20T00:00:00Z'
          },
          {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike@example.com',
            role: 'user',
            posts_count: 12,
            total_views: 1890,
            total_likes: 134,
            created_at: '2025-01-30T00:00:00Z'
          }
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

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
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#65676b',
      margin: '0 0 20px 0',
    },
    searchContainer: {
      position: 'relative',
      maxWidth: '400px',
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px 12px 40px',
      border: '1px solid #e4e6ea',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#65676b',
      fontSize: '16px',
    },
    usersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px',
    },
    userCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '20px',
      border: '1px solid #e4e6ea',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    userHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '16px',
    },
    userAvatar: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid #e4e6ea',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1c1e21',
      margin: '0 0 4px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    userEmail: {
      fontSize: '14px',
      color: '#65676b',
      margin: '0 0 4px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    userRole: {
      fontSize: '12px',
      fontWeight: '600',
      padding: '4px 8px',
      borderRadius: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    adminRole: {
      backgroundColor: '#e3f2fd',
      color: '#1565c0',
    },
    userRoleNormal: {
      backgroundColor: '#f3e5f5',
      color: '#7b1fa2',
    },
    userStats: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '12px',
    },
    statItem: {
      textAlign: 'center',
      padding: '12px 8px',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px',
    },
    statNumber: {
      display: 'block',
      fontSize: '18px',
      fontWeight: '700',
      color: '#1877f2',
      marginBottom: '4px',
    },
    statLabel: {
      fontSize: '12px',
      color: '#65676b',
      fontWeight: '500',
    },
    userJoinDate: {
      fontSize: '13px',
      color: '#65676b',
      marginTop: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      flexDirection: 'column',
      gap: '16px',
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid #e4e6ea',
      borderTop: '3px solid #1877f2',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#65676b',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e4e6ea',
    },
    emptyStateIcon: {
      fontSize: '48px',
      color: '#e4e6ea',
      marginBottom: '16px',
    },
    emptyStateTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1c1e21',
      marginBottom: '8px',
    },
    emptyStateText: {
      fontSize: '15px',
      color: '#65676b',
    },
  };

  if (loading) {
    return (
      <FBLayout>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={fbStyles.container}>
          <div style={fbStyles.loadingContainer}>
            <div style={fbStyles.spinner}></div>
            <p style={{ color: '#65676b', fontSize: '16px' }}>Loading users...</p>
          </div>
        </div>
      </FBLayout>
    );
  }

  return (
    <FBLayout>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={fbStyles.container}>
        {/* Header */}
        <div style={fbStyles.header}>
          <h1 style={fbStyles.title}>
            <FaUsers style={{ color: '#1877f2' }} />
            Community Writers
          </h1>
          <p style={fbStyles.subtitle}>
            Meet the talented writers and contributors who make our blog community amazing.
          </p>

          {/* Search */}
          <div style={fbStyles.searchContainer}>
            <FaSearch style={fbStyles.searchIcon} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={fbStyles.searchInput}
              onFocus={(e) => e.target.style.borderColor = '#1877f2'}
              onBlur={(e) => e.target.style.borderColor = '#e4e6ea'}
            />
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div style={fbStyles.emptyState}>
            <FaUsers style={fbStyles.emptyStateIcon} />
            <h3 style={fbStyles.emptyStateTitle}>
              {searchTerm ? 'No users found' : 'No users yet'}
            </h3>
            <p style={fbStyles.emptyStateText}>
              {searchTerm
                ? 'Try adjusting your search terms.'
                : 'Users will appear here once they join the community.'
              }
            </p>
          </div>
        ) : (
          <div style={fbStyles.usersGrid}>
            {filteredUsers.map(user => (
              <div
                key={user.id}
                style={fbStyles.userCard}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {/* User Header */}
                <div style={fbStyles.userHeader}>
                  <img
                    src={user.avatar || `https://i.pravatar.cc/60?u=${user.id}`}
                    alt={user.name}
                    style={fbStyles.userAvatar}
                  />
                  <div style={fbStyles.userInfo}>
                    <h3 style={fbStyles.userName}>
                      {user.name}
                      {user.role === 'admin' ? (
                        <FaCrown style={{ color: '#ffd700', fontSize: '16px' }} />
                      ) : (
                        <FaUser style={{ color: '#65676b', fontSize: '14px' }} />
                      )}
                    </h3>
                    <p style={fbStyles.userEmail}>
                      <FaEnvelope />
                      {user.email}
                    </p>
                    <span style={{
                      ...fbStyles.userRole,
                      ...(user.role === 'admin' ? fbStyles.adminRole : fbStyles.userRoleNormal)
                    }}>
                      {user.role === 'admin' ? 'Administrator' : 'Writer'}
                    </span>
                  </div>
                </div>

                {/* User Stats */}
                <div style={fbStyles.userStats}>
                  <div style={fbStyles.statItem}>
                    <span style={fbStyles.statNumber}>{user.posts_count || 0}</span>
                    <span style={fbStyles.statLabel}>Posts</span>
                  </div>
                  <div style={fbStyles.statItem}>
                    <span style={fbStyles.statNumber}>
                      {user.total_views > 1000
                        ? `${(user.total_views / 1000).toFixed(1)}k`
                        : user.total_views || 0}
                    </span>
                    <span style={fbStyles.statLabel}>Views</span>
                  </div>
                  <div style={fbStyles.statItem}>
                    <span style={fbStyles.statNumber}>{user.total_likes || 0}</span>
                    <span style={fbStyles.statLabel}>Likes</span>
                  </div>
                </div>

                {/* Join Date */}
                <div style={fbStyles.userJoinDate}>
                  <FaCalendar />
                  Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FBLayout>
  );
};

export default Users;
