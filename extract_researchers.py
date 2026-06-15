#!/usr/bin/env python3
import json
import re

# Read the text file
with open('members_data.txt', 'r', encoding='latin-1') as f:
    content = f.read()

researchers = []

# Split by researcher entries - they start with a name at the beginning of a line
# Pattern: Name followed by title/position on next lines
lines = content.split('\n')

i = 0
while i < len(lines):
    line = lines[i].strip()

    # Skip empty lines
    if not line:
        i += 1
        continue

    # Check if this looks like a name (capital letters, spaces, sometimes special chars)
    # Names typically don't contain colons or start with specific keywords we see in data
    if (line and
        not line.startswith('Centre') and
        not line.startswith('Thème') and
        not line.startswith('Th') and
        not line.startswith('Projets') and
        not line.startswith('Université') and
        not line.startswith('Email') and
        not line.startswith('Publications') and
        not line.startswith('Bio') and
        not line.startswith('Universit')):

        # Check if next non-empty line suggests this is a new researcher entry
        j = i + 1
        while j < len(lines) and not lines[j].strip():
            j += 1

        # If we found a position/title keyword soon after, this is likely a name
        found_position = False
        for k in range(i+1, min(i+10, len(lines))):
            nextline = lines[k].strip()
            if any(kw in nextline.lower() for kw in ['doctorant', 'chercheur', 'directeur', 'maître', 'ingénieur', 'responsable', 'personnel', 'émér']):
                found_position = True
                break

        if found_position or (j < len(lines) and any(kw in lines[j].lower() for kw in ['doctorant', 'chercheur', 'directeur', 'maître', 'ingénieur', 'responsable', 'personnel', 'émér'])):
            # Extract researcher data
            name = line
            title = ""
            center = ""
            themes = ""
            projects = []
            publications = []
            bio = ""
            email = ""

            i += 1

            # Parse following lines until we hit next researcher or end
            section = None
            while i < len(lines):
                current_line = lines[i].strip()

                # Check if this is the start of next researcher
                # (non-empty line that's not a field and not part of current data)
                if (current_line and
                    not current_line.startswith('Centre') and
                    not current_line.startswith('Thème') and
                    not current_line.startswith('Th') and
                    not current_line.startswith('Projets') and
                    not current_line.startswith('Université') and
                    not current_line.startswith('Email') and
                    not current_line.startswith('Publications') and
                    not current_line.startswith('Bio') and
                    not current_line.startswith('Universit') and
                    not current_line.startswith('•') and
                    not current_line.startswith('–') and
                    not current_line.startswith('-') and
                    not current_line.startswith(' ')):

                    # This might be next researcher - check if it has position info soon
                    is_next_researcher = False
                    for k in range(i+1, min(i+5, len(lines))):
                        nextline = lines[k].strip()
                        if any(kw in nextline.lower() for kw in ['doctorant', 'chercheur', 'directeur', 'maître', 'ingénieur', 'responsable', 'personnel', 'émér']):
                            is_next_researcher = True
                            break

                    if is_next_researcher:
                        break

                # Parse field data
                if current_line.startswith('Doctorant'):
                    title = "Doctorant"
                    # Handle subtitle if on same line
                    if ',' in current_line:
                        title = current_line
                elif current_line.startswith('Chercheur'):
                    title = "Chercheur"
                elif current_line.startswith('Directeur de centre adjoint'):
                    title = "Directeur de centre adjoint"
                elif current_line.startswith('Directeur de centre'):
                    title = "Directeur de centre"
                elif current_line.startswith('Directeur d\'Unité Adjoint'):
                    title = "Directeur d'Unité Adjoint"
                elif current_line.startswith('Directeur d\'Unité'):
                    title = "Directeur d'Unité"
                elif current_line.startswith('Directeur de Recherche'):
                    title = "Directeur de Recherche"
                elif current_line.startswith('Émér'):
                    title = "Émérite"
                elif current_line.startswith('Responsable de thème'):
                    title = "Responsable de thème"
                elif current_line.startswith('Responsable'):
                    title = "Responsable"
                elif current_line.startswith('Maître'):
                    title = current_line
                elif current_line.startswith('Ingénieur'):
                    title = current_line
                elif current_line.startswith('Personnel'):
                    title = "Personnel administratif"
                elif current_line.startswith('Centre :'):
                    center = current_line.replace('Centre :', '').strip()
                elif current_line.startswith('Thème'):
                    themes = current_line.replace('Thème(s) :', '').replace('Theme(s) :', '').strip()
                    # Combine with next line if it continues
                    j = i + 1
                    while j < len(lines) and not any(kw in lines[j].strip() for kw in ['Centre', 'Projets', 'Universit', 'Email', 'Publications', 'Bio']):
                        themes += " " + lines[j].strip()
                        j += 1
                    i = j - 1
                elif current_line.startswith('Projets'):
                    proj_text = current_line.replace('Projets :', '').strip()
                    if proj_text:
                        # Split by comma if multiple projects listed
                        if ',' in proj_text:
                            projects.extend([p.strip() for p in proj_text.split(',')])
                        else:
                            projects.append(proj_text)
                elif current_line.startswith('Universit'):
                    # Skip university line - included in other fields
                    pass
                elif current_line.startswith('Email :'):
                    email = current_line.replace('Email :', '').strip()
                elif current_line.startswith('Publications'):
                    section = 'publications'
                elif current_line.startswith('Bio :'):
                    bio = current_line.replace('Bio :', '').strip()
                    section = 'bio'
                elif section == 'publications' and current_line and current_line.startswith('•'):
                    publications.append(current_line.lstrip('•').strip())
                elif section == 'publications' and current_line and current_line.startswith(' '):
                    # Publication line (may start with space or bullet)
                    clean = current_line.strip()
                    if clean and not clean.startswith('Centre'):
                        publications.append(clean)
                elif section == 'bio' and current_line:
                    if bio:
                        bio += " " + current_line
                    else:
                        bio = current_line

                i += 1

            # Create researcher object
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

# Save to JSON
output = {"researchers": researchers}
with open('researchers_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(researchers)} researchers")
for r in researchers[:5]:
    print(f"  - {r['name']} ({r['title']})")
