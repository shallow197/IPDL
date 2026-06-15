#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔄 Generating enriched ummiscoData.ts with all researcher data...\n');

// Read enrichment data
const enrichmentData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/enrichment-data.json'), 'utf8')
);

// Read original ummiscoData to get the template and non-researcher parts
const originalPath = path.join(__dirname, '../src/data/ummiscoData.ts');
const original = fs.readFileSync(originalPath, 'utf8');

// Extract everything before RESEARCHERS array
const researchersStart = original.indexOf('export const RESEARCHERS: Researcher[] = [');
const headerPart = original.substring(0, researchersStart + 'export const RESEARCHERS: Researcher[] = ['.length);

// Extract everything after RESEARCHERS array
const researchersEnd = original.indexOf('export const AXES =');
const footerPart = original.substring(researchersEnd);

// Build enriched researchers array
let enrichedArray = '  {\n';
const enrichmentMap = {};
enrichmentData.forEach(r => enrichmentMap[r.name] = r);

// Rebuild by going through original and merging data
const researcherEntries = [];
const lines = original.split('\n');
let currentEntry = '';
let inResearchersArray = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.includes('export const RESEARCHERS:')) {
    inResearchersArray = true;
    continue;
  }

  if (inResearchersArray && line.includes('export const AXES =')) {
    inResearchersArray = false;
    if (currentEntry.trim()) {
      researcherEntries.push(currentEntry);
    }
    break;
  }

  if (inResearchersArray) {
    if (line.includes('name: "')) {
      // Extract researcher name
      const nameMatch = line.match(/name: "([^"]+)"/);
      if (nameMatch && currentEntry.trim()) {
        researcherEntries.push(currentEntry);
        currentEntry = '';
      }
    }
    currentEntry += (currentEntry ? '\n' : '') + line;
  }
}

// Process each researcher entry and merge enrichment data
const processedEntries = [];

researcherEntries.forEach(entry => {
  const nameMatch = entry.match(/name: "([^"]+)"/);
  if (!nameMatch) return;

  const name = nameMatch[1];
  const enrichment = enrichmentMap[name];

  if (enrichment) {
    // Check if entry already has these fields
    let updated = entry;

    // Add themesDescription if not present
    if (!updated.includes('themesDescription') && enrichment.themesDescription) {
      const lastComma = updated.lastIndexOf(',');
      if (lastComma !== -1) {
        const theme = `\n    themesDescription: "${enrichment.themesDescription.replace(/"/g, '\\"')}"`;
        updated = updated.substring(0, lastComma + 1) + theme + updated.substring(lastComma + 1);
      }
    }

    // Add publications if not present
    if (!updated.includes('publications') && enrichment.publications && enrichment.publications.length > 0) {
      const lastComma = updated.lastIndexOf(',');
      if (lastComma !== -1) {
        const pubs = `,\n    publications: [${enrichment.publications.map(p =>
          `{ title: "${p.replace(/"/g, '\\"')}" }`
        ).join(', ')}]`;
        updated = updated.substring(0, lastComma + 1) + pubs + updated.substring(lastComma + 1);
      }
    }

    // Add projects if not present
    if (!updated.includes('projects') && enrichment.projects && enrichment.projects.length > 0) {
      const lastComma = updated.lastIndexOf(',');
      if (lastComma !== -1) {
        const projects = `,\n    projects: [${enrichment.projects.map(p =>
          `"${p.replace(/"/g, '\\"')}"`
        ).join(', ')}]`;
        updated = updated.substring(0, lastComma + 1) + projects + updated.substring(lastComma + 1);
      }
    }

    processedEntries.push(updated);
  } else {
    processedEntries.push(entry);
  }
});

// Rebuild the file
const newContent = headerPart + '\n' + processedEntries.join(',\n  {\n').replace(/^\n  \{\n/, '') + '\n  ' + footerPart;

fs.writeFileSync(originalPath, newContent, 'utf8');

console.log(`✅ Updated ummiscoData.ts with enriched data`);
console.log(`   Researchers updated: ${processedEntries.length}`);
console.log(`\n🚀 Ready to build and deploy!`);
