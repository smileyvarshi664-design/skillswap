import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { matchService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import UserProfileModal from '../components/UserProfileModal';
import RequestModal from '../components/RequestModal';
import {
  Sparkles,
  ArrowLeftRight,
  BookOpen,
  CheckCircle2,
  Plus,
  Building2,
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
          borderRadius: '12px',
          padding: '0.65rem 1rem',
          border: '1.5px solid #c7d2fe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.65rem',
          marginBottom: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              backgroundColor: '#6366f1',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ArrowLeftRight size={17} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.925rem', fontWeight: 800, color: '#1e1b4b', lineHeight: 1.2 }}>
              How Matching Works
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#4338ca', marginTop: '1px', lineHeight: 1.3 }}>
              Pairs what you teach with what others learn, and what they teach with what you need. <strong>Mutual Matches</strong> are highlighted first!
            </p>
          </div>
        </div>

        <Link to="/my-skills" className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}>
          <Plus size={14} />
          <span>Update My Skills</span>
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 0.5rem', width: '22px', height: '22px' }} />
          <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Analyzing skill matrix...</span>
        </div>
      ) : matches.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Mutual Matches Section */}
          {mutualMatches.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.55rem' }}>
                <Sparkles size={16} color="#9333ea" />
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Mutual Matches ({mutualMatches.length})
                </h2>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '999px',
                    backgroundColor: '#fdf4ff',
                    color: '#9333ea',
                    border: '1px solid #f0abfc',
                  }}
                >
                  High Compatibility
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {mutualMatches.map((m) => (
                  <div
                    key={m.user._id}
                    className="card"
                    style={{
                      padding: '0.85rem 1rem',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #e0e7ff',
                      borderRadius: '12px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.65rem',
                        marginBottom: '0.65rem',
                        paddingBottom: '0.65rem',
                        borderBottom: '1px solid #f1f5f9',
                      }}
                    >
                      {/* Student info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img
                          src={m.user.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                          alt={m.user.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            objectFit: 'cover',
                            border: '1.5px solid #e2e8f0',
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                              {m.user.name}
                            </h3>
                            <span
                              className="badge badge-mutual"
                              style={{ fontSize: '0.68rem', padding: '1px 6px' }}
                            >
                              ★ Mutual Match ({m.score}%)
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.725rem', marginTop: '1px' }}>
                            <Building2 size={12} color="#6366f1" />
                            <span>{m.user.college}</span>
                            <span>•</span>
                            <span>{m.user.department}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '0.45rem' }}>
                        <button
                          onClick={() => handleViewProfile(m.user)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleRequestExchange(m.user, m.otherTeachSkills)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                        >
                          <ArrowLeftRight size={13} />
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
                        gap: '0.75rem',
                        backgroundColor: '#f8fafc',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      {/* Left: What they teach you */}
                      <div>
                        <div
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: '#1e40af',
                            marginBottom: '0.25rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4px',
                          }}
                        >
                          They Teach You:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {m.theyTeachIWant.map((s, idx) => (
                            <span key={idx} className="badge badge-learn" style={{ fontSize: '0.725rem', padding: '2px 7px' }}>
                              <CheckCircle2 size={11} /> {s.skillName} ({s.proficiencyLevel})
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Center Swap Arrow */}
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: '#eef2ff',
                          color: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <ArrowLeftRight size={14} />
                      </div>

                      {/* Right: What you teach them */}
                      <div>
                        <div
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: '#4338ca',
                            marginBottom: '0.25rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4px',
                          }}
                        >
                          You Teach Them:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {m.iTeachTheyWant.map((s, idx) => (
                            <span key={idx} className="badge badge-teach" style={{ fontSize: '0.725rem', padding: '2px 7px' }}>
                              <CheckCircle2 size={11} /> {s.skillName} ({s.proficiencyLevel})
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.55rem' }}>
                <BookOpen size={16} color="#3b82f6" />
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  One-Way Matches ({partialMatches.length})
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {partialMatches.map((m) => (
                  <div
                    key={m.user._id}
                    className="card"
                    style={{
                      padding: '0.85rem 1rem',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.65rem' }}>
                        <img
                          src={m.user.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                          alt={m.user.name}
                          style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {m.user.name}
                          </h4>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            {m.user.college}
                          </span>
                        </div>
                        <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.68rem', padding: '1px 5px' }}>
                          {m.score}%
                        </span>
                      </div>

                      <div style={{ marginBottom: '0.65rem' }}>
                        {m.theyTeachIWant.length > 0 && (
                          <div style={{ marginBottom: '0.35rem' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1e40af' }}>THEY TEACH:</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '1px' }}>
                              {m.theyTeachIWant.map((s, idx) => (
                                <span key={idx} className="badge badge-learn" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                                  {s.skillName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {m.iTeachTheyWant.length > 0 && (
                          <div>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4338ca' }}>YOU TEACH:</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '1px' }}>
                              {m.iTeachTheyWant.map((s, idx) => (
                                <span key={idx} className="badge badge-teach" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                                  {s.skillName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', paddingTop: '0.55rem', borderTop: '1px solid #f1f5f9' }}>
                      <button onClick={() => handleViewProfile(m.user)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                        Profile
                      </button>
                      <button
                        onClick={() => handleRequestExchange(m.user, m.otherTeachSkills)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
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
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#eef2ff',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.65rem',
            }}
          >
            <Sparkles size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
            No Matches Found Yet
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: '380px', margin: '0.35rem auto 1rem' }}>
            List your teaching skills and learning interests so our smart algorithm can match you with campus peers!
          </p>
          <Link to="/my-skills" className="btn btn-primary btn-sm">
            <span>Add Skills to Profile</span>
          </Link>
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        studentId={selectedStudentId}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onRequestExchange={(student) => {
          setIsProfileModalOpen(false);
          handleRequestExchange(student);
        }}
      />

      {/* Request Modal */}
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
