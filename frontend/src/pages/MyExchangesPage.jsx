import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { exchangeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FeedbackModal from '../components/FeedbackModal';
import UserProfileModal from '../components/UserProfileModal';
import {
  Repeat,
  CheckCircle,
  Clock,
  Star,
  Building2,
  Mail,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyExchangesPage = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'completed'
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modals
  const [selectedExchangeForFeedback, setSelectedExchangeForFeedback] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const loadExchanges = async () => {
    try {
      setLoading(true);
      const res = await exchangeService.getMyExchanges();
      if (res.data && res.data.success) {
        setExchanges(res.data.exchanges || []);
      }
    } catch (err) {
      console.error('Failed to load exchanges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExchanges();
  }, []);

  const handleMarkCompleted = async (exchangeId) => {
    if (!window.confirm('Congratulations! Mark this skill exchange as successfully completed?')) {
      return;
    }

    setActionLoadingId(exchangeId);
    try {
      const res = await exchangeService.completeExchange(exchangeId);
      if (res.data && res.data.success) {
        showToast('Exchange marked as completed! You can now rate and review your peer.', 'success');
        loadExchanges();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to complete exchange';
      showToast(msg, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenFeedback = (exchange) => {
    setSelectedExchangeForFeedback(exchange);
    setIsFeedbackModalOpen(true);
  };

  const handleViewProfile = (partner) => {
    setSelectedStudentId(partner._id || partner.id);
    setIsProfileModalOpen(true);
  };

  const activeExchanges = exchanges.filter((e) => e.status === 'In Progress');
  const completedExchanges = exchanges.filter((e) => e.status === 'Completed');
  const currentList = activeTab === 'active' ? activeExchanges : completedExchanges;

  return (
    <DashboardLayout
      title="My Skill Exchanges"
      subtitle="Track your active learning partnerships and exchange peer reviews"
    >
      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '14px',
          gap: '4px',
          width: 'fit-content',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => setActiveTab('active')}
          style={{
            padding: '0.65rem 1.4rem',
            borderRadius: '10px',
            backgroundColor: activeTab === 'active' ? '#ffffff' : 'transparent',
            color: activeTab === 'active' ? '#4f46e5' : '#64748b',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'active' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Clock size={17} />
          <span>Active Exchanges ({activeExchanges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          style={{
            padding: '0.65rem 1.4rem',
            borderRadius: '10px',
            backgroundColor: activeTab === 'completed' ? '#ffffff' : 'transparent',
            color: activeTab === 'completed' ? '#059669' : '#64748b',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'completed' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <CheckCircle size={17} />
          <span>Completed ({completedExchanges.length})</span>
        </button>
      </div>

      {/* Exchanges Grid */}
      {loading ? (
        <div style={{ padding: '5rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          <span style={{ color: '#64748b' }}>Loading exchanges...</span>
        </div>
      ) : currentList.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {currentList.map((ex) => {
            const isCompleted = ex.status === 'Completed';
            const isActionBusy = actionLoadingId === ex._id;

            return (
              <div
                key={ex._id}
                className="card card-interactive"
                style={{
                  padding: '1.6rem',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${isCompleted ? '#10b981' : '#6366f1'}`,
                }}
              >
                <div>
                  {/* Partner Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleViewProfile(ex.partner)}
                    >
                      <img
                        src={ex.partner?.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                        alt={ex.partner?.name}
                        style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                          {ex.partner?.name}
                        </h4>
                        <div style={{ fontSize: '0.775rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Building2 size={12} color="#6366f1" />
                          <span>{ex.partner?.college}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`badge badge-status-${ex.status.toLowerCase().replace(' ', '-')}`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {ex.status}
                    </span>
                  </div>

                  {/* Skills Exchanged Box */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '1rem',
                      border: '1px solid #e2e8f0',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4338ca' }}>
                        YOU TEACH:
                      </span>
                      <span className="badge badge-teach" style={{ fontSize: '0.8rem' }}>
                        {ex.myTeachingSkill}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8' }}>
                        YOU LEARN:
                      </span>
                      <span className="badge badge-learn" style={{ fontSize: '0.8rem' }}>
                        {ex.myLearningSkill}
                      </span>
                    </div>
                  </div>

                  {/* Dates & Contact */}
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <Mail size={13} color="#8b5cf6" />
                      <span>{ex.partner?.email}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Started: {new Date(ex.createdAt).toLocaleDateString()}
                      {ex.completedAt && ` • Finished: ${new Date(ex.completedAt).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.6rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <button
                    onClick={() => handleViewProfile(ex.partner)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.8rem' }}
                  >
                    View Profile
                  </button>

                  {!isCompleted ? (
                    <button
                      onClick={() => handleMarkCompleted(ex._id)}
                      disabled={isActionBusy}
                      className="btn btn-success btn-sm"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <CheckCircle size={15} />
                      <span>Mark Completed</span>
                    </button>
                  ) : ex.hasReviewed ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.775rem',
                        color: '#059669',
                        fontWeight: 700,
                        backgroundColor: '#ecfdf5',
                        padding: '4px 10px',
                        borderRadius: '999px',
                      }}
                    >
                      <CheckCircle size={13} /> Reviewed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenFeedback(ex)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <Star size={14} fill="#ffffff" />
                      <span>Rate & Review</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              backgroundColor: activeTab === 'active' ? '#eef2ff' : '#ecfdf5',
              color: activeTab === 'active' ? '#6366f1' : '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Repeat size={30} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
            No {activeTab === 'active' ? 'Active' : 'Completed'} Exchanges
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', margin: '0.5rem auto 1.5rem' }}>
            {activeTab === 'active'
              ? 'When an exchange request is accepted, your collaborative learning journey begins here!'
              : 'Complete your ongoing skill exchanges to record verified peer reviews on your student profile.'}
          </p>
          <Link to="/matches" className="btn btn-primary">
            <span>Find Skill Matches</span>
          </Link>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        exchange={selectedExchangeForFeedback}
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSuccess={loadExchanges}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        studentId={selectedStudentId}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onRequestExchange={() => {}}
      />
    </DashboardLayout>
  );
};

export default MyExchangesPage;
