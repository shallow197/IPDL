#!/usr/bin/env python3
import json
import re

# Read the text file
with open('members_data.txt', 'r', encoding='latin-1') as f:
    text = f.read()

researchers = []

# Split by researcher names
# Pattern: Line contains only a name (capital letters, spaces, possibly accents/special chars)
# Followed by position/title or Centre field

lines = text.split('\n')

i = 0
while i < len(lines):
    line = lines[i].strip()

    # Skip empty lines and field lines
    if not line or any(line.startswith(kw) for kw in ['Centre', 'Thème', 'Projets', 'Université', 'Email', 'Bio', 'Publications', 'Universit']):
        i += 1
        continue

    # Try to identify a researcher name
    # Must be ALL CAPS or Title Case, no colons or field indicators, no bullets
    is_name = (
        line and
        not any(line.lower().startswith(kw.lower()) for kw in [
            'doctorant', 'chercheur', 'directeur', 'maître', 'ingénieur',
            'responsable', 'personnel', 'émérite', 'professeur', 'centre', 'thème',
            'projet', 'université', 'universit', 'email', 'bio', 'publication'
        ]) and
        ':' not in line and
        '•' not in line and
        '–' not in line and
        len(line) > 2 and
        (line[0].isupper() or line[0] in 'ÀÂÄÆÉÈÊËÏÎÔÖŒÙÛÜÇÑ')
    )

    if is_name:
        # Verify by checking if next non-empty line suggests a researcher entry
        j = i + 1
        found_data = False
        verify_lines = ""

        while j < len(lines) and not found_data:
            next_line = lines[j].strip()
            if next_line:
                verify_lines += next_line + " "
                # Check if contains researcher-related keywords
                if any(kw in verify_lines for kw in ['Centre', 'Email', 'Doctorant', 'Chercheur', 'Directeur', 'Thème']):
                    found_data = True
                if j - i > 20:  # Don't look too far
                    break
            j += 1

        if found_data or 'Centre' in verify_lines or 'Email' in verify_lines:
            # Extract researcher data
            name = line
            title = ""
            center = ""
            themes = ""
            projects = []
            publications = []
            bio = ""
            email = ""

            # Gather all text for this researcher until next researcher
            researcher_text = name + " "
            i += 1
            start_i = i
            title_found = False

            while i < len(lines):
                current_line = lines[i].strip()

                # Check if we've hit the next researcher
                if current_line and not title_found:
                    if any(current_line.startswith(kw) for kw in ['Doctorant', 'Chercheur', 'Directeur', 'Maître', 'Ingénieur', 'Responsable', 'Personnel', 'Émérite']):
                        if not title:
                            title = current_line
                        title_found = True
                        researcher_text += current_line + " "
                        i += 1
                        continue

                # If we've found title, now collect fields until next researcher name
                if title_found:
                    if current_line and (current_line[0].isupper() and
                        not any(current_line.startswith(kw) for kw in ['Centre', 'Thème', 'Projets', 'Université', 'Email', 'Bio', 'Publications', 'Universit']) and
                        ':' not in current_line and
                        not current_line[0] in '•–- ' and
                        not any(current_line.lower().startswith(kw.lower()) for kw in [
                            'doctorant', 'chercheur', 'directeur', 'maître', 'ingénieur',
                            'responsable', 'personnel', 'émérite'
                        ])):
                        # Check if this is a next researcher name
                        if (len(current_line) > 2 and
                            current_line[0].isupper() and
                            current_line.count(' ') >= 1 and
                            ':' not in current_line and
                            not current_line[0:2] in ['• ', '– ']):
                            # Might be next researcher - check what follows
                            k = i + 1
                            while k < len(lines) and not lines[k].strip():
                                k += 1
                            if k < len(lines):
                                next_check = lines[k].strip()
                                if any(next_check.startswith(kw) for kw in ['Centre', 'Chercheur', 'Doctorant', 'Directeur', 'Maître', 'Ingénieur']):
                                    # This is next researcher
                                    break

                    researcher_text += current_line + " "

                i += 1

                # Safety limit
                if i - start_i > 100:
                    break

            # Parse the collected text
            # Centre
            centre_match = re.search(r'Centre\s*:\s*([^\n]+?)(?=Thème|Projets|Université|Email|Bio|$)', researcher_text, re.IGNORECASE)
            if centre_match:
                center = centre_match.group(1).strip()

            # Thème
            theme_match = re.search(r'Thème\(s\)\s*:\s*([^\n]+?)(?=Projets|Université|Email|Bio|Centre|$)', researcher_text, re.IGNORECASE)
            if theme_match:
                themes = theme_match.group(1).strip()

            # Projets
            proj_match = re.search(r'Projets\s*:\s*([^\n]+?)(?=Université|Email|Bio|Centre|Thème|$)', researcher_text)
            if proj_match:
                proj_text = proj_match.group(1).strip()
                if proj_text:
                    projects = [p.strip() for p in re.split(r'[,;]', proj_text) if p.strip()]

            # Email
            email_match = re.search(r'Email\s*:\s*([^\s]+)', researcher_text)
            if email_match:
                email = email_match.group(1).strip()

            # Bio
            bio_match = re.search(r'Bio\s*:\s*([^\n]+?)(?=Centre|Thème|Projets|$)', researcher_text)
            if bio_match:
                bio = bio_match.group(1).strip()

            # Publications
            pub_section = re.search(r'Publications\s*:\s*(.+?)(?=Bio|Centre|$)', researcher_text, re.DOTALL | re.IGNORECASE)
            if pub_section:
                pub_text = pub_section.group(1)
                pub_lines = re.split(r'[\n•]', pub_text)
                for pub_line in pub_lines:
                    clean_pub = pub_line.strip()
                    if clean_pub and len(clean_pub) > 10:
                        publications.append(clean_pub)

            # Add researcher
            if name and name not in ['Centre', 'Thème', 'Projets']:
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
        else:
            i += 1
    else:
        i += 1

# Remove duplicates by name
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
for i, r in enumerate(researchers[:30]):
    email_str = f" | {r['email']}" if r['email'] else ""
    print(f"  {i+1:2d}. {r['name']:40s} | {r['center'][:30]:30s}{email_str}")
