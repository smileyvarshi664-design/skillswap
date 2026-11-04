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
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Student Profile
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '4px',
              borderRadius: '6px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              background: 'none',
              border: 'none',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div className="spinner" />
            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Loading student details...</span>
          </div>
        ) : profile ? (
          <div style={{ padding: '1rem 1.25rem', maxHeight: '76vh', overflowY: 'auto' }}>
            {/* Top Identity Card */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                paddingBottom: '0.85rem',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <img
                src={profile.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                alt={profile.name}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  objectFit: 'cover',
                  border: '2px solid #e0e7ff',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.12)',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{profile.name}</h2>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.7rem',
                      padding: '2px 7px',
                      borderRadius: '999px',
                      background: '#ecfdf5',
                      color: '#059669',
                      fontWeight: 600,
                    }}
                  >
                    <ShieldCheck size={12} /> Verified
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#475569', fontSize: '0.825rem', marginTop: '0.15rem' }}>
                  <Building2 size={13} color="#6366f1" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.college}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.775rem', marginTop: '0.1rem' }}>
                  <GraduationCap size={13} color="#3b82f6" />
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
                padding: '0.55rem 0.85rem',
                backgroundColor: '#fffbeb',
                borderRadius: '10px',
                border: '1px solid #fef3c7',
                margin: '0.85rem 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      fill={star <= Math.round(profile.rating || 0) ? '#f59e0b' : '#e2e8f0'}
                      color={star <= Math.round(profile.rating || 0) ? '#f59e0b' : '#cbd5e1'}
                    />
                  ))}
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#92400e' }}>
                  {profile.rating > 0 ? profile.rating : 'No reviews yet'}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>
                {profile.reviewCount} peer review{profile.reviewCount === 1 ? '' : 's'}
              </span>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div style={{ marginBottom: '0.85rem' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  About Student
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.45, background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', margin: 0 }}>
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Skills: Teaching */}
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                <BookOpen size={14} color="#4f46e5" />
                <h4 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155', margin: 0 }}>
                  Skills {profile.name} Can Teach ({profile.teachSkills?.length || 0})
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {profile.teachSkills && profile.teachSkills.length > 0 ? (
                  profile.teachSkills.map((skill) => (
                    <div
                      key={skill._id}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e7ff',
                        borderRadius: '9px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e1b4b' }}>{skill.skillName}</span>
                          <span className="badge badge-teach" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>{skill.category}</span>
                        </div>
                        {skill.description && (
                          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.1rem', margin: 0 }}>{skill.description}</p>
                        )}
                      </div>
                      <span className={`badge badge-${skill.proficiencyLevel.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                        {skill.proficiencyLevel}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.775rem', fontStyle: 'italic', margin: 0 }}>No skills listed yet.</p>
                )}
              </div>
            </div>

            {/* Skills: Learning */}
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                <Sparkles size={14} color="#2563eb" />
                <h4 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155', margin: 0 }}>
                  Skills {profile.name} Wants to Learn ({profile.learnSkills?.length || 0})
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {profile.learnSkills && profile.learnSkills.length > 0 ? (
                  profile.learnSkills.map((skill) => (
                    <div
                      key={skill._id}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid #dbeafe',
                        borderRadius: '9px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e3a8a' }}>{skill.skillName}</span>
                          <span className="badge badge-learn" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>{skill.category}</span>
                        </div>
                        {skill.description && (
                          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.1rem', margin: 0 }}>{skill.description}</p>
                        )}
                      </div>
                      <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '0.65rem' }}>
                        Interest
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.775rem', fontStyle: 'italic', margin: 0 }}>Open to learning anything!</p>
                )}
              </div>
            </div>

            {/* Peer Reviews */}
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                <MessageSquare size={14} color="#7c3aed" />
                <h4 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155', margin: 0 }}>
                  Peer Feedback & Reviews ({profile.feedbacks?.length || 0})
                </h4>
              </div>

              {profile.feedbacks && profile.feedbacks.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {profile.feedbacks.map((f) => (
                    <div
                      key={f._id}
                      style={{
                        padding: '0.65rem 0.85rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '9px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <img
                            src={f.reviewerId?.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                            alt={f.reviewerId?.name}
                            style={{ width: '22px', height: '22px', borderRadius: '50%' }}
                          />
                          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1e293b' }}>
                            {f.reviewerId?.name || 'Fellow Student'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              fill={s <= f.rating ? '#f59e0b' : '#e2e8f0'}
                              color={s <= f.rating ? '#f59e0b' : '#cbd5e1'}
                            />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.775rem', color: '#475569', fontStyle: 'italic', margin: 0 }}>
                        "{f.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.775rem', color: '#94a3b8', fontStyle: 'italic', background: '#f8fafc', padding: '0.65rem', borderRadius: '9px', textAlign: 'center', margin: 0 }}>
                  No feedback reviews yet. Be the first to exchange skills!
                </p>
              )}
            </div>

            {/* Bottom Modal Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}>
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onRequestExchange(profile);
                }}
                className="btn btn-primary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}
              >
                <span>Request Skill Exchange</span>
                <ArrowRight size={14} />
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
