import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext';
import {
  FaHome,
  FaUsers,
  FaNewspaper,
  FaCog,
  FaPlus,
  FaEdit,
  FaComments,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaBookOpen
} from 'react-icons/fa';

const FBLayout = ({ children, showAdminActions = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Facebook-style colors and styling
  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '56px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e4e6ea',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none',
      color: '#1877f2',
      fontSize: '20px',
      fontWeight: '700',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    headerIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#e4e6ea',
      color: '#1c1e21',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      fontSize: '16px',
    },
    userMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '20px',
      transition: 'background-color 0.2s',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    sidebar: {
      position: 'fixed',
      top: '56px',
      left: showSidebar ? '0' : '-280px',
      width: '280px',
      height: 'calc(100vh - 56px)',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e4e6ea',
      padding: '16px 0',
      overflowY: 'auto',
      zIndex: 999,
      transition: 'left 0.3s ease-in-out',
    },
    sidebarSection: {
      marginBottom: '24px',
    },
    sidebarTitle: {
      fontSize: '17px',
      fontWeight: '600',
      color: '#1c1e21',
      padding: '0 16px 8px',
      margin: '0',
    },
    sidebarItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 16px',
      color: '#1c1e21',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
      transition: 'background-color 0.2s',
      cursor: 'pointer',
    },
    sidebarItemActive: {
      backgroundColor: '#e7f3ff',
      color: '#1877f2',
      borderRight: '3px solid #1877f2',
    },
    sidebarIcon: {
      fontSize: '18px',
      width: '20px',
      textAlign: 'center',
    },
    mainContent: {
      marginLeft: showSidebar ? '280px' : '0',
      marginTop: '56px',
      flex: '1',
      padding: '20px',
      maxWidth: showSidebar ? 'calc(100vw - 280px)' : '100vw',
      transition: 'margin-left 0.3s ease-in-out, max-width 0.3s ease-in-out',
    },
    quickActions: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 1000,
    },
    actionButton: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      backgroundColor: '#1877f2',
      color: 'white',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.2s',
      fontSize: '20px',
    },
    divider: {
      height: '1px',
      backgroundColor: '#e4e6ea',
      margin: '8px 16px',
    },
  };

  const mainNavItems = user?.role === 'admin' ? [
    { path: '/home', icon: FaHome, label: 'Home' },
    { path: '/users', icon: FaUsers, label: 'Users' },
    { path: '/blog', icon: FaNewspaper, label: 'Blog' },
  ] : [
    { path: '/blog', icon: FaNewspaper, label: 'Blog' },
  ];

  const adminNavItems = user?.role === 'admin' ? [
    { path: '/admin', icon: FaChartBar, label: 'Dashboard' },
    { path: '/admin/posts', icon: FaEdit, label: 'Manage Posts' },
    { path: '/admin/comments', icon: FaComments, label: 'Comments' },
    { path: '/admin/settings', icon: FaCog, label: 'Settings' },
  ] : [];

  const adminQuickActions = user?.role === 'admin' && showAdminActions ? [
    {
      icon: FaPlus,
      action: () => navigate('/admin/posts/new'),
      tooltip: 'New Post'
    },
    {
      icon: FaEdit,
      action: () => navigate('/admin/posts'),
      tooltip: 'Edit Posts'
    },
    {
      icon: FaComments,
      action: () => navigate('/admin/comments'),
      tooltip: 'Comments'
    },
  ] : [];

  return (
    <div style={styles.layout}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div
            style={styles.headerIcon}
            onClick={() => setShowSidebar(!showSidebar)}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#d8dadf'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e4e6ea'}
          >
            <FaBars />
          </div>

          <Link to="/home" style={styles.logo}>
            <FaBookOpen />
            Blog Site
          </Link>
        </div>

        <div style={styles.headerRight}>
          <div
            style={styles.userMenu}
            onClick={() => navigate('/profile')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f2f3f5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <img
              src={user?.avatar || `https://i.pravatar.cc/32?u=${user?.id || 1}`}
              alt={user?.name || 'User'}
              style={styles.avatar}
            />
            <span style={{ fontSize: '15px', fontWeight: '500' }}>
              {user?.name || 'User'}
            </span>
          </div>

          <div
            style={styles.headerIcon}
            onClick={handleLogout}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#d8dadf'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e4e6ea'}
          >
            <FaSignOutAlt />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <nav style={styles.sidebar}>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Navigation</h3>
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.sidebarItem,
                  ...(isActive(item.path) ? styles.sidebarItemActive : {})
                }}
                onMouseEnter={(e) => !isActive(item.path) && (e.target.style.backgroundColor = '#f2f3f5')}
                onMouseLeave={(e) => !isActive(item.path) && (e.target.style.backgroundColor = 'transparent')}
              >
                <item.icon style={styles.sidebarIcon} />
                {item.label}
              </Link>
            ))}
          </div>

          {adminNavItems.length > 0 && (
            <>
              <div style={styles.divider} />
              <div style={styles.sidebarSection}>
                <h3 style={styles.sidebarTitle}>Administration</h3>
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      ...styles.sidebarItem,
                      ...(isActive(item.path) ? styles.sidebarItemActive : {})
                    }}
                    onMouseEnter={(e) => !isActive(item.path) && (e.target.style.backgroundColor = '#f2f3f5')}
                    onMouseLeave={(e) => !isActive(item.path) && (e.target.style.backgroundColor = 'transparent')}
                  >
                    <item.icon style={styles.sidebarIcon} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </>
          )}
        </nav>
      )}

      {/* Main Content */}
      <main style={styles.mainContent}>
        {children}
      </main>

      {/* Admin Quick Actions */}
      {adminQuickActions.length > 0 && (
        <div style={styles.quickActions}>
          {adminQuickActions.map((action, index) => (
            <button
              key={index}
              style={styles.actionButton}
              onClick={action.action}
              title={action.tooltip}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#166fe5';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#1877f2';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <action.icon />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FBLayout;
