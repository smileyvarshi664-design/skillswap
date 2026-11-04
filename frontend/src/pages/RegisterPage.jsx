import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight } from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
];

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    department: '',
    year: '2nd Year',
    bio: '',
    profileImage: AVATAR_PRESETS[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your college email');
      return;
    }
    if (!formData.password) {
      setError('Please enter a password');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.college.trim()) {
      setError('Please specify your college or university name');
      return;
    }
    if (!formData.department.trim()) {
      setError('Please specify your department / major');
      return;
    }

    setLoading(true);
    setError('');

    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
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
          maxWidth: '580px',
          width: '100%',
          padding: '1.4rem 1.6rem',
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Brand Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '0.45rem',
              textDecoration: 'none',
            }}
          >
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
              <Sparkles size={16} />
            </div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.3px' }}>
              Skill<span style={{ color: '#4f46e5' }}>Swap</span>
            </span>
          </Link>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15 }}>
            Create Student Account
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '2px' }}>
            Join fellow college peers and exchange skills for free
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              fontSize: '0.8rem',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* Avatar Selector */}
          <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
              Select Avatar:
            </span>
            <div style={{ display: 'flex', gap: '0.45rem' }}>
              {AVATAR_PRESETS.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Avatar ${idx + 1}`}
                  onClick={() => setFormData({ ...formData, profileImage: img })}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: formData.profileImage === img ? '2.5px solid #6366f1' : '1.5px solid #e2e8f0',
                    transform: formData.profileImage === img ? 'scale(1.12)' : 'scale(1)',
                    transition: 'all 0.12s ease',
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            {/* Full Name */}
            <div className="form-group" style={{ marginBottom: '0.55rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Aarav Sharma"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group" style={{ marginBottom: '0.55rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>College Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="student@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            {/* Password */}
            <div className="form-group" style={{ marginBottom: '0.55rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="At least 6 chars"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group" style={{ marginBottom: '0.55rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.65rem' }}>
            {/* College Name */}
            <div className="form-group" style={{ marginBottom: '0.55rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>College / University</label>
              <input
                type="text"
                name="college"
                className="form-input"
                placeholder="National Institute of Tech"
                value={formData.college}
                onChange={handleChange}
                required
              />
            </div>

            {/* Department */}
            <div className="form-group" style={{ marginBottom: '0.55rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Department / Branch</label>
              <input
                type="text"
                name="department"
                className="form-input"
                placeholder="Computer Science"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '0.65rem' }}>
            {/* Year of study */}
            <div className="form-group" style={{ marginBottom: '0.55rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Year of Study</label>
              <select
                name="year"
                className="form-select"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            {/* Bio */}
            <div className="form-group" style={{ marginBottom: '0.55rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Short Bio (Optional)</label>
              <input
                type="text"
                name="bio"
                className="form-input"
                placeholder="E.g. Building full-stack apps & learning UI"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.45rem', padding: '0.65rem' }}
          >
            {loading ? (
              <div className="spinner" style={{ width: '20px', height: '20px' }} />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Link to login */}
          <div style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '0.825rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700 }}>
              Sign In here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
