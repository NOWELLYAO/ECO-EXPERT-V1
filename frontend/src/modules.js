// ════════════════════════════════════════════════════════════════
// Registre central des modules — source unique pour la barre latérale,
// le tableau de bord, la palette de commandes et le routage par URL.
// ════════════════════════════════════════════════════════════════
export const MODULE_GROUPS = [
  { id: 'general', label: 'Général' },
  { id: 'hydraulic', label: 'Calculs hydrauliques' },
  { id: 'sizing', label: 'Dimensionnement' },
  { id: 'tools', label: 'Outils & références' },
  { id: 'data', label: 'Mes données' },
];

export const MODULES = [
  { id: 'home', icon: '🏠', label: 'Accueil', title: 'Tableau de bord', desc: "Vue d'ensemble, favoris et activité récente", group: 'general', color: '#14b8a6' },
  { id: 'npshd', icon: '🔷', label: 'NPSHd', title: 'Calcul NPSHd', desc: 'Net Positive Suction Head — prévention cavitation', group: 'hydraulic', color: '#3b82f6', keywords: 'cavitation aspiration npsh' },
  { id: 'hmt', icon: '🔶', label: 'HMT', title: 'Calcul HMT', desc: 'Hauteur Manométrique Totale et pertes de charge', group: 'hydraulic', color: '#10b981', keywords: 'hauteur manometrique pertes charge darcy' },
  { id: 'performance', icon: '📊', label: 'Performance', title: 'Performance', desc: 'Courbes de performance et point de fonctionnement', group: 'hydraulic', color: '#f59e0b', keywords: 'courbe rendement point' },
  { id: 'water_hammer', icon: '🌊', label: 'Coup de bélier', title: 'Coup de Bélier', desc: 'Analyse transitoire — surpressions Joukowsky', group: 'hydraulic', color: '#6366f1', keywords: 'belier joukowsky surpression transitoire' },
  { id: 'pump_selector', icon: '⚙️', label: 'Sélection pompe', title: 'Sélection Pompe', desc: 'Choisir la pompe adaptée à votre point de fonctionnement', group: 'sizing', color: '#14b8a6', keywords: 'pompe catalogue choix courbe' },
  { id: 'motor_cable', icon: '⚡', label: 'Moteur & câble', title: 'Moteur & Câblage', desc: 'Puissance absorbée et section de câble', group: 'sizing', color: '#f97316', keywords: 'moteur cable section chute tension' },
  { id: 'solar', icon: '☀️', label: 'Expert solaire', title: 'Expert Solaire', desc: 'Dimensionnement pompage photovoltaïque', group: 'sizing', color: '#eab308', keywords: 'solaire photovoltaique panneau pv' },
  { id: 'expert', icon: '🎯', label: 'Expert Pro', title: 'Expert Pro', desc: 'Analyse experte complète avec rapport PDF', group: 'sizing', color: '#ec4899', keywords: 'expert rapport pdf analyse' },
  { id: 'audit', icon: '🔧', label: 'Audit', title: 'Audit ISO 50001', desc: 'Audit hydraulique & énergétique complet', group: 'sizing', color: '#8b5cf6', keywords: 'audit energie iso 50001' },
  { id: 'converter', icon: '🔁', label: 'Convertisseur', title: "Convertisseur d'unités", desc: 'Débit, pression, puissance, vitesse… + outils rapides', group: 'tools', color: '#0ea5e9', keywords: 'conversion unite bar psi gpm kw hp', isNew: true },
  { id: 'drawing', icon: '📐', label: 'Dessin', title: 'Outil de Dessin', desc: "Schémas d'installation hydraulique", group: 'tools', color: '#64748b', keywords: 'schema dessin plan' },
  { id: 'formulas', icon: '📚', label: 'Formules', title: 'Base de Formules', desc: 'Bibliothèque des formules hydrauliques', group: 'tools', color: '#a855f7', keywords: 'formule bibliotheque reference' },
  { id: 'chemical_compatibility', icon: '🧪', label: 'Chimie', title: 'Compatibilité Chimique', desc: 'Compatibilité fluides / matériaux', group: 'tools', color: '#0891b2', keywords: 'chimique compatibilite materiau' },
  { id: 'history', icon: '📋', label: 'Historique', title: 'Historique & Projets', desc: 'Calculs sauvegardés, regroupés par projet', group: 'data', color: '#0f766e', keywords: 'historique projet client sauvegarde' },
];

export const MODULE_IDS = new Set(MODULES.map(m => m.id));
export const getModule = (id) => MODULES.find(m => m.id === id) || MODULES[0];

export const CALC_TYPE_LABELS = {
  npshd: { icon: '🔷', label: 'NPSHd', color: '#3b82f6' },
  hmt: { icon: '🔶', label: 'HMT', color: '#10b981' },
  performance: { icon: '📊', label: 'Performance', color: '#f59e0b' },
  expert: { icon: '🎯', label: 'Expert', color: '#ec4899' },
  solar: { icon: '☀️', label: 'Solaire', color: '#eab308' },
};
export const calcTypeLabel = (t) => {
  const c = CALC_TYPE_LABELS[t];
  return c ? `${c.icon} ${c.label}` : t;
};

// Recherche tolérante : sans accents, insensible à la casse
export const normalize = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const matchModule = (m, q) => {
  const n = normalize(q).trim();
  if (!n) return true;
  const hay = normalize(`${m.label} ${m.title} ${m.desc} ${m.keywords || ''}`);
  return n.split(/\s+/).every(w => hay.includes(w));
};
