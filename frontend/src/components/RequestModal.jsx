import React, { useState, useEffect } from 'react';
import { requestService, skillService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Send, BookOpen, Sparkles, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const RequestModal = ({ targetStudent, isOpen, onClose, onSuccess }) => {
  const { user, showToast } = useAuth();
  const [myTeachSkills, setMyTeachSkills] = useState([]);
  const [offeredSkill, setOfferedSkill] = useState('');
  const [customOfferedSkill, setCustomOfferedSkill] = useState('');
  const [requestedSkill, setRequestedSkill] = useState('');
  const [customRequestedSkill, setCustomRequestedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingSkills, setFetchingSkills] = useState(true);

  // Fetch current student's teaching skills
  useEffect(() => {
    if (isOpen && user) {
      setFetchingSkills(true);
      skillService
        .getMySkills()
        .then((res) => {
          if (res.data && res.data.success) {
            const teach = res.data.teachSkills || [];
            setMyTeachSkills(teach);
            if (teach.length > 0) {
              setOfferedSkill(teach[0].skillName);
            }
          }
        })
        .catch((err) => console.error('Failed to load my skills:', err))
        .finally(() => setFetchingSkills(false));

      // Preset requested skill if target student has teaching skills
      if (targetStudent?.teachSkills && targetStudent.teachSkills.length > 0) {
        setRequestedSkill(targetStudent.teachSkills[0].skillName);
      } else {
        setRequestedSkill('');
      }

      setMessage(
        `Hi ${targetStudent?.name || 'there'}! I'd love to exchange skills with you on SkillSwap.`
      );
    }
  }, [isOpen, user, targetStudent]);

  if (!isOpen || !targetStudent) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOffered = offeredSkill === '__custom__' ? customOfferedSkill.trim() : offeredSkill;
    const finalRequested = requestedSkill === '__custom__' ? customRequestedSkill.trim() : requestedSkill;

    if (!finalOffered) {
      showToast('Please select or enter the skill you offer to teach', 'error');
      return;
    }

    if (!finalRequested) {
      showToast('Please select or enter the skill you wish to learn', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await requestService.sendRequest({
        receiverId: targetStudent._id || targetStudent.id,
        offeredSkill: finalOffered,
        requestedSkill: finalRequested,
        message: message.trim(),
      });

      if (res.data && res.data.success) {
        showToast(res.data.message || 'Exchange request sent successfully!', 'success');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to send exchange request';
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
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Propose Skill Exchange
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Send an exchange proposal to {targetStudent.name}
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '6px', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Target Student Preview */}
        <div
          style={{
            padding: '1rem 1.5rem',
            background: '#f8fafc',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}
        >
          <img
            src={targetStudent.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
            alt={targetStudent.name}
            style={{ width: '46px', height: '46px', borderRadius: '12px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
              {targetStudent.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {targetStudent.college} • {targetStudent.department}
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Skill you offer to teach */}
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={15} color="#4f46e5" />
                <span>Skill You Will Teach:</span>
              </span>
              {myTeachSkills.length === 0 && !fetchingSkills && (
                <Link
                  to="/my-skills"
                  style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600 }}
                  onClick={onClose}
                >
                  + Add to profile
                </Link>
              )}
            </label>

            {myTeachSkills.length > 0 ? (
              <select
                className="form-select"
                value={offeredSkill}
                onChange={(e) => setOfferedSkill(e.target.value)}
                required
              >
                {myTeachSkills.map((s) => (
                  <option key={s._id} value={s.skillName}>
                    {s.skillName} ({s.proficiencyLevel})
                  </option>
                ))}
                <option value="__custom__">+ Enter another skill...</option>
              </select>
            ) : (
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Python, UI Design, Public Speaking"
                value={customOfferedSkill}
                onChange={(e) => {
                  setOfferedSkill('__custom__');
                  setCustomOfferedSkill(e.target.value);
                }}
                required
              />
            )}

            {offeredSkill === '__custom__' && myTeachSkills.length > 0 && (
              <input
                type="text"
                className="form-input"
                style={{ marginTop: '0.5rem' }}
                placeholder="Type custom skill name..."
                value={customOfferedSkill}
                onChange={(e) => setCustomOfferedSkill(e.target.value)}
                required
              />
            )}
          </div>

          {/* Skill you want to learn */}
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={15} color="#2563eb" />
                <span>Skill You Want to Learn from {targetStudent.name}:</span>
              </span>
            </label>

            {targetStudent.teachSkills && targetStudent.teachSkills.length > 0 ? (
              <select
                className="form-select"
                value={requestedSkill}
                onChange={(e) => setRequestedSkill(e.target.value)}
                required
              >
                {targetStudent.teachSkills.map((s, idx) => (
                  <option key={idx} value={s.skillName}>
                    {s.skillName} ({s.proficiencyLevel || 'Teacher'})
                  </option>
                ))}
                <option value="__custom__">+ Other skill...</option>
              </select>
            ) : (
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Web Development, Photography"
                value={customRequestedSkill}
                onChange={(e) => {
                  setRequestedSkill('__custom__');
                  setCustomRequestedSkill(e.target.value);
                }}
                required
              />
            )}

            {requestedSkill === '__custom__' && targetStudent.teachSkills?.length > 0 && (
              <input
                type="text"
                className="form-input"
                style={{ marginTop: '0.5rem' }}
                placeholder="Type custom skill you want to learn..."
                value={customRequestedSkill}
                onChange={(e) => setCustomRequestedSkill(e.target.value)}
                required
              />
            )}
          </div>

          {/* Friendly Message */}
          <div className="form-group">
            <label className="form-label">Invitation Message:</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Introduce yourself and outline your learning goals..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Notice */}
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: '#eef2ff',
              color: '#4338ca',
              fontSize: '0.775rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={16} flexShrink={0} />
            <span>
              Skill exchanges on SkillSwap are 100% peer-to-peer and free. Both students teach and learn!
            </span>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? (
                <div className="spinner" style={{ width: '18px', height: '18px' }} />
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;
