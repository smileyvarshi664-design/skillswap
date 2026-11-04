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
          gap: '0.65rem',
          marginBottom: '0.85rem',
        }}
      >
        {/* Tab Pills */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: '10px',
            gap: '3px',
          }}
        >
          <button
            onClick={() => setActiveTab('teach')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              backgroundColor: activeTab === 'teach' ? '#ffffff' : 'transparent',
              color: activeTab === 'teach' ? '#4f46e5' : '#64748b',
              fontWeight: 700,
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: activeTab === 'teach' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.12s ease',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <BookOpen size={15} />
            <span>Skills I Can Teach ({teachSkills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              backgroundColor: activeTab === 'learn' ? '#ffffff' : 'transparent',
              color: activeTab === 'learn' ? '#2563eb' : '#64748b',
              fontWeight: 700,
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: activeTab === 'learn' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.12s ease',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={15} />
            <span>Skills I Want to Learn ({learnSkills.length})</span>
          </button>
        </div>

        {/* Add Skill Button */}
        <button
          onClick={() => handleOpenAdd(activeTab)}
          className="btn btn-primary btn-sm"
          style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem' }}
        >
          <Plus size={16} />
          <span>Add {activeTab === 'teach' ? 'Teaching' : 'Learning'} Skill</span>
        </button>
      </div>

      {/* Skill Cards Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 0.5rem', width: '22px', height: '22px' }} />
          <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Loading your skills...</span>
        </div>
      ) : currentSkills.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {currentSkills.map((skill) => (
            <div
              key={skill._id}
              className="card card-interactive"
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '12px',
                borderLeft: `3.5px solid ${skill.type === 'teach' ? '#6366f1' : '#3b82f6'}`,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.45rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                    {skill.skillName}
                  </h3>
                  <span
                    className={`badge badge-${skill.proficiencyLevel.toLowerCase()}`}
                    style={{ flexShrink: 0, fontSize: '0.7rem', padding: '1px 6px' }}
                  >
                    {skill.proficiencyLevel}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  <span className={`badge badge-${skill.type}`} style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                    {skill.category}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    • {skill.type === 'teach' ? 'Mentor / Tutor' : 'Learner'}
                  </span>
                </div>

                {skill.description ? (
                  <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.35, marginBottom: '0.75rem' }}>
                    {skill.description}
                  </p>
                ) : (
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '0.75rem' }}>
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
                  gap: '0.4rem',
                  paddingTop: '0.55rem',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <button
                  onClick={() => handleOpenEdit(skill)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(skill._id, skill.skillName)}
                  className="btn btn-danger btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                >
                  <Trash2 size={13} />
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
              backgroundColor: activeTab === 'teach' ? '#eef2ff' : '#eff6ff',
              color: activeTab === 'teach' ? '#4f46e5' : '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
            }}
          >
            {activeTab === 'teach' ? <BookOpen size={24} /> : <Sparkles size={24} />}
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
            No {activeTab === 'teach' ? 'Teaching' : 'Learning'} Skills Added Yet
          </h3>

          <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: '380px', margin: '0.35rem auto 1rem' }}>
            {activeTab === 'teach'
              ? 'List the subjects, tools, programming languages, or creative apps you can teach.'
              : 'Add topics and skills you are eager to learn from your college peers.'}
          </p>

          <button onClick={() => handleOpenAdd(activeTab)} className="btn btn-primary btn-sm">
            <Plus size={16} />
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
