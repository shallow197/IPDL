#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('📖 Parsing infos file with improved logic...\n');

const infosPath = path.join(__dirname, '../infos');
const content = fs.readFileSync(infosPath, 'utf8');

const researchers = [];
const lines = content.split('\n');

let i = 0;
while (i < lines.length) {
  const line = lines[i].trim();

  // Skip empty lines and separators
  if (!line || line.startsWith('_')) {
    i++;
    continue;
  }

  // Check if this looks like a researcher name (has at least one space and starts with uppercase)
  const hasSpace = line.includes(' ');
  const startsWithUpper = line.charAt(0) === line.charAt(0).toUpperCase();
  const noColon = !line.includes(':');
  const isReasonableLength = line.length > 5 && line.length < 60;

  if (hasSpace && startsWithUpper && noColon && isReasonableLength) {
    // This is a researcher name
    const data = {
      name: line,
      themesDescription: '',
      projects: [],
      publications: []
    };

    // Read next lines until we hit another researcher or end of file
    i++;
    let inPublications = false;
    let inBio = false;

    while (i < lines.length) {
      const nextLine = lines[i];
      const nextTrimmed = nextLine.trim();

      // Check if this is a new researcher (should have space, start upper, no colon, reasonable length)
      if (nextTrimmed && nextTrimmed.includes(' ') &&
          nextTrimmed.charAt(0) === nextTrimmed.charAt(0).toUpperCase() &&
          !nextTrimmed.includes(':') &&
          nextTrimmed.length > 5 && nextTrimmed.length < 60 &&
          nextLine.startsWith(nextTrimmed.charAt(0))) {
        // This is next researcher - break
        break;
      }

      if (nextTrimmed.includes('Thème(s) :')) {
        data.themesDescription = nextTrimmed.split('Thème(s) :')[1].trim();
        inPublications = false;
        inBio = false;
      } else if (nextTrimmed.includes('Projets :')) {
        const proj = nextTrimmed.split('Projets :')[1].trim();
        if (proj && proj.length > 2) {
          data.projects.push(proj);
        }
        inPublications = false;
        inBio = false;
      } else if (nextTrimmed.includes('Publications :')) {
        inPublications = true;
        inBio = false;
      } else if (nextTrimmed.includes('Bio :')) {
        inBio = true;
        inPublications = false;
      } else if (inPublications && nextTrimmed && !nextTrimmed.includes(':') &&
                 nextTrimmed.length > 5 && nextTrimmed[0] === nextTrimmed[0].toUpperCase()) {
        // Publication title
        data.publications.push(nextTrimmed);
      } else if (inBio && nextTrimmed && !nextTrimmed.includes(':') && nextTrimmed.length > 3) {
        // Skip if it looks like a role (Directeur, Chercheur, etc at start)
        if (!['Directeur', 'Chercheur', 'Responsable', 'Doctorant', 'Emérite', 'Ingénieur', 'Personnel', 'Maître'].some(r => nextTrimmed.startsWith(r))) {
          inBio = false;
        }
      }

      i++;
    }

    // Only add if we have themes (sign of valid researcher)
    if (data.themesDescription) {
      researchers.push(data);
    }
  } else {
    i++;
  }
}

console.log(`✅ Parsed ${researchers.length} researchers\n`);

// Save
const jsonPath = path.join(__dirname, '../src/data/enrichment-data.json');
fs.writeFileSync(jsonPath, JSON.stringify(researchers, null, 2), 'utf8');

const tsPath = path.join(__dirname, '../src/data/enrichment-data.ts');
const tsOutput = `// Auto-generated from infos file\nexport const ENRICHMENT_DATA = ${JSON.stringify(researchers, null, 2)};\n`;
fs.writeFileSync(tsPath, tsOutput, 'utf8');

console.log(`✅ Saved enrichment data`);
console.log(`\n📊 Summary:`);
console.log(`   Total: ${researchers.length}`);
console.log(`   With themes: ${researchers.filter(r => r.themesDescription).length}`);
console.log(`   With projects: ${researchers.filter(r => r.projects.length > 0).length}`);
console.log(`   With publications: ${researchers.filter(r => r.publications.length > 0).length}`);

// Show sample
const sample = researchers.find(r => r.name.includes('Alassane'));
if (sample) {
  console.log(`\nSample (${sample.name}):`);
  console.log(`   Themes: ${sample.themesDescription.substring(0, 80)}...`);
  console.log(`   Projects: ${sample.projects.length}`);
  console.log(`   Publications: ${sample.publications.length}`);
}
