import React, { useMemo, useState } from 'react';
import { MODULES, MODULE_GROUPS, matchModule, calcTypeLabel } from '../modules';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
};

const timeAgo = (d) => {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  if (s < 86400 * 30) return `il y a ${Math.floor(s / 86400)} j`;
  return new Date(d).toLocaleDateString('fr-FR');
};

const DashboardHome = ({ onNavigate, user, history, favorites, onToggleFavorite, recent, onOpenPalette }) => {
  const [filter, setFilter] = useState('');
  const modules = MODULES.filter(m => m.id !== 'home');

  const stats = useMemo(() => {
    const projects = new Set(history.map(h => h.project_name || 'Sans nom'));
    const clients = new Set(history.map(h => h.client_name).filter(Boolean));
    const weekAgo = Date.now() - 7 * 86400 * 1000;
    const thisWeek = history.filter(h => new Date(h.timestamp).getTime() >= weekAgo).length;
    return { total: history.length, projects: projects.size, clients: clients.size, thisWeek };
  }, [history]);

  const recentModules = recent.map(id => modules.find(m => m.id === id)).filter(Boolean).slice(0, 4);
  const lastCalcs = history.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
  const visible = modules.filter(m => matchModule(m, filter));
  const firstName = (user?.name || '').split(' ')[0];

  return (
    <div className="dashboard-home fade-in">
      <section className="dash-hero">
        <div className="dash-hero-content">
          <div className="dash-hero-kicker">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <h1 className="dash-hero-title">{greeting()}{firstName ? `, ${firstName}` : ''} 👋</h1>
          <p className="dash-hero-desc">Dimensionnez, auditez et optimisez vos installations de pompage — de l'aspiration jusqu'au panneau solaire.</p>
          <div className="dash-hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate('npshd')}>🚀 Nouveau calcul</button>
            <button className="dash-ghost-btn" onClick={onOpenPalette}>🔎 Rechercher <kbd className="kbd kbd-dark">Ctrl K</kbd></button>
          </div>
        </div>
        <div className="dash-hero-art" aria-hidden="true">
          <svg viewBox="0 0 200 160" width="100%" height="100%">
            <defs>
              <linearGradient id="dh-g" x1="0" x2="1"><stop offset="0" stopColor="#2dd4bf" /><stop offset="1" stopColor="#fbbf24" /></linearGradient>
            </defs>
            <path d="M10 140 C 50 40, 110 30, 190 20" fill="none" stroke="url(#dh-g)" strokeWidth="4" strokeLinecap="round" />
            <path d="M10 60 C 70 70, 130 100, 190 140" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2.5" strokeDasharray="6 6" />
            <circle cx="104" cy="81" r="9" fill="#fbbf24" stroke="white" strokeWidth="3" />
            <text x="118" y="76" fill="white" fontSize="11" fontFamily="Inter" fontWeight="700">Point de fonctionnement</text>
          </svg>
        </div>
      </section>

      <section className="dash-stats">
        {[
          { icon: '🧮', label: 'Calculs sauvegardés', value: stats.total, color: '#0ea5e9' },
          { icon: '📁', label: 'Projets', value: stats.projects, color: '#14b8a6' },
          { icon: '👥', label: 'Clients', value: stats.clients, color: '#8b5cf6' },
          { icon: '📈', label: 'Cette semaine', value: stats.thisWeek, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="dash-stat" onClick={() => onNavigate('history')} role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onNavigate('history')}>
            <div className="dash-stat-icon" style={{ background: s.color + '1a', color: s.color }}>{s.icon}</div>
            <div>
              <div className="dash-stat-value">{s.value}</div>
              <div className="dash-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      <div className="dash-columns">
        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2>⏱️ Reprendre</h2>
          </div>
          {recentModules.length === 0 ? (
            <p className="dash-empty">Les modules que vous ouvrez apparaîtront ici.</p>
          ) : (
            <div className="dash-recent-grid">
              {recentModules.map(m => (
                <button key={m.id} className="dash-recent" onClick={() => onNavigate(m.id)} style={{ '--c': m.color }}>
                  <span className="dash-recent-icon">{m.icon}</span>
                  <span>{m.title}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2>🕘 Derniers calculs</h2>
            {history.length > 0 && <button className="dash-link" onClick={() => onNavigate('history')}>Tout voir →</button>}
          </div>
          {lastCalcs.length === 0 ? (
            <p className="dash-empty">Aucun calcul sauvegardé. Utilisez « 💾 Sauvegarder ce calcul » après un calcul.</p>
          ) : (
            <ul className="dash-activity">
              {lastCalcs.map(h => (
                <li key={h.id} onClick={() => onNavigate('history', { project: h.project_name, open: h.id })}>
                  <span className="dash-activity-type">{calcTypeLabel(h.calculation_type)}</span>
                  <span className="dash-activity-name">{h.project_name}{h.client_name ? <em> · {h.client_name}</em> : null}</span>
                  <span className="dash-activity-time">{timeAgo(h.timestamp)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section style={{ marginTop: 26 }}>
        <div className="dash-modules-head">
          <div>
            <h2 className="dash-h2">Tous les modules</h2>
            <p className="dash-sub">Cliquez sur ☆ pour épingler un module dans la barre latérale.</p>
          </div>
          <div className="dash-filter">
            <span>🔎</span>
            <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filtrer les modules…" aria-label="Filtrer les modules" />
          </div>
        </div>

        {MODULE_GROUPS.filter(g => g.id !== 'general').map(g => {
          const items = visible.filter(m => m.group === g.id);
          if (items.length === 0) return null;
          return (
            <div key={g.id} className="dash-group">
              <div className="dash-group-label">{g.label}</div>
              <div className="dash-module-grid">
                {items.map(m => {
                  const fav = favorites.includes(m.id);
                  return (
                    <div key={m.id} className="dash-module" style={{ '--c': m.color }} onClick={() => onNavigate(m.id)}
                      role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onNavigate(m.id)}>
                      <div className="dash-module-top">
                        <span className="dash-module-icon">{m.icon}</span>
                        <button className={`dash-star ${fav ? 'on' : ''}`} title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                          onClick={e => { e.stopPropagation(); onToggleFavorite(m.id); }} aria-pressed={fav}>{fav ? '★' : '☆'}</button>
                      </div>
                      <div className="dash-module-title">{m.title}{m.isNew && <span className="dash-new">NOUVEAU</span>}</div>
                      <div className="dash-module-desc">{m.desc}</div>
                      <div className="dash-module-go">Ouvrir →</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {visible.length === 0 && <p className="dash-empty">Aucun module ne correspond à « {filter} ».</p>}
      </section>

      <footer className="dash-footer">
        <div className="dash-norms">
          {['ISO 50001', 'IEC 60034', 'ASHRAE', 'Joukowsky', 'Darcy-Weisbach', 'Colebrook-White'].map(s => <span key={s}>✓ {s}</span>)}
        </div>
        <span className="dash-version">v5.0 PRO</span>
      </footer>
    </div>
  );
};

export default DashboardHome;
