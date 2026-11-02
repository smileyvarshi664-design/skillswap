import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { matchService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import UserProfileModal from '../components/UserProfileModal';
import RequestModal from '../components/RequestModal';
import {
  Sparkles,
  ArrowRight,
  ArrowLeftRight,
  Star,
  Building2,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SkillMatchingPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [targetStudentForRequest, setTargetStudentForRequest] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await matchService.getMatches();
      if (res.data && res.data.success) {
        setMatches(res.data.matches || []);
      }
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleViewProfile = (matchedUser) => {
    setSelectedStudentId(matchedUser._id || matchedUser.id);
    setIsProfileModalOpen(true);
  };

  const handleRequestExchange = (matchedUser, teachSkills) => {
    setTargetStudentForRequest({
      ...matchedUser,
      teachSkills: teachSkills || matchedUser.teachSkills || [],
    });
    setIsRequestModalOpen(true);
  };

  const mutualMatches = matches.filter((m) => m.isMutual);
  const partialMatches = matches.filter((m) => !m.isMutual);

  return (
    <DashboardLayout
      title="Smart Skill Matching"
      subtitle="Discover college peers with complementary teaching and learning skills"
    >
      {/* Algorithm Explanation Banner */}
      <div
        style={{
          backgroundColor: '#eef2ff',
          borderRadius: '20px',
          padding: '1.5rem 2rem',
          border: '1.5px solid #c7d2fe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '750px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#6366f1',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ArrowLeftRight size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e1b4b' }}>
              How the Matching Algorithm Works
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#4338ca', marginTop: '0.2rem', lineHeight: 1.5 }}>
              The engine compares what you teach with what others want to learn, AND what they teach with what you want to learn.
              Students with <strong>Mutual Matches</strong> are highlighted and prioritized at the top!
            </p>
          </div>
        </div>

        <Link to="/my-skills" className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Update My Skills</span>
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: '5rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          <span style={{ color: '#64748b' }}>Analyzing campus skill matrix...</span>
        </div>
      ) : matches.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Mutual Matches Section */}
          {mutualMatches.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Sparkles size={22} color="#9333ea" />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                  Mutual Matches ({mutualMatches.length})
                </h2>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    backgroundColor: '#fdf4ff',
                    color: '#9333ea',
                    border: '1px solid #f0abfc',
                  }}
                >
                  High Compatibility
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {mutualMatches.map((m) => (
                  <div
                    key={m.user._id}
                    className="card card-interactive"
                    style={{
                      padding: '1.75rem',
                      backgroundColor: '#ffffff',
                      border: '2px solid #e0e7ff',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        marginBottom: '1.25rem',
                        paddingBottom: '1.25rem',
                        borderBottom: '1px solid #f1f5f9',
                      }}
                    >
                      {/* Student info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={m.user.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                          alt={m.user.name}
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            objectFit: 'cover',
                            border: '2px solid #e2e8f0',
                          }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                              {m.user.name}
                            </h3>
                            <span
                              className="badge badge-mutual"
                              style={{ fontSize: '0.725rem' }}
                            >
                              ★ Mutual Match ({m.score}%)
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.825rem', marginTop: '0.2rem' }}>
                            <Building2 size={14} color="#6366f1" />
                            <span>{m.user.college}</span>
                            <span>•</span>
                            <span>{m.user.department}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button
                          onClick={() => handleViewProfile(m.user)}
                          className="btn btn-secondary btn-sm"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleRequestExchange(m.user, m.otherTeachSkills)}
                          className="btn btn-primary btn-sm"
                        >
                          <ArrowLeftRight size={15} />
                          <span>Propose Exchange</span>
                        </button>
                      </div>
                    </div>

                    {/* Skill Comparison Visual Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        gap: '1.25rem',
                        backgroundColor: '#f8fafc',
                        padding: '1.25rem',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      {/* Left: What they teach you */}
                      <div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#1e40af',
                            marginBottom: '0.4rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          They Teach You:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {m.theyTeachIWant.map((s, idx) => (
                            <span key={idx} className="badge badge-learn" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                              <CheckCircle2 size={13} /> {s.skillName} ({s.proficiencyLevel})
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Center Swap Arrow */}
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#eef2ff',
                          color: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ArrowLeftRight size={18} />
                      </div>

                      {/* Right: What you teach them */}
                      <div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#4338ca',
                            marginBottom: '0.4rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          You Teach Them:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {m.iTeachTheyWant.map((s, idx) => (
                            <span key={idx} className="badge badge-teach" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                              <CheckCircle2 size={13} /> {s.skillName} ({s.proficiencyLevel})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partial / One-way Matches Section */}
          {partialMatches.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <BookOpen size={20} color="#3b82f6" />
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                  One-Way Matches ({partialMatches.length})
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {partialMatches.map((m) => (
                  <div
                    key={m.user._id}
                    className="card card-interactive"
                    style={{
                      padding: '1.4rem',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <img
                          src={m.user.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                          alt={m.user.name}
                          style={{ width: '46px', height: '46px', borderRadius: '12px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {m.user.name}
                          </h4>
                          <span style={{ fontSize: '0.775rem', color: '#64748b' }}>
                            {m.user.college}
                          </span>
                        </div>
                        <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.75rem' }}>
                          {m.score}%
                        </span>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        {m.theyTeachIWant.length > 0 && (
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>THEY CAN TEACH YOU:</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.2rem' }}>
                              {m.theyTeachIWant.map((s, idx) => (
                                <span key={idx} className="badge badge-learn" style={{ fontSize: '0.75rem' }}>
                                  {s.skillName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {m.iTeachTheyWant.length > 0 && (
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4338ca' }}>YOU CAN TEACH THEM:</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.2rem' }}>
                              {m.iTeachTheyWant.map((s, idx) => (
                                <span key={idx} className="badge badge-teach" style={{ fontSize: '0.75rem' }}>
                                  {s.skillName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9' }}>
                      <button onClick={() => handleViewProfile(m.user)} className="btn btn-secondary btn-sm">
                        Profile
                      </button>
                      <button
                        onClick={() => handleRequestExchange(m.user, m.otherTeachSkills)}
                        className="btn btn-primary btn-sm"
                      >
                        Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#eef2ff',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <Sparkles size={32} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>
            No Matches Found Yet
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '440px', margin: '0.5rem auto 1.5rem' }}>
            To discover peers whose skills pair with yours, add skills you can teach and skills you want to learn to your profile.
          </p>
          <Link to="/my-skills" className="btn btn-primary">
            <span>Add Skills to Profile</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Profile & Request Modals */}
      <UserProfileModal
        studentId={selectedStudentId}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onRequestExchange={(userObj) => handleRequestExchange(userObj, userObj.teachSkills)}
      />

      <RequestModal
        targetStudent={targetStudentForRequest}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={fetchMatches}
      />
    </DashboardLayout>
  );
};

export default SkillMatchingPage;
