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
              Leave Peer Feedback
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Rate your skill exchange experience with {partner?.name}
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '6px', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Partner Brief */}
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
            src={partner?.profileImage || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
            alt={partner?.name}
            style={{ width: '46px', height: '46px', borderRadius: '12px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
              {partner?.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Taught: <span style={{ color: '#4338ca', fontWeight: 600 }}>{exchange.myLearningSkill}</span> •
              Learned: <span style={{ color: '#1d4ed8', fontWeight: 600 }}>{exchange.myTeachingSkill}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Interactive Star Rating */}
          <div className="form-group" style={{ textAlign: 'center', margin: '0.5rem 0 1.5rem' }}>
            <label className="form-label" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
              Your Rating (1 to 5 Stars):
            </label>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
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
                      padding: '4px',
                      transition: 'transform 0.15s ease',
                    }}
                    onFocus={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                    onBlur={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <Star
                      size={32}
                      fill={isFilled ? '#f59e0b' : 'none'}
                      color={isFilled ? '#f59e0b' : '#cbd5e1'}
                    />
                  </button>
                );
              })}
            </div>

            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#b45309',
                marginTop: '0.5rem',
                minHeight: '20px',
              }}
            >
              {ratingDescriptions[hoverRating || rating]}
            </div>
          </div>

          {/* Feedback comment */}
          <div className="form-group">
            <label className="form-label">Written Feedback / Review:</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="How was their teaching style, punctuality, and helpfulness? Your review helps other students!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
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
