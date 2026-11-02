import React, { useState, useEffect } from 'react';
import { skillService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Check, BookOpen, Sparkles } from 'lucide-react';

const CATEGORIES = [
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

const SkillModal = ({ isOpen, onClose, onSuccess, initialData, defaultType = 'teach' }) => {
  const { showToast, refreshUser } = useAuth();
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [type, setType] = useState(defaultType);
  const [proficiencyLevel, setProficiencyLevel] = useState('Intermediate');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSkillName(initialData.skillName || '');
      setCategory(initialData.category || 'Programming');
      setType(initialData.type || defaultType);
      setProficiencyLevel(initialData.proficiencyLevel || 'Intermediate');
      setDescription(initialData.description || '');
    } else {
      setSkillName('');
      setCategory('Programming');
      setType(defaultType);
      setProficiencyLevel(defaultType === 'teach' ? 'Intermediate' : 'Beginner');
      setDescription('');
    }
  }, [initialData, defaultType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!skillName.trim()) {
      showToast('Please enter a skill name', 'error');
      return;
    }

    setLoading(true);
    try {
      if (initialData && initialData._id) {
        // Update existing skill
        const res = await skillService.updateSkill(initialData._id, {
          skillName: skillName.trim(),
          category,
          type,
          proficiencyLevel,
          description: description.trim(),
        });

        if (res.data && res.data.success) {
          showToast(res.data.message || 'Skill updated successfully!', 'success');
          refreshUser();
          if (onSuccess) onSuccess();
          onClose();
        }
      } else {
        // Add new skill
        const res = await skillService.addSkill({
          skillName: skillName.trim(),
          category,
          type,
          proficiencyLevel,
          description: description.trim(),
        });

        if (res.data && res.data.success) {
          showToast(res.data.message || 'Skill added successfully!', 'success');
          refreshUser();
          if (onSuccess) onSuccess();
          onClose();
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save skill';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {type === 'teach' ? (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#eef2ff',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={18} />
              </div>
            ) : (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={18} />
              </div>
            )}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {initialData ? 'Edit Skill Listing' : 'Add New Skill'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {type === 'teach'
                  ? 'Share what you know with other college peers'
                  : 'Specify what you wish to learn from others'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '6px', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Type Selector (Teach vs Learn) */}
          <div className="form-group">
            <label className="form-label">Skill Intent:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setType('teach')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: `2px solid ${type === 'teach' ? '#6366f1' : '#e2e8f0'}`,
                  backgroundColor: type === 'teach' ? '#eef2ff' : '#ffffff',
                  color: type === 'teach' ? '#4338ca' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <BookOpen size={16} />
                <span>I Can Teach</span>
              </button>

              <button
                type="button"
                onClick={() => setType('learn')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: `2px solid ${type === 'learn' ? '#2563eb' : '#e2e8f0'}`,
                  backgroundColor: type === 'learn' ? '#eff6ff' : '#ffffff',
                  color: type === 'learn' ? '#1e40af' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <Sparkles size={16} />
                <span>I Want to Learn</span>
              </button>
            </div>
          </div>

          {/* Skill Name */}
          <div className="form-group">
            <label className="form-label">Skill Name:</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Python Programming, Figma, Video Editing, SQL"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category:</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Proficiency Level */}
          <div className="form-group">
            <label className="form-label">Proficiency Level:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setProficiencyLevel(lvl)}
                  style={{
                    padding: '0.55rem',
                    borderRadius: '8px',
                    border: `1.5px solid ${proficiencyLevel === lvl ? '#6366f1' : '#e2e8f0'}`,
                    backgroundColor: proficiencyLevel === lvl ? '#eef2ff' : '#ffffff',
                    color: proficiencyLevel === lvl ? '#4338ca' : '#64748b',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description / Topics Covered:</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder={
                type === 'teach'
                  ? 'Briefly describe what topics you can tutor or mentor peers on...'
                  : 'Describe what specific areas you would love help learning...'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? (
                <div className="spinner" style={{ width: '18px', height: '18px' }} />
              ) : (
                <>
                  <Check size={16} />
                  <span>{initialData ? 'Update Skill' : 'Save Skill'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillModal;
