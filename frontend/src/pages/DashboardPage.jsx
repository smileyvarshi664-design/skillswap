import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import {
  skillService,
  requestService,
  matchService,
  exchangeService,
} from '../services/api';
import StudentCard from '../components/StudentCard';
import UserProfileModal from '../components/UserProfileModal';
import RequestModal from '../components/RequestModal';
import {
  BookOpen,
  Sparkles,
  ArrowLeftRight,
  Send,
  Repeat,
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    totalTeach: 0,
    totalLearn: 0,
    receivedCount: 0,
    sentCount: 0,
    activeExchangesCount: 0,
  });

  const [matches, setMatches] = useState([]);
  const [recentExchanges, setRecentExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [targetStudentForRequest, setTargetStudentForRequest] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [skillsRes, receivedRes, sentRes, matchesRes, exchangesRes] = await Promise.all([
        skillService.getMySkills(),
        requestService.getReceivedRequests(),
        requestService.getSentRequests(),
        matchService.getMatches(),
        exchangeService.getMyExchanges(),
      ]);

      const totalTeach = skillsRes.data?.totalTeach || 0;
      const totalLearn = skillsRes.data?.totalLearn || 0;
      const receivedCount = receivedRes.data?.count || 0;
      const sentCount = sentRes.data?.count || 0;
      const exchanges = exchangesRes.data?.exchanges || [];
      const activeExchanges = exchanges.filter((e) => e.status === 'In Progress');

      setMetrics({
        totalTeach,
        totalLearn,
        receivedCount,
        sentCount,
        activeExchangesCount: activeExchanges.length,
      });

      setMatches(matchesRes.data?.matches || []);
      setRecentExchanges(exchanges.slice(0, 4));
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleViewProfile = (student) => {
    setSelectedStudentId(student._id || student.id);
    setIsProfileModalOpen(true);
  };

  const handleRequestExchange = (student) => {
    setTargetStudentForRequest(student);
    setIsRequestModalOpen(true);
  };

  const mutualMatches = matches.filter((m) => m.isMutual);

  return (
    <DashboardLayout
      title={`Hello, ${user?.name?.split(' ')[0] || 'Student'}! 👋`}
      subtitle={`Campus Skill Exchange Dashboard • ${user?.college || 'University'}`}
    >
      {/* Mutual Match Callout Banner */}
      {mutualMatches.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            borderRadius: '14px',
            padding: '0.75rem 1.25rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '0.85rem',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
                flexShrink: 0,
              }}
            >
              <Sparkles size={18} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#e0e7ff' }}>
                Smart Match Found
              </div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15 }}>
                {mutualMatches.length} Mutual Skill {mutualMatches.length === 1 ? 'Match' : 'Matches'} Ready for You!
              </h2>
            </div>
          </div>

          <Link
            to="/matches"
            className="btn btn-secondary btn-sm"
            style={{
              backgroundColor: '#ffffff',
              color: '#4f46e5',
              fontWeight: 700,
              padding: '0.35rem 0.85rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8rem',
            }}
          >
            <span>View Matches</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.65rem',
          marginBottom: '1rem',
        }}
        className="dashboard-metrics-grid"
      >
        {/* Teaching Skills */}
        <div
          className="card card-interactive"
          style={{
            padding: '0.65rem 0.85rem',
            borderLeft: '3.5px solid #6366f1',
            cursor: 'pointer',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
          }}
          onClick={() => navigate('/my-skills')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                TEACHING
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                {metrics.totalTeach}
              </div>
            </div>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#eef2ff',
                color: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookOpen size={16} />
            </div>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#4f46e5', fontWeight: 600, marginTop: '0.35rem' }}>
            Manage teaching list →
          </div>
        </div>

        {/* Learning Skills */}
        <div
          className="card card-interactive"
          style={{
            padding: '0.65rem 0.85rem',
            borderLeft: '3.5px solid #3b82f6',
            cursor: 'pointer',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
          }}
          onClick={() => navigate('/my-skills')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                LEARNING
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                {metrics.totalLearn}
              </div>
            </div>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={16} />
            </div>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600, marginTop: '0.35rem' }}>
            Explore what to learn →
          </div>
        </div>

        {/* Received Requests */}
        <div
          className="card card-interactive"
          style={{
            padding: '0.65rem 0.85rem',
            borderLeft: '3.5px solid #10b981',
            cursor: 'pointer',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
          }}
          onClick={() => navigate('/requests')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                RECEIVED
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                {metrics.receivedCount}
              </div>
            </div>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowLeftRight size={16} />
            </div>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, marginTop: '0.35rem' }}>
            Review proposals →
          </div>
        </div>

        {/* Sent Requests */}
        <div
          className="card card-interactive"
          style={{
            padding: '0.65rem 0.85rem',
            borderLeft: '3.5px solid #f59e0b',
            cursor: 'pointer',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
          }}
          onClick={() => navigate('/requests')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                SENT REQUESTS
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                {metrics.sentCount}
              </div>
            </div>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#fffbeb',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={16} />
            </div>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 600, marginTop: '0.35rem' }}>
            Track pending requests →
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Matches & Recent Activities */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '1rem' }} className="dashboard-content-split">
        {/* Left Column: Recommended Matches */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.65rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Recommended Skill Matches
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Peers tailored to your skills & learning interests
              </p>
            </div>
            <Link
              to="/matches"
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                textDecoration: 'none',
              }}
            >
              <span>See all matches</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto 0.5rem', width: '20px', height: '20px' }} />
              <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Finding student matches...</span>
            </div>
          ) : matches.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {matches.slice(0, 4).map((matchItem) => (
                <StudentCard
                  key={matchItem.user._id}
                  student={{
                    ...matchItem.user,
                    teachSkills: matchItem.otherTeachSkills,
                    learnSkills: matchItem.otherLearnSkills,
                  }}
                  onViewProfile={handleViewProfile}
                  onRequestExchange={handleRequestExchange}
                />
              ))}
            </div>
          ) : (
            <div
              className="card"
              style={{
                padding: '1.5rem',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#eef2ff',
                  color: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem',
                }}
              >
                <BookOpen size={20} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                Add Skills to Unlock Smart Matches
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.78rem', maxWidth: '360px', margin: '0.3rem auto 0.75rem' }}>
                List what you teach and what you want to learn to get paired automatically!
              </p>
              <Link to="/my-skills" className="btn btn-primary btn-sm" style={{ fontSize: '0.8rem' }}>
                <span>Manage My Skills</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Recent Activities & Exchanges */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.65rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                My Exchanges
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Active and completed peer sessions</p>
            </div>
            <Link
              to="/exchanges"
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                textDecoration: 'none',
              }}
            >
              <span>View all</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {recentExchanges.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {recentExchanges.map((ex) => {
                const isStudentOne = ex.studentOne?._id === (user?.id || user?._id);
                const partner = isStudentOne ? ex.studentTwo : ex.studentOne;
                const statusColor = ex.status === 'Completed' ? '#10b981' : '#3b82f6';

                return (
                  <div
                    key={ex._id}
                    className="card"
                    style={{
                      padding: '0.75rem 0.85rem',
                      backgroundColor: '#ffffff',
                      borderLeft: `3.5px solid ${statusColor}`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.65rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
                      <img
                        src={partner?.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                        alt={partner?.name}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid #e2e8f0',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {partner?.name || 'Peer Student'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ex.skillOffered?.skillName || 'Skill'} ⇄ {ex.skillWanted?.skillName || 'Skill'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                      <span
                        className={ex.status === 'Completed' ? 'badge badge-status-completed' : 'badge badge-status-accepted'}
                        style={{ fontSize: '0.68rem', padding: '1px 6px' }}
                      >
                        {ex.status}
                      </span>
                      <button
                        onClick={() => navigate('/exchanges')}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.725rem' }}
                      >
                        Open
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="card"
              style={{
                padding: '1.5rem',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem',
                }}
              >
                <Repeat size={20} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                No Active Exchanges Yet
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.78rem', margin: '0.3rem auto 0.75rem' }}>
                Discover campus partners and send an exchange proposal to start learning!
              </p>
              <Link to="/explore" className="btn btn-primary btn-sm" style={{ fontSize: '0.8rem' }}>
                <span>Explore Students</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>
      </div>

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

      {/* Request Exchange Modal */}
      <RequestModal
        targetStudent={targetStudentForRequest}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={loadDashboardData}
      />

      <style>{`
        @media (max-width: 1024px) {
          .dashboard-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .dashboard-content-split {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .dashboard-metrics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default DashboardPage;
