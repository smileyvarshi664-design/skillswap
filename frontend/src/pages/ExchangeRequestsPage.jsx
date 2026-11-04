import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { requestService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Inbox,
  Send,
  Check,
  X,
  Clock,
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
          padding: '3px',
          borderRadius: '10px',
          gap: '3px',
          width: 'fit-content',
          marginBottom: '0.85rem',
        }}
      >
        <button
          onClick={() => setActiveTab('received')}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '8px',
            backgroundColor: activeTab === 'received' ? '#ffffff' : 'transparent',
            color: activeTab === 'received' ? '#4f46e5' : '#64748b',
            fontWeight: 700,
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: activeTab === 'received' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.12s ease',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Inbox size={15} />
          <span>Received ({receivedRequests.length})</span>
          {pendingReceivedCount > 0 && (
            <span
              style={{
                fontSize: '0.65rem',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                padding: '1px 5px',
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
            padding: '0.45rem 1rem',
            borderRadius: '8px',
            backgroundColor: activeTab === 'sent' ? '#ffffff' : 'transparent',
            color: activeTab === 'sent' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: activeTab === 'sent' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.12s ease',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Send size={15} />
          <span>Sent ({sentRequests.length})</span>
        </button>
      </div>

      {/* Requests List */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 0.5rem', width: '22px', height: '22px' }} />
          <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Loading exchange requests...</span>
        </div>
      ) : currentRequests.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {currentRequests.map((req) => {
            const student = activeTab === 'received' ? req.senderId : req.receiverId;
            const isPending = req.status === 'Pending';
            const isActionBusy = actionLoadingId === req._id;

            return (
              <div
                key={req._id}
                className="card"
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  borderLeft: `3.5px solid ${
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
                    gap: '0.65rem',
                    marginBottom: '0.65rem',
                  }}
                >
                  {/* Student Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img
                      src={student?.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                      alt={student?.name}
                      style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '0.925rem', color: '#0f172a' }}>
                        {student?.name || 'Student Peer'}
                      </h4>
                      <div style={{ fontSize: '0.725rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Building2 size={12} color="#6366f1" />
                        <span>{student?.college} • {student?.department}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className={`badge badge-status-${req.status.toLowerCase()}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                      {req.status}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Exchange Details Visual */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '0.65rem',
                    backgroundColor: '#f8fafc',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '0.65rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4338ca', textTransform: 'uppercase' }}>
                      {activeTab === 'received' ? 'THEY OFFER TO TEACH:' : 'YOU OFFERED TO TEACH:'}
                    </span>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e1b4b', marginTop: '1px' }}>
                      {req.offeredSkill}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                      {activeTab === 'received' ? 'THEY WANT TO LEARN:' : 'YOU REQUESTED TO LEARN:'}
                    </span>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a', marginTop: '1px' }}>
                      {req.requestedSkill}
                    </div>
                  </div>
                </div>

                {/* Message if any */}
                {req.message && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.45rem',
                      fontSize: '0.78rem',
                      color: '#475569',
                      backgroundColor: '#ffffff',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '8px',
                      border: '1px solid #f1f5f9',
                      marginBottom: '0.65rem',
                    }}
                  >
                    <MessageSquare size={13} color="#94a3b8" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontStyle: 'italic' }}>"{req.message}"</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.45rem' }}>
                  {activeTab === 'received' && isPending && (
                    <>
                      <button
                        onClick={() => handleReject(req._id)}
                        disabled={isActionBusy}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                      >
                        <X size={13} />
                        <span>Decline</span>
                      </button>
                      <button
                        onClick={() => handleAccept(req._id)}
                        disabled={isActionBusy}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                      >
                        <Check size={13} />
                        <span>Accept Proposal</span>
                      </button>
                    </>
                  )}

                  {activeTab === 'sent' && isPending && (
                    <button
                      onClick={() => handleCancel(req._id)}
                      disabled={isActionBusy}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                    >
                      <Ban size={13} />
                      <span>Cancel Request</span>
                    </button>
                  )}

                  {!isPending && (
                    <span style={{ fontSize: '0.725rem', color: '#94a3b8', fontStyle: 'italic' }}>
                      Resolved on {new Date(req.updatedAt || req.createdAt).toLocaleDateString()}
                    </span>
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
              backgroundColor: activeTab === 'received' ? '#eef2ff' : '#eff6ff',
              color: activeTab === 'received' ? '#4f46e5' : '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.65rem',
            }}
          >
            {activeTab === 'received' ? <Inbox size={24} /> : <Send size={24} />}
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
            No {activeTab === 'received' ? 'Received' : 'Sent'} Exchange Requests
          </h3>

          <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: '380px', margin: '0.35rem auto 1rem' }}>
            {activeTab === 'received'
              ? 'When other students want to exchange skills with you, their proposals will appear here.'
              : 'Browse students and propose skill exchanges to begin peer sessions!'}
          </p>

          <Link to="/explore" className="btn btn-primary btn-sm">
            <span>Explore Students</span>
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ExchangeRequestsPage;
