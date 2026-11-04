import React from 'react';
import { Star, GraduationCap, ArrowRight, BookOpen, Sparkles, Building2 } from 'lucide-react';

const StudentCard = ({ student, onViewProfile, onRequestExchange }) => {
  const teachSkills = student.teachSkills || [];
  const learnSkills = student.learnSkills || [];

  return (
    <div
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '0.85rem 1rem',
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
      }}
    >
      <div>
        {/* Top Header: Avatar & Info */}
        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', marginBottom: '0.65rem' }}>
          <img
            src={student.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
            alt={student.name}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              objectFit: 'cover',
              border: '1.5px solid #e2e8f0',
              flexShrink: 0,
            }}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
              <h3
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.2,
                }}
              >
                {student.name}
              </h3>
              {student.rating > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    color: '#b45309',
                    backgroundColor: '#fef3c7',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    flexShrink: 0,
                  }}
                >
                  <Star size={11} fill="#f59e0b" color="#f59e0b" />
                  <span>{student.rating}</span>
                  <span style={{ color: '#92400e', fontSize: '0.65rem' }}>({student.reviewCount})</span>
                </div>
              ) : (
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: '#64748b',
                    backgroundColor: '#f1f5f9',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    flexShrink: 0,
                    fontWeight: 600,
                  }}
                >
                  New Peer
                </span>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.75rem',
                color: '#475569',
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <Building2 size={12} color="#6366f1" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.college}</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.7rem',
                color: '#64748b',
                marginTop: '1px',
              }}
            >
              <GraduationCap size={12} color="#3b82f6" />
              <span>
                {student.department} • {student.year}
              </span>
            </div>
          </div>
        </div>

        {/* Bio preview */}
        {student.bio && (
          <p
            style={{
              fontSize: '0.775rem',
              color: '#64748b',
              marginBottom: '0.65rem',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {student.bio}
          </p>
        )}

        {/* Skills Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.75rem' }}>
          {/* Can Teach */}
          <div>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#4338ca',
                marginBottom: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <BookOpen size={11} />
              <span>CAN TEACH ({teachSkills.length}):</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {teachSkills.length > 0 ? (
                teachSkills.slice(0, 3).map((s, idx) => (
                  <span
                    key={idx}
                    className="badge badge-teach"
                    style={{ fontSize: '0.7rem', padding: '1px 6px' }}
                    title={`${s.skillName} (${s.proficiencyLevel})`}
                  >
                    {s.skillName}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  No teaching skills listed
                </span>
              )}
              {teachSkills.length > 3 && (
                <span className="badge" style={{ fontSize: '0.68rem', padding: '1px 5px', background: '#e2e8f0', color: '#475569' }}>
                  +{teachSkills.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Wants to Learn */}
          <div>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#1d4ed8',
                marginBottom: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Sparkles size={11} />
              <span>WANTS TO LEARN ({learnSkills.length}):</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {learnSkills.length > 0 ? (
                learnSkills.slice(0, 3).map((s, idx) => (
                  <span
                    key={idx}
                    className="badge badge-learn"
                    style={{ fontSize: '0.7rem', padding: '1px 6px' }}
                    title={s.skillName}
                  >
                    {s.skillName}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  Open to explore
                </span>
              )}
              {learnSkills.length > 3 && (
                <span className="badge" style={{ fontSize: '0.68rem', padding: '1px 5px', background: '#e2e8f0', color: '#475569' }}>
                  +{learnSkills.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.45rem',
          paddingTop: '0.55rem',
          borderTop: '1px solid #f1f5f9',
        }}
      >
        <button
          onClick={() => onViewProfile(student)}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', fontSize: '0.775rem', padding: '0.3rem 0.5rem' }}
        >
          View Profile
        </button>

        <button
          onClick={() => onRequestExchange(student)}
          className="btn btn-primary btn-sm"
          style={{ width: '100%', fontSize: '0.775rem', padding: '0.3rem 0.5rem', gap: '0.25rem' }}
        >
          <span>Exchange</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
