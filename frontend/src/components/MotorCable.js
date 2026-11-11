import React, { useMemo, useState } from 'react';
import { ProInput, ProSelect, ProCard, SectionHead, KPICard, ProAlert, ModuleHeader, DetailRow, ChoiceGroup, useWideLayout, SPLIT_COLS, SubTabNav } from './ui';

// ════════════════════════════════════════════════════════════════
// MOTEUR & CÂBLAGE — dimensionnement électrique d'un groupe motopompe
// Valeurs de référence : IEC 60034 (puissances normalisées),
// NF C 15-100 / IEC 60364-5-52 (courants admissibles, chute de tension).
// Les courants admissibles sont des valeurs indicatives pour câbles
// isolés PR/XLPE, 3 conducteurs chargés, à 30 °C (20 °C en enterré).
// ════════════════════════════════════════════════════════════════

const G = 9.80665;
const MOTOR_KW = [0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110, 132, 160, 200, 250, 315];
const SECTIONS = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
const BREAKERS = [1, 2, 3, 4, 6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630];

// Courants admissibles cuivre (A) par mode de pose
const IZ_CU = {
  air:     [24, 33, 45, 58, 80, 107, 138, 171, 209, 269, 328, 382, 441, 506, 599],   // méthode C/E — fixé aux parois, chemin de câbles
  conduit: [19.5, 27, 36, 46, 63, 85, 112, 138, 168, 213, 258, 299, 344, 392, 461], // méthode B — sous conduit / goulotte
  buried:  [26, 34, 44, 56, 73, 95, 121, 146, 173, 213, 252, 287, 324, 363, 419],    // méthode D — enterré
};
const AL_FACTOR = 0.78; // aluminium ≈ 78 % du cuivre
// Facteur de correction température ambiante (isolant PR)
const TEMP_FACTOR = { 25: 1.04, 30: 1.0, 35: 0.96, 40: 0.91, 45: 0.87, 50: 0.82, 55: 0.76 };
// Résistivité à température de service (NF C 15-100 : 1,25 × ρ20)
const RHO = { copper: 0.0225, aluminum: 0.036 }; // Ω·mm²/m
const X_LIN = 0.00008; // réactance linéique Ω/m

const STARTERS = {
  direct:     { l: 'Direct', d: 'Id ≈ 7 × In', ratio: 7, curve: 'D' },
  stardelta:  { l: 'Étoile-triangle', d: 'Id ≈ 2,3 × In', ratio: 2.3, curve: 'C' },
  soft:       { l: 'Démarreur progressif', d: 'Id ≈ 3,5 × In', ratio: 3.5, curve: 'C' },
  vfd:        { l: 'Variateur (VFD)', d: 'Id ≈ 1,2 × In', ratio: 1.2, curve: 'C' },
};

const fmt = (v, d = 2) => (v === undefined || v === null || !isFinite(v)) ? '—' : Number(v).toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });

export const computeMotorCable = (d) => {
  const tri = d.network !== 'mono230';
  const U = d.network === 'tri230' || d.network === 'mono230' ? 230 : 400;
  const cosphi = Math.min(Math.max(d.pf, 0.1), 1);
  const sinphi = Math.sqrt(1 - cosphi * cosphi);
  const etaP = d.eta_pump / 100, etaM = d.eta_motor / 100;

  const Ph = d.input_mode === 'qh' ? (1000 * G * (d.flow / 3600) * d.hmt) / 1000 : d.Ph; // kW
  const P2 = etaP > 0 ? Ph / etaP : NaN;               // puissance à l'arbre
  const P2_req = P2 * (1 + d.margin / 100);            // avec marge de service
  const Pn = MOTOR_KW.find(k => k >= P2_req) || MOTOR_KW[MOTOR_KW.length - 1];
  const P1 = etaM > 0 ? P2 / etaM : NaN;               // puissance électrique absorbée au point de fonctionnement
  const k = tri ? Math.sqrt(3) : 1;
  const In = (Pn * 1000) / (k * U * etaM * cosphi);    // courant nominal plaque du moteur choisi
  const Ib = (P1 * 1000) / (k * U * cosphi);           // courant au point de fonctionnement
  const load = Pn > 0 ? (P2 / Pn) * 100 : NaN;         // taux de charge du moteur
  const starter = STARTERS[d.starter] || STARTERS.direct;
  const Id = In * starter.ratio;

  // Câble : plus petite section satisfaisant le courant admissible ET la chute de tension
  const tf = TEMP_FACTOR[d.ambient] ?? 1;
  const iz = (i) => (IZ_CU[d.install][i] * (d.cable_material === 'aluminum' ? AL_FACTOR : 1)) * (d.install === 'buried' ? 1 : tf);
  const dropAt = (S, I, cos = cosphi) => {
    const sin = Math.sqrt(1 - cos * cos);
    const R = RHO[d.cable_material] / S;
    const b = tri ? Math.sqrt(3) : 2;
    const dU = b * I * d.cable_length * (R * cos + X_LIN * sin);
    return (dU / U) * 100;
  };
  const minSection = d.cable_material === 'aluminum' ? 16 : 1.5;
  const rows = SECTIONS.map((S, i) => ({
    S, Iz: iz(i), dU: dropAt(S, In), dUstart: dropAt(S, Id, 0.35),
  })).filter(r => r.S >= minSection);
  const chosen = rows.find(r => r.Iz >= In && r.dU <= d.delta_U_max) || rows[rows.length - 1];
  const byCurrent = rows.find(r => r.Iz >= In);
  const limiting = chosen && byCurrent && chosen.S > byCurrent.S ? 'chute de tension' : 'courant admissible';

  // Protection : calibre normalisé ≥ In et ≤ Iz du câble retenu
  const breaker = BREAKERS.find(b => b >= In * 1.05) || BREAKERS[BREAKERS.length - 1];
  const breakerOk = chosen ? breaker <= chosen.Iz : false;

  // Énergie
  const kwhYear = P1 * d.hours * d.days;
  const costYear = kwhYear * d.price;
  const co2 = kwhYear * d.co2 / 1e6; // t (g/kWh → t)

  const warnings = [];
  if (load > 100) warnings.push('Moteur surchargé : la puissance à l\'arbre dépasse la puissance nominale.');
  if (load < 50) warnings.push(`Moteur peu chargé (${fmt(load, 0)} %) : rendement et cos φ réels seront dégradés.`);
  if (chosen && chosen.dU > d.delta_U_max) warnings.push('Aucune section du tableau ne respecte la chute de tension visée : réduire la longueur ou augmenter la tension.');
  if (chosen && chosen.dUstart > 15) warnings.push(`Chute de tension au démarrage élevée (${fmt(chosen.dUstart, 1)} %) : préférer un démarrage progressif ou un variateur.`);
  if (d.starter === 'stardelta' && !tri) warnings.push('Le démarrage étoile-triangle nécessite un réseau triphasé.');
  if (!tri && Pn > 3) warnings.push('Au-delà de 3 kW, un moteur monophasé est rarement disponible : privilégier le triphasé.');
  if (!breakerOk) warnings.push('Le calibre de protection dépasse le courant admissible du câble : augmenter la section.');

  return { tri, U, Ph, P2, P2_req, Pn, P1, In, Ib, Id, load, starter, rows, chosen, limiting, breaker, breakerOk, kwhYear, costYear, co2, warnings, sinphi };
};

// ── Schéma unifilaire ──
const SingleLine = ({ d, r }) => {
  const W = 640, H = 230;
  const cable = r.chosen ? `${r.tri ? '4G' : '3G'} ${String(r.chosen.S).replace('.', ',')} mm² ${d.cable_material === 'copper' ? 'Cu' : 'Al'}` : '—';
  const box = (x, label, sub, color) => (
    <g>
      <rect x={x - 42} y={78} width={84} height={64} rx={12} fill="white" stroke={color} strokeWidth="2" />
      <text x={x} y={104} textAnchor="middle" fontSize="12" fontWeight="800" fill={color}>{label}</text>
      <text x={x} y={122} textAnchor="middle" fontSize="10" fill="#475569">{sub}</text>
    </g>
  );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Schéma unifilaire">
      <defs>
        <pattern id="mc-grid" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="#eef2f7" strokeWidth="1" /></pattern>
        <marker id="mc-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#94a3b8" /></marker>
      </defs>
      <rect width={W} height={H} rx="14" fill="url(#mc-grid)" />
      {/* Source */}
      <g>
        <circle cx="48" cy="110" r="30" fill="#eff6ff" stroke="#2563eb" strokeWidth="2" />
        <path d="M30 110 q9 -14 18 0 t18 0" fill="none" stroke="#2563eb" strokeWidth="2.2" />
        <text x="48" y="160" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e40af">{r.U} V {r.tri ? '3~' : '1~'}</text>
      </g>
      <line x1="78" y1="110" x2="120" y2="110" stroke="#334155" strokeWidth="2.5" />
      {/* Disjoncteur */}
      <g>
        <line x1="120" y1="110" x2="132" y2="110" stroke="#334155" strokeWidth="2.5" />
        <line x1="132" y1="110" x2="156" y2="96" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
        <path d="M150 104 l8 -8 M150 96 l8 8" stroke="#d97706" strokeWidth="2" />
        <line x1="158" y1="110" x2="170" y2="110" stroke="#334155" strokeWidth="2.5" />
        <text x="145" y="80" textAnchor="middle" fontSize="11" fontWeight="800" fill="#b45309">{r.breaker} A</text>
        <text x="145" y="140" textAnchor="middle" fontSize="9.5" fill="#64748b">Disj. courbe {r.starter.curve}</text>
      </g>
      <line x1="170" y1="110" x2="208" y2="110" stroke="#334155" strokeWidth="2.5" />
      {box(250, d.starter === 'vfd' ? 'VFD' : d.starter === 'soft' ? 'SOFT' : d.starter === 'stardelta' ? 'Y / Δ' : 'KM', r.starter.l, '#7c3aed')}
      {/* Câble */}
      <line x1="292" y1="110" x2="440" y2="110" stroke="#ea580c" strokeWidth="4" strokeDasharray={d.install === 'buried' ? '10 6' : undefined} />
      <text x="366" y="96" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#c2410c">{cable}</text>
      <text x="366" y="132" textAnchor="middle" fontSize="10" fill="#64748b">L = {d.cable_length} m · ΔU = {fmt(r.chosen?.dU, 2)} %</text>
      {/* Moteur */}
      <g>
        <circle cx="478" cy="110" r="36" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2.2" />
        <text x="478" y="108" textAnchor="middle" fontSize="16" fontWeight="900" fill="#15803d">M</text>
        <text x="478" y="124" textAnchor="middle" fontSize="10" fill="#16a34a">{r.tri ? '3~' : '1~'}</text>
        <text x="478" y="168" textAnchor="middle" fontSize="11" fontWeight="800" fill="#15803d">{fmt(r.Pn, r.Pn < 1 ? 2 : 1)} kW</text>
        <text x="478" y="183" textAnchor="middle" fontSize="9.5" fill="#64748b">In = {fmt(r.In, 1)} A</text>
      </g>
      <line x1="514" y1="110" x2="548" y2="110" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
      {/* Pompe */}
      <g>
        <circle cx="584" cy="110" r="30" fill="#eff6ff" stroke="#2563eb" strokeWidth="2.2" />
        <path d="M584 84 L606 120 L562 120 Z" fill="none" stroke="#2563eb" strokeWidth="2" />
        <text x="584" y="160" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e40af">Pompe</text>
        <text x="584" y="175" textAnchor="middle" fontSize="9.5" fill="#64748b">η = {d.eta_pump} %</text>
      </g>
      <text x="16" y="24" fontSize="10" fontWeight="800" fill="#94a3b8" letterSpacing="1.5">SCHÉMA UNIFILAIRE</text>
    </svg>
  );
};

const DEFAULTS = {
  input_mode: 'power', Ph: 5, flow: 30, hmt: 45,
  eta_pump: 72, eta_motor: 90, pf: 0.85, margin: 10,
  network: 'tri400', starter: 'direct',
  cable_length: 50, cable_material: 'copper', install: 'air', ambient: 30, delta_U_max: 3,
  hours: 8, days: 300, price: 100, currency: 'FCFA', co2: 450,
};

const MotorCableCalculator = () => {
  const [d, setD] = useState(DEFAULTS);
  const [tab, setTab] = useState('config');
  const wide = useWideLayout();
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));
  const r = useMemo(() => computeMotorCable(d), [d]);

  const form = (
    <div className="stack">
      <ProCard>
        <SectionHead icon="💧" title="Besoin hydraulique" color="#2563eb" sub="Puissance demandée par la pompe" />
        <div className="stack">
          <ChoiceGroup value={d.input_mode} onChange={v => set('input_mode', v)} color="#2563eb"
            options={[{ v: 'power', l: 'Puissance hydraulique', d: 'Ph connue' }, { v: 'qh', l: 'Débit + HMT', d: 'Ph calculée (eau)' }]} />
          {d.input_mode === 'power' ? (
            <ProInput label="Puissance hydraulique Ph" unit="kW" value={d.Ph} onChange={v => set('Ph', v)} />
          ) : (
            <div className="grid-2">
              <ProInput label="Débit" unit="m³/h" value={d.flow} onChange={v => set('flow', v)} />
              <ProInput label="HMT" unit="m" value={d.hmt} onChange={v => set('hmt', v)} />
            </div>
          )}
          <div className="grid-2">
            <ProInput label="Rendement pompe ηp" unit="%" color="green" value={d.eta_pump} onChange={v => set('eta_pump', v)} warn={d.eta_pump < 50} />
            <ProInput label="Marge de puissance" unit="%" color="green" value={d.margin} onChange={v => set('margin', v)} note="Réserve sur la puissance à l'arbre (10–15 % usuel)" />
          </div>
        </div>
      </ProCard>

      <ProCard>
        <SectionHead icon="⚡" title="Moteur & réseau" color="#7c3aed" sub="IEC 60034" />
        <div className="stack">
          <ChoiceGroup label="Réseau d'alimentation" value={d.network} onChange={v => set('network', v)} color="#7c3aed"
            options={[{ v: 'tri400', l: 'Tri 400 V', d: '3~ + N' }, { v: 'tri230', l: 'Tri 230 V', d: '3~' }, { v: 'mono230', l: 'Mono 230 V', d: '1~' }]} />
          <div className="grid-2">
            <ProInput label="Rendement moteur ηm" unit="%" color="purple" value={d.eta_motor} onChange={v => set('eta_motor', v)} />
            <ProInput label="Facteur de puissance cos φ" color="purple" value={d.pf} onChange={v => set('pf', v)} warn={d.pf < 0.75} />
          </div>
          <ChoiceGroup label="Mode de démarrage" value={d.starter} onChange={v => set('starter', v)} color="#7c3aed"
            options={Object.entries(STARTERS).map(([v, s]) => ({ v, l: s.l, d: s.d }))} />
        </div>
      </ProCard>

      <ProCard>
        <SectionHead icon="🔌" title="Câble d'alimentation" color="#ea580c" sub="NF C 15-100 · IEC 60364-5-52" />
        <div className="stack">
          <div className="grid-2">
            <ProInput label="Longueur" unit="m" color="orange" value={d.cable_length} onChange={v => set('cable_length', v)} />
            <ProInput label="Chute de tension max" unit="%" color="orange" value={d.delta_U_max} onChange={v => set('delta_U_max', v)} note="3 % éclairage · 5 % autres usages" />
          </div>
          <ChoiceGroup label="Mode de pose" value={d.install} onChange={v => set('install', v)} color="#ea580c"
            options={[{ v: 'air', l: 'Chemin de câbles', d: 'Air libre' }, { v: 'conduit', l: 'Sous conduit', d: 'Goulotte / tube' }, { v: 'buried', l: 'Enterré', d: 'Fourreau' }]} />
          <div className="grid-2">
            <ProSelect label="Matériau" color="orange" value={d.cable_material} onChange={v => set('cable_material', v)}
              options={[{ v: 'copper', l: 'Cuivre (Cu)' }, { v: 'aluminum', l: 'Aluminium (Al)' }]} />
            <ProSelect label="Température ambiante" color="orange" value={String(d.ambient)} onChange={v => set('ambient', Number(v))}
              options={Object.keys(TEMP_FACTOR).map(t => ({ v: t, l: `${t} °C` }))} />
          </div>
        </div>
      </ProCard>

      <ProCard>
        <SectionHead icon="💰" title="Exploitation" color="#0f766e" sub="Consommation et coût annuel" />
        <div className="grid-2">
          <ProInput label="Heures / jour" unit="h" color="cyan" value={d.hours} onChange={v => set('hours', v)} />
          <ProInput label="Jours / an" unit="j" color="cyan" value={d.days} onChange={v => set('days', v)} />
          <ProInput label="Prix de l'énergie" unit={`${d.currency}/kWh`} color="cyan" value={d.price} onChange={v => set('price', v)} />
          <ProSelect label="Devise" color="cyan" value={d.currency} onChange={v => set('currency', v)} options={['FCFA', '€', '$']} />
        </div>
      </ProCard>
    </div>
  );

  const results = (
    <div className={`stack ${wide ? 'calc-results-sticky' : ''}`}>
      <ProCard style={{ padding: 12 }}>
        <SingleLine d={d} r={r} />
      </ProCard>

      <div className="grid-2">
        <KPICard big icon="⚙️" label="Moteur normalisé" value={fmt(r.Pn, r.Pn < 1 ? 2 : 1)} unit="kW" color="#15803d" bg="#f0fdf4"
          sub={`Charge ${fmt(r.load, 0)} % · P arbre ${fmt(r.P2, 2)} kW`} />
        <KPICard big icon="🔌" label="Section de câble" value={r.chosen ? String(r.chosen.S).replace('.', ',') : '—'} unit="mm²" color="#c2410c" bg="#fff7ed"
          sub={`Dimensionné par : ${r.limiting}`} />
        <KPICard icon="〰️" label="Courant nominal In" value={fmt(r.In, 1)} unit="A" color="#7c3aed" bg="#faf5ff"
          sub={`Au point de fonct. : ${fmt(r.Ib, 1)} A`} />
        <KPICard icon="🚀" label="Courant de démarrage" value={fmt(r.Id, 0)} unit="A" color="#b45309" bg="#fffbeb"
          sub={r.starter.l} />
        <KPICard icon="📉" label="Chute de tension" value={fmt(r.chosen?.dU, 2)} unit="%" color={r.chosen?.dU <= d.delta_U_max ? '#15803d' : '#dc2626'} bg={r.chosen?.dU <= d.delta_U_max ? '#f0fdf4' : '#fff1f2'}
          sub={`Au démarrage : ${fmt(r.chosen?.dUstart, 1)} %`} />
        <KPICard icon="🛡️" label="Protection" value={r.breaker} unit="A" color="#2563eb" bg="#eff6ff"
          sub={`Disjoncteur moteur, courbe ${r.starter.curve}`} />
      </div>

      {r.warnings.length > 0 && (
        <ProAlert type="warning" title="Points d'attention">
          <ul style={{ margin: 0, paddingLeft: 16 }}>{r.warnings.map(w => <li key={w}>{w}</li>)}</ul>
        </ProAlert>
      )}

      <ProCard>
        <SectionHead icon="🔬" title="Bilan de puissance" color="#475569" />
        <DetailRow label="Puissance hydraulique Ph" value={fmt(r.Ph)} unit="kW" />
        <DetailRow label="Puissance à l'arbre P2" hint="Ph / ηp" value={fmt(r.P2)} unit="kW" />
        <DetailRow label="P2 avec marge" value={fmt(r.P2_req)} unit="kW" />
        <DetailRow label="Puissance absorbée P1" hint="P2 / ηm" value={fmt(r.P1)} unit="kW" tone="accent" />
        <DetailRow label="Rendement global" value={fmt((d.eta_pump * d.eta_motor) / 100, 1)} unit="%" />
        <DetailRow label="Puissance apparente" value={fmt(r.P1 / d.pf)} unit="kVA" />
        <DetailRow label="Puissance réactive" value={fmt((r.P1 / d.pf) * r.sinphi)} unit="kvar" />
      </ProCard>

      <ProCard>
        <SectionHead icon="📋" title="Comparatif des sections" color="#ea580c" sub={`Iz corrigé ${d.install === 'buried' ? '' : `à ${d.ambient} °C `}· ΔU calculée à In`} />
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Section</th><th>Iz (A)</th><th>ΔU (%)</th><th>ΔU démarrage</th><th>Verdict</th></tr></thead>
            <tbody>
              {r.rows.filter(x => !r.chosen || (x.S >= r.chosen.S / 4 && x.S <= r.chosen.S * 3)).map(x => {
                const okI = x.Iz >= r.In, okU = x.dU <= d.delta_U_max;
                return (
                  <tr key={x.S} className={r.chosen?.S === x.S ? 'sel' : ''}>
                    <td>{String(x.S).replace('.', ',')} mm²</td>
                    <td style={{ color: okI ? undefined : '#dc2626' }}>{fmt(x.Iz, 0)}</td>
                    <td style={{ color: okU ? undefined : '#dc2626' }}>{fmt(x.dU, 2)}</td>
                    <td>{fmt(x.dUstart, 1)}</td>
                    <td>{okI && okU ? (r.chosen?.S === x.S ? '✅ Retenue' : '✓') : !okI ? '✗ Échauffement' : '✗ Chute U'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ProCard>

      <ProCard>
        <SectionHead icon="💰" title="Énergie & coût annuel" color="#0f766e" />
        <KPICard big label="Coût annuel d'énergie" value={fmt(r.costYear, 0)} unit={`${d.currency} / an`} color="#0f766e" bg="#f0fdfa"
          sub={`${fmt(r.costYear / 12, 0)} ${d.currency} / mois`} />
        <div style={{ marginTop: 10 }}>
          <DetailRow label="Consommation annuelle" hint={`${d.hours} h/j × ${d.days} j × ${fmt(r.P1)} kW`} value={fmt(r.kwhYear, 0)} unit="kWh" />
          <DetailRow label="Émissions estimées" hint={`Facteur réseau ${d.co2} g CO₂/kWh`} value={fmt(r.co2, 1)} unit="t CO₂/an" />
        </div>
        <p style={{ fontSize: '.74rem', color: '#64748b', marginTop: 10 }}>
          Un point de rendement moteur gagné (IE3 → IE4) économise environ <b>{fmt(r.kwhYear * (1 - d.eta_motor / (d.eta_motor + 1)), 0)} kWh/an</b>.
        </p>
      </ProCard>

      <p style={{ fontSize: '.7rem', color: '#94a3b8' }}>
        Valeurs indicatives (câbles PR/XLPE, 3 conducteurs chargés, sans facteur de groupement). Vérifier avec les données du fabricant et la norme applicable avant exécution.
      </p>
    </div>
  );

  return (
    <div className="fade-in stack" style={{ gap: 18 }}>
      <ModuleHeader icon="⚡" kicker="Électrotechnique" title="Moteur & Câblage" color="#f97316"
        desc="Moteur normalisé, courants, démarrage, section de câble, protection et coût énergétique — calcul instantané."
        tags={['IEC 60034', 'NF C 15-100', 'IEC 60364-5-52']} />
      <SubTabNav hidden={wide} active={tab} onChange={setTab}
        tabs={[{ id: 'config', label: '📝 Paramètres', color: 'orange' }, { id: 'results', label: '📊 Résultats', color: 'green' }]} />
      <div style={{ display: 'grid', gridTemplateColumns: wide ? SPLIT_COLS : '1fr', gap: 18, alignItems: 'start' }}>
        {(wide || tab === 'config') && form}
        {(wide || tab === 'results') && results}
      </div>
    </div>
  );
};

export default MotorCableCalculator;
