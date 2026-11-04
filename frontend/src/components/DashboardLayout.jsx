import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      {/* Sidebar with mobile toggle class */}
      <div className={sidebarOpen ? 'dashboard-sidebar open' : 'dashboard-sidebar'}>
        <Sidebar onCloseMobile={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 35,
          }}
        />
      )}

      {/* Main Content Pane */}
      <main className="dashboard-main">
        {/* Top Navbar Header */}
        <header
          style={{
            height: '52px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.25rem',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          {/* Mobile hamburger & Page Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: 'none',
                padding: '5px',
                borderRadius: '8px',
                color: '#475569',
                background: '#f1f5f9',
                border: 'none',
              }}
              className="mobile-menu-btn"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15 }}>
                {title}
              </h1>
              {subtitle && (
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1px', lineHeight: 1 }}>{subtitle}</p>
              )}
            </div>
          </div>

          {/* Quick Actions & User Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Link
              to="/matches"
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: '1.5px solid #c7d2fe',
                background: '#f5f3ff',
                color: '#6366f1',
                padding: '0.3rem 0.75rem',
                fontSize: '0.8rem',
              }}
            >
              <Sparkles size={14} />
              <span style={{ fontWeight: 700 }}>Find Matches</span>
            </Link>

            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '3px 8px 3px 3px',
                borderRadius: '999px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
              }}
            >
              <img
                src={user?.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                alt={user?.name}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                {user?.name?.split(' ')[0]}
              </span>
            </Link>
          </div>
        </header>

        {/* Inner Content Area */}
        <div className="dashboard-content">{children}</div>
      </main>

      <style>{`
        @media (max-width: 992px) {
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
