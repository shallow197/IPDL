#!/usr/bin/env python3
import json
import re

# Read the layout-preserved PDF text
with open('members_layout.txt', 'r', encoding='latin-1') as f:
    text = f.read()

# Split by researcher blocks
# Each researcher block starts with a name on its own line, followed by position/title on the next non-empty line

lines = text.split('\n')

researchers = []
i = 0

while i < len(lines):
    line = lines[i].strip()

    # Skip empty lines
    if not line:
        i += 1
        continue

    # Check if this looks like a researcher name
    # Should be Title Case, no colons, not a field name, reasonable length
    is_name = (
        line and
        len(line) > 2 and
        len(line) < 100 and
        line[0].isupper() and
        ':' not in line and
        not any(keyword in line.lower() for keyword in [
            'centre', 'thème', 'theme', 'projets', 'université', 'email', 'bio',
            'publication', 'universit', 'doctorant', 'chercheur', 'directeur',
            'responsable', 'ingénieur', 'personnel', 'émérite', 'maître'
        ])
    )

    if is_name:
        # Look ahead to confirm this is a researcher
        j = i + 1
        found_title = False
        title = ""

        # Find the title line (skip whitespace)
        while j < len(lines) and not found_title:
            next_line = lines[j].strip()
            if next_line:
                # Check if it's a position/title
                if any(next_line.lower().startswith(pos.lower()) for pos in [
                    'Doctorant', 'Chercheur', 'Directeur', 'Directeur de centre',
                    'Directeur de Recherche', 'Maître', 'Ingénieur', 'Responsable',
                    'Personnel', 'Émérite'
                ]):
                    found_title = True
                    title = next_line
                elif j - i > 10:
                    # Didn't find title close enough
                    break
            j += 1

        if found_title:
            # This is a researcher! Extract data
            name = line
            center = ""
            themes = ""
            projects = []
            publications = []
            bio = ""
            email = ""

            # Start parsing from after the title
            k = j
            in_publications = False

            while k < len(lines):
                current_line = lines[k].rstrip()
                current_stripped = current_line.strip()

                # Check if we've hit the next researcher (a new all-caps or Title-Case name line)
                if (current_stripped and
                    not any(keyword in current_stripped.lower() for keyword in [
                        'centre', 'thème', 'theme', 'projets', 'université', 'email', 'bio',
                        'publication', 'universit'
                    ]) and
                    ':' not in current_stripped and
                    len(current_stripped) > 2 and
                    len(current_stripped) < 100 and
                    current_stripped[0].isupper() and
                    k > j + 3):
                    # Might be next researcher
                    # Check if next line has title keyword
                    m = k + 1
                    while m < len(lines) and not lines[m].strip():
                        m += 1
                    if m < len(lines):
                        check_line = lines[m].strip().lower()
                        if any(pos in check_line for pos in [
                            'doctorant', 'chercheur', 'directeur', 'responsable',
                            'ingénieur', 'personnel', 'émérite', 'maître'
                        ]):
                            break

                # Parse fields
                if current_stripped.startswith('Centre'):
                    center = current_stripped.replace('Centre :', '').replace('Centre:', '').strip()

                elif current_stripped.startswith('Thème'):
                    # Theme may span multiple lines
                    themes = current_stripped.replace('Thème(s) :', '').replace('Theme(s) :', '').strip()
                    k += 1
                    while k < len(lines):
                        next_theme_line = lines[k].strip()
                        if any(kw in next_theme_line for kw in ['Centre', 'Projets', 'Université', 'Email', 'Bio', 'Publications']):
                            k -= 1
                            break
                        if next_theme_line and not next_theme_line[0] == ' ':
                            themes += ' ' + next_theme_line
                        k += 1
                    continue

                elif current_stripped.startswith('Projets'):
                    proj_text = current_stripped.replace('Projets :', '').replace('Projets:', '').strip()
                    if proj_text:
                        # Split by comma if present
                        projects = [p.strip() for p in re.split(r'[,;]', proj_text) if p.strip()]

                elif current_stripped.startswith('Email'):
                    email = current_stripped.replace('Email :', '').replace('Email:', '').strip()

                elif current_stripped.startswith('Bio'):
                    bio = current_stripped.replace('Bio :', '').replace('Bio:', '').strip()
                    # Continue reading bio
                    k += 1
                    while k < len(lines):
                        next_bio_line = lines[k].strip()
                        if not next_bio_line or any(kw in next_bio_line for kw in ['Centre', 'Projets', 'Université', 'Email', 'Publications']):
                            k -= 1
                            break
                        if next_bio_line and next_bio_line[0].isupper() and next_bio_line.count(' ') > 1:
                            # Might be next researcher
                            k -= 1
                            break
                        if next_bio_line:
                            bio += ' ' + next_bio_line
                        k += 1
                    continue

                elif current_stripped.startswith('Publications'):
                    in_publications = True

                elif in_publications and current_stripped:
                    if any(kw in current_stripped for kw in ['Centre', 'Projets', 'Université', 'Email', 'Bio']):
                        in_publications = False
                    elif current_stripped.startswith(' ') or current_stripped[0] == '•' or current_stripped[0] == '-':
                        # Publication line
                        clean_pub = current_stripped.lstrip('•- ').strip()
                        if clean_pub and len(clean_pub) > 10:
                            publications.append(clean_pub)

                k += 1

            # Add researcher
            if name and len(name) > 2:
                researcher = {
                    "name": name,
                    "title": title,
                    "center": center,
                    "themesDescription": themes,
                    "projects": projects,
                    "publications": publications,
                    "bio": bio,
                    "email": email
                }
                researchers.append(researcher)

            # Move past this researcher
            i = k
        else:
            i += 1
    else:
        i += 1

# Remove duplicates
seen = set()
unique = []
for r in researchers:
    if r['name'] not in seen:
        unique.append(r)
        seen.add(r['name'])

researchers = unique

# Save to JSON
output = {"researchers": researchers}
with open('researchers_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(researchers)} researchers")
print("\nAll researchers:")
for i, r in enumerate(researchers, 1):
    title_disp = (r['title'][:25] + '...' if len(r['title']) > 25 else r['title'])
    print(f"  {i:2d}. {r['name']:40s} | {title_disp:28s} | {r['center'][:25]}")
