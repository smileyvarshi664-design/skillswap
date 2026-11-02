import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { skillService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SkillModal from '../components/SkillModal';
import {
  BookOpen,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Award,
  Layers,
  Search,
} from 'lucide-react';

const MySkillsPage = () => {
  const { showToast, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('teach'); // 'teach' or 'learn'
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const res = await skillService.getMySkills();
      if (res.data && res.data.success) {
        setTeachSkills(res.data.teachSkills || []);
        setLearnSkills(res.data.learnSkills || []);
      }
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleOpenAdd = (type) => {
    setEditingSkill(null);
    setActiveTab(type);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleDelete = async (skillId, skillName) => {
    if (!window.confirm(`Are you sure you want to remove "${skillName}" from your skills list?`)) {
      return;
    }

    try {
      const res = await skillService.deleteSkill(skillId);
      if (res.data && res.data.success) {
        showToast(`"${skillName}" has been removed`, 'info');
        loadSkills();
        refreshUser();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete skill';
      showToast(msg, 'error');
    }
  };

  const currentSkills = activeTab === 'teach' ? teachSkills : learnSkills;

  return (
    <DashboardLayout
      title="My Skill Listings"
      subtitle="Manage what you can teach other college peers and what you want to learn"
    >
      {/* Top Controls & Tab Selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {/* Tab Pills */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '4px',
            borderRadius: '14px',
            gap: '4px',
          }}
        >
          <button
            onClick={() => setActiveTab('teach')}
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: '10px',
              backgroundColor: activeTab === 'teach' ? '#ffffff' : 'transparent',
              color: activeTab === 'teach' ? '#4f46e5' : '#64748b',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: activeTab === 'teach' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <BookOpen size={17} />
            <span>Skills I Can Teach ({teachSkills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: '10px',
              backgroundColor: activeTab === 'learn' ? '#ffffff' : 'transparent',
              color: activeTab === 'learn' ? '#2563eb' : '#64748b',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: activeTab === 'learn' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={17} />
            <span>Skills I Want to Learn ({learnSkills.length})</span>
          </button>
        </div>

        {/* Add Skill Button */}
        <button
          onClick={() => handleOpenAdd(activeTab)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Add {activeTab === 'teach' ? 'Teaching' : 'Learning'} Skill</span>
        </button>
      </div>

      {/* Skill Cards Grid */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          <span style={{ color: '#64748b' }}>Loading your skills...</span>
        </div>
      ) : currentSkills.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {currentSkills.map((skill) => (
            <div
              key={skill._id}
              className="card card-interactive"
              style={{
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${skill.type === 'teach' ? '#6366f1' : '#3b82f6'}`,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    {skill.skillName}
                  </h3>
                  <span
                    className={`badge badge-${skill.proficiencyLevel.toLowerCase()}`}
                    style={{ flexShrink: 0 }}
                  >
                    {skill.proficiencyLevel}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <span className={`badge badge-${skill.type}`} style={{ fontSize: '0.75rem' }}>
                    {skill.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    • Listed as {skill.type === 'teach' ? 'Mentor / Tutor' : 'Student Learner'}
                  </span>
                </div>

                {skill.description ? (
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {skill.description}
                  </p>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                    No specific description added.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <button
                  onClick={() => handleOpenEdit(skill)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem' }}
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(skill._id, skill.skillName)}
                  className="btn btn-danger btn-sm"
                  style={{ fontSize: '0.8rem' }}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
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
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: activeTab === 'teach' ? '#eef2ff' : '#eff6ff',
              color: activeTab === 'teach' ? '#4f46e5' : '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            {activeTab === 'teach' ? <BookOpen size={32} /> : <Sparkles size={32} />}
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>
            No {activeTab === 'teach' ? 'Teaching' : 'Learning'} Skills Added Yet
          </h3>

          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '440px', margin: '0.5rem auto 1.5rem' }}>
            {activeTab === 'teach'
              ? 'List the subjects, tools, languages, or software you are confident in teaching other students.'
              : 'Add topics you are interested in exploring or mastering from your peers.'}
          </p>

          <button onClick={() => handleOpenAdd(activeTab)} className="btn btn-primary">
            <Plus size={18} />
            <span>Add First {activeTab === 'teach' ? 'Teaching' : 'Learning'} Skill</span>
          </button>
        </div>
      )}

      {/* Skill Modal */}
      <SkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadSkills}
        initialData={editingSkill}
        defaultType={activeTab}
      />
    </DashboardLayout>
  );
};

export default MySkillsPage;
