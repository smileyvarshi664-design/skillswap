import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Navbar from '../components/Navbar';
import StudentCard from '../components/StudentCard';
import UserProfileModal from '../components/UserProfileModal';
import RequestModal from '../components/RequestModal';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  BookOpen,
  Sparkles,
  Users,
  RotateCcw,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Programming',
  'Web Development',
  'Designing',
  'Communication',
  'Photography',
  'Video Editing',
  'Marketing',
  'Data Science',
  'Languages',
  'Other',
];

const ExploreStudentsPage = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Parse URL query params
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [teachSkill, setTeachSkill] = useState('');
  const [learnSkill, setLearnSkill] = useState('');

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [targetStudentForRequest, setTargetStudentForRequest] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (teachSkill.trim()) params.teachSkill = teachSkill.trim();
      if (learnSkill.trim()) params.learnSkill = learnSkill.trim();

      const res = await userService.getUsers(params);
      if (res.data && res.data.success) {
        setStudents(res.data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setTeachSkill('');
    setLearnSkill('');
    setTimeout(() => {
      userService.getUsers({}).then((res) => {
        if (res.data && res.data.success) setStudents(res.data.users || []);
      });
    }, 0);
  };

  const handleViewProfile = (student) => {
    setSelectedStudentId(student._id || student.id);
    setIsProfileModalOpen(true);
  };

  const handleRequestExchange = (student) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setTargetStudentForRequest(student);
    setIsRequestModalOpen(true);
  };

  const content = (
    <div>
      {/* Search & Filter Header Banner */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          padding: '0.85rem 1.15rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
          marginBottom: '0.85rem',
        }}
      >
        {/* Search Bar + Inputs in 1 compact grid */}
        <form onSubmit={handleSearchSubmit} style={{ marginBottom: '0.65rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }} className="explore-search-grid">
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                color="#94a3b8"
                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.25rem', fontSize: '0.825rem' }}
                placeholder="Search by name, college, department, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <BookOpen
                size={14}
                color="#4f46e5"
                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2rem', fontSize: '0.825rem' }}
                placeholder="Filter Can Teach (Python, Figma...)"
                value={teachSkill}
                onChange={(e) => setTeachSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Sparkles
                size={14}
                color="#2563eb"
                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2rem', fontSize: '0.825rem' }}
                placeholder="Filter Wants to Learn (React...)"
                value={learnSkill}
                onChange={(e) => setLearnSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}>
                <Search size={14} />
                <span>Search</span>
              </button>

              {(search || selectedCategory !== 'All' || teachSkill || learnSkill) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-secondary btn-sm"
                  title="Reset Filters"
                  style={{ padding: '0.45rem 0.65rem', fontSize: '0.825rem' }}
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4f46e5', marginRight: '0.2rem', textTransform: 'uppercase' }}>
            Categories:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                border: `1.5px solid ${selectedCategory === cat ? '#6366f1' : '#e2e8f0'}`,
                backgroundColor: selectedCategory === cat ? '#eef2ff' : '#ffffff',
                color: selectedCategory === cat ? '#4338ca' : '#64748b',
                transition: 'all 0.12s ease',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.65rem',
        }}
      >
        <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569' }}>
          Showing {students.length} student profile{students.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Student Cards Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 0.5rem', width: '22px', height: '22px' }} />
          <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Discovering student peers...</span>
        </div>
      ) : students.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '0.85rem',
          }}
        >
          {students.map((student) => (
            <StudentCard
              key={student._id || student.id}
              student={student}
              onViewProfile={handleViewProfile}
              onRequestExchange={handleRequestExchange}
            />
          ))}
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
              backgroundColor: '#f1f5f9',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.65rem',
            }}
          >
            <Users size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
            No Matching Students Found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: '380px', margin: '0.35rem auto 1rem' }}>
            Try broadening your search term or select "All" categories to explore all campus peers.
          </p>
          <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <UserProfileModal
        studentId={selectedStudentId}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onRequestExchange={(student) => {
          setIsProfileModalOpen(false);
          handleRequestExchange(student);
        }}
      />

      <RequestModal
        targetStudent={targetStudentForRequest}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={fetchStudents}
      />

      <style>{`
        @media (max-width: 900px) {
          .explore-search-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );

  // If user is authenticated, wrap with DashboardLayout; otherwise show with public Navbar
  if (isAuthenticated) {
    return (
      <DashboardLayout
        title="Explore Campus Peers"
        subtitle="Search student profiles by department, teaching skills, or learning interests"
      >
        {content}
      </DashboardLayout>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />
      <div className="container" style={{ padding: '1.25rem 1rem', flex: 1 }}>
        <div style={{ marginBottom: '0.85rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Explore Campus Peers</h1>
          <p style={{ color: '#64748b', fontSize: '0.825rem' }}>
            Discover students across university departments eager to exchange knowledge
          </p>
        </div>
        {content}
      </div>
    </div>
  );
};

export default ExploreStudentsPage;
