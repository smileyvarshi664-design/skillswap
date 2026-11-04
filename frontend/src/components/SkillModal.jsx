import React, { useState, useEffect } from 'react';
import { skillService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Check } from 'lucide-react';

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
      <div className="modal-content" style={{ maxWidth: '480px', borderRadius: '16px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              {initialData ? 'Edit Skill Listing' : `Add ${type === 'teach' ? 'Teaching' : 'Learning'} Skill`}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {type === 'teach'
                ? 'Offer this skill to mentor or tutor your fellow campus students'
                : 'List this skill so student tutors can find and guide you'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '4px',
              color: '#94a3b8',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1rem 1.25rem' }}>
          {/* Skill Type Switcher */}
          <div className="form-group" style={{ marginBottom: '0.65rem' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Listing Type:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
              <button
                type="button"
                onClick={() => setType('teach')}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '8px',
                  border: `1.5px solid ${type === 'teach' ? '#6366f1' : '#e2e8f0'}`,
                  backgroundColor: type === 'teach' ? '#eef2ff' : '#ffffff',
                  color: type === 'teach' ? '#4f46e5' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                }}
              >
                I Can Teach This
              </button>
              <button
                type="button"
                onClick={() => setType('learn')}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '8px',
                  border: `1.5px solid ${type === 'learn' ? '#3b82f6' : '#e2e8f0'}`,
                  backgroundColor: type === 'learn' ? '#eff6ff' : '#ffffff',
                  color: type === 'learn' ? '#2563eb' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                }}
              >
                I Want to Learn This
              </button>
            </div>
          </div>

          {/* Skill Name */}
          <div className="form-group" style={{ marginBottom: '0.65rem' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Skill Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Python, UI/UX Figma, React, Portrait Photo"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              required
            />
          </div>

          {/* Category & Proficiency in 2 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <div className="form-group" style={{ marginBottom: '0.65rem' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Domain Category</label>
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

            <div className="form-group" style={{ marginBottom: '0.65rem' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Proficiency</label>
              <select
                className="form-select"
                value={proficiencyLevel}
                onChange={(e) => setProficiencyLevel(e.target.value)}
                required
              >
                <option value="Beginner">Beginner (Foundations)</option>
                <option value="Intermediate">Intermediate (Hands-on)</option>
                <option value="Advanced">Advanced (Expert / Projects)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Short Description</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="What topics or frameworks do you focus on? (e.g. FastAPI, hooks, framing)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.55rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.85rem' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-sm" style={{ padding: '0.35rem 1rem' }}>
              {loading ? (
                <div className="spinner" style={{ width: '16px', height: '16px' }} />
              ) : (
                <>
                  <Check size={14} />
                  <span>{initialData ? 'Save Changes' : 'Add to Profile'}</span>
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
