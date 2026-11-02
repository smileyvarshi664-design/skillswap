import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Building2,
  GraduationCap,
  Calendar,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
];

const RegisterPage = () => {
  const { register, showToast } = useAuth();
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

    // Validation
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1rem',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '680px',
          width: '100%',
          padding: '2.5rem',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Brand Top Header */}
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
            Create Student Account
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Join your fellow college peers and start exchanging skills today
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* Avatar Selector */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <label className="form-label" style={{ justifyContent: 'center', marginBottom: '0.6rem' }}>
              Choose Profile Avatar:
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              {AVATAR_PRESETS.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Avatar ${idx + 1}`}
                  onClick={() => setFormData({ ...formData, profileImage: img })}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: formData.profileImage === img ? '3px solid #6366f1' : '2px solid #e2e8f0',
                    transform: formData.profileImage === img ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">College Email</label>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* College Name */}
            <div className="form-group">
              <label className="form-label">College / University Name</label>
              <input
                type="text"
                name="college"
                className="form-input"
                placeholder="e.g. National Institute of Tech"
                value={formData.college}
                onChange={handleChange}
                required
              />
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label">Department / Major</label>
              <input
                type="text"
                name="department"
                className="form-input"
                placeholder="e.g. Computer Science, Design"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Year of study */}
          <div className="form-group">
            <label className="form-label">Year of Study</label>
            <select
              name="year"
              className="form-select"
              value={formData.year}
              onChange={handleChange}
              required
            >
              <option value="1st Year">1st Year (Freshman)</option>
              <option value="2nd Year">2nd Year (Sophomore)</option>
              <option value="3rd Year">3rd Year (Junior)</option>
              <option value="4th Year">4th Year (Senior)</option>
              <option value="Postgraduate">Postgraduate / Masters</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">Short Bio (Optional)</label>
            <textarea
              name="bio"
              className="form-textarea"
              rows={2}
              placeholder="What are you currently passionate about or building?"
              value={formData.bio}
              onChange={handleChange}
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
                <span>Complete Registration</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Link to login */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
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
