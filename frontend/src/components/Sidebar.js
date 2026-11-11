import React from 'react';
import { MODULES, MODULE_GROUPS } from '../modules';

// Barre latérale de navigation, groupée par catégorie.
// Desktop : repliable (icônes seules). Mobile : tiroir coulissant.
const Sidebar = ({ active, onNavigate, collapsed, onToggleCollapse, mobileOpen, onCloseMobile, favorites, historyCount }) => (
  <>
    {mobileOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}
    <aside className={`sidebar no-print ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`} aria-label="Navigation principale">
      <div className="sidebar-brand" onClick={() => onNavigate('home')}>
        <div className="sidebar-logo">💧</div>
        <div className="sidebar-brand-text">
          <div className="sidebar-title">ECO-PUMP AFRIK</div>
          <div className="sidebar-subtitle">Hydraulique Pro</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {favorites.length > 0 && (
          <div className="sidebar-group">
            <div className="sidebar-group-label">★ Favoris</div>
            {favorites.map(id => {
              const m = MODULES.find(x => x.id === id);
              if (!m) return null;
              return <NavItem key={`fav-${m.id}`} m={m} active={active === m.id} onClick={() => onNavigate(m.id)} />;
            })}
          </div>
        )}
        {MODULE_GROUPS.map(g => (
          <div className="sidebar-group" key={g.id}>
            <div className="sidebar-group-label">{g.label}</div>
            {MODULES.filter(m => m.group === g.id).map(m => (
              <NavItem key={m.id} m={m} active={active === m.id} onClick={() => onNavigate(m.id)}
                badge={m.id === 'history' && historyCount > 0 ? historyCount : (m.isNew ? 'NEW' : null)} />
            ))}
          </div>
        ))}
      </nav>

      <button className="sidebar-collapse-btn" onClick={onToggleCollapse} title={collapsed ? 'Déplier le menu' : 'Replier le menu'}>
        <span style={{ display: 'inline-block', transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>«</span>
        <span className="sidebar-item-label">Replier</span>
      </button>
    </aside>
  </>
);

const NavItem = ({ m, active, onClick, badge }) => (
  <button className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick} title={m.title}
    style={active ? { '--accent': m.color } : undefined} aria-current={active ? 'page' : undefined}>
    <span className="sidebar-item-icon">{m.icon}</span>
    <span className="sidebar-item-label">{m.label}</span>
    {badge != null && <span className={`sidebar-badge ${badge === 'NEW' ? 'new' : ''}`}>{badge}</span>}
  </button>
);

export default Sidebar;
