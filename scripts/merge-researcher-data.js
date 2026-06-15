#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read ummiscoData.ts
const ummiscoPath = path.join(__dirname, '../src/data/ummiscoData.ts');
const ummiscoContent = fs.readFileSync(ummiscoPath, 'utf8');

// Extract RESEARCHERS array from ummiscoData.ts
const researchersStartIdx = ummiscoContent.indexOf('export const RESEARCHERS: Researcher[] = [');
const researchersEndIdx = ummiscoContent.lastIndexOf('export const AXES =') - 2;
const researchersSection = ummiscoContent.substring(researchersStartIdx, researchersEndIdx);

// Parse and extract researcher names and basic structure
const researchers = [];
const entryPattern = /{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",/g;
let match;

while ((match = entryPattern.exec(researchersSection)) !== null) {
  researchers.push({
    id: match[1],
    name: match[2]
  });
}

console.log(`✓ Found ${researchers.length} researchers in ummiscoData.ts`);

// Read researchers_full_pdf_data.ts to get enriched data
const pdfDataPath = path.join(__dirname, '../src/data/researchers_full_pdf_data.ts');
const pdfDataContent = fs.readFileSync(pdfDataPath, 'utf8');

// Extract theme and project data for enrichment
const pdfDataMatch = pdfDataContent.match(/themesDescription:\s*"([^"]+)"/g);
console.log(`✓ Found ${pdfDataMatch?.length || 0} theme descriptions in PDF data`);

console.log(`
Task: Merge complete researcher data from researchers_full_pdf_data.ts into ummiscoData.ts
Status: Ready to enrich ${researchers.length} researchers with themes, projects, and publications

Next steps:
1. Extract complete data for all 94 researchers from infos_membres.pdf
2. Update ummiscoData.ts with themesDescription, projects, and publications fields
3. Deploy to Vercel
`);
