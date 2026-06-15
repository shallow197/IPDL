#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔀 Merging enrichment data into ummiscoData.ts...\n');

// Read enrichment data
const enrichmentPath = path.join(__dirname, '../src/data/enrichment-data.json');
const enrichmentData = JSON.parse(fs.readFileSync(enrichmentPath, 'utf8'));

// Read ummiscoData
const ummiscoPath = path.join(__dirname, '../src/data/ummiscoData.ts');
let ummiscoContent = fs.readFileSync(ummiscoPath, 'utf8');

// Create a map of enrichment data by name
const enrichmentMap = {};
enrichmentData.forEach(r => {
  enrichmentMap[r.name] = r;
});

let mergedCount = 0;
let notFoundCount = 0;
const notFound = [];

// For each enrichment entry, find matching researcher in ummiscoData and add fields
Object.entries(enrichmentMap).forEach(([name, enrichData]) => {
  // Find the researcher block in ummiscoData
  const namePattern = `name: "${name}"`;

  if (ummiscoContent.includes(namePattern)) {
    mergedCount++;

    // Find the end of this researcher object (next comma followed by { or end of array)
    const startIdx = ummiscoContent.indexOf(namePattern);
    let searchIdx = startIdx;
    let braceCount = 0;
    let inObject = false;

    // Find the opening brace of this object
    while (searchIdx > 0 && ummiscoContent[searchIdx] !== '{') {
      searchIdx--;
    }
    inObject = true;

    // Find the closing brace
    let endIdx = startIdx;
    braceCount = 0;
    let foundOpen = false;

    for (let i = searchIdx; i < ummiscoContent.length; i++) {
      if (ummiscoContent[i] === '{') {
        braceCount++;
        foundOpen = true;
      } else if (ummiscoContent[i] === '}') {
        braceCount--;
        if (foundOpen && braceCount === 0) {
          endIdx = i;
          break;
        }
      }
    }

    // Extract current researcher object
    const objectStr = ummiscoContent.substring(searchIdx, endIdx + 1);

    // Check if it already has themesDescription field
    if (!objectStr.includes('themesDescription')) {
      // Insert after publicationsCount or similar - find last field before closing }
      const lastCommaIdx = objectStr.lastIndexOf(',');

      if (lastCommaIdx !== -1) {
        // Build enrichment fields
        const themesField = enrichData.themesDescription ?
          `\n    themesDescription: "${enrichData.themesDescription.replace(/"/g, '\\"')}"` : '';

        const projectsField = enrichData.projects && enrichData.projects.length > 0 ?
          `,\n    projects: [${enrichData.projects.map(p => `"${p.replace(/"/g, '\\"')}"`).join(', ')}]` : '';

        const pubsField = enrichData.publications && enrichData.publications.length > 0 ?
          `,\n    publications: [${enrichData.publications.map(p => `{ title: "${p.replace(/"/g, '\\"')}" }`).join(', ')}]` : '';

        const enrichment = themesField + projectsField + pubsField;

        if (enrichment) {
          const newObject = objectStr.substring(0, lastCommaIdx + 1) + enrichment + objectStr.substring(lastCommaIdx + 1);
          ummiscoContent = ummiscoContent.replace(objectStr, newObject);
        }
      }
    }
  } else {
    notFoundCount++;
    notFound.push(name);
  }
});

console.log(`✅ Merge Summary:`);
console.log(`   Researchers enriched: ${mergedCount}`);
console.log(`   Not found in ummiscoData: ${notFoundCount}`);

if (notFound.length > 0 && notFound.length <= 10) {
  console.log(`   Missing: ${notFound.join(', ')}`);
}

// Write updated ummiscoData
fs.writeFileSync(ummiscoPath, ummiscoContent, 'utf8');
console.log(`\n📝 Updated ummiscoData.ts`);

console.log(`\n✨ Integration complete! Ready to deploy.`);
console.log(`   Next: npm run build && git add . && git commit`);
