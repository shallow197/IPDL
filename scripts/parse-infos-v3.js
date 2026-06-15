#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('📖 Parsing infos with separator-based logic...\n');

const infosPath = path.join(__dirname, '../infos');
const content = fs.readFileSync(infosPath, 'utf8');

// Split by separator lines
const blocks = content.split(/\n_{10,}/);

const researchers = [];

blocks.forEach(block => {
  if (!block.trim()) return;

  const lines = block.split('\n').map(l => l.trim()).filter(l => l);
  if (lines.length < 3) return;

  // First line is name, second is title/role
  const name = lines[0];

  // Skip invalid names
  if (!name || name.length < 5 || name.length > 60 ||
      name.toLowerCase().includes('directeur') ||
      name.toLowerCase().includes('chercheur') ||
      name.toLowerCase().includes('doctorant')) {
    return;
  }

  const data = {
    name,
    themesDescription: '',
    projects: [],
    publications: []
  };

  let inPublications = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('Thème(s) :')) {
      data.themesDescription = line.split('Thème(s) :')[1].trim();
      inPublications = false;
    } else if (line.includes('Projets :')) {
      const proj = line.split('Projets :')[1].trim();
      if (proj && proj.length > 2) {
        data.projects.push(proj);
      }
      inPublications = false;
    } else if (line === 'Publications :' || line.startsWith('Publications :')) {
      inPublications = true;
    } else if (inPublications && line && !line.includes(':')) {
      data.publications.push(line);
    }
  }

  if (data.themesDescription) {
    researchers.push(data);
  }
});

console.log(`✅ Parsed ${researchers.length} researchers\n`);

// Show samples
const alassane = researchers.find(r => r.name === 'Alassane BAH');
if (alassane) {
  console.log(`✓ Alassane BAH: ${alassane.publications.length} publications`);
}

const ahmad = researchers.find(r => r.name === 'Ahmad FALL');
if (ahmad) {
  console.log(`✓ Ahmad FALL: ${ahmad.publications.length} publications`);
}

const alexis = researchers.find(r => r.name === 'Alexis DROGOUL');
if (alexis) {
  console.log(`✓ Alexis DROGOUL: ${alexis.publications.length} publications`);
}

// Save
fs.writeFileSync(
  path.join(__dirname, '../src/data/enrichment-data.json'),
  JSON.stringify(researchers, null, 2)
);

console.log(`\n📊 Summary:`);
console.log(`   Total: ${researchers.length}`);
console.log(`   With publications: ${researchers.filter(r => r.publications.length > 0).length}`);
console.log(`   Total publications: ${researchers.reduce((sum, r) => sum + r.publications.length, 0)}`);
