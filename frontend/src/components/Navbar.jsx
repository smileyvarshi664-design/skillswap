import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, LayoutDashboard, LogOut, Info, X } from 'lucide-react';

const Navbar = ({ onAboutClick, onHowItWorksClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showInternalAbout, setShowInternalAbout] = useState(false);

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (onAboutClick) {
      onAboutClick();
    } else {
      setShowInternalAbout(true);
    }
  };

  const handleHowItWorksClick = (e) => {
    if (onHowItWorksClick) {
      e.preventDefault();
      onHowItWorksClick();
    } else if (location.pathname !== '/') {
      navigate('/#how-it-works');
    }
  };

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.42rem 0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 3px 10px rgba(99, 102, 241, 0.35)',
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  letterSpacing: '-0.4px',
                  color: '#1e1b4b',
                  lineHeight: 1.1,
                  display: 'block',
                }}
              >
                Skill<span style={{ color: '#4f46e5' }}>Swap</span>
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.6rem',
                  color: '#64748b',
                  fontWeight: 700,
                  letterSpacing: '0.6px',
                  lineHeight: 1,
                }}
              >
                STUDENT SKILL EXCHANGE
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.4rem',
            }}
            className="navbar-center-links"
          >
            <Link
              to="/"
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: location.pathname === '/' ? '#4f46e5' : '#475569',
                transition: 'color 0.15s ease',
              }}
            >
              Home
            </Link>

            <button
              type="button"
              onClick={handleAboutClick}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#4f46e5')}
              onMouseLeave={(e) => (e.target.style.color = '#475569')}
            >
              About
            </button>

            <a
              href="#how-it-works"
              onClick={handleHowItWorksClick}
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#475569',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#4f46e5')}
              onMouseLeave={(e) => (e.target.style.color = '#475569')}
            >
              How It Works
            </a>

            <Link
              to="/explore"
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: location.pathname === '/explore' ? '#4f46e5' : '#475569',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#4f46e5')}
              onMouseLeave={(e) =>
                (e.target.style.color = location.pathname === '/explore' ? '#4f46e5' : '#475569')
              }
            >
              Explore Skills
            </Link>
          </div>

          {/* Action Buttons: Login & Get Started */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/dashboard" className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.8rem', fontSize: '0.825rem' }}>
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="btn btn-secondary btn-sm"
                  title="Log Out"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.825rem' }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-secondary btn-sm"
                  style={{
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                  style={{
                    padding: '0.35rem 0.95rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Internal About Modal (used when onAboutClick is not passed) */}
      {showInternalAbout && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
          onClick={() => setShowInternalAbout(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#e0e7ff',
                    color: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Info size={18} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>About SkillSwap</h3>
              </div>
              <button
                onClick={() => setShowInternalAbout(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={16} />
              </button>
            </div>
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.85rem' }}>
              <strong>SkillSwap</strong> is a student-first peer knowledge exchange platform. It enables college students to barter their skills without any monetary transactions.
            </p>
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Whether you are teaching Python, learning UI/UX Design, practicing Photography, or improving Communication, SkillSwap connects you with the perfect campus partner.
            </p>
            <button
              onClick={() => setShowInternalAbout(false)}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', padding: '0.55rem' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
