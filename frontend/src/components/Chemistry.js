import React, { useMemo, useState } from 'react';
import { ModuleHeader, ProCard, SectionHead, SubTabNav } from './ui';
import { CHEM_DB } from './chemicalData';
import { normalize } from '../modules';

// ════════════════════════════════════════════════════════════════
// COMPATIBILITÉ CHIMIQUE — trois vues : par fluide, matrice, par matériau
// ════════════════════════════════════════════════════════════════
const LEVELS = {
  excellent:    { label: 'Excellent', short: 'A', icon: '✅', color: '#16a34a', bg: '#dcfce7', desc: 'Usage long terme' },
  good:         { label: 'Bon', short: 'B', icon: '👍', color: '#2563eb', bg: '#dbeafe', desc: 'Surveillance recommandée' },
  poor:         { label: 'Médiocre', short: 'C', icon: '⚠️', color: '#d97706', bg: '#fef3c7', desc: 'Usage limité' },
  incompatible: { label: 'Incompatible', short: 'D', icon: '⛔', color: '#dc2626', bg: '#fee2e2', desc: 'À proscrire' },
};
const LEVEL_KEYS = Object.keys(LEVELS);
const FLUIDS = Object.entries(CHEM_DB).map(([id, f]) => ({ id, ...f }));

// Index matériau → { fluide → niveau }
const MATERIAL_INDEX = (() => {
  const idx = {};
  FLUIDS.forEach(f => LEVEL_KEYS.forEach(lv => (f.compatibility?.[lv]?.materials || []).forEach(m => {
    (idx[m] = idx[m] || {})[f.id] = lv;
  })));
  return idx;
})();
const ALL_MATERIALS = Object.keys(MATERIAL_INDEX).sort((a, b) => Object.keys(MATERIAL_INDEX[b]).length - Object.keys(MATERIAL_INDEX[a]).length || a.localeCompare(b, 'fr'));

const corrosionTone = (c = '') => {
  const n = normalize(c);
  if (n.includes('tres') || n.includes('extreme')) return 'bad';
  if (n.includes('elev') || n.includes('moder')) return 'warn';
  return 'ok';
};

const Cell = ({ lv }) => {
  if (!lv) return <span className="chem-cell empty" title="Non renseigné">·</span>;
  const L = LEVELS[lv];
  return <span className="chem-cell" style={{ background: L.bg, color: L.color }} title={L.label}>{L.short}</span>;
};

const FluidView = ({ fluidId, setFluidId }) => {
  const f = CHEM_DB[fluidId];
  const props = [
    ['pH', f.ph_range], ['Corrosivité', f.corrosiveness, corrosionTone(f.corrosiveness)], ['Températures', f.temperature_limits],
    f.salinity && ['Salinité', f.salinity], f.toxicity && ['Toxicité', f.toxicity], f.volatility && ['Volatilité', f.volatility],
    f.saponification && ['Saponification', f.saponification],
  ].filter(Boolean);
  return (
    <div className="stack">
      <div className="chem-fluids">
        {FLUIDS.map(x => (
          <button key={x.id} className={`chem-fluid ${x.id === fluidId ? 'on' : ''}`} onClick={() => setFluidId(x.id)}>
            <span>{x.icon}</span>{x.name}
          </button>
        ))}
      </div>
      <ProCard>
        <div className="chem-fluid-head">
          <span className="chem-fluid-icon">{f.icon}</span>
          <div>
            <h2 className="fx-title" style={{ margin: 0 }}>{f.name}</h2>
            <div className="chem-props">
              {props.map(([k, val, tone]) => <span key={k} className={`chem-prop ${tone || ''}`}><b>{k}</b> {val}</span>)}
            </div>
          </div>
        </div>
      </ProCard>
      <div className="chem-levels">
        {LEVEL_KEYS.map(lv => {
          const L = LEVELS[lv]; const c = f.compatibility?.[lv];
          return (
            <div key={lv} className="chem-level" style={{ '--lv': L.color, '--lvbg': L.bg }}>
              <div className="chem-level-head"><span>{L.icon} {L.label}</span><small>{L.desc}</small></div>
              <div className="chem-mats">
                {(c?.materials || []).map(m => <span key={m} className="chem-mat">{m}</span>)}
                {!c?.materials?.length && <span className="chem-none">—</span>}
              </div>
              {c?.reasons?.length > 0 && <ul className="chem-reasons">{c.reasons.map(r => <li key={r}>{r}</li>)}</ul>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MatrixView = ({ onPickFluid, onPickMaterial }) => {
  const [q, setQ] = useState('');
  const [minCount, setMinCount] = useState(3);
  const rows = ALL_MATERIALS.filter(m => Object.keys(MATERIAL_INDEX[m]).length >= minCount && (!q || normalize(m).includes(normalize(q))));
  return (
    <ProCard>
      <SectionHead icon="🧮" title="Matrice de compatibilité" color="#9333ea" sub="Matériaux en lignes, fluides en colonnes — cliquez un en-tête pour le détail" />
      <div className="hv-toolbar">
        <div className="dash-filter" style={{ flex: 1, minWidth: 200 }}>
          <span>🔎</span><input value={q} onChange={e => setQ(e.target.value)} placeholder="Filtrer les matériaux…" aria-label="Filtrer les matériaux" />
        </div>
        <div className="hv-chips">
          {[[3, 'Matériaux courants'], [1, 'Tous les matériaux']].map(([n, l]) => (
            <button key={n} className={`uc-chip ${minCount === n ? 'active' : ''}`} onClick={() => setMinCount(n)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="chem-matrix-wrap">
        <table className="chem-matrix">
          <thead>
            <tr>
              <th className="sticky-col">Matériau</th>
              {FLUIDS.map(f => (
                <th key={f.id} title={f.name}><button onClick={() => onPickFluid(f.id)}><span>{f.icon}</span><span className="vert">{f.name}</span></button></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(m => (
              <tr key={m}>
                <th className="sticky-col"><button onClick={() => onPickMaterial(m)}>{m}</button></th>
                {FLUIDS.map(f => <td key={f.id}><Cell lv={MATERIAL_INDEX[m][f.id]} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="chem-legend">
        {LEVEL_KEYS.map(lv => <span key={lv}><Cell lv={lv} /> {LEVELS[lv].label}</span>)}
        <span><Cell /> Non renseigné</span>
      </div>
    </ProCard>
  );
};

const MaterialView = ({ material, setMaterial }) => {
  const [q, setQ] = useState('');
  const matches = ALL_MATERIALS.filter(m => !q || normalize(m).includes(normalize(q))).slice(0, 40);
  const data = MATERIAL_INDEX[material] || {};
  const grouped = LEVEL_KEYS.map(lv => ({ lv, fluids: FLUIDS.filter(f => data[f.id] === lv) }));
  const unknown = FLUIDS.filter(f => !data[f.id]);
  return (
    <div className="fx-layout">
      <ProCard style={{ padding: 8 }}>
        <div className="dash-filter" style={{ margin: 6 }}>
          <span>🔎</span><input value={q} onChange={e => setQ(e.target.value)} placeholder="Chercher un matériau…" aria-label="Chercher un matériau" />
        </div>
        <div className="fx-list">
          {matches.map(m => (
            <button key={m} className={`fx-item ${m === material ? 'on' : ''}`} style={{ '--fx': '#9333ea' }} onClick={() => setMaterial(m)}>
              <span className="fx-item-text"><span className="fx-item-name">{m}</span>
                <span className="fx-item-expr">{Object.keys(MATERIAL_INDEX[m]).length} fluide(s) documenté(s)</span></span>
            </button>
          ))}
        </div>
      </ProCard>
      <ProCard>
        <SectionHead icon="🧱" title={material} color="#9333ea" sub="Tenue du matériau selon le fluide pompé" />
        <div className="chem-levels">
          {grouped.map(({ lv, fluids }) => (
            <div key={lv} className="chem-level" style={{ '--lv': LEVELS[lv].color, '--lvbg': LEVELS[lv].bg }}>
              <div className="chem-level-head"><span>{LEVELS[lv].icon} {LEVELS[lv].label}</span><small>{fluids.length}</small></div>
              <div className="chem-mats">
                {fluids.map(f => <span key={f.id} className="chem-mat">{f.icon} {f.name}</span>)}
                {fluids.length === 0 && <span className="chem-none">—</span>}
              </div>
            </div>
          ))}
        </div>
        {unknown.length > 0 && <p className="dash-empty" style={{ marginTop: 10 }}>Non renseigné pour : {unknown.map(f => f.name).join(', ')}.</p>}
      </ProCard>
    </div>
  );
};

const ChemicalCompatibility = () => {
  const [view, setView] = useState('fluid');
  const [fluidId, setFluidId] = useState('water');
  const [material, setMaterial] = useState('316L Stainless Steel');
  const stats = useMemo(() => ({ fluids: FLUIDS.length, materials: ALL_MATERIALS.length }), []);

  return (
    <div className="fade-in stack" style={{ gap: 18 }}>
      <ModuleHeader icon="🧪" kicker="Matériaux" title="Compatibilité chimique" color="#c026d3"
        desc={`${stats.fluids} fluides × ${stats.materials} matériaux : choisissez les matériaux de pompe, de tuyauterie et de joints adaptés au fluide pompé.`}
        tags={['ASTM', 'ISO 23936', 'Guides fabricants']} />
      <SubTabNav active={view} onChange={setView} tabs={[
        { id: 'fluid', label: '💧 Par fluide', color: 'blue' },
        { id: 'matrix', label: '🧮 Matrice', color: 'purple' },
        { id: 'material', label: '🧱 Par matériau', color: 'teal' },
      ]} />
      {view === 'fluid' && <FluidView fluidId={fluidId} setFluidId={setFluidId} />}
      {view === 'matrix' && <MatrixView onPickFluid={id => { setFluidId(id); setView('fluid'); }} onPickMaterial={m => { setMaterial(m); setView('material'); }} />}
      {view === 'material' && <MaterialView material={material} setMaterial={setMaterial} />}
      <p style={{ fontSize: '.72rem', color: '#94a3b8' }}>
        Données indicatives à température ambiante. La tenue réelle dépend de la concentration, de la température et de la durée d'exposition : validez avec le fabricant.
      </p>
    </div>
  );
};

export default ChemicalCompatibility;
