import React, { useMemo, useState } from 'react';
import { ModuleHeader, ProCard, SectionHead } from './ui';
import { normalize } from '../modules';
import notify from '../lib/notify';

// ════════════════════════════════════════════════════════════════
// BASE DE FORMULES INTERACTIVE
// Chaque formule est accompagnée d'un mini-calculateur : on saisit les
// variables, le résultat se met à jour instantanément.
// ════════════════════════════════════════════════════════════════
const G = 9.80665;

const CATS = {
  npsh:     { label: 'NPSH & cavitation', icon: '🔷', color: '#2563eb' },
  losses:   { label: 'Pertes de charge', icon: '📉', color: '#dc2626' },
  hmt:      { label: 'HMT', icon: '🔶', color: '#059669' },
  power:    { label: 'Puissance & rendement', icon: '⚡', color: '#d97706' },
  flow:     { label: 'Écoulement', icon: '🌊', color: '#0891b2' },
  affinity: { label: 'Similitude', icon: '🔄', color: '#7c3aed' },
  hammer:   { label: 'Coup de bélier', icon: '💥', color: '#4f46e5' },
  solar:    { label: 'Solaire & énergie', icon: '☀️', color: '#ca8a04' },
};

const v = (key, label, unit, def, hint) => ({ key, label, unit, def, hint });

export const FORMULAS = [
  {
    id: 'npshd_flooded', cat: 'npsh', name: 'NPSH disponible — en charge',
    expr: 'NPSHd = Patm/(ρ·g) + h − Pv/(ρ·g) − ΔHasp',
    desc: 'Pompe installée sous le niveau du réservoir d\'aspiration (hauteur h positive).',
    refs: 'NF EN ISO 17769-1 · API 610',
    vars: [v('Patm', 'Pression atmosphérique', 'Pa', 101325), v('rho', 'Masse volumique ρ', 'kg/m³', 998), v('h', 'Hauteur d\'eau au-dessus de la pompe', 'm', 3), v('Pv', 'Pression de vapeur Pv', 'Pa', 2339, 'Eau à 20 °C : 2 339 Pa'), v('dH', 'Pertes à l\'aspiration ΔHasp', 'm', 0.8)],
    calc: x => [{ label: 'NPSHd', value: x.Patm / (x.rho * G) + x.h - x.Pv / (x.rho * G) - x.dH, unit: 'm' }],
  },
  {
    id: 'npshd_lift', cat: 'npsh', name: 'NPSH disponible — en dépression',
    expr: 'NPSHd = Patm/(ρ·g) − h − Pv/(ρ·g) − ΔHasp',
    desc: 'Pompe installée au-dessus du plan d\'eau : la hauteur d\'aspiration se retranche.',
    refs: 'NF EN ISO 17769-1 · Hydraulic Institute',
    vars: [v('Patm', 'Pression atmosphérique', 'Pa', 101325), v('rho', 'Masse volumique ρ', 'kg/m³', 998), v('h', 'Hauteur d\'aspiration', 'm', 4), v('Pv', 'Pression de vapeur Pv', 'Pa', 2339), v('dH', 'Pertes à l\'aspiration ΔHasp', 'm', 0.8)],
    calc: x => [{ label: 'NPSHd', value: x.Patm / (x.rho * G) - x.h - x.Pv / (x.rho * G) - x.dH, unit: 'm' }],
  },
  {
    id: 'npsh_margin', cat: 'npsh', name: 'Marge de sécurité NPSH',
    expr: 'M = NPSHd − NPSHr   (M ≥ 0,5 m recommandé)',
    desc: 'La pompe ne cavite pas si le NPSH disponible dépasse le NPSH requis du constructeur avec une marge suffisante.',
    refs: 'ANSI/HI 9.6.1',
    vars: [v('a', 'NPSH disponible', 'm', 7.5), v('r', 'NPSH requis (constructeur)', 'm', 4.2)],
    calc: x => { const m = x.a - x.r; return [{ label: 'Marge', value: m, unit: 'm', verdict: m >= 0.5 ? ['ok', 'Pas de cavitation'] : m >= 0 ? ['warn', 'Marge insuffisante'] : ['bad', 'Cavitation'] }]; },
  },
  {
    id: 'patm_altitude', cat: 'npsh', name: 'Pression atmosphérique selon l\'altitude',
    expr: 'Patm = 101 325 × (1 − 2,25577·10⁻⁵ × z)^5,25588',
    desc: 'L\'altitude réduit la pression atmosphérique, donc le NPSH disponible (≈ −1,1 m par 1 000 m).',
    refs: 'Atmosphère standard ISO 2533',
    vars: [v('z', 'Altitude', 'm', 350)],
    calc: x => { const p = 101325 * Math.pow(1 - 2.25577e-5 * x.z, 5.25588); return [{ label: 'Patm', value: p, unit: 'Pa', digits: 0 }, { label: 'Hauteur équivalente (eau)', value: p / (998 * G), unit: 'm' }]; },
  },
  {
    id: 'darcy', cat: 'losses', name: 'Darcy-Weisbach (pertes linéaires)',
    expr: 'ΔH = λ · (L/D) · V²/(2g)',
    desc: 'Formule universelle des pertes de charge linéaires, valable pour tout fluide et tout régime.',
    refs: 'Idel\'cik · ISO 4006',
    vars: [v('f', 'Coefficient de friction λ', '—', 0.02), v('L', 'Longueur', 'm', 100), v('D', 'Diamètre intérieur', 'mm', 100), v('V', 'Vitesse', 'm/s', 1.5)],
    calc: x => [{ label: 'Perte de charge ΔH', value: x.f * (x.L / (x.D / 1000)) * (x.V * x.V) / (2 * G), unit: 'm' }],
  },
  {
    id: 'swamee', cat: 'losses', name: 'Coefficient λ — Swamee-Jain',
    expr: 'λ = 0,25 / [log₁₀(ε/(3,7·D) + 5,74/Re^0,9)]²',
    desc: 'Approximation explicite de Colebrook-White (écart < 1 % pour 5·10³ < Re < 10⁸).',
    refs: 'Swamee & Jain (1976)',
    vars: [v('e', 'Rugosité ε', 'mm', 0.0015, 'PVC 0,0015 · acier 0,045 · fonte 0,26'), v('D', 'Diamètre intérieur', 'mm', 100), v('Re', 'Nombre de Reynolds', '—', 150000)],
    calc: x => [{ label: 'λ', value: 0.25 / Math.pow(Math.log10(x.e / (3.7 * x.D) + 5.74 / Math.pow(x.Re, 0.9)), 2), unit: '', digits: 4 }],
  },
  {
    id: 'hazen', cat: 'losses', name: 'Hazen-Williams (eau)',
    expr: 'J = 10,67 · Q^1,852 / (C^1,852 · D^4,87)   ;   ΔH = J · L',
    desc: 'Formule empirique pour l\'eau froide en réseau, très utilisée en adduction.',
    refs: 'AWWA M32',
    vars: [v('Q', 'Débit', 'm³/h', 50), v('C', 'Coefficient C', '—', 140, 'PVC/PEHD 140–150 · acier neuf 120 · fonte 100'), v('D', 'Diamètre intérieur', 'mm', 100), v('L', 'Longueur', 'm', 500)],
    calc: x => { const J = 10.67 * Math.pow(x.Q / 3600, 1.852) / (Math.pow(x.C, 1.852) * Math.pow(x.D / 1000, 4.87)); return [{ label: 'Perte unitaire J', value: J * 1000, unit: 'm/km' }, { label: 'Perte totale ΔH', value: J * x.L, unit: 'm' }]; },
  },
  {
    id: 'singular', cat: 'losses', name: 'Pertes singulières',
    expr: 'ΔH = ζ · V²/(2g)',
    desc: 'Pertes locales dans les coudes, vannes, clapets… ζ : coude 90° ≈ 0,3–0,9 ; vanne ouverte ≈ 0,2 ; clapet ≈ 2.',
    refs: 'Idel\'cik — Memento des pertes de charge',
    vars: [v('z', 'Somme des coefficients ζ', '—', 3.5), v('V', 'Vitesse', 'm/s', 1.8)],
    calc: x => [{ label: 'ΔH singulière', value: x.z * x.V * x.V / (2 * G), unit: 'm' }],
  },
  {
    id: 'hmt', cat: 'hmt', name: 'Hauteur manométrique totale',
    expr: 'HMT = Hgéo + ΔHtotal + ΔP/(ρ·g)',
    desc: 'Énergie par unité de poids que doit fournir la pompe : dénivelé, pertes de charge et pression résiduelle utile.',
    refs: 'NF EN 12723',
    vars: [v('Hg', 'Hauteur géométrique', 'm', 35), v('dH', 'Pertes de charge totales', 'm', 6), v('P', 'Pression utile au refoulement', 'bar', 2), v('rho', 'Masse volumique ρ', 'kg/m³', 998)],
    calc: x => [{ label: 'HMT', value: x.Hg + x.dH + (x.P * 1e5) / (x.rho * G), unit: 'm' }, { label: 'dont pression utile', value: (x.P * 1e5) / (x.rho * G), unit: 'm' }],
  },
  {
    id: 'bar_to_m', cat: 'hmt', name: 'Pression ↔ hauteur de colonne',
    expr: 'h = P / (ρ · g)',
    desc: 'Conversion d\'une pression en hauteur de fluide : 1 bar ≈ 10,2 m d\'eau.',
    refs: '—',
    vars: [v('P', 'Pression', 'bar', 4), v('rho', 'Masse volumique ρ', 'kg/m³', 998)],
    calc: x => [{ label: 'Hauteur', value: x.P * 1e5 / (x.rho * G), unit: 'm' }],
  },
  {
    id: 'ph', cat: 'power', name: 'Puissance hydraulique',
    expr: 'Ph = ρ · g · Q · H',
    desc: 'Puissance réellement transmise au fluide par la pompe.',
    refs: 'ISO 9906',
    vars: [v('Q', 'Débit', 'm³/h', 50), v('H', 'HMT', 'm', 40), v('rho', 'Masse volumique ρ', 'kg/m³', 998)],
    calc: x => [{ label: 'Ph', value: x.rho * G * (x.Q / 3600) * x.H / 1000, unit: 'kW' }],
  },
  {
    id: 'p2', cat: 'power', name: 'Puissance à l\'arbre (absorbée pompe)',
    expr: 'P2 = Q · H / (367 · ηp)',
    desc: 'Forme pratique pour l\'eau avec Q en m³/h, H en m et ηp en fraction. 367 = 3 600 / (ρ·g/1 000).',
    refs: 'ISO 9906',
    vars: [v('Q', 'Débit', 'm³/h', 50), v('H', 'HMT', 'm', 40), v('eta', 'Rendement pompe', '%', 72)],
    calc: x => [{ label: 'P2', value: x.Q * x.H / (367 * x.eta / 100), unit: 'kW' }],
  },
  {
    id: 'current', cat: 'power', name: 'Courant nominal triphasé',
    expr: 'I = P1 / (√3 · U · cos φ)',
    desc: 'Courant absorbé par un moteur triphasé ; en monophasé, supprimer √3.',
    refs: 'IEC 60034-1',
    vars: [v('P', 'Puissance électrique P1', 'kW', 8.5), v('U', 'Tension entre phases', 'V', 400), v('pf', 'cos φ', '—', 0.85)],
    calc: x => [{ label: 'I', value: x.P * 1000 / (Math.sqrt(3) * x.U * x.pf), unit: 'A', digits: 1 }],
  },
  {
    id: 'eta_global', cat: 'power', name: 'Rendement global du groupe',
    expr: 'ηglobal = ηpompe × ηmoteur (× ηvariateur)',
    desc: 'Rendement « fil à eau » de la chaîne complète.',
    refs: 'ISO 50001',
    vars: [v('p', 'Rendement pompe', '%', 72), v('m', 'Rendement moteur', '%', 91), v('vfd', 'Rendement variateur', '%', 100, '100 % si pas de variateur')],
    calc: x => { const e = x.p * x.m * x.vfd / 1e4; return [{ label: 'η global', value: e, unit: '%', digits: 1, verdict: e >= 60 ? ['ok', 'Bon'] : e >= 45 ? ['warn', 'Moyen'] : ['bad', 'Faible'] }]; },
  },
  {
    id: 'velocity', cat: 'flow', name: 'Vitesse d\'écoulement',
    expr: 'V = 4·Q / (π · D²)',
    desc: 'Vitesses usuelles : aspiration 0,6–1,5 m/s ; refoulement 1–2,5 m/s.',
    refs: '—',
    vars: [v('Q', 'Débit', 'm³/h', 50), v('D', 'Diamètre intérieur', 'mm', 100)],
    calc: x => { const V = (x.Q / 3600) / (Math.PI * Math.pow(x.D / 1000, 2) / 4); return [{ label: 'V', value: V, unit: 'm/s', verdict: V < 0.5 ? ['warn', 'Faible — dépôts'] : V <= 2.5 ? ['ok', 'Plage usuelle'] : ['bad', 'Trop élevée'] }]; },
  },
  {
    id: 'diameter', cat: 'flow', name: 'Diamètre pour une vitesse cible',
    expr: 'D = √(4·Q / (π · V))',
    desc: 'Pré-dimensionnement d\'une conduite à partir du débit et de la vitesse souhaitée.',
    refs: '—',
    vars: [v('Q', 'Débit', 'm³/h', 50), v('V', 'Vitesse cible', 'm/s', 1.5)],
    calc: x => [{ label: 'D intérieur', value: Math.sqrt(4 * (x.Q / 3600) / (Math.PI * x.V)) * 1000, unit: 'mm', digits: 1 }],
  },
  {
    id: 'reynolds', cat: 'flow', name: 'Nombre de Reynolds',
    expr: 'Re = V · D / ν',
    desc: 'Laminaire si Re < 2 300, turbulent au-delà de 4 000.',
    refs: '—',
    vars: [v('V', 'Vitesse', 'm/s', 1.5), v('D', 'Diamètre intérieur', 'mm', 100), v('nu', 'Viscosité cinématique ν', 'cSt', 1.0, 'Eau à 20 °C : 1,0 cSt')],
    calc: x => { const Re = x.V * (x.D / 1000) / (x.nu * 1e-6); return [{ label: 'Re', value: Re, unit: '', digits: 0, verdict: Re < 2300 ? ['ok', 'Laminaire'] : Re < 4000 ? ['warn', 'Transitoire'] : ['ok', 'Turbulent'] }]; },
  },
  {
    id: 'affinity', cat: 'affinity', name: 'Lois de similitude (vitesse variable)',
    expr: 'Q₂ = Q₁·(n₂/n₁)   H₂ = H₁·(n₂/n₁)²   P₂ = P₁·(n₂/n₁)³',
    desc: 'Effet d\'un changement de vitesse de rotation (variateur) : la puissance varie au cube de la vitesse.',
    refs: 'Lois d\'affinité — Hydraulic Institute',
    vars: [v('Q', 'Débit à n₁', 'm³/h', 50), v('H', 'HMT à n₁', 'm', 40), v('P', 'Puissance à n₁', 'kW', 8), v('n1', 'Vitesse n₁', 'tr/min', 2900), v('n2', 'Vitesse n₂', 'tr/min', 2400)],
    calc: x => { const k = x.n2 / x.n1; return [{ label: 'Q₂', value: x.Q * k, unit: 'm³/h' }, { label: 'H₂', value: x.H * k * k, unit: 'm' }, { label: 'P₂', value: x.P * k * k * k, unit: 'kW' }, { label: 'Économie de puissance', value: (1 - k * k * k) * 100, unit: '%', digits: 0 }]; },
  },
  {
    id: 'joukowsky', cat: 'hammer', name: 'Surpression de Joukowsky',
    expr: 'ΔP = ρ · a · ΔV',
    desc: 'Surpression maximale lors d\'une fermeture rapide (temps de fermeture < 2L/a).',
    refs: 'Joukowsky (1898)',
    vars: [v('rho', 'Masse volumique ρ', 'kg/m³', 998), v('a', 'Célérité de l\'onde a', 'm/s', 1000), v('dV', 'Variation de vitesse ΔV', 'm/s', 1.5)],
    calc: x => { const p = x.rho * x.a * x.dV; return [{ label: 'ΔP', value: p / 1e5, unit: 'bar' }, { label: 'ΔH', value: p / (x.rho * G), unit: 'm' }]; },
  },
  {
    id: 'celerity', cat: 'hammer', name: 'Célérité de l\'onde (Allievi)',
    expr: 'a = √(K/ρ) / √(1 + K·D/(E·e))',
    desc: 'Vitesse de propagation de l\'onde de pression, fonction de l\'élasticité du tuyau. E : PVC 3 GPa · PEHD 1 GPa · acier 210 GPa · fonte 100 GPa.',
    refs: 'Allievi · Wylie & Streeter',
    vars: [v('K', 'Module de compressibilité K', 'GPa', 2.2), v('rho', 'Masse volumique ρ', 'kg/m³', 998), v('D', 'Diamètre intérieur', 'mm', 100), v('e', 'Épaisseur de paroi', 'mm', 5), v('E', 'Module d\'Young du tuyau', 'GPa', 3)],
    calc: x => [{ label: 'a', value: Math.sqrt(x.K * 1e9 / x.rho) / Math.sqrt(1 + (x.K * x.D) / (x.E * x.e)), unit: 'm/s', digits: 0 }],
  },
  {
    id: 'tc', cat: 'hammer', name: 'Temps critique d\'aller-retour',
    expr: 'Tc = 2 · L / a',
    desc: 'Une fermeture plus lente que Tc réduit fortement la surpression.',
    refs: '—',
    vars: [v('L', 'Longueur de conduite', 'm', 800), v('a', 'Célérité a', 'm/s', 400)],
    calc: x => [{ label: 'Tc', value: 2 * x.L / x.a, unit: 's' }],
  },
  {
    id: 'pv_peak', cat: 'solar', name: 'Puissance crête PV pour pompage',
    expr: 'Pc = 2,725 · V · H / (η · Ir · PR)',
    desc: 'Énergie hydraulique journalière (2,725 Wh par m³ et par m) ramenée à l\'ensoleillement du site. PR : ratio de performance (0,7–0,8).',
    refs: 'IEC 62253',
    vars: [v('V', 'Volume journalier', 'm³/j', 40), v('H', 'HMT', 'm', 50), v('eta', 'Rendement motopompe', '%', 45), v('Ir', 'Irradiation', 'kWh/m²/j', 5.5), v('PR', 'Ratio de performance', '—', 0.75)],
    calc: x => { const E = 2.725 * x.V * x.H / (x.eta / 100); const Pc = E / (x.Ir * x.PR); return [{ label: 'Énergie électrique', value: E / 1000, unit: 'kWh/j' }, { label: 'Puissance crête', value: Pc, unit: 'Wc', digits: 0 }]; },
  },
  {
    id: 'energy_cost', cat: 'solar', name: 'Coût énergétique annuel',
    expr: 'C = P1 · h · j · prix',
    desc: 'Coût d\'exploitation électrique d\'un groupe motopompe.',
    refs: 'ISO 50001',
    vars: [v('P', 'Puissance absorbée P1', 'kW', 7.5), v('h', 'Heures par jour', 'h', 10), v('j', 'Jours par an', 'j', 330), v('c', 'Prix du kWh', 'FCFA', 100)],
    calc: x => [{ label: 'Énergie', value: x.P * x.h * x.j, unit: 'kWh/an', digits: 0 }, { label: 'Coût', value: x.P * x.h * x.j * x.c, unit: 'FCFA/an', digits: 0 }],
  },
];

const fmt = (val, digits = 2) => {
  if (!isFinite(val)) return '—';
  const a = Math.abs(val);
  if (a !== 0 && (a >= 1e7 || a < 1e-3)) return val.toExponential(3);
  return val.toLocaleString('fr-FR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
};

const FormulaCalculator = ({ f }) => {
  const [vals, setVals] = useState(() => Object.fromEntries(f.vars.map(x => [x.key, String(x.def)])));
  const nums = Object.fromEntries(Object.entries(vals).map(([k, s]) => [k, parseFloat(String(s).replace(',', '.'))]));
  let results = [];
  try { results = f.calc(nums); } catch { results = []; }
  const cat = CATS[f.cat];
  const copy = () => {
    const txt = `${f.name}\n${f.expr}\n` + f.vars.map(x => `${x.label} = ${vals[x.key]} ${x.unit}`).join('\n') + '\n→ ' + results.map(r => `${r.label} = ${fmt(r.value, r.digits ?? 2)} ${r.unit}`).join(' ; ');
    navigator.clipboard?.writeText(txt).then(() => notify.success('Calcul copié'), () => notify.error('Copie impossible'));
  };
  return (
    <div className="fx-detail" style={{ '--fx': cat.color }}>
      <div className="fx-detail-head">
        <span className="fx-cat">{cat.icon} {cat.label}</span>
        <h2 className="fx-title">{f.name}</h2>
        <div className="fx-expr">{f.expr}</div>
        <p className="fx-desc">{f.desc}</p>
      </div>
      <div className="fx-calc">
        <div className="fx-inputs">
          {f.vars.map(x => (
            <label key={x.key} className="fx-input">
              <span className="fx-input-label">{x.label}</span>
              <span className="fx-input-box">
                <input inputMode="decimal" value={vals[x.key]} onChange={e => setVals(p => ({ ...p, [x.key]: e.target.value }))} onFocus={e => e.target.select()} />
                {x.unit && x.unit !== '—' && <em>{x.unit}</em>}
              </span>
              {x.hint && <span className="fx-input-hint">{x.hint}</span>}
            </label>
          ))}
          <button className="fx-reset" onClick={() => setVals(Object.fromEntries(f.vars.map(x => [x.key, String(x.def)])))}>↺ Valeurs par défaut</button>
        </div>
        <div className="fx-results">
          {results.map(r => (
            <div key={r.label} className="fx-result">
              <span className="fx-result-label">{r.label}</span>
              <span className="fx-result-value">{fmt(r.value, r.digits ?? 2)}<em>{r.unit}</em></span>
              {r.verdict && <span className={`fx-verdict ${r.verdict[0]}`}>{r.verdict[1]}</span>}
            </div>
          ))}
          <button className="hv-btn" onClick={copy} style={{ marginTop: 4 }}>📋 Copier le calcul</button>
        </div>
      </div>
      <div className="fx-refs">📖 Références : {f.refs}</div>
    </div>
  );
};

const FormulaDatabase = () => {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [selected, setSelected] = useState(FORMULAS[0].id);

  const list = useMemo(() => FORMULAS.filter(f =>
    (cat === 'all' || f.cat === cat) &&
    (!q.trim() || normalize(`${f.name} ${f.expr} ${f.desc} ${CATS[f.cat].label}`).includes(normalize(q)))
  ), [q, cat]);
  const current = FORMULAS.find(f => f.id === selected) || list[0];

  return (
    <div className="fade-in stack" style={{ gap: 18 }}>
      <ModuleHeader icon="📚" kicker="Référentiel" title="Base de formules interactive" color="#a855f7"
        desc={`${FORMULAS.length} formules d'hydraulique, d'électrotechnique et d'énergie — chacune avec son calculateur intégré.`}
        tags={['ISO 9906', 'ISO 17769', 'IEC 60034', 'Hydraulic Institute']} />

      <div className="fx-toolbar">
        <div className="dash-filter" style={{ flex: 1, minWidth: 220 }}>
          <span>🔎</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher : Reynolds, NPSH, bélier, solaire…" aria-label="Rechercher une formule" />
        </div>
        <div className="hv-chips">
          <button className={`uc-chip ${cat === 'all' ? 'active' : ''}`} onClick={() => setCat('all')}>Toutes ({FORMULAS.length})</button>
          {Object.entries(CATS).map(([id, c]) => (
            <button key={id} className={`uc-chip ${cat === id ? 'active' : ''}`} onClick={() => setCat(id)}>{c.icon} {c.label}</button>
          ))}
        </div>
      </div>

      <div className="fx-layout">
        <ProCard style={{ padding: 8 }}>
          <div className="fx-list" role="listbox" aria-label="Formules">
            {list.length === 0 && <p className="dash-empty" style={{ padding: 12 }}>Aucune formule ne correspond.</p>}
            {list.map(f => (
              <button key={f.id} role="option" aria-selected={current?.id === f.id}
                className={`fx-item ${current?.id === f.id ? 'on' : ''}`} style={{ '--fx': CATS[f.cat].color }}
                onClick={() => setSelected(f.id)}>
                <span className="fx-item-icon">{CATS[f.cat].icon}</span>
                <span className="fx-item-text">
                  <span className="fx-item-name">{f.name}</span>
                  <span className="fx-item-expr">{f.expr}</span>
                </span>
              </button>
            ))}
          </div>
        </ProCard>
        <div>
          {current ? <ProCard><FormulaCalculator key={current.id} f={current} /></ProCard>
            : <ProCard><SectionHead icon="🔎" title="Aucune formule sélectionnée" /></ProCard>}
        </div>
      </div>
    </div>
  );
};

export default FormulaDatabase;
