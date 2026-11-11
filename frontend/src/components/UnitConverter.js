import React, { useMemo, useState } from 'react';
import { readJSON, writeJSON } from '../lib/storage';
import notify from '../lib/notify';

// ════════════════════════════════════════════════════════════════
// CONVERTISSEUR D'UNITÉS — unités usuelles du pompage
// Chaque unité est définie par son facteur vers l'unité de base (SI).
// La température est traitée à part (conversion affine).
// ════════════════════════════════════════════════════════════════
const G = 9.80665;

const CATEGORIES = {
  flow: {
    label: 'Débit', icon: '💧', base: 'm³/s',
    units: {
      'm³/h': 1 / 3600, 'm³/s': 1, 'L/s': 1e-3, 'L/min': 1e-3 / 60, 'L/h': 1e-3 / 3600,
      'm³/j': 1 / 86400, 'GPM (US)': 3.785411784e-3 / 60, 'GPM (UK)': 4.54609e-3 / 60, 'ft³/s': 0.028316846592,
    },
    defaults: ['m³/h', 'L/s'],
  },
  pressure: {
    label: 'Pression / Hauteur', icon: '🧭', base: 'Pa', usesDensity: true,
    units: {
      'bar': 1e5, 'mbar': 100, 'kPa': 1e3, 'MPa': 1e6, 'Pa': 1, 'psi': 6894.757293168, 'atm': 101325,
      'kgf/cm²': 98066.5, 'mmHg': 133.322387415,
      // Hauteur de colonne de fluide : dépend de la masse volumique (ρ·g·h)
      'm CE (colonne)': 'head_m', 'ft (colonne)': 'head_ft',
    },
    defaults: ['bar', 'm CE (colonne)'],
  },
  power: {
    label: 'Puissance', icon: '⚡', base: 'W',
    units: { 'kW': 1e3, 'W': 1, 'MW': 1e6, 'HP (mécanique)': 745.69987158, 'CV (ch)': 735.49875, 'BTU/h': 0.29307107, 'kcal/h': 1.163 },
    defaults: ['kW', 'CV (ch)'],
  },
  length: {
    label: 'Longueur', icon: '📏', base: 'm',
    units: { 'm': 1, 'mm': 1e-3, 'cm': 1e-2, 'km': 1e3, 'pouce (in)': 0.0254, 'pied (ft)': 0.3048, 'yard': 0.9144, 'mile': 1609.344 },
    defaults: ['mm', 'pouce (in)'],
  },
  velocity: {
    label: 'Vitesse', icon: '🏃', base: 'm/s',
    units: { 'm/s': 1, 'km/h': 1 / 3.6, 'ft/s': 0.3048, 'cm/s': 0.01 },
    defaults: ['m/s', 'ft/s'],
  },
  volume: {
    label: 'Volume', icon: '🛢️', base: 'm³',
    units: { 'm³': 1, 'L': 1e-3, 'hL': 0.1, 'gallon (US)': 3.785411784e-3, 'gallon (UK)': 4.54609e-3, 'ft³': 0.028316846592, 'baril (pétrole)': 0.158987294928 },
    defaults: ['m³', 'L'],
  },
  energy: {
    label: 'Énergie', icon: '🔋', base: 'J',
    units: { 'kWh': 3.6e6, 'Wh': 3600, 'MWh': 3.6e9, 'J': 1, 'kJ': 1e3, 'MJ': 1e6, 'kcal': 4184, 'BTU': 1055.05585 },
    defaults: ['kWh', 'MJ'],
  },
  viscosity: {
    label: 'Viscosité cinématique', icon: '🫗', base: 'm²/s',
    units: { 'm²/s': 1, 'cSt (mm²/s)': 1e-6, 'St': 1e-4, 'ft²/s': 0.09290304 },
    defaults: ['cSt (mm²/s)', 'm²/s'],
  },
  temperature: {
    label: 'Température', icon: '🌡️', base: 'K', affine: true,
    units: { '°C': null, '°F': null, 'K': null },
    defaults: ['°C', '°F'],
  },
};

const toKelvin = (v, u) => u === '°C' ? v + 273.15 : u === '°F' ? (v - 32) * 5 / 9 + 273.15 : v;
const fromKelvin = (k, u) => u === '°C' ? k - 273.15 : u === '°F' ? (k - 273.15) * 9 / 5 + 32 : k;

const unitFactor = (cat, u, rho) => {
  const f = CATEGORIES[cat].units[u];
  if (f === 'head_m') return rho * G;
  if (f === 'head_ft') return rho * G * 0.3048;
  return f;
};

export const convert = (cat, value, from, to, rho = 1000) => {
  if (!isFinite(value)) return NaN;
  if (CATEGORIES[cat].affine) return fromKelvin(toKelvin(value, from), to);
  return value * unitFactor(cat, from, rho) / unitFactor(cat, to, rho);
};

export const fmt = (v) => {
  if (!isFinite(v)) return '—';
  if (v === 0) return '0';
  const a = Math.abs(v);
  if (a >= 1e9 || a < 1e-4) return v.toExponential(4);
  const decimals = a >= 1000 ? 2 : a >= 1 ? 4 : 6;
  return Number(v.toFixed(decimals)).toLocaleString('fr-FR', { maximumFractionDigits: decimals });
};

// Diamètres nominaux usuels pour l'outil "vitesse dans la conduite"
const DN_LIST = [15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150, 200, 250, 300, 350, 400, 500];

const Card = ({ children, style }) => <div className="uc-card" style={style}>{children}</div>;

const UnitConverter = () => {
  const [cat, setCat] = useState(() => readJSON('eco_uc_cat', 'flow'));
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState(CATEGORIES[cat]?.defaults[0] || 'm³/h');
  const [rho, setRho] = useState('1000');

  const changeCat = (c) => {
    setCat(c); writeJSON('eco_uc_cat', c);
    setFrom(CATEGORIES[c].defaults[0]);
  };

  const C = CATEGORIES[cat];
  const num = parseFloat(String(value).replace(',', '.'));
  const rhoNum = parseFloat(String(rho).replace(',', '.')) || 1000;

  const results = useMemo(() => Object.keys(C.units).map(u => ({ unit: u, v: convert(cat, num, from, u, rhoNum) })), [C, cat, num, from, rhoNum]);

  const copy = (txt) => {
    navigator.clipboard?.writeText(txt).then(() => notify.success(`Copié : ${txt}`), () => notify.error('Copie impossible'));
  };

  return (
    <div className="fade-in">
      <div className="page-intro">
        <div>
          <h1 className="page-h1">🔁 Convertisseur d'unités</h1>
          <p className="page-lead">Toutes les conversions courantes du pompage, instantanément. Cliquez sur un résultat pour le copier.</p>
        </div>
      </div>

      <div className="uc-tabs" role="tablist">
        {Object.entries(CATEGORIES).map(([id, c]) => (
          <button key={id} role="tab" aria-selected={cat === id} className={`uc-tab ${cat === id ? 'active' : ''}`} onClick={() => changeCat(id)}>
            <span>{c.icon}</span> {c.label}
          </button>
        ))}
      </div>

      <div className="uc-layout">
        <Card>
          <div className="uc-label">Valeur à convertir</div>
          <div className="uc-input-row">
            <input className="uc-input" inputMode="decimal" value={value} onChange={e => setValue(e.target.value)} aria-label="Valeur" />
            <select className="uc-select" value={from} onChange={e => setFrom(e.target.value)} aria-label="Unité d'origine">
              {Object.keys(C.units).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          {C.usesDensity && (
            <div style={{ marginTop: 14 }}>
              <div className="uc-label">Masse volumique du fluide (kg/m³) — pour les hauteurs de colonne</div>
              <div className="uc-chip-row">
                <input className="uc-input small" inputMode="decimal" value={rho} onChange={e => setRho(e.target.value)} />
                {[['Eau', 1000], ['Eau de mer', 1025], ['Gasoil', 840], ['Huile', 900]].map(([n, r]) => (
                  <button key={n} className={`uc-chip ${Number(rho) === r ? 'active' : ''}`} onClick={() => setRho(String(r))}>{n} · {r}</button>
                ))}
              </div>
            </div>
          )}
          {!isFinite(num) && value !== '' && <div className="uc-error">Saisissez un nombre valide.</div>}
        </Card>

        <Card>
          <div className="uc-label">Résultats</div>
          <div className="uc-results">
            {results.map(r => (
              <button key={r.unit} className={`uc-result ${r.unit === from ? 'is-source' : ''}`} onClick={() => copy(`${fmt(r.v)} ${r.unit}`)} title="Copier">
                <span className="uc-result-val">{fmt(r.v)}</span>
                <span className="uc-result-unit">{r.unit}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <QuickTools />
    </div>
  );
};

// ── Outils rapides : vitesse en conduite & puissance hydraulique ──
const QuickTools = () => {
  const [q, setQ] = useState('20');
  const [dn, setDn] = useState('80');
  const [h, setH] = useState('40');
  const [eta, setEta] = useState('65');

  const Q = parseFloat(q) || 0;
  const D = (parseFloat(dn) || 0) / 1000;
  const area = Math.PI * D * D / 4;
  const v = area > 0 ? (Q / 3600) / area : NaN;
  const vStatus = !isFinite(v) ? null : v < 0.5 ? ['Faible — risque de dépôts', 'warn'] : v <= 2.0 ? ['Plage recommandée (0,5–2 m/s)', 'ok'] : v <= 3 ? ['Élevée — pertes de charge importantes', 'warn'] : ['Trop élevée — érosion / coup de bélier', 'bad'];
  const dnSuggested = DN_LIST.find(d => (Q / 3600) / (Math.PI * (d / 1000) ** 2 / 4) <= 1.5);

  const H = parseFloat(h) || 0;
  const E = (parseFloat(eta) || 0) / 100;
  const pHyd = 1000 * G * (Q / 3600) * H / 1000; // kW
  const pAbs = E > 0 ? pHyd / E : NaN;

  return (
    <div className="uc-layout" style={{ marginTop: 18 }}>
      <Card>
        <div className="uc-tool-title">🚰 Vitesse dans la conduite</div>
        <div className="uc-grid2">
          <label className="uc-field"><span>Débit (m³/h)</span><input className="uc-input small" inputMode="decimal" value={q} onChange={e => setQ(e.target.value)} /></label>
          <label className="uc-field"><span>Diamètre intérieur (mm)</span><input className="uc-input small" inputMode="decimal" value={dn} onChange={e => setDn(e.target.value)} /></label>
        </div>
        <div className="uc-big">{fmt(v)} <small>m/s</small></div>
        {vStatus && <div className={`uc-status ${vStatus[1]}`}>{vStatus[0]}</div>}
        {dnSuggested && <div className="uc-hint">DN conseillé pour ≈1,5 m/s : <b>DN {dnSuggested}</b></div>}
      </Card>
      <Card>
        <div className="uc-tool-title">⚡ Puissance hydraulique (eau)</div>
        <div className="uc-grid2">
          <label className="uc-field"><span>HMT (m)</span><input className="uc-input small" inputMode="decimal" value={h} onChange={e => setH(e.target.value)} /></label>
          <label className="uc-field"><span>Rendement pompe (%)</span><input className="uc-input small" inputMode="decimal" value={eta} onChange={e => setEta(e.target.value)} /></label>
        </div>
        <div className="uc-big-row">
          <div><div className="uc-mini-label">P hydraulique</div><div className="uc-big">{fmt(pHyd)} <small>kW</small></div></div>
          <div><div className="uc-mini-label">P absorbée</div><div className="uc-big accent">{fmt(pAbs)} <small>kW</small></div></div>
        </div>
        <div className="uc-hint">P = ρ·g·Q·H / η — débit pris dans l'outil de gauche ({fmt(Q)} m³/h)</div>
      </Card>
    </div>
  );
};

export default UnitConverter;
