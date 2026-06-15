#!/usr/bin/env python3
import json
import re

# Read the text file
with open('members_data.txt', 'r', encoding='latin-1') as f:
    text = f.read()

researchers = []

# Split by double newlines or by looking at the text structure
# Each researcher block contains: Name, optional title, Centre, Thème, optional Projets, optional Publications, optional Bio

# Pattern: We look for lines that start with uppercase and are names
# Followed by a line with title keywords or Centre/Thème

lines = text.split('\n')

i = 0
while i < len(lines):
    line = lines[i].strip()

    # Skip empty lines
    if not line:
        i += 1
        continue

    # Try to identify if this is a researcher name
    # It should be ALL CAPS or Title Case, and not contain colons or keywords
    is_potential_name = (
        line and
        not any(line.startswith(kw) for kw in ['Centre', 'Thème', 'Projets', 'Université', 'Email', 'Publications', 'Bio', 'Universit', 'Th']) and
        not any(kw in line for kw in [' : ', ': ', ' :', ':', '•', '–', '  ']) and
        len(line) > 2 and
        not line[0].islower() and
        not any(digit in line[0] for digit in '0123456789')
    )

    if is_potential_name:
        # Verify this is a name by checking what follows
        j = i + 1
        while j < len(lines) and not lines[j].strip():
            j += 1

        if j < len(lines):
            next_non_empty = lines[j].strip()
            # Check if next section contains title/position keywords or field info
            is_researcher = any(kw.lower() in next_non_empty.lower() for kw in [
                'doctorant', 'chercheur', 'directeur', 'maître', 'ingénieur',
                'responsable', 'personnel', 'émérite', 'centre', 'thème'
            ])

            if is_researcher:
                researcher = {
                    "name": line,
                    "title": "",
                    "center": "",
                    "themesDescription": "",
                    "projects": [],
                    "publications": [],
                    "bio": "",
                    "email": ""
                }

                # Parse the next 50 lines for this researcher's data
                k = i + 1
                in_publications = False
                pub_buffer = ""

                while k < len(lines) and len(researchers) + 1 < 100:  # Safety limit
                    current = lines[k].strip()

                    # Check if we've hit the next researcher
                    if current and not any(kw in current.lower() for kw in ['centre', 'thème', 'projets', 'université', 'email', 'publications', 'bio']):
                        # Check if this looks like a new name
                        if (current and
                            not current[0].islower() and
                            ':' not in current and
                            '•' not in current and
                            any(word[0].isupper() for word in current.split())):
                            # Likely next researcher
                            break

                    if current.startswith('Centre'):
                        researcher['center'] = current.replace('Centre :', '').replace('Centre:', '').strip()
                    elif current.startswith('Thème'):
                        themes = current.replace('Thème(s) :', '').replace('Theme(s) :', '').strip()
                        # Continue reading theme lines
                        k += 1
                        while k < len(lines):
                            next_theme_line = lines[k].strip()
                            if any(kw in next_theme_line for kw in ['Centre', 'Projets', 'Université', 'Email', 'Publications', 'Bio']):
                                k -= 1
                                break
                            if next_theme_line and not any(c in next_theme_line for c in [':', '•']):
                                themes += ' ' + next_theme_line
                            k += 1
                        researcher['themesDescription'] = themes
                    elif current.startswith('Projets'):
                        proj_text = current.replace('Projets :', '').replace('Projets:', '').strip()
                        if proj_text:
                            researcher['projects'] = [p.strip() for p in proj_text.split(',')]
                    elif current.startswith('Université'):
                        pass  # Skip university lines
                    elif current.startswith('Email'):
                        researcher['email'] = current.replace('Email :', '').replace('Email:', '').strip()
                    elif current.startswith('Bio'):
                        bio = current.replace('Bio :', '').replace('Bio:', '').strip()
                        # Continue reading bio
                        k += 1
                        while k < len(lines):
                            next_bio_line = lines[k].strip()
                            if any(kw in next_bio_line for kw in ['Centre', 'Projets', 'Université', 'Email', 'Publications']) or (next_bio_line and not next_bio_line[0].islower() and ':' not in next_bio_line):
                                k -= 1
                                break
                            if next_bio_line:
                                bio += ' ' + next_bio_line
                            k += 1
                        researcher['bio'] = bio
                    elif current.startswith('Publications'):
                        in_publications = True
                    elif in_publications and current:
                        if any(kw in current for kw in ['Centre', 'Projets', 'Université', 'Email', 'Bio']):
                            in_publications = False
                        elif current.startswith('Doctorant') or current.startswith('Chercheur') or current.startswith('Directeur'):
                            # Next researcher
                            break
                        elif not current[0].isupper() or '•' in current or current[0] == ' ' or (len(current) > 3 and current[0].isupper() and current[1:].islower()):
                            # Publication line
                            clean = current.lstrip('• ').strip()
                            if clean and len(clean) > 5:
                                researcher['publications'].append(clean)
                    elif not current.startswith('Doctorant') and not current.startswith('Chercheur'):
                        if not any(kw in current.lower() for kw in ['centre', 'thème', 'projets', 'université', 'email', 'publications', 'bio']):
                            if current and current.lower() in ['doctorant, modélisation hydrogéologique', 'chercheur', 'directeur']:
                                if not researcher['title']:
                                    researcher['title'] = current
                    else:
                        if current and not researcher['title']:
                            if any(kw.lower() in current.lower() for kw in ['doctorant', 'chercheur', 'directeur', 'maître', 'ingénieur', 'responsable', 'personnel', 'émérite']):
                                researcher['title'] = current

                    k += 1

                if researcher['name']:
                    researchers.append(researcher)
                    i = k - 1

    i += 1

# Save to JSON
output = {"researchers": researchers}
with open('researchers_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(researchers)} researchers")
for i, r in enumerate(researchers[:15]):
    print(f"  {i+1}. {r['name']} - {r['title']}")
    print(f"     Centre: {r['center']}")
    if r['email']:
        print(f"     Email: {r['email']}")
