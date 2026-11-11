// ════════════════════════════════════════════════════════════════
// Notifications "toast" — remplace les alert() bloquants du navigateur.
// Petit bus d'événements sans dépendance : n'importe quel composant peut
// appeler notify.success('…') ; <Toaster/> (monté une fois dans App) affiche.
// ════════════════════════════════════════════════════════════════
const listeners = new Set();
let nextId = 1;

const emit = (type, message, opts = {}) => {
  const toast = { id: nextId++, type, message: String(message ?? ''), duration: opts.duration ?? (type === 'error' ? 6000 : 3800) };
  listeners.forEach(l => l(toast));
  return toast.id;
};

export const notify = {
  info: (m, o) => emit('info', m, o),
  success: (m, o) => emit('success', m, o),
  warning: (m, o) => emit('warning', m, o),
  error: (m, o) => emit('error', m, o),
  subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
};

export default notify;
