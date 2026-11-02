import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { userService, feedbackService } from '../services/api';
import {
  User,
  Building2,
  GraduationCap,
  Mail,
  Calendar,
  Save,
  Star,
  ShieldCheck,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
];

const ProfilePage = () => {
  const { user, updateUser, showToast, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    department: '',
    year: '2nd Year',
    bio: '',
    profileImage: '',
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        college: user.college || '',
        department: user.department || '',
        year: user.year || '2nd Year',
        bio: user.bio || '',
        profileImage: user.profileImage || AVATAR_PRESETS[0],
      });

      // Load user reviews
      feedbackService
        .getUserFeedback(user.id || user._id)
        .then((res) => {
          if (res.data && res.data.success) {
            setFeedbacks(res.data.feedbacks || []);
            setAvgRating(res.data.averageRating || 0);
          }
        })
        .catch((err) => console.error('Failed to load reviews:', err))
        .finally(() => setReviewsLoading(false));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await userService.updateProfile(formData);
      if (res.data && res.data.success) {
        updateUser(res.data.user);
        showToast('Your profile has been updated successfully!', 'success');
        refreshUser();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update profile';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="My Student Profile"
      subtitle="Manage your personal information, college details, and peer reputation"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
        {/* Left Column: Profile Card & Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Visual Profile Card */}
          <div
            className="card"
            style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#ffffff',
            }}
          >
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
              <img
                src={formData.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                alt={formData.name}
                style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #e0e7ff',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  border: '3px solid #ffffff',
                }}
                title="Active Student"
              />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{formData.name}</h2>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                padding: '3px 10px',
                borderRadius: '999px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                fontWeight: 700,
                marginTop: '0.35rem',
              }}
            >
              <ShieldCheck size={14} />
              <span>Verified College Student</span>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
                <Building2 size={16} color="#6366f1" />
                <span>{formData.college || 'College not set'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
                <GraduationCap size={16} color="#3b82f6" />
                <span>{formData.department} • {formData.year}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
                <Mail size={16} color="#8b5cf6" />
                <span>{formData.email}</span>
              </div>
            </div>

            {/* Peer Rating Widget */}
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '14px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={20} fill="#f59e0b" color="#f59e0b" />
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#92400e' }}>
                  {avgRating > 0 ? avgRating : 'New'}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>
                {feedbacks.length} Peer Review{feedbacks.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* Peer Reviews List */}
          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <MessageSquare size={18} color="#6366f1" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                Peer Reviews ({feedbacks.length})
              </h3>
            </div>

            {reviewsLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 0.5rem' }} />
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Loading reviews...</span>
              </div>
            ) : feedbacks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {feedbacks.map((f) => (
                  <div
                    key={f._id}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>
                        {f.reviewerId?.name || 'Fellow Student'}
                      </span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={13}
                            fill={s <= f.rating ? '#f59e0b' : '#e2e8f0'}
                            color={s <= f.rating ? '#f59e0b' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: '#475569', fontStyle: 'italic' }}>
                      "{f.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '1rem 0' }}>
                No feedback received yet. Complete skill exchanges to earn peer endorsements!
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <User size={20} color="#4f46e5" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Edit Profile Information
            </h3>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Avatar Picker */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.6rem' }}>
                Choose Profile Avatar:
              </label>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {AVATAR_PRESETS.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Preset ${idx + 1}`}
                    onClick={() => setFormData({ ...formData, profileImage: img })}
                    style={{
                      width: '44px',
                      height: '44px',
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
              <input
                type="url"
                name="profileImage"
                className="form-input"
                placeholder="Or paste custom image URL..."
                value={formData.profileImage}
                onChange={handleChange}
              />
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email (Readonly) */}
            <div className="form-group">
              <label className="form-label">Email Address (Registered)</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                disabled
                style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
              />
            </div>

            {/* College & Department */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">College / University</label>
                <input
                  type="text"
                  name="college"
                  className="form-input"
                  value={formData.college}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department / Major</label>
                <input
                  type="text"
                  name="department"
                  className="form-input"
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
              <label className="form-label">Student Bio</label>
              <textarea
                name="bio"
                className="form-textarea"
                rows={4}
                placeholder="Tell other students about your background, interests, and what you love learning..."
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
                {loading ? (
                  <div className="spinner" style={{ width: '20px', height: '20px' }} />
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
