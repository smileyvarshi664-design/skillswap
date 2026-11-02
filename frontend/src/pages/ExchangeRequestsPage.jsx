import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { requestService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeftRight,
  Inbox,
  Send,
  Check,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  MessageSquare,
  Building2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ExchangeRequestsPage = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const [recRes, sentRes] = await Promise.all([
        requestService.getReceivedRequests(),
        requestService.getSentRequests(),
      ]);

      if (recRes.data && recRes.data.success) {
        setReceivedRequests(recRes.data.requests || []);
      }
      if (sentRes.data && sentRes.data.success) {
        setSentRequests(sentRes.data.requests || []);
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (requestId) => {
    setActionLoadingId(requestId);
    try {
      const res = await requestService.acceptRequest(requestId);
      if (res.data && res.data.success) {
        showToast('Exchange request accepted! Your exchange is now active.', 'success');
        loadRequests();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to accept request';
      showToast(msg, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm('Are you sure you want to decline this skill exchange request?')) {
      return;
    }

    setActionLoadingId(requestId);
    try {
      const res = await requestService.rejectRequest(requestId);
      if (res.data && res.data.success) {
        showToast('Exchange request declined.', 'info');
        loadRequests();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to reject request';
      showToast(msg, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this pending request?')) {
      return;
    }

    setActionLoadingId(requestId);
    try {
      const res = await requestService.cancelRequest(requestId);
      if (res.data && res.data.success) {
        showToast('Exchange request cancelled.', 'info');
        loadRequests();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to cancel request';
      showToast(msg, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingReceivedCount = receivedRequests.filter((r) => r.status === 'Pending').length;
  const currentRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <DashboardLayout
      title="Exchange Requests"
      subtitle="Manage incoming and outgoing peer skill exchange proposals"
    >
      {/* Tabs Bar */}
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
          onClick={() => setActiveTab('received')}
          style={{
            padding: '0.65rem 1.4rem',
            borderRadius: '10px',
            backgroundColor: activeTab === 'received' ? '#ffffff' : 'transparent',
            color: activeTab === 'received' ? '#4f46e5' : '#64748b',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'received' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Inbox size={17} />
          <span>Received Requests ({receivedRequests.length})</span>
          {pendingReceivedCount > 0 && (
            <span
              style={{
                fontSize: '0.7rem',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                padding: '1px 6px',
                borderRadius: '999px',
                fontWeight: 700,
              }}
            >
              {pendingReceivedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          style={{
            padding: '0.65rem 1.4rem',
            borderRadius: '10px',
            backgroundColor: activeTab === 'sent' ? '#ffffff' : 'transparent',
            color: activeTab === 'sent' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'sent' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Send size={17} />
          <span>Sent Requests ({sentRequests.length})</span>
        </button>
      </div>

      {/* Requests List */}
      {loading ? (
        <div style={{ padding: '5rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          <span style={{ color: '#64748b' }}>Loading exchange requests...</span>
        </div>
      ) : currentRequests.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {currentRequests.map((req) => {
            const student = activeTab === 'received' ? req.senderId : req.receiverId;
            const isPending = req.status === 'Pending';
            const isActionBusy = actionLoadingId === req._id;

            return (
              <div
                key={req._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#ffffff',
                  borderLeft: `4px solid ${
                    req.status === 'Pending'
                      ? '#f59e0b'
                      : req.status === 'Accepted'
                      ? '#10b981'
                      : '#ef4444'
                  }`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  {/* Student Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={student?.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                      alt={student?.name}
                      style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                        {student?.name || 'Student Peer'}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Building2 size={13} color="#6366f1" />
                        <span>{student?.college} • {student?.department}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge badge-status-${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Exchange Details Visual */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1rem',
                    backgroundColor: '#f8fafc',
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#4338ca', textTransform: 'uppercase' }}>
                      {activeTab === 'received' ? 'THEY OFFER TO TEACH YOU:' : 'YOU OFFERED TO TEACH:'}
                    </span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e1b4b', marginTop: '0.2rem' }}>
                      {req.offeredSkill}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                      {activeTab === 'received' ? 'THEY WANT TO LEARN FROM YOU:' : 'YOU REQUESTED TO LEARN:'}
                    </span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a', marginTop: '0.2rem' }}>
                      {req.requestedSkill}
                    </div>
                  </div>
                </div>

                {/* Message */}
                {req.message && (
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: '#475569',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                      fontStyle: 'italic',
                      backgroundColor: '#ffffff',
                      padding: '0.5rem 0',
                    }}
                  >
                    "{req.message}"
                  </div>
                )}

                {/* Action Buttons */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.6rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  {activeTab === 'received' && isPending && (
                    <>
                      <button
                        onClick={() => handleReject(req._id)}
                        disabled={isActionBusy}
                        className="btn btn-danger btn-sm"
                      >
                        <X size={15} />
                        <span>Decline</span>
                      </button>
                      <button
                        onClick={() => handleAccept(req._id)}
                        disabled={isActionBusy}
                        className="btn btn-primary btn-sm"
                      >
                        <Check size={15} />
                        <span>Accept Proposal</span>
                      </button>
                    </>
                  )}

                  {activeTab === 'sent' && isPending && (
                    <button
                      onClick={() => handleCancel(req._id)}
                      disabled={isActionBusy}
                      className="btn btn-secondary btn-sm"
                    >
                      <Ban size={15} />
                      <span>Cancel Request</span>
                    </button>
                  )}

                  {req.status === 'Accepted' && (
                    <Link to="/exchanges" className="btn btn-secondary btn-sm">
                      <span>View in Active Exchanges →</span>
                    </Link>
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
              backgroundColor: '#f1f5f9',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            {activeTab === 'received' ? <Inbox size={30} /> : <Send size={30} />}
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
            No {activeTab === 'received' ? 'Received' : 'Sent'} Requests
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', margin: '0.5rem auto 1.5rem' }}>
            {activeTab === 'received'
              ? 'When other students find your teaching skills and propose an exchange, they will appear here.'
              : 'Browse students or smart matches and send an exchange request to start learning!'}
          </p>
          <Link to="/matches" className="btn btn-primary">
            <span>Find Skill Matches</span>
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ExchangeRequestsPage;
