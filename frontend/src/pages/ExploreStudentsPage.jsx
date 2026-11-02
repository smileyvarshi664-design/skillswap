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
  Filter,
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

  // Parse URL query params (e.g. from landing page category click)
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
    // Trigger reload
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
          borderRadius: '20px',
          padding: '1.75rem',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem',
        }}
      >
        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              color="#94a3b8"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="Search students by name, college, department, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
            <Search size={16} />
            <span>Search</span>
          </button>

          {(search || selectedCategory !== 'All' || teachSkill || learnSkill) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-secondary"
              title="Reset Filters"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          )}
        </form>

        {/* Skill-Specific Keyword Filters */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ position: 'relative' }}>
            <BookOpen
              size={16}
              color="#4f46e5"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
              placeholder="Filter by Teaching Skill (e.g. Python, Figma, React)"
              value={teachSkill}
              onChange={(e) => setTeachSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Sparkles
              size={16}
              color="#2563eb"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
              placeholder="Filter by Learning Interest (e.g. Design, Video Editing)"
              value={learnSkill}
              onChange={(e) => setLearnSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginRight: '0.25rem' }}>
            CATEGORIES:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                border: `1.5px solid ${selectedCategory === cat ? '#6366f1' : '#e2e8f0'}`,
                backgroundColor: selectedCategory === cat ? '#eef2ff' : '#ffffff',
                color: selectedCategory === cat ? '#4338ca' : '#64748b',
                transition: 'all 0.15s ease',
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
          marginBottom: '1.25rem',
        }}
      >
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>
          Showing {students.length} student profile{students.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Student Cards Grid */}
      {loading ? (
        <div style={{ padding: '5rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          <span style={{ color: '#64748b' }}>Discovering students across campuses...</span>
        </div>
      ) : students.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
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
            <Users size={30} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
            No Students Found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', margin: '0.5rem auto 1.5rem' }}>
            We couldn't find any students matching your exact search filters. Try widening your criteria
            or clearing your search filters.
          </p>
          <button onClick={handleResetFilters} className="btn btn-secondary">
            Reset All Filters
          </button>
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        studentId={selectedStudentId}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onRequestExchange={handleRequestExchange}
      />

      {/* Request Modal */}
      <RequestModal
        targetStudent={targetStudentForRequest}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={fetchStudents}
      />
    </div>
  );

  // If user is authenticated, wrap with DashboardLayout; otherwise show with public Navbar
  if (isAuthenticated) {
    return (
      <DashboardLayout
        title="Explore Students"
        subtitle="Search peers by name, campus, teaching abilities, and learning interests"
      >
        {content}
      </DashboardLayout>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ padding: '3rem 1.5rem', flex: 1 }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>Explore Students</h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '0.25rem' }}>
            Connect with college peers, discover skills they can teach you, and propose a mutual exchange!
          </p>
        </div>
        {content}
      </div>
    </div>
  );
};

export default ExploreStudentsPage;
