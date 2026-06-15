#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('📖 Parsing infos file to extract all researcher data...\n');

const infosPath = path.join(__dirname, '../infos');
const content = fs.readFileSync(infosPath, 'utf8');

const researchers = [];
const blocks = content.split(/\n(?=[A-Z][a-z\s]+ [A-Z])/);

blocks.forEach(block => {
  if (!block.trim()) return;

  const lines = block.split('\n');
  const name = lines[0].trim();

  if (!name || name.length < 3) return;

  const data = {
    name,
    themesDescription: '',
    projects: [],
    publications: []
  };

  let inPublications = false;
  let inBio = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (line.includes('Thème(s) :')) {
      data.themesDescription = line.split('Thème(s) :')[1].trim();
    } else if (line.includes('Projets :')) {
      const proj = line.split('Projets :')[1].trim();
      if (proj && proj.length > 1) {
        data.projects.push(proj);
      }
    } else if (line.includes('Publications :')) {
      inPublications = true;
      inBio = false;
    } else if (line.includes('Bio :')) {
      inPublications = false;
      inBio = true;
    } else if (inPublications && trimmed && !line.includes(':') && trimmed.length > 5) {
      // Avoid noise - only if line starts with capital and is reasonable length
      if (trimmed[0] === trimmed[0].toUpperCase()) {
        data.publications.push(trimmed);
      }
    }
  }

  if (data.themesDescription) {
    researchers.push(data);
  }
});

console.log(`✅ Extracted ${researchers.length} researchers\n`);

// Show sample
if (researchers.length > 0) {
  console.log('Sample (Alassane BAH):');
  const sample = researchers.find(r => r.name.includes('Alassane'));
  if (sample) {
    console.log(`  Name: ${sample.name}`);
    console.log(`  Themes: ${sample.themesDescription.substring(0, 100)}...`);
    console.log(`  Projects: ${sample.projects.length}`);
    console.log(`  Publications: ${sample.publications.length}`);
  }
}

// Save as JSON for use in TypeScript
const jsonPath = path.join(__dirname, '../src/data/enrichment-data.json');
fs.writeFileSync(jsonPath, JSON.stringify(researchers, null, 2), 'utf8');
console.log(`\n💾 Saved to src/data/enrichment-data.json`);

// Also generate TypeScript array
const tsOutput = `// Auto-generated enrichment data from infos file
export const ENRICHMENT_DATA = ${JSON.stringify(researchers, null, 2)};
`;

const tsPath = path.join(__dirname, '../src/data/enrichment-data.ts');
fs.writeFileSync(tsPath, tsOutput, 'utf8');
console.log(`✅ Saved TypeScript version to src/data/enrichment-data.ts`);

console.log(`\n📊 Data Summary:`);
console.log(`   Total researchers: ${researchers.length}`);
console.log(`   With themes: ${researchers.filter(r => r.themesDescription).length}`);
console.log(`   With projects: ${researchers.filter(r => r.projects.length > 0).length}`);
console.log(`   With publications: ${researchers.filter(r => r.publications.length > 0).length}`);
