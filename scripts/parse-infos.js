#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Read the infos file
const infosPath = path.join(__dirname, '../infos');
const content = fs.readFileSync(infosPath, 'utf8');

// Parse researchers
const researchers = [];
const lines = content.split('\n');

let current = null;
let inPublications = false;
let inBio = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // Start of new researcher (name line - not empty, no special chars)
  if (trimmed && !trimmed.includes(':') && !trimmed.includes('_') &&
      trimmed.charAt(0) === trimmed.charAt(0).toUpperCase() &&
      !inPublications && !inBio) {

    // Save previous researcher
    if (current && current.name) {
      researchers.push(current);
    }

    current = {
      name: trimmed,
      themesDescription: '',
      projects: [],
      publications: [],
      bio: ''
    };
    inPublications = false;
    inBio = false;
  } else if (line.includes('Centre :')) {
    if (current) current.centre = line.split('Centre :')[1].trim();
  } else if (line.includes('Thème(s) :')) {
    if (current) current.themesDescription = line.split('Thème(s) :')[1].trim();
  } else if (line.includes('Projets :')) {
    const proj = line.split('Projets :')[1].trim();
    if (current && proj) current.projects = [proj];
  } else if (line.includes('Université :')) {
    if (current) current.university = line.split('Université :')[1].trim();
  } else if (line.includes('Email :')) {
    if (current) current.email = line.split('Email :')[1].trim();
  } else if (line.includes('Publications :')) {
    inPublications = true;
    inBio = false;
  } else if (line.includes('Bio :')) {
    inBio = true;
    inPublications = false;
  } else if (inPublications && trimmed && !line.includes(':')) {
    if (current && trimmed !== 'Bio :' && trimmed) {
      current.publications.push(trimmed);
    }
  } else if (inBio && trimmed && trimmed !== 'Directeur' && trimmed !== 'Chercheur' &&
             !trimmed.includes('Centre') && !trimmed.includes(':')) {
    if (current && trimmed) {
      current.bio = trimmed;
      inBio = false;
    }
  }
}

// Save last researcher
if (current && current.name) {
  researchers.push(current);
}

console.log(`✓ Parsed ${researchers.length} researchers from infos file`);
console.log('\nSample data (first researcher):');
console.log(JSON.stringify(researchers[0], null, 2));

// Save to JSON for integration
fs.writeFileSync(
  path.join(__dirname, '../src/data/researchers-parsed.json'),
  JSON.stringify(researchers, null, 2)
);
console.log('\n✓ Saved parsed data to src/data/researchers-parsed.json');
