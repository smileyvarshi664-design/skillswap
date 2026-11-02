import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, User as UserIcon, LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.85rem 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.4rem',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: '#1e1b4b',
              }}
            >
              Skill<span style={{ color: '#4f46e5' }}>Swap</span>
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.65rem',
                color: '#64748b',
                fontWeight: 600,
                letterSpacing: '0.5px',
                marginTop: '-4px',
              }}
            >
              CAMPUS SKILL EXCHANGE
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
          }}
        >
          <Link
            to="/#how-it-works"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: '#475569',
              transition: 'color 0.2s',
            }}
          >
            How It Works
          </Link>
          <Link
            to="/explore"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: '#475569',
              transition: 'color 0.2s',
            }}
          >
            Explore Students
          </Link>
          <Link
            to="/#benefits"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: '#475569',
              transition: 'color 0.2s',
            }}
          >
            Benefits
          </Link>
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/dashboard" className="btn btn-primary btn-sm">
                <LayoutDashboard size={16} />
                <span>My Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn btn-secondary btn-sm"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <span>Get Started</span>
                <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
