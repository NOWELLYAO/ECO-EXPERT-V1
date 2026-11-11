import React, { useEffect, useState } from 'react';
import notify from '../lib/notify';

const ICONS = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '⛔' };

const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => notify.subscribe((t) => {
    setToasts(list => [...list.slice(-3), t]);
    setTimeout(() => setToasts(list => list.filter(x => x.id !== t.id)), t.duration);
  }), []);

  const dismiss = (id) => setToasts(list => list.filter(x => x.id !== id));

  return (
    <div className="toaster no-print" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{ICONS[t.type]}</span>
          <span className="toast-msg">{t.message}</span>
          <button className="toast-close" onClick={() => dismiss(t.id)} aria-label="Fermer">✕</button>
        </div>
      ))}
    </div>
  );
};

export default Toaster;
