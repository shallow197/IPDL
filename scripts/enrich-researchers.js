#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('✨ Enriching researchers in ummiscoData.ts...\n');

const enrichmentData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/enrichment-data.json'), 'utf8')
);

let ummiscoContent = fs.readFileSync(
  path.join(__dirname, '../src/data/ummiscoData.ts'), 'utf8'
);

let updatedCount = 0;

// For each enrichment entry
enrichmentData.forEach(enrichData => {
  const name = enrichData.name
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape regex chars
    .replace(/&rsquo;/g, "'"); // Handle HTML entities

  // Find this researcher in ummiscoData
  const regex = new RegExp(`(\\{[^}]*\\bname: "${name}"[^}]*?)(\\},)`, 's');
  const match = ummiscoContent.match(regex);

  if (match) {
    let entry = match[0];

    // Build enrichment fields
    let toAdd = '';

    // Theme
    if (!entry.includes('themesDescription') && enrichData.themesDescription) {
      toAdd += `,\n    themesDescription: "${enrichData.themesDescription.replace(/"/g, '\\"')}"`;
    }

    // Projects
    if (!entry.includes('projects') && enrichData.projects?.length > 0) {
      toAdd += `,\n    projects: [${enrichData.projects.map(p =>
        `"${p.replace(/"/g, '\\"')}"`).join(', ')}]`;
    }

    // Publications
    if (!entry.includes('publications') && enrichData.publications?.length > 0) {
      toAdd += `,\n    publications: [${enrichData.publications.map(p =>
        `{ title: "${p.replace(/"/g, '\\"')}" }`).join(', ')}]`;
    }

    if (toAdd) {
      // Insert before closing },
      const updated = entry.replace(/(\n  \},)$/, toAdd + '\n  },');
      ummiscoContent = ummiscoContent.replace(match[0], updated);
      updatedCount++;
    }
  }
});

fs.writeFileSync(
  path.join(__dirname, '../src/data/ummiscoData.ts'),
  ummiscoContent,
  'utf8'
);

console.log(`✅ Enhanced ${updatedCount} researchers`);
console.log(`\n🎯 Next: npm run build && git add . && git commit`);
