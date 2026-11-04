import React, { useState } from 'react';
import { feedbackService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Star, Send } from 'lucide-react';

const FeedbackModal = ({ exchange, isOpen, onClose, onSuccess }) => {
  const { showToast } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !exchange) return null;

  const partner = exchange.partner;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      showToast('Please enter your written feedback review', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await feedbackService.createFeedback({
        exchangeId: exchange._id,
        receiverId: partner._id || partner.id,
        rating,
        comment: comment.trim(),
      });

      if (res.data && res.data.success) {
        showToast('Thank you! Your feedback has been recorded successfully.', 'success');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit feedback';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const ratingDescriptions = {
    1: 'Needs improvement',
    2: 'Fair experience',
    3: 'Good exchange',
    4: 'Great learning experience!',
    5: 'Outstanding mentor & peer!',
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
              Leave Peer Feedback
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Rate your skill exchange experience with {partner?.name}
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

        {/* Partner Brief */}
        <div
          style={{
            padding: '0.65rem 1.25rem',
            background: '#f8fafc',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
          }}
        >
          <img
            src={partner?.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
            alt={partner?.name}
            style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>
              {partner?.name}
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
              Taught: <span style={{ color: '#4338ca', fontWeight: 600 }}>{exchange.myLearningSkill}</span> •
              Learned: <span style={{ color: '#1d4ed8', fontWeight: 600 }}>{exchange.myTeachingSkill}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1rem 1.25rem' }}>
          {/* Interactive Star Rating */}
          <div className="form-group" style={{ textAlign: 'center', margin: '0.25rem 0 1rem' }}>
            <label className="form-label" style={{ justifyContent: 'center', marginBottom: '0.45rem', fontSize: '0.8rem' }}>
              Your Rating (1 to 5 Stars):
            </label>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      transition: 'transform 0.12s ease',
                    }}
                  >
                    <Star
                      size={26}
                      fill={isFilled ? '#f59e0b' : 'none'}
                      color={isFilled ? '#f59e0b' : '#cbd5e1'}
                    />
                  </button>
                );
              })}
            </div>

            <div
              style={{
                fontSize: '0.775rem',
                fontWeight: 600,
                color: '#b45309',
                marginTop: '0.35rem',
                minHeight: '18px',
              }}
            >
              {ratingDescriptions[hoverRating || rating]}
            </div>
          </div>

          {/* Feedback comment */}
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Written Feedback / Review:</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="How was their teaching style, punctuality, and knowledge sharing? Your review helps peers!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.55rem', marginTop: '0.85rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.85rem' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-sm" style={{ padding: '0.35rem 1rem' }}>
              {loading ? (
                <div className="spinner" style={{ width: '16px', height: '16px' }} />
              ) : (
                <>
                  <Send size={14} />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
