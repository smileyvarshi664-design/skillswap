import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Users,
  BookOpen,
  ArrowLeftRight,
  Repeat,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  UserX,
  Building2,
  TrendingUp,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [tab, setTab] = useState('users'); // 'users' or 'requests'

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, reqRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllUsers(),
        adminService.getAllRequests(),
      ]);

      if (statsRes.data && statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (usersRes.data && usersRes.data.success) {
        setUsers(usersRes.data.users || []);
      }
      if (reqRes.data && reqRes.data.success) {
        setRequests(reqRes.data.requests || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus, userName) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} student account for "${userName}"?`)) {
      return;
    }

    setActionLoadingId(userId);
    try {
      const res = await adminService.toggleUserStatus(userId);
      if (res.data && res.data.success) {
        showToast(res.data.message || `User ${action}d successfully`, 'success');
        // Update locally
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: !currentStatus } : u))
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update user status';
      showToast(msg, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <DashboardLayout
      title="Admin Control Center"
      subtitle="Oversee campus students, skill distribution, and platform safety"
    >
      {/* Top Admin Notice */}
      <div
        style={{
          backgroundColor: '#fef2f2',
          borderRadius: '16px',
          padding: '1rem 1.5rem',
          border: '1px solid #fecaca',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
        }}
      >
        <ShieldCheck size={24} color="#dc2626" />
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#991b1b' }}>
            System Administrator Session Active
          </h4>
          <p style={{ fontSize: '0.825rem', color: '#b91c1c' }}>
            You have full elevated permissions to audit peer requests and manage or deactivate student accounts.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          {/* Total Students */}
          <div className="card" style={{ padding: '1.4rem', borderLeft: '4px solid #6366f1' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>TOTAL STUDENTS</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
              {stats.totalUsers}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: '0.4rem' }}>
              {stats.activeUsers} Active • {stats.inactiveUsers} Inactive
            </div>
          </div>

          {/* Total Skills */}
          <div className="card" style={{ padding: '1.4rem', borderLeft: '4px solid #3b82f6' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>TOTAL SKILL LISTINGS</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
              {stats.totalSkills}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600, marginTop: '0.4rem' }}>
              {stats.teachSkillsCount} Teach • {stats.learnSkillsCount} Learn
            </div>
          </div>

          {/* Total Requests */}
          <div className="card" style={{ padding: '1.4rem', borderLeft: '4px solid #f59e0b' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>EXCHANGE PROPOSALS</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
              {stats.totalRequests}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600, marginTop: '0.4rem' }}>
              {stats.pendingRequests} Pending • {stats.acceptedRequests} Accepted
            </div>
          </div>

          {/* Total Exchanges */}
          <div className="card" style={{ padding: '1.4rem', borderLeft: '4px solid #10b981' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>SKILL EXCHANGES</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
              {stats.totalExchanges}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '0.4rem' }}>
              {stats.inProgressExchanges} Active • {stats.completedExchanges} Completed
            </div>
          </div>
        </div>
      )}

      {/* Category Distribution */}
      {stats?.skillsByCategory && stats.skillsByCategory.length > 0 && (
        <div
          className="card"
          style={{
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <TrendingUp size={18} color="#6366f1" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              Skill Category Distribution
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {stats.skillsByCategory.map((c) => (
              <div
                key={c._id}
                style={{
                  padding: '0.85rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                  <span style={{ color: '#1e293b' }}>{c._id}</span>
                  <span style={{ color: '#6366f1' }}>{c.count} listings</span>
                </div>
                <div
                  style={{
                    height: '6px',
                    borderRadius: '999px',
                    backgroundColor: '#e2e8f0',
                    marginTop: '0.5rem',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min((c.count / (stats.totalSkills || 1)) * 100 * 2, 100)}%`,
                      backgroundColor: '#6366f1',
                      borderRadius: '999px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Switcher Tabs */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '14px',
          gap: '4px',
          width: 'fit-content',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={() => setTab('users')}
          style={{
            padding: '0.65rem 1.4rem',
            borderRadius: '10px',
            backgroundColor: tab === 'users' ? '#ffffff' : 'transparent',
            color: tab === 'users' ? '#4f46e5' : '#64748b',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: tab === 'users' ? 'var(--shadow-sm)' : 'none',
          }}
        >
          <Users size={16} />
          <span>Manage Students ({users.length})</span>
        </button>

        <button
          onClick={() => setTab('requests')}
          style={{
            padding: '0.65rem 1.4rem',
            borderRadius: '10px',
            backgroundColor: tab === 'requests' ? '#ffffff' : 'transparent',
            color: tab === 'requests' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: tab === 'requests' ? 'var(--shadow-sm)' : 'none',
          }}
        >
          <ArrowLeftRight size={16} />
          <span>Exchange Audit Logs ({requests.length})</span>
        </button>
      </div>

      {/* Table: Users Management */}
      {tab === 'users' && (
        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Student</th>
                <th style={{ padding: '0.75rem 1rem' }}>College & Major</th>
                <th style={{ padding: '0.75rem 1rem' }}>Skills (Teach / Learn)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '0.9rem' }}>
                  {/* Name & Avatar */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={u.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                        alt={u.name}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* College */}
                  <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                    <div style={{ fontWeight: 600 }}>{u.college}</div>
                    <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{u.department} • {u.year}</div>
                  </td>

                  {/* Skills count */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge badge-teach" style={{ marginRight: '0.3rem' }}>
                      {u.teachCount || 0} Teach
                    </span>
                    <span className="badge badge-learn">
                      {u.learnCount || 0} Learn
                    </span>
                  </td>

                  {/* Role */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: u.role === 'admin' ? '#fee2e2' : '#eef2ff',
                        color: u.role === 'admin' ? '#dc2626' : '#4338ca',
                      }}
                    >
                      {u.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      className={`badge ${u.isActive ? 'badge-beginner' : 'badge-danger'}`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleUserStatus(u._id, u.isActive, u.name)}
                        disabled={actionLoadingId === u._id}
                        className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`}
                        style={{ fontSize: '0.775rem' }}
                      >
                        {u.isActive ? (
                          <>
                            <UserX size={14} />
                            <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <UserCheck size={14} />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table: Exchange Requests Audit Logs */}
      {tab === 'requests' && (
        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Sender</th>
                <th style={{ padding: '0.75rem 1rem' }}>Receiver</th>
                <th style={{ padding: '0.75rem 1rem' }}>Offered Skill</th>
                <th style={{ padding: '0.75rem 1rem' }}>Requested Skill</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '0.875rem' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                    {r.senderId?.name || 'Student'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                    {r.receiverId?.name || 'Student'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge badge-teach">{r.offeredSkill}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge badge-learn">{r.requestedSkill}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge badge-status-${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
