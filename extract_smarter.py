#!/usr/bin/env python3
import json
import re

# Read the text file
with open('members_data.txt', 'r', encoding='latin-1') as f:
    lines = f.readlines()

researchers = []

i = 0
while i < len(lines):
    line = lines[i].rstrip('\n')
    stripped = line.strip()

    # Skip empty lines
    if not stripped:
        i += 1
        continue

    # Look for name patterns: A line with capitalized words (name pattern)
    # Must not start with field keywords
    is_name_line = (
        stripped and
        not any(stripped.lower().startswith(kw.lower()) for kw in [
            'doctorant', 'chercheur', 'directeur', 'maître', 'ingénieur',
            'responsable', 'personnel', 'émérite', 'centre', 'thème', 'projets',
            'université', 'email', 'bio', 'publication', 'universit'
        ]) and
        ':' not in stripped and
        '•' not in stripped and
        '–' not in stripped and
        len(stripped) > 2 and
        (stripped[0].isupper() or stripped[0] in 'ÀÂÄÆÉÈÊËÏÎÔÖŒÙÛÜÇÑ') and
        stripped.count(' ') >= 1  # At least first and last name
    )

    if is_name_line:
        # Look ahead to see if next lines contain researcher data
        j = i + 1
        found_position = False
        title = ""

        # Check next 5 non-empty lines for position keywords
        non_empty_count = 0
        while j < len(lines) and non_empty_count < 5:
            next_line = lines[j].rstrip('\n').strip()
            if next_line:
                non_empty_count += 1
                if any(next_line.lower().startswith(pos) for pos in [
                    'doctorant', 'chercheur', 'directeur', 'maître', 'ingénieur',
                    'responsable', 'personnel', 'émérite'
                ]):
                    found_position = True
                    title = next_line
                    break
            j += 1

        if found_position:
            # This is a researcher! Extract all data
            name = stripped

            center = ""
            themes = ""
            projects = []
            publications = []
            bio = ""
            email = ""
            in_publications = False

            # Skip to next line after title
            k = i + 1
            max_lines = 150  # Don't read too far

            while k < len(lines) and max_lines > 0:
                current_line = lines[k].rstrip('\n')
                current_stripped = current_line.strip()
                max_lines -= 1

                # Check if we've hit next researcher (name-like line after we've found position)
                if (current_stripped and
                    not any(current_stripped.lower().startswith(kw.lower()) for kw in [
                        'doctorant', 'chercheur', 'directeur', 'maître', 'ingénieur',
                        'responsable', 'personnel', 'émérite', 'centre', 'thème', 'projets',
                        'université', 'email', 'bio', 'publication', 'universit'
                    ]) and
                    ':' not in current_stripped and
                    '•' not in current_stripped and
                    '–' not in current_stripped and
                    current_stripped[0].isupper() and
                    current_stripped.count(' ') >= 1 and
                    len(current_stripped) > 2):
                    # This might be next researcher
                    break

                # Parse fields
                if current_stripped.startswith('Centre'):
                    center = current_stripped.replace('Centre :', '').replace('Centre:', '').strip()
                    # May be on same line with other fields
                    if 'Thème' in current_stripped:
                        parts = current_stripped.split('Thème')
                        center = parts[0].replace('Centre :', '').strip()
                        if len(parts) > 1:
                            themes = parts[1].replace('(s) :', '').strip()

                elif current_stripped.startswith('Thème'):
                    themes = current_stripped.replace('Thème(s) :', '').replace('Theme(s) :', '').strip()
                    # May continue on next lines
                    k += 1
                    while k < len(lines):
                        next_line = lines[k].rstrip('\n').strip()
                        if any(kw in next_line for kw in ['Projets', 'Université', 'Email', 'Bio', 'Centre']):
                            k -= 1
                            break
                        if next_line and not any(next_line.startswith(kw) for kw in ['Centre', 'Projets', 'Université', 'Email']):
                            themes += ' ' + next_line
                        k += 1
                    continue

                elif current_stripped.startswith('Projets'):
                    proj_text = current_stripped.replace('Projets :', '').replace('Projets:', '').strip()
                    if proj_text:
                        projects = [p.strip() for p in re.split(r'[,;]', proj_text) if p.strip()]

                elif current_stripped.startswith('Email'):
                    email = current_stripped.replace('Email :', '').replace('Email:', '').strip()

                elif current_stripped.startswith('Bio'):
                    bio = current_stripped.replace('Bio :', '').replace('Bio:', '').strip()
                    k += 1
                    while k < len(lines):
                        next_line = lines[k].rstrip('\n').strip()
                        if any(kw in next_line for kw in ['Centre', 'Projets', 'Université', 'Email']):
                            k -= 1
                            break
                        if next_line and not next_line[0].isupper():
                            bio += ' ' + next_line
                        elif next_line and ':' not in next_line and len(bio) < 500:
                            bio += ' ' + next_line
                        k += 1
                    continue

                elif current_stripped.startswith('Publications'):
                    in_publications = True

                elif in_publications and current_stripped:
                    if any(kw in current_stripped for kw in ['Centre', 'Projets', 'Université', 'Email', 'Bio']):
                        in_publications = False
                    elif not current_stripped[0].isupper() or '•' in current_stripped or current_stripped[0] == ' ':
                        clean_pub = current_stripped.lstrip('•– ').strip()
                        if clean_pub and len(clean_pub) > 10:
                            publications.append(clean_pub)

                k += 1

            # Add researcher if valid
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

            # Move to next potential researcher
            i = k + 1
        else:
            i += 1
    else:
        i += 1

# Remove duplicates and filter out fake entries
seen = set()
unique = []
for r in researchers:
    # Filter out entries that look like publications or field data
    name = r['name']

    # Skip if name contains typical publication patterns
    if any(indicator in name for indicator in [
        'and', 'of', 'the', 'with', 'for', 'from', 'to', 'in', 'based',
        'using', 'through', 'by', 'Healing', 'Learning', 'Differential',
        'Mathematical', 'Numerical', 'Encoding'
    ]):
        continue

    # Skip if too long (likely a publication title)
    if len(name) > 120:
        continue

    # Skip if contains "and" followed by lowercase (English phrase)
    if re.search(r'and [a-z]', name):
        continue

    if name not in seen and len(name) > 2:
        unique.append(r)
        seen.add(name)

researchers = unique

# Save to JSON
output = {"researchers": researchers}
with open('researchers_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(researchers)} researchers")
print("\nFirst 40:")
for i, r in enumerate(researchers[:40]):
    title_short = (r['title'][:20] + '...' if len(r['title']) > 20 else r['title'])
    print(f"  {i+1:2d}. {r['name']:35s} | {title_short:23s} | {r['center'][:20]}")
