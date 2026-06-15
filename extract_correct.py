#!/usr/bin/env python3
import json
import re

# Read the text file
with open('members_data.txt', 'r', encoding='latin-1') as f:
    text = f.read()

researchers = []

# Strategy: Find position keywords followed by everything back to the previous position keyword or start
# This way we capture the name and data in one block

# Split on position keywords
position_pattern = r'(Doctorant|Chercheur|Directeur de centre adjoint|Directeur de centre|Directeur d\'Unité Adjoint|Directeur d\'Unité|Directeur de Recherche|Maître de Conférence|Ingénieur de Recherche|Ingénieur|Responsable de thème|Responsable|Personnel administratif|Émérite)'

# Split text by positions
sections = re.split(rf'(?<!\n)(?={position_pattern}(?:\s|$))', text)

for section in sections:
    if not section.strip():
        continue

    lines = section.split('\n')

    # Find the name (first non-empty line that's not a position keyword)
    name = ""
    title = ""
    idx = 0

    for i, line in enumerate(lines):
        line_strip = line.strip()
        if not line_strip:
            continue

        # Check if this is a position title
        if any(line_strip.startswith(pos) for pos in [
            'Doctorant', 'Chercheur', 'Directeur', 'Maître', 'Ingénieur',
            'Responsable', 'Personnel', 'Émérite'
        ]):
            if i > 0 and not name:
                # The name is in the previous line(s)
                for j in range(i-1, -1, -1):
                    prev = lines[j].strip()
                    if prev and not any(kw in prev for kw in ['Centre', 'Thème', 'Projets', 'Email', 'Bio', 'Universit']):
                        name = prev
                        break
            if not title:
                title = line_strip
            idx = i
            break

    if not name or len(name) < 2:
        continue

    # Parse the section
    full_section = '\n'.join(lines[idx:])

    center = ""
    themes = ""
    projects = []
    publications = []
    bio = ""
    email = ""

    # Centre
    centre_match = re.search(r'Centre\s*:\s*([^\n]+?)(?=Thème|Projets|Université|Email|Bio|$)', full_section, re.IGNORECASE)
    if centre_match:
        center = centre_match.group(1).strip()

    # Thème
    theme_match = re.search(r'Thème\(s\)\s*:\s*([^\n]+?)(?=Projets|Université|Email|Bio|Centre|$)', full_section, re.IGNORECASE)
    if theme_match:
        themes = theme_match.group(1).strip()

    # Projets
    proj_match = re.search(r'Projets\s*:\s*([^\n]+?)(?=Université|Email|Bio|Centre|Thème|$)', full_section)
    if proj_match:
        proj_text = proj_match.group(1).strip()
        if proj_text:
            projects = [p.strip() for p in re.split(r'[,;]', proj_text) if p.strip()]

    # Email
    email_match = re.search(r'Email\s*:\s*(\S+)', full_section)
    if email_match:
        email = email_match.group(1).strip()

    # Bio
    bio_match = re.search(r'Bio\s*:\s*([^\n]+?)(?=Centre|Thème|Projets|$)', full_section)
    if bio_match:
        bio = bio_match.group(1).strip()

    # Publications
    pub_section = re.search(r'Publications\s*:\s*(.+?)(?=Bio|Centre|Thème|Projets|$)', full_section, re.DOTALL | re.IGNORECASE)
    if pub_section:
        pub_text = pub_section.group(1)
        # Split publications
        pub_lines = re.split(r'\n\s*(?=[•–\s])', pub_text)
        for pub_line in pub_lines:
            clean = pub_line.strip().lstrip('•–').strip()
            if clean and len(clean) > 10 and not any(kw in clean for kw in ['Centre', 'Projets', 'Université']):
                publications.append(clean)

    # Add researcher
    if name:
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
print("\nFirst 30:")
for i, r in enumerate(researchers[:30]):
    print(f"  {i+1:2d}. {r['name']:40s} | {r['title'][:30]:30s}")
