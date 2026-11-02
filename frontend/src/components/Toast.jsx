import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toast, closeToast } = useAuth();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={20} className="text-emerald-500" color="#10b981" />,
    error: <AlertCircle size={20} className="text-rose-500" color="#ef4444" />,
    info: <Info size={20} className="text-blue-500" color="#3b82f6" />,
  };

  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type || 'info'}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          {icons[toast.type] || icons.info}
          <span style={{ fontSize: '0.9rem', color: '#1e293b' }}>{toast.message}</span>
        </div>
        <button
          onClick={closeToast}
          style={{
            padding: '4px',
            color: '#94a3b8',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
