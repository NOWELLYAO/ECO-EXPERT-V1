import React, { useState, useEffect } from 'react';

// Composants d'interface partagés par tous les modules de calcul.

export const DS = {
  // Polices
  fontHead: "'Inter', 'Segoe UI', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  // Couleurs
  blue:   { 50:'#eff6ff', 100:'#dbeafe', 500:'#3b82f6', 600:'#2563eb', 700:'#1d4ed8', 900:'#1e3a8a' },
  green:  { 50:'#f0fdf4', 100:'#dcfce7', 500:'#22c55e', 600:'#16a34a', 700:'#15803d' },
  red:    { 50:'#fff1f2', 100:'#ffe4e6', 500:'#ef4444', 600:'#dc2626', 700:'#b91c1c' },
  amber:  { 50:'#fffbeb', 100:'#fef3c7', 500:'#f59e0b', 600:'#d97706', 700:'#b45309' },
  purple: { 50:'#faf5ff', 100:'#f3e8ff', 500:'#a855f7', 600:'#9333ea', 700:'#7e22ce' },
  slate:  { 50:'#f8fafc', 100:'#f1f5f9', 200:'#e2e8f0', 300:'#cbd5e1', 400:'#94a3b8', 500:'#64748b', 700:'#334155', 900:'#0f172a' },
};


export const PRO_FIELD_COLORS = {
  blue:   { border:'#3b82f6', bg:'#eff6ff', label:'#1d4ed8' },
  green:  { border:'#22c55e', bg:'#f0fdf4', label:'#15803d' },
  cyan:   { border:'#06b6d4', bg:'#ecfeff', label:'#0e7490' },
  purple: { border:'#a855f7', bg:'#faf5ff', label:'#7e22ce' },
  amber:  { border:'#f59e0b', bg:'#fffbeb', label:'#b45309' },
  orange: { border:'#f97316', bg:'#fff7ed', label:'#c2410c' },
  slate:  { border:'#64748b', bg:'#f8fafc', label:'#334155' },
};

// Hook : vrai quand l'écran est assez large pour afficher formulaire et
// résultats côte à côte (au lieu de les séparer dans deux onglets).
export const useWideLayout = (minWidth = 1180) => {
  const query = `(min-width: ${minWidth}px)`;
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setWide(mq.matches);
    onChange();
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange); };
  }, [query]);
  return wide;
};
export const SPLIT_COLS = 'minmax(0, 1.1fr) minmax(0, 1fr)';

export const ProInput = ({ label, value, onChange, unit, note, warn, icon, min, max, step=1, color='blue' }) => {
  const [raw, setRaw] = React.useState(value === null || value === undefined ? '' : String(value));
  React.useEffect(() => { setRaw(value === null || value === undefined ? '' : String(value)); }, [value]);
  const commit = str => {
    const n = parseFloat(String(str).replace(',', '.'));
    if (!isNaN(n)) onChange(n);
    else setRaw(String(value ?? ''));
  };
  const c = PRO_FIELD_COLORS[color] || PRO_FIELD_COLORS.blue;
  const accent = warn ? '#f59e0b' : c.border;
  return (
    <div className={`pro-field ${warn ? 'is-warn' : ''}`} style={{ '--accent': accent, '--accent-ink': warn ? '#b45309' : c.label }}>
      <label className="pro-field-label">
        {icon && <span className="pro-field-icon">{icon}</span>}
        <span>{label}</span>
      </label>
      <div className="pro-field-control">
        <input
          type="text" inputMode="decimal"
          value={raw}
          onChange={e=>{
            const v = e.target.value;
            setRaw(v);
            const n = parseFloat(v.replace(',', '.'));
            if (!isNaN(n)) onChange(n); // mise à jour en temps réel (ex: suggestion DN pendant la saisie)
          }}
          onBlur={e=>commit(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}
          onFocus={e=>e.target.select()}
          className="pro-field-input"
          style={{ paddingRight: unit ? '58px' : undefined }}
          aria-label={label}
        />
        {unit && <span className="pro-field-unit">{unit}</span>}
      </div>
      {note && <p className="pro-field-note">{note}</p>}
    </div>
  );
};

// Composant : Select stylé, même apparence que ProInput
export const ProSelect = ({ label, value, onChange, options, icon, color='blue' }) => {
  const c = PRO_FIELD_COLORS[color] || PRO_FIELD_COLORS.blue;
  return (
    <div className="pro-field" style={{ '--accent': c.border, '--accent-ink': c.label }}>
      <label className="pro-field-label">
        {icon && <span className="pro-field-icon">{icon}</span>}
        <span>{label}</span>
      </label>
      <div className="pro-field-control">
        <select value={value} onChange={e=>onChange(e.target.value)} className="pro-field-input pro-field-select" aria-label={label}>
          {options.map(o => <option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}
        </select>
      </div>
    </div>
  );
};


export const ProAlert = ({ type='info', title, children, icon }) => {
  const cfg = {
    danger:  { bg:'#fff1f2', border:'#fca5a5', title:'#991b1b', text:'#dc2626', icon: icon||'🚨' },
    warning: { bg:'#fffbeb', border:'#fcd34d', title:'#92400e', text:'#d97706', icon: icon||'⚠️' },
    success: { bg:'#f0fdf4', border:'#86efac', title:'#14532d', text:'#16a34a', icon: icon||'✅' },
    info:    { bg:'#eff6ff', border:'#93c5fd', title:'#1e3a8a', text:'#2563eb', icon: icon||'💡' },
  }[type];
  return (
    <div className="pro-alert" style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, borderLeft:`4px solid ${cfg.text}`, borderRadius:'12px', padding:'12px 14px' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
        <span style={{ fontSize:'1.1rem', marginTop:'1px', flexShrink:0 }}>{cfg.icon}</span>
        <div>
          {title&&<div style={{ fontSize:'0.8rem', fontWeight:700, color:cfg.title, marginBottom:'4px' }}>{title}</div>}
          <div style={{ fontSize:'0.78rem', color:cfg.text, lineHeight:1.6 }}>{children}</div>
        </div>
      </div>
    </div>
  );
};


export const KPICard = ({ label, value, unit, sub, color='#2563eb', bg='#eff6ff', icon, big }) => (
  <div className={`kpi ${big ? 'kpi-big' : ''}`} style={{ '--kpi': color, '--kpi-bg': bg }}>
    <div className="kpi-head">
      <span className="kpi-label">{label}</span>
      {icon && <span className="kpi-icon">{icon}</span>}
    </div>
    <div className="kpi-value">{value ?? '—'}<span className="kpi-unit">{unit}</span></div>
    {sub && <div className="kpi-sub">{sub}</div>}
  </div>
);


export const SUBTAB_COLORS = { blue:'#2563eb', cyan:'#0891b2', yellow:'#d97706', green:'#059669', purple:'#7c3aed', orange:'#ea580c', red:'#dc2626', indigo:'#4f46e5', teal:'#0d9488', pink:'#db2777', gray:'#475569' };
export const SubTabNav = ({ tabs, active, onChange, hidden }) => hidden ? null : (
  <div className="seg" role="tablist">
    {tabs.map(t => (
      <button
        key={t.id}
        role="tab"
        aria-selected={active === t.id}
        onClick={() => !t.disabled && onChange(t.id)}
        disabled={t.disabled}
        className={`seg-btn ${active === t.id ? 'active' : ''}`}
        style={{ '--seg': SUBTAB_COLORS[t.color] || '#0f766e' }}
      >
        {t.label}
      </button>
    ))}
  </div>
);

export const SectionHead = ({ icon, title, color='#2563eb', sub }) => (
  <div className="section-head" style={{ '--sh': color }}>
    <span className="section-head-icon">{icon}</span>
    <div>
      <div className="section-head-title">{title}</div>
      {sub && <div className="section-head-sub">{sub}</div>}
    </div>
  </div>
);

// Composant : Card conteneur pro
export const ProCard = ({ children, style={} }) => (
  <div className="pro-card" style={style}>
    {children}
  </div>
);


// En-tête de module unifié : icône, catégorie, titre, description, badges et actions.
export const ModuleHeader = ({ icon, kicker, title, desc, color = '#14b8a6', tags = [], actions }) => (
  <header className="mod-head" style={{ '--mh': color }}>
    <div className="mod-head-icon" aria-hidden="true">{icon}</div>
    <div className="mod-head-text">
      {kicker && <div className="mod-head-kicker">{kicker}</div>}
      <h1 className="mod-head-title">{title}</h1>
      {desc && <p className="mod-head-desc">{desc}</p>}
      {tags.length > 0 && (
        <div className="mod-head-tags">{tags.map(t => <span key={t}>{t}</span>)}</div>
      )}
    </div>
    {actions && <div className="mod-head-actions">{actions}</div>}
  </header>
);

// Ligne "libellé … valeur" pour les tableaux de détail
export const DetailRow = ({ label, value, unit, tone, hint }) => (
  <div className="detail-row">
    <span className="detail-label">{label}{hint && <small>{hint}</small>}</span>
    <span className={`detail-value ${tone ? 'tone-' + tone : ''}`}>{value}{unit && <em>{unit}</em>}</span>
  </div>
);

// Groupe de boutons à choix unique (remplace un <select> quand il y a peu d'options)
export const ChoiceGroup = ({ label, value, onChange, options, color = '#0f766e' }) => (
  <div className="pro-field">
    {label && <div className="pro-field-label"><span>{label}</span></div>}
    <div className="choice-group" style={{ '--cg': color }}>
      {options.map(o => (
        <button key={o.v} type="button" className={`choice ${value === o.v ? 'on' : ''}`} onClick={() => onChange(o.v)} aria-pressed={value === o.v}>
          <span className="choice-l">{o.l}</span>
          {o.d && <span className="choice-d">{o.d}</span>}
        </button>
      ))}
    </div>
  </div>
);
