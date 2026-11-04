import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Users,
  ArrowLeftRight,
  UserCheck,
  UserX,
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
          borderRadius: '10px',
          padding: '0.65rem 1rem',
          border: '1px solid #fecaca',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          marginBottom: '0.85rem',
        }}
      >
        <ShieldCheck size={20} color="#dc2626" />
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#991b1b', lineHeight: 1.2 }}>
            System Administrator Session Active
          </h4>
          <p style={{ fontSize: '0.75rem', color: '#b91c1c', marginTop: '1px' }}>
            Full administrative permissions to audit peer exchanges and manage student account states.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.65rem',
            marginBottom: '0.85rem',
          }}
          className="admin-metrics-grid"
        >
          {/* Total Students */}
          <div className="card" style={{ padding: '0.65rem 0.85rem', borderLeft: '3.5px solid #6366f1', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>STUDENTS</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {stats.totalUsers}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
              {stats.activeUsers} Active • {stats.inactiveUsers} Inactive
            </div>
          </div>

          {/* Total Skills */}
          <div className="card" style={{ padding: '0.65rem 0.85rem', borderLeft: '3.5px solid #3b82f6', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>SKILL LISTINGS</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {stats.totalSkills}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 600, marginTop: '2px' }}>
              {stats.teachSkillsCount} Teach • {stats.learnSkillsCount} Learn
            </div>
          </div>

          {/* Total Requests */}
          <div className="card" style={{ padding: '0.65rem 0.85rem', borderLeft: '3.5px solid #f59e0b', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>PROPOSALS</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {stats.totalRequests}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 600, marginTop: '2px' }}>
              {stats.pendingRequests} Pending • {stats.acceptedRequests} Accepted
            </div>
          </div>

          {/* Total Exchanges */}
          <div className="card" style={{ padding: '0.65rem 0.85rem', borderLeft: '3.5px solid #10b981', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>EXCHANGES</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {stats.totalExchanges}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
              {stats.inProgressExchanges} Active • {stats.completedExchanges} Done
            </div>
          </div>
        </div>
      )}

      {/* Category Distribution */}
      {stats?.skillsByCategory && stats.skillsByCategory.length > 0 && (
        <div
          className="card"
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            marginBottom: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.55rem' }}>
            <TrendingUp size={15} color="#6366f1" />
            <h3 style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0f172a' }}>
              Skill Category Distribution
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem' }}>
            {stats.skillsByCategory.map((c) => (
              <div
                key={c._id}
                style={{
                  padding: '0.5rem 0.65rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                  <span style={{ color: '#1e293b' }}>{c._id}</span>
                  <span style={{ color: '#6366f1' }}>{c.count}</span>
                </div>
                <div
                  style={{
                    height: '4px',
                    borderRadius: '999px',
                    backgroundColor: '#e2e8f0',
                    marginTop: '0.35rem',
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
          padding: '3px',
          borderRadius: '10px',
          gap: '3px',
          width: 'fit-content',
          marginBottom: '0.75rem',
        }}
      >
        <button
          onClick={() => setTab('users')}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '8px',
            backgroundColor: tab === 'users' ? '#ffffff' : 'transparent',
            color: tab === 'users' ? '#4f46e5' : '#64748b',
            fontWeight: 700,
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: tab === 'users' ? 'var(--shadow-sm)' : 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Users size={14} />
          <span>Manage Students ({users.length})</span>
        </button>

        <button
          onClick={() => setTab('requests')}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '8px',
            backgroundColor: tab === 'requests' ? '#ffffff' : 'transparent',
            color: tab === 'requests' ? '#2563eb' : '#64748b',
            fontWeight: 700,
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: tab === 'requests' ? 'var(--shadow-sm)' : 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <ArrowLeftRight size={14} />
          <span>Exchange Audit Logs ({requests.length})</span>
        </button>
      </div>

      {/* Table: Users Management */}
      {tab === 'users' && (
        <div className="card" style={{ padding: '0.85rem 1rem', backgroundColor: '#ffffff', borderRadius: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #f1f5f9', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.5rem 0.75rem' }}>Student</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>College & Major</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Skills</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Role</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Status</th>
                <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '0.825rem' }}>
                  {/* Name & Avatar */}
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <img
                        src={u.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                        alt={u.name}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* College */}
                  <td style={{ padding: '0.55rem 0.75rem', color: '#475569' }}>
                    <div style={{ fontWeight: 600 }}>{u.college}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{u.department} • {u.year}</div>
                  </td>

                  {/* Skills count */}
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <span className="badge badge-teach" style={{ marginRight: '0.25rem', fontSize: '0.68rem', padding: '1px 5px' }}>
                      {u.teachCount || 0} Teach
                    </span>
                    <span className="badge badge-learn" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                      {u.learnCount || 0} Learn
                    </span>
                  </td>

                  {/* Role */}
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '999px',
                        backgroundColor: u.role === 'admin' ? '#fee2e2' : '#eef2ff',
                        color: u.role === 'admin' ? '#dc2626' : '#4338ca',
                      }}
                    >
                      {u.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <span
                      className={`badge ${u.isActive ? 'badge-beginner' : 'badge-danger'}`}
                      style={{ fontSize: '0.68rem', padding: '1px 6px' }}
                    >
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>

                  {/* Action */}
                  <td style={{ padding: '0.55rem 0.75rem', textAlign: 'right' }}>
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleUserStatus(u._id, u.isActive, u.name)}
                        disabled={actionLoadingId === u._id}
                        className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`}
                        style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem' }}
                      >
                        {u.isActive ? (
                          <>
                            <UserX size={12} />
                            <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <UserCheck size={12} />
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
        <div className="card" style={{ padding: '0.85rem 1rem', backgroundColor: '#ffffff', borderRadius: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #f1f5f9', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.5rem 0.75rem' }}>Sender</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Receiver</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Offered Skill</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Requested Skill</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Status</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '0.825rem' }}>
                  <td style={{ padding: '0.55rem 0.75rem', fontWeight: 600, color: '#0f172a' }}>
                    {r.senderId?.name || 'Student'}
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', fontWeight: 600, color: '#0f172a' }}>
                    {r.receiverId?.name || 'Student'}
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <span className="badge badge-teach" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>{r.offeredSkill}</span>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <span className="badge badge-learn" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>{r.requestedSkill}</span>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <span className={`badge badge-status-${r.status.toLowerCase()}`} style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', color: '#64748b', fontSize: '0.725rem' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .admin-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .admin-metrics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
