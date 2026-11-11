import React, { useEffect, useMemo, useState } from 'react';
import { CALC_TYPE_LABELS, calcTypeLabel, normalize } from '../modules';

// ════════════════════════════════════════════════════════════════
// COMPARATEUR — champs clés à afficher côte à côte, par type de calcul
// ════════════════════════════════════════════════════════════════
export const COMPARISON_FIELDS = {
  npshd: {
    inputs: [
      ['flow_rate', 'Débit', 'm³/h'], ['hasp', 'Hauteur asp.', 'm'],
      ['pipe_diameter', 'Diamètre', 'mm'], ['pipe_length', 'Longueur', 'm'],
      ['pipe_material', 'Matériau', ''], ['fluid_type', 'Fluide', ''],
      ['temperature', 'Température', '°C'], ['npsh_required', 'NPSH requis', 'm'],
    ],
    results: [
      ['npshd', 'NPSHd calculé', 'm'], ['npsh_margin', 'Marge sécurité', 'm'],
      ['velocity', 'Vitesse', 'm/s'], ['reynolds_number', 'Reynolds', ''],
      ['cavitation_risk', 'Risque cavitation', ''],
    ],
  },
  hmt: {
    inputs: [
      ['flow_rate', 'Débit', 'm³/h'], ['hasp', 'Hasp', 'm'], ['discharge_height', 'H. refoulement', 'm'],
      ['useful_pressure', 'P. utile', 'bar'], ['suction_pipe_diameter', 'Ø aspiration', 'mm'],
      ['discharge_pipe_diameter', 'Ø refoulement', 'mm'], ['fluid_type', 'Fluide', ''],
    ],
    results: [
      ['total_hmt', 'HMT totale', 'm'], ['absorbed_power', 'Puissance absorbée', 'kW'],
      ['velocity_suction', 'Vitesse asp.', 'm/s'], ['velocity_discharge', 'Vitesse ref.', 'm/s'],
    ],
  },
  performance: {
    inputs: [
      ['flow_rate', 'Débit', 'm³/h'], ['hmt', 'HMT', 'm'], ['pipe_diameter', 'Diamètre', 'mm'],
      ['pump_efficiency', 'η pompe', '%'], ['motor_efficiency', 'η moteur', '%'], ['voltage', 'Tension', 'V'],
    ],
    results: [
      ['overall_efficiency', 'Rendement global', '%'], ['nominal_current', 'Courant nominal', 'A'],
      ['hydraulic_power', 'Puissance hydraulique', 'kW'], ['absorbed_power', 'Puissance absorbée', 'kW'],
      ['cable_section', 'Section câble', 'mm²'], ['voltage_drop_percent', 'Chute tension', '%'],
    ],
  },
  expert: {
    inputs: [
      ['flow_rate', 'Débit', 'm³/h'], ['fluid_type', 'Fluide', ''],
      ['pump_efficiency', 'η pompe', '%'], ['motor_efficiency', 'η moteur', '%'],
    ],
    results: [
      ['overall_efficiency', 'Rendement global', '%'], ['annual_energy_cost', 'Coût énergétique/an', 'FCFA'],
    ],
  },
};

export const fmtCompVal = (v, unit) => {
  if (v === undefined || v === null || v === '') return '—';
  if (typeof v === 'boolean') return v ? 'Oui ⚠️' : 'Non ✓';
  if (typeof v === 'number') return `${Number.isInteger(v) ? v : v.toFixed(2)}${unit ? ' ' + unit : ''}`;
  return `${v}${unit ? ' ' + unit : ''}`;
};

const makeResolver = (fluids, pipeMaterials) => (item, key) => {
  let v = item.input_data?.[key] ?? item.result_data?.[key];
  if (key === 'fluid_type' && v) return fluids.find(f => f.id === v)?.name || v;
  if ((key === 'pipe_material' || key.endsWith('_pipe_material')) && v) return pipeMaterials.find(m => m.id === v)?.name || v;
  return v;
};

// Tableau de comparaison de 2-3 calculs sauvegardés du même type
export const ComparisonTable = ({ items, fluids, pipeMaterials, onClose }) => {
  const type = items[0]?.calculation_type;
  const fields = COMPARISON_FIELDS[type] || { inputs: [], results: [] };
  const resolveValue = makeResolver(fluids, pipeMaterials);

  const Row = ({ label, unit, dataKey }) => {
    const values = items.map(it => resolveValue(it, dataKey));
    const allSame = values.every(v => String(v) === String(values[0]));
    return (
      <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
        <td style={{ padding: '9px 12px', fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 500 }}>{label}</td>
        {values.map((v, i) => (
          <td key={i} style={{
            padding: '9px 12px', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center',
            color: allSame ? 'var(--navy-900)' : '#b45309', background: allSame ? 'transparent' : '#fffbeb',
          }}>{fmtCompVal(v, unit)}</td>
        ))}
      </tr>
    );
  };

  return (
    <div className="card fade-in" style={{ marginBottom: '16px' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="card-title">⚖️ Comparaison — {calcTypeLabel(type)}</div>
        <button onClick={onClose} className="hv-btn">✕ Fermer</button>
      </div>
      <div className="card-body" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '480px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--slate-200)' }}>
              <th style={{ padding: '9px 12px', textAlign: 'left', fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase' }}>Paramètre</th>
              {items.map((it, i) => (
                <th key={i} style={{ padding: '9px 12px', textAlign: 'center', fontSize: '0.82rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  {it.project_name}
                  <div style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--slate-400)', marginTop: '2px' }}>{new Date(it.timestamp).toLocaleDateString('fr-FR')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={items.length + 1} className="hv-table-section">📝 Configuration</td></tr>
            {fields.inputs.map(([key, label, unit]) => <Row key={key} dataKey={key} label={label} unit={unit} />)}
            <tr><td colSpan={items.length + 1} className="hv-table-section">📊 Résultats</td></tr>
            {fields.results.map(([key, label, unit]) => <Row key={key} dataKey={key} label={label} unit={unit} />)}
          </tbody>
        </table>
        <p style={{ fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: '10px' }}>Les valeurs surlignées en orange diffèrent entre les calculs comparés.</p>
      </div>
    </div>
  );
};

// ── Aplatit un objet imbriqué en paires clé/valeur lisibles (pour détail & CSV)
const flatten = (obj, prefix = '', out = {}) => {
  if (obj === null || obj === undefined) return out;
  Object.entries(obj).forEach(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else if (Array.isArray(v)) out[key] = v.length > 6 || v.some(x => typeof x === 'object') ? `[${v.length} éléments]` : v.join(', ');
    else out[key] = v;
  });
  return out;
};

const prettyKey = (k) => k.split('.').pop().replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());

const download = (filename, content, mime) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const csvCell = (v) => {
  const s = v === undefined || v === null ? '' : String(v);
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// ── Panneau de détail d'un calcul ──
const DetailDrawer = ({ item, onClose, resolve, onDelete }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const fields = COMPARISON_FIELDS[item.calculation_type];
  const [showAll, setShowAll] = useState(!fields);
  const flatIn = flatten(item.input_data);
  const flatOut = flatten(item.result_data);

  const Section = ({ title, keyed, flat }) => (
    <div className="hv-detail-section">
      <div className="hv-detail-title">{title}</div>
      <dl className="hv-dl">
        {keyed
          ? keyed.map(([k, label, unit]) => (
            <React.Fragment key={k}><dt>{label}</dt><dd>{fmtCompVal(resolve(item, k), unit)}</dd></React.Fragment>))
          : Object.entries(flat).map(([k, v]) => (
            <React.Fragment key={k}><dt title={k}>{prettyKey(k)}</dt><dd>{fmtCompVal(v, '')}</dd></React.Fragment>))}
      </dl>
      {Object.keys(flat).length === 0 && !keyed && <p className="dash-empty">Aucune donnée.</p>}
    </div>
  );

  return (
    <div className="drawer-overlay" onMouseDown={onClose}>
      <aside className="drawer" onMouseDown={e => e.stopPropagation()} role="dialog" aria-label="Détail du calcul">
        <div className="drawer-head">
          <div>
            <span className="hv-type" style={{ '--c': CALC_TYPE_LABELS[item.calculation_type]?.color || '#0f766e' }}>{calcTypeLabel(item.calculation_type)}</span>
            <h3 className="drawer-title">{item.project_name}</h3>
            <div className="drawer-sub">{item.client_name ? `👤 ${item.client_name} · ` : ''}{new Date(item.timestamp).toLocaleString('fr-FR')}</div>
          </div>
          <button className="hv-icon-btn" onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        <div className="drawer-body">
          {fields && (
            <label className="hv-toggle">
              <input type="checkbox" checked={showAll} onChange={e => setShowAll(e.target.checked)} /> Afficher toutes les données brutes
            </label>
          )}
          <Section title="📝 Données d'entrée" keyed={showAll ? null : fields?.inputs} flat={flatIn} />
          <Section title="📊 Résultats" keyed={showAll ? null : fields?.results} flat={flatOut} />
        </div>
        <div className="drawer-foot">
          <button className="hv-btn" onClick={() => download(`${item.project_name}-${item.calculation_type}.json`, JSON.stringify(item, null, 2), 'application/json')}>⬇️ JSON</button>
          <button className="hv-btn danger" onClick={() => onDelete(item.id)}>🗑️ Supprimer</button>
        </div>
      </aside>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// VUE HISTORIQUE — recherche, filtres, tri, détail, export, comparaison
// ════════════════════════════════════════════════════════════════
const HistoryView = ({ history, fluids, pipeMaterials, onDelete, onRefresh, initialProject, initialOpen }) => {
  const [query, setQuery] = useState(initialProject || '');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [collapsed, setCollapsed] = useState([]);
  const [compareSelection, setCompareSelection] = useState([]);
  const [showComparator, setShowComparator] = useState(false);
  const [openId, setOpenId] = useState(initialOpen || null);

  useEffect(() => { if (initialProject !== undefined) setQuery(initialProject || ''); }, [initialProject]);
  useEffect(() => { if (initialOpen) setOpenId(initialOpen); }, [initialOpen]);

  const resolve = useMemo(() => makeResolver(fluids, pipeMaterials), [fluids, pipeMaterials]);
  const typesAvailable = useMemo(() => [...new Set(history.map(h => h.calculation_type))], [history]);

  const filtered = useMemo(() => {
    const n = normalize(query).trim();
    return history.filter(h => {
      if (typeFilter !== 'all' && h.calculation_type !== typeFilter) return false;
      if (!n) return true;
      return normalize(`${h.project_name} ${h.client_name || ''} ${h.calculation_type}`).includes(n);
    });
  }, [history, query, typeFilter]);

  const groups = useMemo(() => {
    const g = {};
    filtered.forEach(item => { const k = item.project_name || 'Sans nom'; (g[k] = g[k] || []).push(item); });
    Object.values(g).forEach(list => list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    const names = Object.keys(g);
    const latest = (k) => Math.max(...g[k].map(i => new Date(i.timestamp).getTime()));
    if (sort === 'recent') names.sort((a, b) => latest(b) - latest(a));
    else if (sort === 'oldest') names.sort((a, b) => latest(a) - latest(b));
    else if (sort === 'name') names.sort((a, b) => a.localeCompare(b, 'fr'));
    else if (sort === 'count') names.sort((a, b) => g[b].length - g[a].length);
    return { g, names };
  }, [filtered, sort]);

  const selectedType = compareSelection.length > 0 ? history.find(h => h.id === compareSelection[0])?.calculation_type : null;
  const toggleSelect = (item) => setCompareSelection(sel => {
    if (sel.includes(item.id)) return sel.filter(id => id !== item.id);
    if (sel.length > 0 && item.calculation_type !== selectedType) return sel;
    if (sel.length >= 3) return sel;
    return [...sel, item.id];
  });
  const selectedItems = history.filter(h => compareSelection.includes(h.id));
  const openItem = history.find(h => h.id === openId);

  const exportCSV = () => {
    const rows = filtered.map(h => ({
      projet: h.project_name, client: h.client_name || '', type: h.calculation_type,
      date: new Date(h.timestamp).toLocaleString('fr-FR'),
      ...Object.fromEntries(Object.entries(flatten(h.input_data)).map(([k, v]) => [`entree.${k}`, v])),
      ...Object.fromEntries(Object.entries(flatten(h.result_data)).map(([k, v]) => [`resultat.${k}`, v])),
    }));
    const cols = [...new Set(rows.flatMap(r => Object.keys(r)))];
    const csv = '﻿' + [cols.join(';'), ...rows.map(r => cols.map(c => csvCell(r[c])).join(';'))].join('\n');
    download(`historique-eco-pump-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv;charset=utf-8');
  };
  const exportJSON = () => download(`historique-eco-pump-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(filtered, null, 2), 'application/json');

  const handleDelete = async (id) => {
    const ok = await onDelete(id);
    if (ok) {
      setCompareSelection(s => s.filter(x => x !== id));
      if (openId === id) setOpenId(null);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-intro">
        <div>
          <h1 className="page-h1">📋 Historique & Projets</h1>
          <p className="page-lead">{history.length} calcul{history.length > 1 ? 's' : ''} sauvegardé{history.length > 1 ? 's' : ''} · {new Set(history.map(h => h.project_name)).size} projet(s)</p>
        </div>
        <div className="hv-actions">
          <button className="hv-btn" onClick={onRefresh} title="Actualiser">↻ Actualiser</button>
          <button className="hv-btn" onClick={exportCSV} disabled={!filtered.length}>⬇️ Export CSV</button>
          <button className="hv-btn" onClick={exportJSON} disabled={!filtered.length}>⬇️ JSON</button>
        </div>
      </div>

      <div className="hv-toolbar">
        <div className="dash-filter" style={{ flex: 1, minWidth: 200 }}>
          <span>🔎</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher un projet ou un client…" aria-label="Rechercher" />
          {query && <button className="hv-clear" onClick={() => setQuery('')} aria-label="Effacer">✕</button>}
        </div>
        <div className="hv-chips">
          <button className={`uc-chip ${typeFilter === 'all' ? 'active' : ''}`} onClick={() => setTypeFilter('all')}>Tous</button>
          {typesAvailable.map(t => (
            <button key={t} className={`uc-chip ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>{calcTypeLabel(t)}</button>
          ))}
        </div>
        <select className="uc-select" value={sort} onChange={e => setSort(e.target.value)} aria-label="Trier">
          <option value="recent">Plus récents</option>
          <option value="oldest">Plus anciens</option>
          <option value="name">Nom (A→Z)</option>
          <option value="count">Nb de calculs</option>
        </select>
      </div>

      {showComparator && selectedItems.length >= 2 && (
        <ComparisonTable items={selectedItems} fluids={fluids} pipeMaterials={pipeMaterials} onClose={() => setShowComparator(false)} />
      )}

      {compareSelection.length > 0 && (
        <div className="hv-compare-bar">
          <span>{compareSelection.length} sélectionné(s) — {calcTypeLabel(selectedType)} (max. 3, même type)</span>
          <button className="hv-btn" onClick={() => { setCompareSelection([]); setShowComparator(false); }}>Annuler</button>
          <button className="hv-btn primary" onClick={() => setShowComparator(true)} disabled={compareSelection.length < 2}>⚖️ Comparer ({compareSelection.length})</button>
        </div>
      )}

      {history.length === 0 ? (
        <div className="hv-empty">
          <div style={{ fontSize: '2.6rem' }}>📭</div>
          <div className="hv-empty-title">Aucun calcul sauvegardé</div>
          <div>Utilisez le bouton « 💾 Sauvegarder ce calcul » après un calcul NPSHd, HMT, Performance ou Expert.</div>
        </div>
      ) : groups.names.length === 0 ? (
        <div className="hv-empty"><div className="hv-empty-title">Aucun résultat</div><div>Modifiez la recherche ou les filtres.</div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {groups.names.map(name => {
            const items = groups.g[name];
            const client = items.find(i => i.client_name)?.client_name;
            const isCollapsed = collapsed.includes(name);
            const types = [...new Set(items.map(i => i.calculation_type))];
            return (
              <div key={name} className="card hv-project">
                <button className="hv-project-head" onClick={() => setCollapsed(s => s.includes(name) ? s.filter(n => n !== name) : [...s, name])} aria-expanded={!isCollapsed}>
                  <span className="hv-caret" style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'none' }}>▾</span>
                  <span className="hv-project-name">
                    📁 {name}
                    {client && <span className="hv-project-client">👤 {client}</span>}
                  </span>
                  <span className="hv-project-tags">
                    {types.map(t => <span key={t} className="hv-type" style={{ '--c': CALC_TYPE_LABELS[t]?.color || '#0f766e' }}>{calcTypeLabel(t)}</span>)}
                    <span className="hv-count">{items.length}</span>
                  </span>
                </button>
                {!isCollapsed && (
                  <div className="hv-rows">
                    {items.map(item => {
                      const checked = compareSelection.includes(item.id);
                      const disabled = compareSelection.length > 0 && !checked && (item.calculation_type !== selectedType || compareSelection.length >= 3);
                      const keyResult = COMPARISON_FIELDS[item.calculation_type]?.results?.[0];
                      return (
                        <div key={item.id} className={`hv-row ${checked ? 'checked' : ''}`}>
                          <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggleSelect(item)}
                            title={disabled ? 'Type différent ou limite de 3 atteinte' : 'Sélectionner pour comparer'} />
                          <button className="hv-row-main" onClick={() => setOpenId(item.id)}>
                            <span className="hv-type" style={{ '--c': CALC_TYPE_LABELS[item.calculation_type]?.color || '#0f766e' }}>{calcTypeLabel(item.calculation_type)}</span>
                            <span className="hv-row-date">{new Date(item.timestamp).toLocaleString('fr-FR')}</span>
                            {keyResult && <span className="hv-row-kpi">{keyResult[1]} : <b>{fmtCompVal(resolve(item, keyResult[0]), keyResult[2])}</b></span>}
                            <span className="hv-row-open">Détails →</span>
                          </button>
                          <button className="hv-icon-btn danger" onClick={() => handleDelete(item.id)} title="Supprimer" aria-label="Supprimer">🗑️</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {openItem && <DetailDrawer item={openItem} resolve={resolve} onClose={() => setOpenId(null)} onDelete={handleDelete} />}
    </div>
  );
};

export default HistoryView;
