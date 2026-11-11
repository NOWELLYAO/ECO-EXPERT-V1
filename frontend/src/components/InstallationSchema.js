import React from 'react';

// ════════════════════════════════════════════════════════════════
// SCHÉMA D'INSTALLATION (vue en élévation) — module Expert Pro
// Réservoir d'aspiration, pompe + moteur, accessoires normalisés
// (vanne, clapet, crépine, manomètre), réservoir de refoulement,
// cotes de hauteur et panneau de synthèse. Le dessin n'est pas à
// l'échelle : les hauteurs sont proportionnées pour rester lisibles.
// ════════════════════════════════════════════════════════════════

const FLUID_PROPS = {
  water: { d0: 1000, dD: -0.2, v0: 0.001, dV: -0.00005, vp0: 2340, dVp: 100 },
  seawater: { d0: 1025, dD: -0.25, v0: 0.00107, dV: -0.000052, vp0: 2280, dVp: 95 },
  oil: { d0: 850, dD: -0.7, v0: 0.05, dV: -0.002, vp0: 100, dVp: 20 },
  diesel: { d0: 840, dD: -0.75, v0: 0.0035, dV: -0.00012, vp0: 300, dVp: 25 },
  gasoline: { d0: 740, dD: -0.9, v0: 0.00055, dV: -0.000015, vp0: 13000, dVp: 850 },
  glycol: { d0: 1113, dD: -0.8, v0: 0.0161, dV: -0.0008, vp0: 10, dVp: 5 },
};

const C = {
  ink: '#0f172a', slate: '#475569', muted: '#94a3b8', line: '#e2e8f0',
  pipe: '#334155', suction: '#0d9488', water: '#3b82f6', waterDark: '#1d4ed8',
  ok: '#16a34a', warn: '#d97706', bad: '#dc2626', accent: '#0f766e',
};

const n = (v, d = 2) => (v === undefined || v === null || !isFinite(v)) ? '—' : Number(v).toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });

// ── Symboles normalisés (ISO 14617) ──
const GateValve = ({ x, y, vertical }) => (
  <g transform={`translate(${x},${y}) ${vertical ? 'rotate(90)' : ''}`}>
    <path d="M-11 -8 L11 8 L11 -8 L-11 8 Z" fill="white" stroke={C.ink} strokeWidth="1.8" strokeLinejoin="round" />
    <line x1="0" y1="0" x2="0" y2="-16" stroke={C.ink} strokeWidth="1.8" />
    <line x1="-6" y1="-16" x2="6" y2="-16" stroke={C.ink} strokeWidth="2.2" />
  </g>
);
const CheckValve = ({ x, y, vertical }) => (
  <g transform={`translate(${x},${y}) ${vertical ? 'rotate(-90)' : ''}`}>
    <path d="M-11 -8 L11 8 L11 -8 L-11 8 Z" fill="white" stroke={C.ink} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M-11 -8 L0 0 L-11 8 Z" fill={C.ink} />
  </g>
);
const Gauge = ({ x, y }) => (
  <g>
    <line x1={x} y1={y} x2={x} y2={y - 24} stroke={C.ink} strokeWidth="1.6" />
    <circle cx={x} cy={y - 36} r="11" fill="white" stroke={C.ink} strokeWidth="1.8" />
    <line x1={x} y1={y - 36} x2={x + 6} y2={y - 42} stroke={C.bad} strokeWidth="1.8" strokeLinecap="round" />
  </g>
);
const Strainer = ({ x, y, foot }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x="-10" y="0" width="20" height="18" rx="2" fill="white" stroke={C.ink} strokeWidth="1.6" />
    {[4, 9, 14].map(yy => <line key={yy} x1="-10" y1={yy} x2="10" y2={yy} stroke={C.ink} strokeWidth="1" />)}
    {foot && <path d="M-7 -6 L7 -6 L0 -1 Z" fill={C.ink} />}
  </g>
);
const FlowArrow = ({ x, y, dir = 'right' }) => {
  const rot = { right: 0, left: 180, up: -90, down: 90 }[dir];
  return <path transform={`translate(${x},${y}) rotate(${rot})`} d="M-7 -6 L7 0 L-7 6 Z" fill={C.water} />;
};
const Dim = ({ x, y1, y2, label, sub, color = C.slate, side = 'left' }) => {
  const mid = (y1 + y2) / 2, tx = side === 'left' ? x - 10 : x + 10, anchor = side === 'left' ? 'end' : 'start';
  return (
    <g>
      <line x1={x - 7} y1={y1} x2={x + 7} y2={y1} stroke={color} strokeWidth="1.4" />
      <line x1={x - 7} y1={y2} x2={x + 7} y2={y2} stroke={color} strokeWidth="1.4" />
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth="1.4" markerStart="url(#is-dim)" markerEnd="url(#is-dim)" />
      <text x={tx} y={mid - 2} textAnchor={anchor} fontSize="14" fontWeight="800" fill={color}>{label}</text>
      {sub && <text x={tx} y={mid + 13} textAnchor={anchor} fontSize="10" fontWeight="600" fill={C.muted}>{sub}</text>}
    </g>
  );
};

const fittingsText = (d, side) => {
  const map = [
    ['elbow_90', 'coude 90°'], ['elbow_45', 'coude 45°'], ['elbow_30', 'coude 30°'],
    ['gate_valve', 'vanne'], ['ball_valve', 'vanne ¼ tour'], ['butterfly_valve', 'vanne papillon'], ['globe_valve', 'robinet'],
    ['check_valve', 'clapet'], ['foot_valve', 'clapet de pied'], ['strainer', 'crépine'],
    ['tee_flow', 'té'], ['tee_branch', 'té dérivé'], ['reducer_gradual', 'réduction'], ['enlarger_gradual', 'élargissement'],
    ['flow_meter', 'débitmètre'], ['pressure_gauge', 'manomètre'],
  ];
  const plural = (l) => l.replace(/^(\S+)/, (w) => (w.endsWith('s') ? w : w + 's'));
  return map.map(([k, l]) => { const q = Number(d[`${side}_${k}`]) || 0; return q > 0 ? `${q} ${q > 1 ? plural(l) : l}` : null; }).filter(Boolean).join(' · ');
};

const InstallationSchema = ({ inputData: d, results, fluids }) => {
  const flooded = d.suction_type === 'flooded';
  const Hs = Math.abs(Number(d.suction_height) || 0);
  const Hd = Math.max(Number(d.discharge_height) || 0, 0);
  const Q = Number(d.flow_rate) || 0;
  const vel = (D) => D > 0 ? (Q / 3600) / (Math.PI * Math.pow(D / 1000, 2) / 4) : NaN;
  const vS = vel(d.suction_pipe_diameter), vD = vel(d.discharge_pipe_diameter);

  const fp = FLUID_PROPS[d.fluid_type] || FLUID_PROPS.water;
  const dT = (Number(d.temperature) || 20) - 20;
  const rho = Math.max(fp.d0 + fp.dD * dT, 500);
  const pv = Math.max(fp.vp0 + fp.dVp * dT, 1) / 1000;
  const fluidName = fluids?.find(f => f.id === d.fluid_type)?.name || 'Fluide';

  const npsh = results?.npshd_analysis;
  const cav = !!npsh?.cavitation_risk;
  const hmt = results?.hmt_analysis?.hmt;
  const lossS = npsh?.total_head_loss, lossD = results?.hmt_analysis?.total_head_loss;
  const status = cav ? ['Risque de cavitation', C.bad, '#fef2f2'] : (npsh?.npsh_margin ?? 1) < 0.5 ? ['Marge NPSH faible', C.warn, '#fffbeb'] : ['Installation sécurisée', C.ok, '#f0fdf4'];

  // ── Altitudes → ordonnées (non à l'échelle, séparations minimales garanties)
  const W = 1200, H = 660;
  const yTop = 200, yBot = 520;
  const zW = flooded ? Hs : -Hs, zO = Hd;
  const zMax = Math.max(zW, zO, 0), zMin = Math.min(zW, 0);
  const span = Math.max(zMax - zMin, 1);
  const yOf = z => yBot - ((z - zMin) / span) * (yBot - yTop);
  let yP = yOf(0), yW = yOf(zW), yO = yOf(zO);
  if (flooded && yP - yW < 90) yW = yP - 90;
  if (!flooded && yW - yP < 110) yW = yP + 110;
  if (!flooded && yW > 520) { const k = yW - 520; yP -= k; yO -= k; yW = 520; }
  if (yP - yO < 140) yO = Math.max(yP - 140, 110);
  yO = Math.max(yO, 110);
  const groundY = yP + 52;

  const pumpX = 440, pumpR = 30;
  const inX = pumpX - pumpR, outX = pumpX + pumpR;
  const riserX = 690;
  const tank = flooded
    ? { x: 110, y: yW - 28, w: 170, h: Math.max(70, (yP - 22) - (yW - 28)) }
    : { x: 110, y: yW - 34, w: 190, h: 120 };
  const sw = Math.min(Math.max((d.suction_pipe_diameter || 100) / 10, 7), 14);
  const dw = Math.min(Math.max((d.discharge_pipe_diameter || 80) / 10, 6), 13);

  // Tracé aspiration
  const suctionPath = flooded
    ? `M ${tank.x + tank.w} ${tank.y + tank.h - 16} L 350 ${tank.y + tank.h - 16} L 350 ${yP} L ${inX} ${yP}`
    : `M 240 ${yW + 52} L 240 ${yP} L ${inX} ${yP}`;
  const fitS = fittingsText(d, 'suction'), fitD = fittingsText(d, 'discharge');

  // Panneau de synthèse
  const panelX = 900, panelW = 280;
  const rows = [
    ['Fluide', [['Nature', fluidName], ['Température', `${n(d.temperature, 0)} °C`], ['ρ', `${n(rho, 0)} kg/m³`], ['Pv', `${n(pv, 1)} kPa`]]],
    ['Hydraulique', [['Débit', `${n(Q, 1)} m³/h · ${n(Q / 3600, 4)} m³/s`], ['HMT', `${n(hmt)} m`], ['NPSHd', `${n(npsh?.npshd)} m`], ['NPSHr', `${n(Number(d.npsh_required), 2)} m`], ['Marge NPSH', `${n(npsh?.npsh_margin)} m`]]],
    ['Pertes de charge', [['Aspiration', `${n(lossS)} m`], ['Refoulement', `${n(lossD)} m`], ['Totales', `${n(results?.total_head_loss)} m`]]],
    ['Performance', [['η global', `${n(results?.overall_efficiency, 1)} %`], ['P hydraulique', `${n(results?.performance_analysis?.hydraulic_power, 2)} kW`], ['η pompe · moteur', `${n(d.pump_efficiency, 0)} % · ${n(d.motor_efficiency, 0)} %`]]],
  ];
  let py = 96;
  const panel = rows.map(([title, items]) => { const y = py; py += 28 + items.length * 19 + 14; return { title, items, y }; });

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Schéma d'installation"
      style={{ fontFamily: "'Inter','Segoe UI',sans-serif", display: 'block', background: 'white', borderRadius: 16, border: `1px solid ${C.line}` }}>
      <defs>
        <pattern id="is-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#f1f5f9" strokeWidth="1" /></pattern>
        <pattern id="is-ground" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="10" stroke="#cbd5e1" strokeWidth="3" /></pattern>
        <linearGradient id="is-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#93c5fd" /><stop offset="1" stopColor="#2563eb" /></linearGradient>
        <linearGradient id="is-pump" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#14b8a6" /><stop offset="1" stopColor="#0f766e" /></linearGradient>
        <marker id="is-dim" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L10 5 L0 9 Z" fill={C.slate} /></marker>
      </defs>
      <rect width={W} height={H} fill="url(#is-grid)" />

      {/* Cartouche */}
      <text x="28" y="40" fontSize="11" fontWeight="800" fill={C.muted} letterSpacing="1.6">SCHÉMA D'INSTALLATION — VUE EN ÉLÉVATION</text>
      <text x="28" y="64" fontSize="20" fontWeight="800" fill={C.ink}>{flooded ? 'Pompe en charge' : 'Pompe en aspiration'} · {d.installation_type === 'submersible' ? 'immergée' : 'de surface'}</text>
      <text x="28" y="84" fontSize="12" fill={C.slate}>{flooded ? 'Le niveau d\'eau est au-dessus de l\'axe de la pompe (alimentation gravitaire).' : 'La pompe aspire au-dessus du plan d\'eau (dépression à l\'aspiration).'}</text>

      {/* Sol */}
      <rect x="290" y={groundY} width={panelX - 310} height="14" fill="url(#is-ground)" />
      <line x1="290" y1={groundY} x2={panelX - 20} y2={groundY} stroke="#94a3b8" strokeWidth="1.5" />
      {/* Socle pompe */}
      <rect x={pumpX - 52} y={yP + pumpR + 4} width="104" height={groundY - (yP + pumpR + 4)} fill="#e2e8f0" stroke="#94a3b8" />

      {/* Réservoir d'aspiration */}
      {!flooded && <rect x={tank.x - 18} y={yP + 52} width={tank.w + 36} height={H - yP - 70} fill="url(#is-ground)" opacity=".5" />}
      <rect x={tank.x} y={tank.y} width={tank.w} height={tank.h} rx="8" fill="#f8fafc" stroke={C.pipe} strokeWidth="2.5" />
      <rect x={tank.x + 4} y={yW} width={tank.w - 8} height={tank.y + tank.h - yW - 4} rx="4" fill="url(#is-water)" opacity=".9" />
      <path d={`M ${tank.x + 4} ${yW} q 15 -5 30 0` + ' t 30 0'.repeat(Math.max(0, Math.floor((tank.w - 8) / 30) - 1))} fill="none" stroke={C.waterDark} strokeWidth="2" />
      <path d={`M ${tank.x + tank.w - 30} ${yW - 12} l 6 8 l 6 -8 z`} fill={C.waterDark} />
      <text x={flooded ? tank.x + tank.w / 2 : tank.x + 60} y={flooded ? tank.y - 12 : tank.y + tank.h + 18} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={C.ink}>{flooded ? 'Bâche / réservoir' : 'Puits / bâche'}</text>

      {/* Conduite d'aspiration */}
      <path d={suctionPath} fill="none" stroke={C.suction} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" />
      {flooded
        ? <><GateValve x={312} y={tank.y + tank.h - 16} /><FlowArrow x={350} y={(tank.y + tank.h - 16 + yP) / 2} dir="down" /><FlowArrow x={385} y={yP} /></>
        : <><Strainer x={240} y={yW + 52} foot={Number(d.suction_foot_valve) > 0 || Number(d.suction_check_valve) > 0} /><FlowArrow x={240} y={(yW + yP) / 2} dir="up" /><FlowArrow x={340} y={yP} /></>}

      {/* Pompe + moteur */}
      <rect x={pumpX - 22} y={yP - pumpR - 54} width="44" height="40" rx="6" fill="#f1f5f9" stroke={C.pipe} strokeWidth="2" />
      <text x={pumpX} y={yP - pumpR - 29} textAnchor="middle" fontSize="15" fontWeight="900" fill={C.ink}>M</text>
      <line x1={pumpX} y1={yP - pumpR - 14} x2={pumpX} y2={yP - pumpR} stroke={C.pipe} strokeWidth="5" />
      <circle cx={pumpX} cy={yP} r={pumpR} fill="url(#is-pump)" stroke="#115e59" strokeWidth="2.5" />
      <path d={`M ${pumpX - 14} ${yP - 18} L ${pumpX + 20} ${yP} L ${pumpX - 14} ${yP + 18} Z`} fill="white" opacity=".95" />
      <text x={pumpX} y={yP - pumpR - 64} textAnchor="middle" fontSize="11" fontWeight="800" fill={C.accent}>POMPE · η {n(d.pump_efficiency, 0)} %</text>

      {/* Conduite de refoulement */}
      <path d={`M ${outX} ${yP} L ${riserX} ${yP} L ${riserX} ${yO} L ${riserX + 70} ${yO}`} fill="none" stroke={C.pipe} strokeWidth={dw} strokeLinejoin="round" strokeLinecap="round" />
      {Number(d.discharge_pressure_gauge) > 0 && <Gauge x={500} y={yP - dw / 2} />}
      {Number(d.discharge_check_valve) > 0 && <CheckValve x={545} y={yP} />}
      {(Number(d.discharge_gate_valve) > 0 || Number(d.discharge_butterfly_valve) > 0 || Number(d.discharge_ball_valve) > 0) && <GateValve x={600} y={yP} />}
      <FlowArrow x={650} y={yP} />
      <FlowArrow x={riserX} y={(yP + yO) / 2 + 30} dir="up" />

      {/* Repères des conduites (sous le sol, sans chevauchement) */}
      <g>
        <rect x="28" y="108" width="12" height="12" rx="3" fill={C.suction} />
        <text x="48" y="118" fontSize="11" fontWeight="800" fill={C.suction}>ASPIRATION · Ø {n(d.suction_pipe_diameter, 0)} mm · L {n(Number(d.suction_length), 0)} m · v {n(vS)} m/s</text>
        {fitS && <text x="48" y="133" fontSize="10" fill={C.slate}>{fitS}</text>}
        <rect x="28" y="146" width="12" height="12" rx="3" fill={C.pipe} />
        <text x="48" y="156" fontSize="11" fontWeight="800" fill={C.pipe}>REFOULEMENT · Ø {n(d.discharge_pipe_diameter, 0)} mm · L {n(Number(d.discharge_length), 0)} m · v {n(vD)} m/s</text>
        {fitD && <text x="48" y="171" fontSize="10" fill={C.slate}>{fitD}</text>}
      </g>

      {/* Réservoir de refoulement */}
      <rect x={riserX + 40} y={yO - 6} width="120" height="86" rx="8" fill="#f8fafc" stroke={C.pipe} strokeWidth="2.5" />
      <rect x={riserX + 44} y={yO + 26} width="112" height="50" rx="4" fill="url(#is-water)" opacity=".85" />
      <path d={`M ${riserX + 76} ${yO + 2} q 0 12 4 22`} fill="none" stroke={C.water} strokeWidth="3" strokeDasharray="4 4" />
      <text x={riserX + 100} y={yO - 16} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={C.ink}>Point de livraison</text>
      {Number(d.useful_pressure) > 0 && <text x={riserX + 100} y={yO + 98} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.slate}>Pression utile {n(Number(d.useful_pressure), 1)} bar</text>}

      {/* Cotes */}
      <line x1={tank.x} y1={yW} x2="70" y2={yW} stroke={C.muted} strokeDasharray="4 4" />
      <line x1={flooded ? 350 : 240} y1={yP} x2="70" y2={yP} stroke={C.muted} strokeDasharray="4 4" opacity=".6" />
      <Dim x={82} y1={Math.min(yW, yP)} y2={Math.max(yW, yP)} side="left" color={flooded ? C.ok : C.warn}
        label={`${n(Hs, 1)} m`} sub={flooded ? 'charge' : 'aspiration'} />
      <line x1={riserX} y1={yO} x2={riserX - 40} y2={yO} stroke={C.muted} strokeDasharray="4 4" />
      <Dim x={riserX - 30} y1={yO} y2={yP} side="left" label={`${n(Hd, 1)} m`} sub="refoulement" />
      {hmt != null && (
        <g>
          <rect x={pumpX + 62} y={yP - pumpR - 74} width="104" height="40" rx="10" fill={C.ink} />
          <text x={pumpX + 114} y={yP - pumpR - 58} textAnchor="middle" fontSize="10" fontWeight="700" fill="#94a3b8">HMT</text>
          <text x={pumpX + 114} y={yP - pumpR - 42} textAnchor="middle" fontSize="14" fontWeight="800" fill="#5eead4">{n(hmt, 1)} m</text>
        </g>
      )}

      {/* Panneau de synthèse */}
      <rect x={panelX} y="20" width={panelW} height={H - 40} rx="16" fill="#f8fafc" stroke={C.line} />
      <rect x={panelX + 12} y="32" width={panelW - 24} height="46" rx="11" fill={status[2]} stroke={status[1]} />
      <circle cx={panelX + 34} cy="55" r="10" fill={status[1]} />
      <text x={panelX + 34} y="59" textAnchor="middle" fontSize="12" fontWeight="900" fill="white">{cav ? '!' : '✓'}</text>
      <text x={panelX + 52} y="60" fontSize="13" fontWeight="800" fill={status[1]}>{status[0]}</text>
      {panel.map(({ title, items, y }) => (
        <g key={title}>
          <text x={panelX + 18} y={y + 16} fontSize="10.5" fontWeight="800" fill={C.muted} letterSpacing="1.2">{title.toUpperCase()}</text>
          {items.map(([k, val], i) => (
            <g key={k}>
              <text x={panelX + 18} y={y + 38 + i * 19} fontSize="11.5" fill={C.slate}>{k}</text>
              <text x={panelX + panelW - 18} y={y + 38 + i * 19} textAnchor="end" fontSize="11.5" fontWeight="700" fill={C.ink}>{val}</text>
            </g>
          ))}
        </g>
      ))}
      <text x={panelX + 18} y={H - 34} fontSize="9.5" fill={C.muted}>Schéma de principe — non à l'échelle.</text>
      {(d.engineer_name || d.company_name) && <text x={panelX + panelW - 18} y={H - 34} textAnchor="end" fontSize="9.5" fill={C.muted}>{[d.engineer_firstname, d.engineer_name].filter(Boolean).join(' ')}{d.company_name ? ` · ${d.company_name}` : ''}</text>}
    </svg>
  );
};

export default InstallationSchema;
