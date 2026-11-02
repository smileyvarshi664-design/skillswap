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
  TrendingUp,
  Star,
  CheckCircle,
  Clock,
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
      subtitle={`Welcome to your SkillSwap dashboard • ${user?.college || 'College Campus'}`}
    >
      {/* Mutual Match Callout Banner */}
      {mutualMatches.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            borderRadius: '20px',
            padding: '1.5rem 2rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Sparkles size={28} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#e0e7ff' }}>
                Smart Algorithm Match
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>
                We found {mutualMatches.length} Mutual Skill {mutualMatches.length === 1 ? 'Match' : 'Matches'} for You!
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#e0e7ff', marginTop: '0.2rem' }}>
                Students who teach what you want to learn, and want what you can teach!
              </p>
            </div>
          </div>

          <Link
            to="/matches"
            className="btn btn-secondary"
            style={{
              backgroundColor: '#ffffff',
              color: '#4f46e5',
              fontWeight: 700,
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <span>View Mutual Matches</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Teaching Skills */}
        <div
          className="card"
          style={{
            padding: '1.4rem',
            borderLeft: '4px solid #6366f1',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/my-skills')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                TEACHING SKILLS
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                {metrics.totalTeach}
              </div>
            </div>
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
              }}
            >
              <BookOpen size={20} />
            </div>
          </div>
          <div style={{ fontSize: '0.775rem', color: '#4f46e5', fontWeight: 600, marginTop: '0.75rem' }}>
            Manage teaching list →
          </div>
        </div>

        {/* Learning Skills */}
        <div
          className="card"
          style={{
            padding: '1.4rem',
            borderLeft: '4px solid #3b82f6',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/my-skills')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                LEARNING SKILLS
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                {metrics.totalLearn}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} />
            </div>
          </div>
          <div style={{ fontSize: '0.775rem', color: '#2563eb', fontWeight: 600, marginTop: '0.75rem' }}>
            Explore what to learn →
          </div>
        </div>

        {/* Received Requests */}
        <div
          className="card"
          style={{
            padding: '1.4rem',
            borderLeft: '4px solid #10b981',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/requests')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                RECEIVED REQUESTS
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                {metrics.receivedCount}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowLeftRight size={20} />
            </div>
          </div>
          <div style={{ fontSize: '0.775rem', color: '#059669', fontWeight: 600, marginTop: '0.75rem' }}>
            Review proposals →
          </div>
        </div>

        {/* Sent Requests */}
        <div
          className="card"
          style={{
            padding: '1.4rem',
            borderLeft: '4px solid #f59e0b',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/requests')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                SENT REQUESTS
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                {metrics.sentCount}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#fffbeb',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={20} />
            </div>
          </div>
          <div style={{ fontSize: '0.775rem', color: '#d97706', fontWeight: 600, marginTop: '0.75rem' }}>
            Track pending requests →
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Matches & Recent Activities */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column: Recommended Matches */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                Recommended Skill Matches
              </h2>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
                Peers tailored to your teaching abilities and learning interests
              </p>
            </div>
            <Link
              to="/matches"
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span>See all matches</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem' }} />
              <span style={{ color: '#64748b' }}>Finding best student matches...</span>
            </div>
          ) : matches.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
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
                padding: '3rem',
                textAlign: 'center',
                backgroundColor: '#ffffff',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#eef2ff',
                  color: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <BookOpen size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>
                Add Skills to Unlock Smart Matches
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', margin: '0.5rem auto 1.5rem' }}>
                Once you list what you can teach and what you want to learn, our algorithm will
                automatically discover the best student matches for you!
              </p>
              <Link to="/my-skills" className="btn btn-primary">
                <span>Manage My Skills</span>
                <ArrowRight size={16} />
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
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                My Exchanges
              </h2>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Active and completed sessions</p>
            </div>
            <Link
              to="/exchanges"
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span>View all</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            {recentExchanges.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentExchanges.map((ex) => (
                  <div
                    key={ex._id}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img
                          src={ex.partner?.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                          alt={ex.partner?.name}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>
                          {ex.partner?.name}
                        </span>
                      </div>
                      <span
                        className={`badge badge-status-${ex.status.toLowerCase().replace(' ', '-')}`}
                        style={{ fontSize: '0.675rem' }}
                      >
                        {ex.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.775rem', color: '#475569', lineHeight: 1.4 }}>
                      <div>Teaching: <strong style={{ color: '#4338ca' }}>{ex.myTeachingSkill}</strong></div>
                      <div>Learning: <strong style={{ color: '#1d4ed8' }}>{ex.myLearningSkill}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
                <Repeat size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.85rem' }}>No active exchanges yet.</p>
                <Link
                  to="/explore"
                  style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 600, display: 'inline-block', marginTop: '0.5rem' }}
                >
                  Explore students to connect →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        studentId={selectedStudentId}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onRequestExchange={handleRequestExchange}
      />

      {/* Send Request Modal */}
      <RequestModal
        targetStudent={targetStudentForRequest}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={loadDashboardData}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;
