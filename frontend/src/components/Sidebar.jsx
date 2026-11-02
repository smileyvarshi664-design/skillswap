import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Sparkles,
  BookOpen,
  ArrowLeftRight,
  Repeat,
  User,
  ShieldCheck,
  LogOut,
  GraduationCap,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/explore', label: 'Explore Students', icon: <Users size={20} /> },
    {
      to: '/matches',
      label: 'Smart Matches',
      icon: <Sparkles size={20} />,
      badge: 'Smart Match',
    },
    { to: '/my-skills', label: 'My Skills', icon: <BookOpen size={20} /> },
    { to: '/requests', label: 'Exchange Requests', icon: <ArrowLeftRight size={20} /> },
    { to: '/exchanges', label: 'My Exchanges', icon: <Repeat size={20} /> },
    { to: '/profile', label: 'My Profile', icon: <User size={20} /> },
  ];

  if (isAdmin) {
    navItems.push({
      to: '/admin',
      label: 'Admin Control',
      icon: <ShieldCheck size={20} />,
      badge: 'Admin',
    });
  }

  return (
    <aside className="dashboard-sidebar">
      {/* Brand Header */}
      <div
        style={{
          padding: '1.5rem 1.5rem 1.25rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
          }}
        >
          <GraduationCap size={22} />
        </div>
        <div>
          <h2
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.3px',
              lineHeight: 1.1,
            }}
          >
            Skill<span style={{ color: '#4f46e5' }}>Swap</span>
          </h2>
          <span
            style={{
              fontSize: '0.675rem',
              fontWeight: 700,
              color: '#6366f1',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            Student Exchange
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <div
        style={{
          flex: 1,
          padding: '1.25rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            fontSize: '0.725rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            padding: '0 0.75rem 0.5rem',
          }}
        >
          Main Menu
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.7rem 0.9rem',
              borderRadius: '12px',
              color: isActive ? '#4f46e5' : '#475569',
              backgroundColor: isActive ? '#eef2ff' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.925rem',
              transition: 'all 0.18s ease',
              textDecoration: 'none',
              boxShadow: isActive ? '0 2px 6px rgba(99, 102, 241, 0.08)' : 'none',
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  background: item.badge === 'Admin' ? '#fee2e2' : '#fdf4ff',
                  color: item.badge === 'Admin' ? '#dc2626' : '#9333ea',
                  border: item.badge === 'Admin' ? '1px solid #fca5a5' : '1px solid #f0abfc',
                }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* User Footer Profile */}
      <div
        style={{
          padding: '1rem',
          borderTop: '1px solid #f1f5f9',
          backgroundColor: '#fafafa',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/profile')}
          >
            <img
              src={user?.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
              alt={user?.name || 'User'}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #e0e7ff',
                flexShrink: 0,
              }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name || 'Student'}
              </div>
              <div
                style={{
                  fontSize: '0.725rem',
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.college || user?.email || 'SkillSwap Member'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            style={{
              padding: '8px',
              borderRadius: '8px',
              color: '#94a3b8',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ef4444';
              e.currentTarget.style.backgroundColor = '#fee2e2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
