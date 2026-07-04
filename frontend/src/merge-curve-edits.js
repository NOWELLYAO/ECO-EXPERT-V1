#!/usr/bin/env node
/**
 * merge-curve-edits.js
 * ─────────────────────────────────────────────────────────────
 * Fusionne un fichier de corrections exporté depuis l'appli
 * ECO-PUMP AFRIK (bouton "📥 Exporter tout") directement dans
 * App.js, sans passer par Claude.
 *
 * Usage :
 *   node merge-curve-edits.js corrections.json src/App.js
 *
 * Ce que fait le script :
 *   - Pour chaque modèle corrigé (ex: "SP 77-8"), il identifie
 *     la famille (SP 77) et le nombre d'étages (8)
 *   - Il crée ou met à jour l'entrée correspondante dans la
 *     table DIRECT_CURVES_BY_FAMILY (SP) ou
 *     DIRECT_CURVES_BY_FAMILY_CR (CR) de App.js
 *   - Si la table de la famille (ex: SP77_DIRECT) n'existe pas
 *     encore, il la crée juste avant le tableau de mapping
 *   - Une sauvegarde App.js.bak est créée avant toute écriture
 *
 * Après exécution : vérifier avec `npx esbuild App.js --loader=jsx
 * --outfile=/dev/null` (ou simplement relancer le build) puis
 * commit + push comme d'habitude.
 * ─────────────────────────────────────────────────────────────
 */
const fs = require('fs');

const [,, editsPath, appPath] = process.argv;
if (!editsPath || !appPath) {
  console.error('Usage: node merge-curve-edits.js corrections.json App.js');
  process.exit(1);
}

const edits = JSON.parse(fs.readFileSync(editsPath, 'utf8'));
let src = fs.readFileSync(appPath, 'utf8');

// Sauvegarde
fs.writeFileSync(appPath + '.bak', src);
console.log('Sauvegarde créée :', appPath + '.bak');

function parseModel(model) {
  // "SP 77-8" -> {serie:'SP', family:'SP 77', stage:'8'}
  // "CR 64-5" -> {serie:'CR', family:'CR 64', stage:'5'}
  const m = model.match(/^(SP|CR)\s?([0-9A-Za-z]+)-(\d+)$/);
  if (!m) return null;
  const [, serie, famNum, stage] = m;
  return { serie, family: `${serie} ${famNum}`, famKey: `${serie}${famNum}_DIRECT`, stage };
}

let created = 0, updated = 0, skipped = 0;

for (const [model, pts] of Object.entries(edits)) {
  const info = parseModel(model);
  if (!info) { console.warn('⚠️  Modèle non reconnu, ignoré :', model); skipped++; continue; }
  const { serie, family, famKey, stage } = info;
  const ptsStr = pts.map(([q, h]) => `[${q},${h}]`).join(',');

  const constDeclRegex = new RegExp(`const ${famKey} = \\{([^}]*)\\};`, 's');
  const constMatch = src.match(constDeclRegex);

  if (constMatch) {
    // La table existe déjà : on met à jour ou on ajoute l'étage
    const body = constMatch[1];
    const stageRegex = new RegExp(`(['"]${stage}['"]\\s*:\\s*\\[)[^\\]]*(\\][^,]*,?)`, '');
    let newBody;
    if (stageRegex.test(body)) {
      newBody = body.replace(stageRegex, `$1${ptsStr}$2`);
      updated++;
    } else {
      newBody = body.trimEnd() + `\n  '${stage}': [${ptsStr}],`;
      created++;
    }
    src = src.replace(constDeclRegex, `const ${famKey} = {${newBody}\n};`);
  } else {
    // La table n'existe pas encore : on la crée juste avant le
    // tableau de correspondance DIRECT_CURVES_BY_FAMILY(_CR)
    const mapConstName = serie === 'SP' ? 'DIRECT_CURVES_BY_FAMILY' : 'DIRECT_CURVES_BY_FAMILY_CR';
    const mapRegex = new RegExp(`const ${mapConstName} = \\{`);
    if (!mapRegex.test(src)) {
      console.warn(`⚠️  Impossible de trouver ${mapConstName} pour insérer ${famKey}, ignoré.`);
      skipped++;
      continue;
    }
    const newConst = `const ${famKey} = {\n  '${stage}': [${ptsStr}],\n};\n`;
    src = src.replace(mapRegex, newConst + `const ${mapConstName} = {`);
    // Ajouter la référence dans le mapping si absente
    const mapBlockRegex = new RegExp(`(const ${mapConstName} = \\{)([^}]*)(\\};)`, 's');
    const mapBlock = src.match(mapBlockRegex);
    if (mapBlock && !mapBlock[2].includes(famKey)) {
      src = src.replace(mapBlockRegex, `$1$2  '${family}': ${famKey},\n$3`);
    }
    created++;
  }
}

fs.writeFileSync(appPath, src);
console.log(`\n✅ Terminé : ${created} entrée(s) créée(s), ${updated} mise(s) à jour, ${skipped} ignorée(s).`);
console.log('Vérifie la syntaxe avant de commit :');
console.log(`  npx esbuild ${appPath} --outfile=/dev/null --loader:.js=jsx`);
