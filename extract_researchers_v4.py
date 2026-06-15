#!/usr/bin/env python3
import json
import re

# Read the text file
with open('members_data.txt', 'r', encoding='latin-1') as f:
    text = f.read()

researchers = []

# Split text into researcher blocks using careful pattern matching
# Each researcher block starts with a name (capitalized) and contains fields

# Create blocks by finding names followed by data
# Pattern: Name on its own line, then fields on following lines

lines = text.split('\n')

# First pass: identify researcher boundaries
researcher_blocks = []
current_block = []
block_start = None

for i, line in enumerate(lines):
    stripped = line.strip()

    # Check if this is a researcher name
    # Criteria: Capitalized, not a field keyword, not empty
    is_name = (
        stripped and
        not any(stripped.lower().startswith(kw.lower()) for kw in [
            'centre', 'thème', 'theme', 'projets', 'université', 'universit', 'email', 'publications', 'bio', 'doctorant', 'chercheur', 'directeur', 'maître', 'ingénieur', 'responsable', 'personnel', 'émérite'
        ]) and
        ':' not in stripped and
        '•' not in stripped and
        '–' not in stripped
    )

    # Check if previous line suggests this is continuation of previous researcher
    if i > 0 and stripped:
        prev_stripped = lines[i-1].strip()
        if prev_stripped and any(kw in prev_stripped.lower() for kw in ['centre', 'email', 'bio']):
            is_name = False

    if is_name and i > 0:
        # Check if we should start a new block
        prev_non_empty_idx = i - 1
        while prev_non_empty_idx >= 0 and not lines[prev_non_empty_idx].strip():
            prev_non_empty_idx -= 1

        if prev_non_empty_idx >= 0:
            prev_line = lines[prev_non_empty_idx].strip()
            # If previous line is a field, this is likely a new researcher
            if any(kw in prev_line.lower() for kw in ['centre', 'email', 'bio', 'universit']) or prev_line.endswith(':'):
                if current_block:
                    researcher_blocks.append(current_block)
                current_block = [line]
                block_start = i
                continue

    if current_block is not None:
        current_block.append(line)

if current_block:
    researcher_blocks.append(current_block)

# Second pass: parse each block
for block_idx, block in enumerate(researcher_blocks):
    if not block:
        continue

    # Extract name (first non-empty line)
    name = ""
    title = ""
    center = ""
    themes = ""
    projects = []
    publications = []
    bio = ""
    email = ""

    # Find the name (first significant line)
    for line in block:
        if line.strip():
            name = line.strip()
            break

    # Parse remaining lines
    full_text = '\n'.join(block)

    # Extract fields using regex
    # Centre
    centre_match = re.search(r'Centre\s*:\s*([^\n]+?)(?=Thème|Projets|Université|Email|Bio|$)', full_text)
    if centre_match:
        center = centre_match.group(1).strip()

    # Thème
    theme_match = re.search(r'Thème\(s\)\s*:\s*([^\n]+?)(?=Projets|Université|Email|Bio|Centre|$)', full_text, re.IGNORECASE)
    if theme_match:
        themes = theme_match.group(1).strip()

    # Projets
    proj_match = re.search(r'Projets\s*:\s*([^\n]+?)(?=Université|Email|Bio|Centre|Thème|$)', full_text)
    if proj_match:
        proj_text = proj_match.group(1).strip()
        if proj_text:
            projects = [p.strip() for p in re.split(r'[,;]', proj_text) if p.strip()]

    # Email
    email_match = re.search(r'Email\s*:\s*([^\n]+?)(?=Bio|Centre|Thème|Projets|$)', full_text)
    if email_match:
        email = email_match.group(1).strip()

    # Bio
    bio_match = re.search(r'Bio\s*:\s*([^\n]+?)(?=Centre|Thème|Projets|$)', full_text)
    if bio_match:
        bio = bio_match.group(1).strip()

    # Title (look for position keywords)
    title_keywords = ['Doctorant', 'Chercheur', 'Directeur de centre', 'Directeur de Recherche', 'Directeur d\'Unité', 'Responsable de thème', 'Maître de Conférence', 'Ingénieur', 'Personnel administratif', 'Émérite']
    for kw in title_keywords:
        if kw.lower() in full_text.lower():
            # Extract the full line with this keyword
            title_match = re.search(rf'({kw}[^\n]*)', full_text, re.IGNORECASE)
            if title_match:
                title = title_match.group(1).strip()
                break

    # Publications
    pub_section = re.search(r'Publications\s*:\s*(.+?)(?=Bio|Centre|Thème|$)', full_text, re.DOTALL | re.IGNORECASE)
    if pub_section:
        pub_text = pub_section.group(1)
        # Split by bullets, dashes, or newlines
        pub_lines = re.split(r'[\n•–]', pub_text)
        for pub_line in pub_lines:
            clean_pub = pub_line.strip()
            if clean_pub and len(clean_pub) > 5 and not any(kw in clean_pub for kw in ['Centre', 'Projets', 'Université']):
                publications.append(clean_pub)

    # Only add if we have a valid name
    if name and len(name) > 2 and name not in ['Centre', 'Thème', 'Projets', 'Université', 'Email', 'Bio', 'Publications']:
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

# Remove duplicates and sort
seen_names = set()
unique_researchers = []
for r in researchers:
    if r['name'] not in seen_names:
        unique_researchers.append(r)
        seen_names.add(r['name'])

researchers = unique_researchers

# Save to JSON
output = {"researchers": researchers}
with open('researchers_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(researchers)} researchers")
for i, r in enumerate(researchers[:20]):
    print(f"  {i+1:2d}. {r['name']:30s} | {r['title']:30s} | {r['center'][:25]}")
