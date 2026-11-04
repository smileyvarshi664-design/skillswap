import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(res.message);
    }
  };

  // Quick Demo Logins for Faculty / Evaluator Demo
  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        backgroundImage: 'radial-gradient(ellipse at 15% 15%, #eef2ff 0%, #f8fafc 50%, #f1f5f9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '1.75rem',
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.65rem',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 3px 10px rgba(99, 102, 241, 0.3)',
              }}
            >
              <Sparkles size={18} />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.4px' }}>
              Skill<span style={{ color: '#4f46e5' }}>Swap</span>
            </span>
          </Link>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15 }}>
            Welcome Back
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.825rem', marginTop: '0.2rem' }}>
            Sign in to your student or administrator portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              fontSize: '0.825rem',
              fontWeight: 500,
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Quick Demo Credentials Panel */}
        <div
          style={{
            backgroundColor: '#eef2ff',
            borderRadius: '10px',
            padding: '0.65rem 0.85rem',
            border: '1px solid #c7d2fe',
            marginBottom: '1.15rem',
          }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4338ca', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ⚡ 1-Click Demo Accounts:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('aarav@skillswap.edu', 'Student@123')}
              style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.3rem 0.4rem',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#4f46e5',
                border: '1px solid #c7d2fe',
                cursor: 'pointer',
              }}
            >
              Aarav (Student)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('priya@skillswap.edu', 'Student@123')}
              style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.3rem 0.4rem',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
                cursor: 'pointer',
              }}
            >
              Priya (Student)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@skillswap.edu', 'Admin@123')}
              style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.3rem 0.4rem',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#dc2626',
                border: '1px solid #fecaca',
                cursor: 'pointer',
              }}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="student@skillswap.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.65rem' }}
          >
            {loading ? (
              <div className="spinner" style={{ width: '20px', height: '20px' }} />
            ) : (
              <>
                <span>Sign In to SkillSwap</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Link to Register */}
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.825rem', color: '#64748b' }}>
            New to SkillSwap?{' '}
            <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700 }}>
              Create student account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
