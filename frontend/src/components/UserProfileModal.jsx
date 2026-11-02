import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';
import { X, Star, GraduationCap, Building2, BookOpen, Sparkles, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

const UserProfileModal = ({ studentId, isOpen, onClose, onRequestExchange }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && studentId) {
      setLoading(true);
      userService
        .getUserById(studentId)
        .then((res) => {
          if (res.data && res.data.success) {
            setProfile(res.data.user);
          }
        })
        .catch((err) => console.error('Failed to fetch student profile:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, studentId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Student Profile
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="spinner" />
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading student details...</span>
          </div>
        ) : profile ? (
          <div style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
            {/* Top Identity Card */}
            <div
              style={{
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <img
                src={profile.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                alt={profile.name}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  border: '2px solid #e0e7ff',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{profile.name}</h2>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.725rem',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: '#ecfdf5',
                      color: '#059669',
                      fontWeight: 600,
                    }}
                  >
                    <ShieldCheck size={13} /> Verified Student
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  <Building2 size={15} color="#6366f1" />
                  <span>{profile.college}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.825rem', marginTop: '0.15rem' }}>
                  <GraduationCap size={15} color="#3b82f6" />
                  <span>{profile.department} • {profile.year}</span>
                </div>
              </div>
            </div>

            {/* Rating Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.25rem',
                backgroundColor: '#fffbeb',
                borderRadius: '12px',
                border: '1px solid #fef3c7',
                margin: '1.25rem 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={17}
                      fill={star <= Math.round(profile.rating || 0) ? '#f59e0b' : '#e2e8f0'}
                      color={star <= Math.round(profile.rating || 0) ? '#f59e0b' : '#cbd5e1'}
                    />
                  ))}
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#92400e' }}>
                  {profile.rating > 0 ? profile.rating : 'No reviews yet'}
                </span>
              </div>
              <span style={{ fontSize: '0.825rem', color: '#b45309', fontWeight: 600 }}>
                {profile.reviewCount} peer review{profile.reviewCount === 1 ? '' : 's'}
              </span>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  About Student
                </h4>
                <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.5, background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Skills: Teaching */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
                <BookOpen size={16} color="#4f46e5" />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                  Skills {profile.name} Can Teach ({profile.teachSkills?.length || 0})
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {profile.teachSkills && profile.teachSkills.length > 0 ? (
                  profile.teachSkills.map((skill) => (
                    <div
                      key={skill._id}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #e0e7ff',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e1b4b' }}>{skill.skillName}</span>
                          <span className="badge badge-teach" style={{ fontSize: '0.7rem' }}>{skill.category}</span>
                        </div>
                        {skill.description && (
                          <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.2rem' }}>{skill.description}</p>
                        )}
                      </div>
                      <span className={`badge badge-${skill.proficiencyLevel.toLowerCase()}`}>
                        {skill.proficiencyLevel}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>No skills listed yet.</p>
                )}
              </div>
            </div>

            {/* Skills: Learning */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
                <Sparkles size={16} color="#2563eb" />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                  Skills {profile.name} Wants to Learn ({profile.learnSkills?.length || 0})
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {profile.learnSkills && profile.learnSkills.length > 0 ? (
                  profile.learnSkills.map((skill) => (
                    <div
                      key={skill._id}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #dbeafe',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e3a8a' }}>{skill.skillName}</span>
                          <span className="badge badge-learn" style={{ fontSize: '0.7rem' }}>{skill.category}</span>
                        </div>
                        {skill.description && (
                          <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.2rem' }}>{skill.description}</p>
                        )}
                      </div>
                      <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                        Interest
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>Open to learning anything!</p>
                )}
              </div>
            </div>

            {/* Peer Reviews */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
                <MessageSquare size={16} color="#7c3aed" />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                  Peer Feedback & Reviews ({profile.feedbacks?.length || 0})
                </h4>
              </div>

              {profile.feedbacks && profile.feedbacks.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {profile.feedbacks.map((f) => (
                    <div
                      key={f._id}
                      style={{
                        padding: '0.85rem 1rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img
                            src={f.reviewerId?.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                            alt={f.reviewerId?.name}
                            style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                          />
                          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>
                            {f.reviewerId?.name || 'Fellow Student'}
                          </span>
                        </div>
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
                      <p style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic' }}>
                        "{f.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', background: '#f8fafc', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                  No feedback reviews yet. Be the first to exchange skills!
                </p>
              )}
            </div>

            {/* Bottom Modal Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <button onClick={onClose} className="btn btn-secondary">
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onRequestExchange(profile);
                }}
                className="btn btn-primary"
              >
                <span>Request Skill Exchange</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            Profile could not be loaded.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;
