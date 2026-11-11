import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MODULES, matchModule, normalize, calcTypeLabel } from '../modules';

// Palette de commandes (Ctrl/⌘ + K) : accès instantané aux modules,
// aux projets sauvegardés et aux actions courantes, au clavier.
const CommandPalette = ({ open, onClose, onNavigate, history, actions }) => {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (open) { setQuery(''); setCursor(0); setTimeout(() => inputRef.current?.focus(), 10); }
  }, [open]);

  const items = useMemo(() => {
    const out = [];
    MODULES.filter(m => matchModule(m, query)).forEach(m =>
      out.push({ key: `m-${m.id}`, section: 'Modules', icon: m.icon, label: m.title, hint: m.desc, run: () => onNavigate(m.id) }));
    actions.filter(a => !query || normalize(a.label).includes(normalize(query))).forEach(a =>
      out.push({ key: `a-${a.id}`, section: 'Actions', icon: a.icon, label: a.label, hint: a.hint, run: a.run }));
    if (query.trim()) {
      const n = normalize(query);
      const seen = new Set();
      history.forEach(h => {
        const name = h.project_name || 'Sans nom';
        if (seen.has(name)) return;
        if (normalize(`${name} ${h.client_name || ''}`).includes(n)) {
          seen.add(name);
          out.push({ key: `p-${name}`, section: 'Projets', icon: '📁', label: name, hint: `${h.client_name ? h.client_name + ' · ' : ''}${calcTypeLabel(h.calculation_type)}`, run: () => onNavigate('history', { project: name }) });
        }
      });
    }
    return out.slice(0, 40);
  }, [query, history, actions, onNavigate]);

  useEffect(() => { setCursor(0); }, [query]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${cursor}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  if (!open) return null;

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); const it = items[cursor]; if (it) { it.run(); onClose(); } }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  };

  let lastSection = null;
  return (
    <div className="cmdk-overlay" onMouseDown={onClose}>
      <div className="cmdk" onMouseDown={e => e.stopPropagation()} role="dialog" aria-label="Recherche rapide">
        <div className="cmdk-input-row">
          <span className="cmdk-search-icon">🔎</span>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={onKey}
            placeholder="Rechercher un module, un projet, une action…" className="cmdk-input" />
          <kbd className="kbd">Échap</kbd>
        </div>
        <div className="cmdk-list" ref={listRef}>
          {items.length === 0 && <div className="cmdk-empty">Aucun résultat pour « {query} »</div>}
          {items.map((it, i) => {
            const header = it.section !== lastSection ? (lastSection = it.section) : null;
            return (
              <React.Fragment key={it.key}>
                {header && <div className="cmdk-section">{header}</div>}
                <button data-idx={i} className={`cmdk-item ${i === cursor ? 'active' : ''}`}
                  onMouseEnter={() => setCursor(i)} onClick={() => { it.run(); onClose(); }}>
                  <span className="cmdk-item-icon">{it.icon}</span>
                  <span className="cmdk-item-text">
                    <span className="cmdk-item-label">{it.label}</span>
                    {it.hint && <span className="cmdk-item-hint">{it.hint}</span>}
                  </span>
                  {i === cursor && <kbd className="kbd">↵</kbd>}
                </button>
              </React.Fragment>
            );
          })}
        </div>
        <div className="cmdk-footer">
          <span><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd> naviguer</span>
          <span><kbd className="kbd">↵</kbd> ouvrir</span>
          <span><kbd className="kbd">Ctrl</kbd>+<kbd className="kbd">K</kbd> ouvrir/fermer</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
