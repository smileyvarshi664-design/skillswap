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
  X,
} from 'lucide-react';

const Sidebar = ({ onCloseMobile }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
    { to: '/explore', label: 'Explore Students', icon: <Users size={17} /> },
    {
      to: '/matches',
      label: 'Smart Matches',
      icon: <Sparkles size={17} />,
      badge: 'Match',
    },
    { to: '/my-skills', label: 'My Skills', icon: <BookOpen size={17} /> },
    { to: '/requests', label: 'Exchange Requests', icon: <ArrowLeftRight size={17} /> },
    { to: '/exchanges', label: 'My Exchanges', icon: <Repeat size={17} /> },
    { to: '/profile', label: 'My Profile', icon: <User size={17} /> },
  ];

  if (isAdmin) {
    navItems.push({
      to: '/admin',
      label: 'Admin Control',
      icon: <ShieldCheck size={17} />,
      badge: 'Admin',
    });
  }

  return (
    <aside
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '0.85rem 1rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 3px 8px rgba(99, 102, 241, 0.3)',
            }}
          >
            <GraduationCap size={18} />
          </div>
          <div>
            <h2
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.15rem',
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
                fontSize: '0.625rem',
                fontWeight: 700,
                color: '#6366f1',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              Student Portal
            </span>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px',
            }}
            className="mobile-close-btn"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <div
        style={{
          flex: 1,
          padding: '0.75rem 0.65rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.2rem',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            fontSize: '0.675rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            padding: '0 0.5rem 0.35rem',
          }}
        >
          Menu
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onCloseMobile}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.65rem',
              borderRadius: '9px',
              color: isActive ? '#4f46e5' : '#475569',
              backgroundColor: isActive ? '#eef2ff' : 'transparent',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.85rem',
              transition: 'all 0.15s ease',
              textDecoration: 'none',
              boxShadow: isActive ? '0 1px 3px rgba(99, 102, 241, 0.08)' : 'none',
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span
                style={{
                  fontSize: '0.6rem',
                  padding: '1px 6px',
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
          padding: '0.65rem 0.75rem',
          borderTop: '1px solid #f1f5f9',
          backgroundColor: '#fafafa',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              overflow: 'hidden',
              cursor: 'pointer',
              flex: 1,
            }}
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              navigate('/profile');
            }}
          >
            <img
              src={user?.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
              alt={user?.name || 'User'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #e0e7ff',
                flexShrink: 0,
              }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.1,
                }}
              >
                {user?.name || 'Student'}
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.1,
                  marginTop: '1px',
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
              padding: '6px',
              borderRadius: '6px',
              color: '#94a3b8',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
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
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
