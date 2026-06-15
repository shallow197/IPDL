#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔄 Integrating researcher data from infos file into ummiscoData.ts...\n');

// Read infos file
const infosPath = path.join(__dirname, '../infos');
const infosContent = fs.readFileSync(infosPath, 'utf8');

// Parse researchers from infos
const parsedResearchers = {};
const lines = infosContent.split('\n');

let currentName = null;
let currentData = {};
let inPublications = false;
let inBio = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // Detect new researcher (starts with capital letter, not empty, no special keywords)
  const isNewResearcher = trimmed &&
    !trimmed.includes(':') &&
    !trimmed.startsWith('_') &&
    trimmed.charAt(0) === trimmed.charAt(0).toUpperCase() &&
    trimmed.charAt(0).match(/[A-Z]/) &&
    !['Bio', 'Publications', 'Centre', 'Thème', 'Projets', 'Université', 'Email'].some(k => trimmed.startsWith(k));

  if (isNewResearcher && currentName && currentData.themesDescription) {
    parsedResearchers[currentName] = currentData;
    currentData = { themesDescription: '', projects: [], publications: [] };
    currentName = null;
    inPublications = false;
    inBio = false;
  }

  if (isNewResearcher) {
    currentName = trimmed;
    currentData = { name: trimmed, themesDescription: '', projects: [], publications: [] };
    inPublications = false;
    inBio = false;
  }

  if (currentName) {
    if (line.includes('Thème(s) :')) {
      currentData.themesDescription = line.split('Thème(s) :')[1].trim();
    } else if (line.includes('Projets :')) {
      const proj = line.split('Projets :')[1].trim();
      if (proj && proj !== 'Bio' && proj !== 'Publications') {
        currentData.projects = [proj];
      }
    } else if (line.includes('Publications :')) {
      inPublications = true;
      inBio = false;
    } else if (line.includes('Bio :')) {
      inBio = true;
      inPublications = false;
    } else if (inPublications && trimmed && !trimmed.includes(':') && trimmed !== 'Bio' && !trimmed.startsWith('_')) {
      if (trimmed.charAt(0).match(/[A-Z]/)) {
        currentData.publications.push(trimmed);
      }
    }
  }
}

if (currentName && currentData.themesDescription) {
  parsedResearchers[currentName] = currentData;
}

console.log(`✓ Parsed ${Object.keys(parsedResearchers).length} researchers from infos file`);

// Read ummiscoData.ts
const ummiscoPath = path.join(__dirname, '../src/data/ummiscoData.ts');
const ummiscoContent = fs.readFileSync(ummiscoPath, 'utf8');

// Count matches
let enrichedCount = 0;
const notFound = [];

// Generate enrichment patch
Object.entries(parsedResearchers).forEach(([name, data]) => {
  // Try to find exact match in ummiscoData
  const nameRegex = new RegExp(`name: "${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'i');

  if (ummiscoContent.match(nameRegex)) {
    enrichedCount++;
  } else {
    notFound.push(name);
  }
});

console.log(`\n📊 Enrichment Summary:`);
console.log(`   • Researchers found in ummiscoData: ${enrichedCount}/${Object.keys(parsedResearchers).length}`);
if (notFound.length > 0 && notFound.length <= 10) {
  console.log(`   • Not found: ${notFound.join(', ')}`);
}

console.log(`\n✅ Data ready to merge. Next: use Edit tool to update ummiscoData.ts`);

// Save mapping for reference
fs.writeFileSync(
  path.join(__dirname, '../researchers-enrichment-map.json'),
  JSON.stringify(parsedResearchers, null, 2)
);

console.log(`\n💾 Saved enrichment mapping to researchers-enrichment-map.json`);
