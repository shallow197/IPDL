#!/usr/bin/env python3
import json
import re

# Read the text file
with open('members_data.txt', 'r', encoding='latin-1') as f:
    lines = f.readlines()

researchers = []
current_researcher = None

i = 0
while i < len(lines):
    line = lines[i].rstrip('\n')
    stripped = line.strip()

    # Skip empty lines
    if not stripped:
        i += 1
        continue

    # Detect start of new researcher entry
    # A researcher typically starts with a name followed by a title/position
    # Pattern: Non-empty line that's a name, then next non-empty line is a position title

    if (not stripped.startswith('Centre') and
        not stripped.startswith('Thème') and
        not stripped.startswith('Projets') and
        not stripped.startswith('Université') and
        not stripped.startswith('Email') and
        not stripped.startswith('Publications') and
        not stripped.startswith('Bio') and
        not stripped.startswith('Universit') and
        not stripped.startswith(' ') and
        not stripped.startswith('•') and
        not stripped.startswith('–') and
        not stripped.startswith('--') and
        not any(c in stripped for c in [':', '|']) or ':' in stripped and 'Email' not in stripped and 'Centre' not in stripped):

        # Save previous researcher if exists
        if current_researcher:
            researchers.append(current_researcher)

        # Start new researcher
        current_researcher = {
            "name": stripped,
            "title": "",
            "center": "",
            "themesDescription": "",
            "projects": [],
            "publications": [],
            "bio": "",
            "email": ""
        }
        i += 1
        continue

    # Parse field data for current researcher
    if current_researcher:
        if stripped.startswith('Doctorant'):
            current_researcher['title'] = stripped
        elif stripped.startswith('Chercheur'):
            current_researcher['title'] = 'Chercheur'
        elif stripped.startswith('Directeur de centre adjoint'):
            current_researcher['title'] = 'Directeur de centre adjoint'
        elif stripped.startswith('Directeur de centre'):
            current_researcher['title'] = 'Directeur de centre'
        elif stripped.startswith('Directeur d\'Unité Adjoint'):
            current_researcher['title'] = "Directeur d'Unité Adjoint"
        elif stripped.startswith('Directeur de Recherche'):
            current_researcher['title'] = 'Directeur de Recherche'
        elif stripped.startswith('Émér'):
            current_researcher['title'] = 'Émérite'
        elif stripped.startswith('Responsable de thème'):
            current_researcher['title'] = 'Responsable de thème'
        elif stripped.startswith('Maître de Conf'):
            current_researcher['title'] = 'Maître de Conférence'
        elif stripped.startswith('Ingénieur'):
            current_researcher['title'] = stripped
        elif stripped.startswith('Personnel administratif'):
            current_researcher['title'] = 'Personnel administratif'
        elif stripped.startswith('Centre :'):
            current_researcher['center'] = stripped.replace('Centre :', '').replace('Centre:', '').strip()
        elif stripped.startswith('Thème'):
            themes = stripped.replace('Thème(s) :', '').replace('Theme(s) :', '').strip()
            # Append continuation lines
            j = i + 1
            while j < len(lines):
                next_line = lines[j].rstrip('\n').strip()
                if any(kw in next_line for kw in ['Centre', 'Projets', 'Université', 'Email', 'Publications', 'Bio']):
                    break
                if next_line and not next_line.startswith('•') and not next_line.startswith('–'):
                    themes += ' ' + next_line
                    j += 1
                else:
                    break
            current_researcher['themesDescription'] = themes
            i = j - 1
        elif stripped.startswith('Projets'):
            proj_text = stripped.replace('Projets :', '').replace('Projets:', '').strip()
            if proj_text:
                current_researcher['projects'] = [p.strip() for p in proj_text.split(',')]
        elif stripped.startswith('Email :'):
            current_researcher['email'] = stripped.replace('Email :', '').replace('Email:', '').strip()
        elif stripped.startswith('Bio :'):
            bio_text = stripped.replace('Bio :', '').replace('Bio:', '').strip()
            # Append continuation
            j = i + 1
            while j < len(lines):
                next_line = lines[j].rstrip('\n').strip()
                if not next_line or any(kw in next_line for kw in ['Centre', 'Projets', 'Université', 'Email', 'Publications']):
                    break
                if next_line and not next_line.startswith('•'):
                    bio_text += ' ' + next_line
                    j += 1
                else:
                    break
            current_researcher['bio'] = bio_text
            i = j - 1
        elif stripped.startswith('Publications'):
            # Parse publications section
            j = i + 1
            while j < len(lines):
                pub_line = lines[j].rstrip('\n').strip()
                if not pub_line:
                    j += 1
                    continue
                if any(kw in pub_line for kw in ['Centre', 'Projets', 'Université', 'Email', 'Bio']):
                    break
                if pub_line.startswith('•') or pub_line.startswith('–') or pub_line.startswith(' '):
                    clean_pub = pub_line.lstrip('•–').strip()
                    if clean_pub and not any(kw in clean_pub for kw in ['Centre', 'Projets', 'Université']):
                        current_researcher['publications'].append(clean_pub)
                    j += 1
                elif any(kw in pub_line for kw in ['Doctorant', 'Chercheur', 'Directeur', 'Maître']):
                    # Next researcher
                    break
                else:
                    # Likely a publication line
                    if pub_line and not any(c in pub_line for c in [':']):
                        current_researcher['publications'].append(pub_line)
                    j += 1
            i = j - 1

    i += 1

# Add last researcher
if current_researcher and current_researcher['name']:
    researchers.append(current_researcher)

# Filter out invalid entries (those without proper name or basic fields)
researchers = [r for r in researchers if r['name'] and len(r['name']) > 2]

# Save to JSON
output = {"researchers": researchers}
with open('researchers_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(researchers)} researchers")
for i, r in enumerate(researchers[:10]):
    print(f"  {i+1}. {r['name']} - {r['title']} ({r['center']})")

print(f"\n... and {len(researchers) - 10} more")
