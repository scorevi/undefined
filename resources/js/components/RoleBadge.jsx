import React from 'react';
import { FaCrown, FaUser, FaUserShield } from 'react-icons/fa';
import './Styles/RoleBadge.css';

const RoleBadge = ({ role, className = '' }) => {
  if (!role) return null;

  const getRoleConfig = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return {
          icon: <FaCrown />,
          text: 'Admin',
          className: 'role-badge-admin'
        };
      case 'moderator':
        return {
          icon: <FaUserShield />,
          text: 'Mod',
          className: 'role-badge-moderator'
        };
      case 'user':
        return {
          icon: <FaUser />,
          text: 'User',
          className: 'role-badge-user'
        };
      default:
        return {
          icon: <FaUser />,
          text: role,
          className: 'role-badge-default'
        };
    }
  };

  const config = getRoleConfig(role);

  return (
    <span className={`role-badge ${config.className} ${className}`}>
      <span className="role-badge-icon">{config.icon}</span>
      <span className="role-badge-text">{config.text}</span>
    </span>
  );
};

export default RoleBadge;
