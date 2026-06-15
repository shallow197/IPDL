#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('📖 Parsing infos file correctly...\n');

const infosPath = path.join(__dirname, '../infos');
const content = fs.readFileSync(infosPath, 'utf8');

const researchers = [];
const lines = content.split('\n');

let i = 0;
while (i < lines.length) {
  const line = lines[i].trim();

  // Skip empty and separator lines
  if (!line || line.startsWith('_')) {
    i++;
    continue;
  }

  // Detect researcher by: has space, starts with capital, no colon, reasonable length
  if (line.includes(' ') && line[0] === line[0].toUpperCase() &&
      !line.includes(':') && line.length > 5 && line.length < 60) {

    const name = line;
    const data = {
      name,
      themesDescription: '',
      projects: [],
      publications: []
    };

    i++;
    let inPublications = false;

    // Read until next researcher
    while (i < lines.length) {
      const nextLine = lines[i];
      const nextTrimmed = nextLine.trim();

      // Check if this is next researcher name
      if (nextTrimmed && nextTrimmed.includes(' ') &&
          nextTrimmed[0] === nextTrimmed[0].toUpperCase() &&
          !nextTrimmed.includes(':') &&
          nextTrimmed.length > 5 && nextTrimmed.length < 60 &&
          !nextLine.startsWith('\t') && !nextLine.startsWith('  ')) {
        break;
      }

      if (nextTrimmed.includes('Thème(s) :')) {
        data.themesDescription = nextTrimmed.split('Thème(s) :')[1].trim();
        inPublications = false;
      } else if (nextTrimmed.includes('Projets :')) {
        const proj = nextTrimmed.split('Projets :')[1].trim();
        if (proj && proj.length > 2) {
          data.projects.push(proj);
        }
        inPublications = false;
      } else if (nextTrimmed === 'Publications :') {
        inPublications = true;
      } else if (inPublications) {
        // Line is indented (tab or spaces) and is a publication
        if ((nextLine.startsWith('\t') || nextLine.startsWith('  ')) && nextTrimmed) {
          data.publications.push(nextTrimmed);
        }
        // If line is NOT indented and not empty, we're out of publications
        else if (nextTrimmed && !nextLine.startsWith('\t') && !nextLine.startsWith('  ')) {
          inPublications = false;
        }
      }

      i++;
    }

    // Only add if has themes
    if (data.themesDescription) {
      researchers.push(data);
    }
  } else {
    i++;
  }
}

console.log(`✅ Parsed ${researchers.length} researchers\n`);

// Show samples
const alassane = researchers.find(r => r.name === 'Alassane BAH');
if (alassane) {
  console.log(`Alassane BAH:`);
  console.log(`  Publications: ${alassane.publications.length}`);
  alassane.publications.slice(0, 3).forEach(p => console.log(`    - ${p.substring(0, 60)}...`));
}

const ahmad = researchers.find(r => r.name === 'Ahmad FALL');
if (ahmad) {
  console.log(`\nAhmad FALL:`);
  console.log(`  Publications: ${ahmad.publications.length}`);
}

// Save
fs.writeFileSync(
  path.join(__dirname, '../src/data/enrichment-data.json'),
  JSON.stringify(researchers, null, 2)
);

console.log(`\n💾 Saved to enrichment-data.json`);
console.log(`\n📊 Summary:`);
console.log(`   With publications: ${researchers.filter(r => r.publications.length > 0).length}`);
console.log(`   Total publications: ${researchers.reduce((sum, r) => sum + r.publications.length, 0)}`);
