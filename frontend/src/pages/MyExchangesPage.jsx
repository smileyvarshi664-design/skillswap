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
          padding: '3px',
          borderRadius: '10px',
          gap: '3px',
          width: 'fit-content',
          marginBottom: '0.85rem',
        }}
      >
        <button
          onClick={() => setActiveTab('active')}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '8px',
            backgroundColor: activeTab === 'active' ? '#ffffff' : 'transparent',
            color: activeTab === 'active' ? '#4f46e5' : '#64748b',
            fontWeight: 700,
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: activeTab === 'active' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.12s ease',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Clock size={15} />
          <span>Active Exchanges ({activeExchanges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '8px',
            backgroundColor: activeTab === 'completed' ? '#ffffff' : 'transparent',
            color: activeTab === 'completed' ? '#059669' : '#64748b',
            fontWeight: 700,
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: activeTab === 'completed' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.12s ease',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <CheckCircle size={15} />
          <span>Completed ({completedExchanges.length})</span>
        </button>
      </div>

      {/* Exchanges Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 0.5rem', width: '22px', height: '22px' }} />
          <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Loading exchanges...</span>
        </div>
      ) : currentList.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '0.85rem',
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
                  padding: '0.85rem 1rem',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '12px',
                  borderTop: `3.5px solid ${isCompleted ? '#10b981' : '#6366f1'}`,
                }}
              >
                <div>
                  {/* Partner Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.65rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleViewProfile(ex.partner)}
                    >
                      <img
                        src={ex.partner?.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                        alt={ex.partner?.name}
                        style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontWeight: 800, fontSize: '0.925rem', color: '#0f172a' }}>
                          {ex.partner?.name}
                        </h4>
                        <div style={{ fontSize: '0.725rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Building2 size={12} color="#6366f1" />
                          <span>{ex.partner?.college}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`badge badge-status-${ex.status.toLowerCase().replace(' ', '-')}`}
                      style={{ fontSize: '0.7rem', padding: '1px 6px' }}
                    >
                      {ex.status}
                    </span>
                  </div>

                  {/* Skills Exchanged Box */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '10px',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #e2e8f0',
                      marginBottom: '0.65rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4338ca' }}>
                        YOU TEACH:
                      </span>
                      <span className="badge badge-teach" style={{ fontSize: '0.75rem', padding: '1px 6px' }}>
                        {ex.myTeachingSkill}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1d4ed8' }}>
                        YOU LEARN:
                      </span>
                      <span className="badge badge-learn" style={{ fontSize: '0.75rem', padding: '1px 6px' }}>
                        {ex.myLearningSkill}
                      </span>
                    </div>
                  </div>

                  {/* Dates & Contact */}
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1px' }}>
                      <Mail size={12} color="#8b5cf6" />
                      <span>{ex.partner?.email}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      Started: {new Date(ex.createdAt).toLocaleDateString()}
                      {ex.completedAt && ` • Done: ${new Date(ex.completedAt).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.45rem',
                    paddingTop: '0.55rem',
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <button
                    onClick={() => handleViewProfile(ex.partner)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    View Profile
                  </button>

                  {!isCompleted ? (
                    <button
                      onClick={() => handleMarkCompleted(ex._id)}
                      disabled={isActionBusy}
                      className="btn btn-success btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                    >
                      <CheckCircle size={13} />
                      <span>Mark Completed</span>
                    </button>
                  ) : ex.hasReviewed ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.725rem',
                        color: '#059669',
                        fontWeight: 700,
                        backgroundColor: '#ecfdf5',
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      <CheckCircle size={12} /> Reviewed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenFeedback(ex)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                    >
                      <Star size={12} fill="#ffffff" />
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
              backgroundColor: activeTab === 'active' ? '#eef2ff' : '#ecfdf5',
              color: activeTab === 'active' ? '#6366f1' : '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.65rem',
            }}
          >
            <Repeat size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
            No {activeTab === 'active' ? 'Active' : 'Completed'} Exchanges
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: '380px', margin: '0.35rem auto 1rem' }}>
            {activeTab === 'active'
              ? 'When an exchange request is accepted, your collaborative learning journey begins here!'
              : 'Complete your ongoing skill exchanges to record verified peer reviews on your student profile.'}
          </p>
          <Link to="/matches" className="btn btn-primary btn-sm">
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
