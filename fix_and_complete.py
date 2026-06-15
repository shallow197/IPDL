#!/usr/bin/env python3
import json

# Read current extraction
with open('researchers_extracted.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

researchers = data['researchers']

# Remove obviously bad entries (those that look like publications or project descriptions)
bad_keywords = [
    'Camembert on French Literature',
    'Développement de GAMA',
    'Enseignement au centre de préparation',
    'Promotion PDI-MSC 2015',
    'Participation',
    'Coordination de',
    'Encadrement de',
    'Enseignement',
    'Organisation de'
]

cleaned = []
for r in researchers:
    is_bad = False
    for kw in bad_keywords:
        if kw.lower() in r['name'].lower():
            is_bad = True
            break
    if not is_bad and len(r['name']) > 2 and r['name'].count(' ') >= 1:
        cleaned.append(r)

researchers = cleaned

# Now manually add the researchers we're missing
# Based on the PDF text, here are the additional researchers not captured properly

additional = [
    {
        "name": "Aïcha BALHAG",
        "title": "Chercheur",
        "center": "Centre Méditerranée",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "aichabalhag@gmail.com"
    },
    {
        "name": "Alexis DROGOUL",
        "title": "Directeur de Recherche",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": ["Directeur du LMI ACROSS"],
        "publications": [],
        "bio": "Directeur du LMI ACROSS",
        "email": "alexis.drogoul@ird.fr"
    },
    {
        "name": "Aman BERHE",
        "title": "Chercheur",
        "center": "Centre France",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning",
        "projects": ["Recherche et supervision"],
        "publications": [],
        "bio": "Recherche et supervision",
        "email": "amanzaid.berhe@ird.fr"
    },
    {
        "name": "Armel Jacques NZEKON NZEKO'O",
        "title": "Chercheur",
        "center": "Centre Afrique centrale et de l'est",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning",
        "projects": ["Promotion PDI-MSC 2015 (thèse soutenu en décembre 2019)"],
        "publications": [],
        "bio": "Promotion PDI-MSC 2015 (thèse soutenu en décembre 2019)",
        "email": "armel.nzekon@facsciences-uy1.cm"
    },
    {
        "name": "Arnaud GRIGNARD",
        "title": "Responsable de thème",
        "center": "Centre France",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection, Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": ["Chercheur affilié MIT Media Lab"],
        "publications": [],
        "bio": "Chercheur affilié MIT Media Lab",
        "email": "arnaud.grignard@ird.fr"
    },
    {
        "name": "Arthur BRUGIERE",
        "title": "Doctorant",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "arthur.brugiere@ird.fr"
    },
    {
        "name": "Berge TSANOU",
        "title": "Chercheur",
        "center": "Centre Afrique centrale et de l'est",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": ["Coordination de l'antenne UMMISCO Afrique centrale - Université de Dschang"],
        "publications": [],
        "bio": "Coordination de l'antenne UMMISCO Afrique centrale ­ Université de Dschang",
        "email": "bergetsanou@gmail.com"
    },
    {
        "name": "Chainarong KESAMOON",
        "title": "Chercheur",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": ""
    },
    {
        "name": "Christophe CAMBIER",
        "title": "Émérite",
        "center": "Centre France",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection",
        "projects": ["Encadrement de stages et de doctorants"],
        "publications": [],
        "bio": "Encadrement de stages et de doctorants",
        "email": "Christophe.Cambier@ird.fr"
    },
    {
        "name": "Christophe DENIS",
        "title": "Chercheur",
        "center": "Centre France",
        "themesDescription": "Intelligence artificielle et apprentissage profond / Approches participatives et science citoyenne",
        "projects": ["Ingénieur-chercheur IA EDF R&D / expert évaluation éthique Commission européenne / chercheur associé institut d'histoire / membre Think Tank Espérances et Algorithmes"],
        "publications": [],
        "bio": "Ingénieur-chercheur IA EDF R&D / expert évaluation éthique Commission européenne / chercheur associé institut d'histoire / membre Think Tank Espérances et Algorithmes",
        "email": "christophe.denis@sorbonne-universite.fr"
    },
    {
        "name": "Diane TCHUANI TCHAKONTE",
        "title": "Responsable de thème",
        "center": "Centre Afrique centrale et de l'est",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "diane.tchuani@gmail.com"
    },
    {
        "name": "Diaraf SECK",
        "title": "Chercheur",
        "center": "Centre Afrique de l'Ouest",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "diaraf.seck@ucad.edu.sn"
    },
    {
        "name": "Diep Anh PHUNG",
        "title": "Personnel administratif",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "diepanh.phung@ird.fr"
    },
    {
        "name": "Doanh NGUYEN-NGOC",
        "title": "Directeur de centre",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": ["Participation aux activités LMI Across/Cosmos Lab/VNCEM"],
        "publications": [],
        "bio": "Participation aux activités LMI Across/Cosmos Lab/VNCEM",
        "email": "doanhbondy@gmail.com"
    },
    {
        "name": "Dramane Sam Idris KANTE",
        "title": "Chercheur",
        "center": "Centre Méditerranée",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "dramanesamidrisk@gmail.com"
    },
    {
        "name": "Duy Dung LE",
        "title": "Chercheur",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "dung.ld@vinuni.edu.vn"
    },
    {
        "name": "Edi PRIFTI",
        "title": "Responsable de thème",
        "center": "Centre France",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "edi.prifti@ird.fr"
    },
    {
        "name": "Elhadi AIT DADS",
        "title": "Émérite",
        "center": "Centre Méditerranée",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": ["Professeur émérite - FSSM Marrakech"],
        "publications": [],
        "bio": "Professeur émérite à FSSM Marrakech",
        "email": "aitdads@uca.ac.ma"
    },
    {
        "name": "Eugeni BELDA CUESTA",
        "title": "Ingénieur de Recherche",
        "center": "Centre France",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "eugeni.belda@ird.fr"
    },
    {
        "name": "Gabriel Guilsou KOLAYE",
        "title": "Chercheur",
        "center": "Centre Afrique centrale et de l'est",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "kolayegg@gmail.com"
    },
    {
        "name": "Hamidou DATHE",
        "title": "Chercheur",
        "center": "Centre Afrique de l'Ouest",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": ["Direction du laboratoire Géométrie et Applications et responsabilité de la formation"],
        "publications": [],
        "bio": "",
        "email": ""
    },
    {
        "name": "Jalila EL GHORDAF",
        "title": "Maître de Conférence",
        "center": "Centre Méditerranée",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": ["Participation à des réunions et à des projets historiques d'UMMISCO"],
        "publications": [],
        "bio": "Participation à des réunions et à des projets historiques d'UMMISCO",
        "email": "elg_jalila@yahoo.fr"
    },
    {
        "name": "Jean-Daniel ZUCKER",
        "title": "Directeur d'Unité Adjoint",
        "center": "Centre France",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "Jean-Daniel.zucker@ird.fr"
    },
    {
        "name": "Jeanne COTTENCEAU",
        "title": "Personnel administratif",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": ["Participation au projet SIMPLE"],
        "publications": [],
        "bio": "Participation au projet SIMPLE",
        "email": "jeanne.cottenceau@ird.fr"
    },
    {
        "name": "Joseph MBANG",
        "title": "Chercheur",
        "center": "Centre Afrique centrale et de l'est",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "joseph.mbang@facsciences-uy1.cm"
    },
    {
        "name": "Justin MOSKOLAI NGOSSAHA",
        "title": "Chercheur",
        "center": "Centre Afrique centrale et de l'est",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "moskojustin@gmail.com"
    },
    {
        "name": "Kevin CHAPUIS",
        "title": "Chercheur",
        "center": "Centre France",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": ["Développement de GAMA"],
        "publications": [],
        "bio": "Développement de GAMA",
        "email": "kevin.chapuis@ird.fr"
    },
    {
        "name": "Khalil EZZINBI",
        "title": "Directeur de centre",
        "center": "Centre Méditerranée",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "ezzinbi@uca.ac.ma"
    },
    {
        "name": "Kittima LEERUTTANAWISUT",
        "title": "Chercheur",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "kittimalee@hotmail.com"
    },
    {
        "name": "Lahcen LHACHIMI",
        "title": "Chercheur",
        "center": "Centre Méditerranée",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": ["Enseignement au centre de préparation à l'agrégation de mathématiques"],
        "publications": [],
        "bio": "Enseignement au centre de préparation à l'agrégation de mathématiques",
        "email": "66LHACHIMI@gmail.com"
    },
    {
        "name": "Lahcen MANIAR",
        "title": "Chercheur",
        "center": "Centre Méditerranée",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "lahcenmaniar@gmail.com"
    },
    {
        "name": "Mai Chi NGUYEN",
        "title": "Chercheur",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "mai-chi.nguyen@ird.fr"
    },
    {
        "name": "Maurice TCHUENTE",
        "title": "Émérite",
        "center": "Centre Afrique centrale et de l'est",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning",
        "projects": ["Encadrement de doctorant"],
        "publications": [],
        "bio": "Encadrement de doctorant",
        "email": "Maurice.Tchuente@gmail.com"
    },
    {
        "name": "Mohamed HALLOUMI",
        "title": "Chercheur",
        "center": "Centre Méditerranée",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "m.halloumi@uca.ac.ma"
    },
    {
        "name": "Mohd Hafiz Bin MOHD",
        "title": "Chercheur",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": ["Participation à COSMOS Workshop"],
        "publications": [],
        "bio": "Participation à COSMOS Workshop",
        "email": "mohdhafizmohd@usm.my"
    },
    {
        "name": "Nicolas FLORSCH",
        "title": "Émérite",
        "center": "Centre France",
        "themesDescription": "Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "nicolas.florsch@gmail.com"
    },
    {
        "name": "Nicolas TURENNE",
        "title": "Chercheur",
        "center": "Centre France",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "nicolas.turenne@ird.fr"
    },
    {
        "name": "Nisrine OUTADA",
        "title": "Responsable de thème; Directeur de centre adjoint",
        "center": "Centre Méditerranée",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "nisrine.outada@uca.ac.ma"
    },
    {
        "name": "Nohayla ALAOUI",
        "title": "Chercheur",
        "center": "Centre Méditerranée",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "alaouinohayla0607@gmail.com"
    },
    {
        "name": "Olga KENGNI NGANGMO",
        "title": "Chercheur",
        "center": "Centre Afrique centrale et de l'est",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "olgakengni@gmail.com"
    },
    {
        "name": "Ousmane THIARE",
        "title": "Chercheur",
        "center": "Centre Afrique de l'Ouest",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "ousmane.thiare@ugb.edu.sn"
    },
    {
        "name": "Paulin MELATAGIA YONTA",
        "title": "Directeur de centre adjoint",
        "center": "Centre Afrique centrale et de l'est",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning",
        "projects": ["Participation à des projets de recherche et à la conférence CRI"],
        "publications": [],
        "bio": "Participation à des projets de recherche et à la conférence CRI",
        "email": "paulinyonta@gmail.com"
    },
    {
        "name": "Pierre AUGER",
        "title": "Émérite",
        "center": "Centre France",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "pierre.auger@ird.fr"
    },
    {
        "name": "Pierre sylvain ILOGA BIYIK",
        "title": "Chercheur",
        "center": "Centre Afrique centrale et de l'est",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "sylvain.iloga@gmail.com"
    },
    {
        "name": "Prachya Rachya RACHYA BOONPRASURT",
        "title": "Chercheur",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": ["Collaboration avec Simulation Center"],
        "publications": [],
        "bio": "Collaboration avec Simulation Center",
        "email": "pachalow.g@gmail.com"
    },
    {
        "name": "Quang Nghi HUYNH",
        "title": "Chercheur",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "hqnghi@ctu.edu.vn"
    },
    {
        "name": "Raphaël DUBOZ",
        "title": "Chercheur",
        "center": "Centre Afrique de l'Ouest",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "raphael.duboz@cirad.fr"
    },
    {
        "name": "René NDOUNDAM",
        "title": "Chercheur",
        "center": "Centre Afrique centrale et de l'est",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "ndoundam@yahoo.com"
    },
    {
        "name": "Said BOULITE",
        "title": "Chercheur",
        "center": "Centre Méditerranée",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "s.boulite@uca.ma"
    },
    {
        "name": "Thi Hai Van DINH",
        "title": "Directeur de centre adjoint",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "dinhthihaivan@vnua.edu.vn"
    },
    {
        "name": "Thi Hoai Phuong TRAN",
        "title": "Chercheur",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "25phuong.tth@vinuni.edu.vn"
    },
    {
        "name": "Thi Phuong Linh HUYNH",
        "title": "Chercheur",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "linh.huynh-thi-phuong@ird.fr"
    },
    {
        "name": "Thi Thuy NGUYEN",
        "title": "Responsable de thème",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "thuy.nguyen43@rmit.edu.vn"
    },
    {
        "name": "Timothée BROCHIER",
        "title": "Responsable de thème",
        "center": "Centre France",
        "themesDescription": "Capteurs et collecte de données / Sensors and data collection",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "timothee.brochier@ird.fr"
    },
    {
        "name": "Tri NGUYEN-HUU",
        "title": "Responsable de thème",
        "center": "Centre France",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Approches participatives et science citoyenne / Participatory approaches and citizen science",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "tri.nguyen-huu@ird.fr"
    },
    {
        "name": "Tuong Vinh HO",
        "title": "Chercheur",
        "center": "Centre Asie du Sud-Est",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning",
        "projects": [],
        "publications": [],
        "bio": "",
        "email": "ho.tuong.vinh@gmail.com"
    },
    {
        "name": "Youcef SKLAB",
        "title": "Chercheur",
        "center": "Centre France",
        "themesDescription": "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning",
        "projects": ["Enseignement"],
        "publications": [],
        "bio": "Enseignement",
        "email": "youcef.sklab@ird.fr"
    }
]

# Combine and deduplicate
all_researchers = cleaned + additional
seen = set()
final = []
for r in all_researchers:
    if r['name'] not in seen:
        final.append(r)
        seen.add(r['name'])

# Sort by name
final.sort(key=lambda x: x['name'])

# Save
output = {"researchers": final}
with open('researchers_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Final extraction: {len(final)} researchers")
for i, r in enumerate(final, 1):
    print(f"  {i:2d}. {r['name']:40s} | {r['title'][:30]:30s} | {r['email']}")
