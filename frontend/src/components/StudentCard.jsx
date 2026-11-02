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
        padding: '1.4rem',
        height: '100%',
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      {/* Top Header: Avatar & Info */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <img
          src={student.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
          alt={student.name}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            objectFit: 'cover',
            border: '2px solid #e2e8f0',
            boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
            flexShrink: 0,
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#0f172a',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {student.name}
            </h3>
            {student.rating > 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#b45309',
                  backgroundColor: '#fef3c7',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  flexShrink: 0,
                }}
              >
                <Star size={12} fill="#f59e0b" color="#f59e0b" />
                <span>{student.rating}</span>
                <span style={{ color: '#92400e', fontSize: '0.7rem' }}>({student.reviewCount})</span>
              </div>
            ) : (
              <span
                style={{
                  fontSize: '0.7rem',
                  color: '#64748b',
                  backgroundColor: '#f1f5f9',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  flexShrink: 0,
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
              gap: '0.35rem',
              fontSize: '0.825rem',
              color: '#475569',
              marginTop: '0.2rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Building2 size={13} color="#6366f1" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.college}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.775rem',
              color: '#64748b',
              marginTop: '0.15rem',
            }}
          >
            <GraduationCap size={13} color="#3b82f6" />
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
            fontSize: '0.85rem',
            color: '#64748b',
            marginBottom: '1rem',
            lineHeight: 1.4,
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {/* Can Teach */}
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#4338ca',
              marginBottom: '0.35rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <BookOpen size={13} />
            <span>CAN TEACH ({teachSkills.length}):</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {teachSkills.length > 0 ? (
              teachSkills.slice(0, 3).map((s, idx) => (
                <span key={idx} className="badge badge-teach" title={`${s.skillName} (${s.proficiencyLevel})`}>
                  {s.skillName}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                No teaching skills listed yet
              </span>
            )}
            {teachSkills.length > 3 && (
              <span className="badge" style={{ background: '#e2e8f0', color: '#475569' }}>
                +{teachSkills.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Wants to Learn */}
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#1d4ed8',
              marginBottom: '0.35rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Sparkles size={13} />
            <span>WANTS TO LEARN ({learnSkills.length}):</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {learnSkills.length > 0 ? (
              learnSkills.slice(0, 3).map((s, idx) => (
                <span key={idx} className="badge badge-learn" title={s.skillName}>
                  {s.skillName}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                Open to recommendations
              </span>
            )}
            {learnSkills.length > 3 && (
              <span className="badge" style={{ background: '#e2e8f0', color: '#475569' }}>
                +{learnSkills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.6rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid #f1f5f9',
        }}
      >
        <button
          onClick={() => onViewProfile(student)}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', fontSize: '0.825rem' }}
        >
          View Profile
        </button>

        <button
          onClick={() => onRequestExchange(student)}
          className="btn btn-primary btn-sm"
          style={{ width: '100%', fontSize: '0.825rem' }}
        >
          <span>Exchange</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
