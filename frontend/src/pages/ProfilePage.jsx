import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { userService, feedbackService } from '../services/api';
import {
  User,
  Building2,
  GraduationCap,
  Mail,
  Save,
  Star,
  ShieldCheck,
  MessageSquare,
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
      subtitle="Manage your personal details, campus affiliations, and review standing"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1rem' }} className="profile-layout-grid">
        {/* Left Column: Visual Profile Card & Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Visual Profile Card */}
          <div
            className="card"
            style={{
              padding: '1.15rem',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '14px',
            }}
          >
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.65rem' }}>
              <img
                src={formData.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                alt={formData.name}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #e0e7ff',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.15)',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  border: '2px solid #ffffff',
                }}
                title="Active Student"
              />
            </div>

            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{formData.name}</h2>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                fontWeight: 700,
                marginTop: '0.25rem',
              }}
            >
              <ShieldCheck size={12} />
              <span>Verified Student</span>
            </div>

            <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#475569' }}>
                <Building2 size={13} color="#6366f1" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formData.college || 'College not set'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#475569' }}>
                <GraduationCap size={13} color="#3b82f6" />
                <span>{formData.department} • {formData.year}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#475569' }}>
                <Mail size={13} color="#8b5cf6" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formData.email}</span>
              </div>
            </div>

            {/* Peer Rating Widget */}
            <div
              style={{
                marginTop: '0.85rem',
                padding: '0.55rem 0.85rem',
                borderRadius: '10px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#92400e' }}>
                  {avgRating > 0 ? avgRating : 'New'}
                </span>
              </div>
              <span style={{ fontSize: '0.725rem', color: '#b45309', fontWeight: 600 }}>
                {feedbacks.length} Peer Review{feedbacks.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* Peer Reviews List */}
          <div className="card" style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
              <MessageSquare size={15} color="#6366f1" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                Peer Reviews ({feedbacks.length})
              </h3>
            </div>

            {reviewsLoading ? (
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 0.35rem', width: '20px', height: '20px' }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Loading reviews...</span>
              </div>
            ) : feedbacks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', maxHeight: '200px', overflowY: 'auto' }}>
                {feedbacks.map((f) => (
                  <div
                    key={f._id}
                    style={{
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#1e293b' }}>
                        {f.reviewerId?.name || 'Fellow Student'}
                      </span>
                      <div style={{ display: 'flex', gap: '1px' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={11}
                            fill={s <= f.rating ? '#f59e0b' : '#e2e8f0'}
                            color={s <= f.rating ? '#f59e0b' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#475569', fontStyle: 'italic' }}>
                      "{f.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic', textAlign: 'center', padding: '0.75rem 0' }}>
                No reviews yet. Complete exchanges to earn ratings!
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="card" style={{ padding: '1.15rem 1.35rem', backgroundColor: '#ffffff', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem', paddingBottom: '0.65rem', borderBottom: '1px solid #f1f5f9' }}>
            <User size={17} color="#4f46e5" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              Edit Profile Information
            </h3>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Avatar Picker */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                Choose Profile Avatar:
              </label>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
                {AVATAR_PRESETS.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Preset ${idx + 1}`}
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
              <input
                type="url"
                name="profileImage"
                className="form-input"
                style={{ fontSize: '0.78rem', padding: '0.45rem 0.75rem' }}
                placeholder="Or paste custom image URL..."
                value={formData.profileImage}
                onChange={handleChange}
              />
            </div>

            {/* Full Name & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div className="form-group" style={{ marginBottom: '0.55rem' }}>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.55rem' }}>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Email (Registered)</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  disabled
                  style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
                />
              </div>
            </div>

            {/* College & Department */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.65rem' }}>
              <div className="form-group" style={{ marginBottom: '0.55rem' }}>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>College / University</label>
                <input
                  type="text"
                  name="college"
                  className="form-input"
                  value={formData.college}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.55rem' }}>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Department / Branch</label>
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
            <div className="form-group" style={{ marginBottom: '0.55rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Year of Study</label>
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
            <div className="form-group" style={{ marginBottom: '0.55rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Student Bio</label>
              <textarea
                name="bio"
                className="form-textarea"
                rows={2}
                placeholder="Tell peers what you love teaching and learning..."
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.65rem' }}>
              <button type="submit" disabled={loading} className="btn btn-primary btn-sm" style={{ padding: '0.45rem 1.15rem' }}>
                {loading ? (
                  <div className="spinner" style={{ width: '18px', height: '18px' }} />
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .profile-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ProfilePage;
