import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1rem',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '2.5rem',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              }}
            >
              <Sparkles size={22} />
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e1b4b' }}>
              Skill<span style={{ color: '#4f46e5' }}>Swap</span>
            </span>
          </Link>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Sign in to your SkillSwap student or admin portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Quick Demo Credentials Panel */}
        <div
          style={{
            backgroundColor: '#eef2ff',
            borderRadius: '14px',
            padding: '1rem',
            border: '1px solid #c7d2fe',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#4338ca', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ⚡ 1-Click Demo Accounts (For Faculty Demo):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('aarav@skillswap.edu', 'Student@123')}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.4rem',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#4f46e5',
                border: '1px solid #c7d2fe',
              }}
            >
              Aarav (Student)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('priya@skillswap.edu', 'Student@123')}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.4rem',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
              }}
            >
              Priya (Student)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@skillswap.edu', 'Admin@123')}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.4rem',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#dc2626',
                border: '1px solid #fecaca',
              }}
            >
              Admin Panel
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
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            {loading ? (
              <div className="spinner" style={{ width: '22px', height: '22px' }} />
            ) : (
              <>
                <span>Sign In to SkillSwap</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Link to Register */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
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
