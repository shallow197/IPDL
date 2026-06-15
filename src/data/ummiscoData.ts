// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Researcher {
  id: string;
  name: string;
  title: string;
  orcid?: string;
  axes: string[];
  bio: string;
  email?: string;
  avatarSeed: string;
  /** URL vers la photo locale (public/photos/) ou DiceBear en fallback */
  photoUrl: string;
  publicationsCount: number;
  center: string;
  role: "directeur_centre" | "directeur_unite" | "responsable_theme" | "chercheur" | "doctorant" | "emerite" | "ingenieur";
  /** Thèmes détaillés en anglais et français */
  themesDescription?: string;
  /** Projets spécifiques du chercheur */
  projects?: string[];
  /** Liste des publications avec détails */
  publications?: { title: string; year?: number }[];
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  researcherIds: string[];
  year: number;
  axis: string;
  abstract: string;
  citationApa: string;
  citationBibtex: string;
  accessLevel: "public" | "protected" | "private";
  doi?: string;
  journal?: string;
}

export interface Dataset {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  year: number;
  size: string;
  accessLevel: "public" | "protected" | "private";
  downloads: number;
  type?: string;
  licence?: string;
}

export interface SeminarEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  speaker: string;
  description: string;
  type?: "seminaire" | "conference" | "atelier";
}

export interface Center {
  id: string;
  name: string;
  country: string;
  city: string;
  tutelle: string;
  director: string;
  description: string;
  themes: string[];
  partners?: string[];
  /** Position géographique (pour la carte du monde). */
  coords?: { lat: number; lon: number };
}

export interface Project {
  id: string;
  name: string;
  centers: string[];
  themes: string[];
  domain: string;
  description: string;
  url?: string;
  image?: string;
  chefProjet?: string;
  duree?: string;
  dateDebut?: string;
  budget?: string;
  institutionPorteuse?: string;
  financement?: string;
  partenaires?: string;
}

export interface SoftwareTool {
  id: string;
  name: string;
  description: string;
  since?: string;
  tags: string[];
  website?: string;
  github?: string;
}

// ─── Axes officiels UMMISCO UMI 209 ──────────────────────────────────────────

export const AXES = [
  {
    id: "agents",
    name: "Modélisation mathématique et informatique à base d'agents",
    shortName: "Agents & Modélisation",
    color: "from-blue-600 to-indigo-700",
    description:
      "Modèles multi-agents, équations différentielles, hybridation. Applications : épidémiologie, dynamique des populations, ressources en eau, trafic.",
  },
  {
    id: "ia",
    name: "Intelligence Artificielle et Apprentissage Profond",
    shortName: "IA & Deep Learning",
    color: "from-violet-600 to-purple-700",
    description:
      "Apprentissage profond, méthodes interprétables, IA embarquée et frugale. Applications : santé, biodiversité, langues africaines, mobilité urbaine.",
  },
  {
    id: "capteurs",
    name: "Capteurs et collecte de données",
    shortName: "Capteurs & IoT",
    color: "from-green-600 to-emerald-700",
    description:
      "Capteurs open-source à faible coût, déploiement terrain, assimilation de données. Applications : qualité de l'air, irrigation, biosignaux, bioacoustique.",
  },
  {
    id: "participatif",
    name: "Approches participatives et science citoyenne",
    shortName: "Science citoyenne",
    color: "from-amber-600 to-orange-700",
    description:
      "Modélisation participative, jeux sérieux, interfaces tangibles, réalité virtuelle. Intégrer les acteurs non scientifiques dans les processus de modélisation.",
  },
];

// ─── Centres UMMISCO ──────────────────────────────────────────────────────────

export const CENTERS: Center[] = [
  {
    id: "france",
    name: "Centre France",
    country: "France",
    city: "Bondy / Sorbonne Université",
    tutelle: "IRD & Sorbonne Université",
    director: "Nicolas Marilleau",
    description:
      "Siège historique avec un cluster HPC de +1700 cœurs et le FabLab cofab-in-Bondy. Expertise : couplage de modèles, jumeau numérique, simulation distribuée à grande échelle.",
    themes: ["agents", "ia", "capteurs", "participatif"],
    partners: ["IRD", "Sorbonne Université", "iEES-Paris", "LOCEAN"],
    coords: { lat: 48.9, lon: 2.45 },
  },
  {
    id: "asie",
    name: "Centre Asie du Sud-Est",
    country: "Vietnam",
    city: "Hanoï (VinUniversity)",
    tutelle: "VinUniversity",
    director: "Alexis Drogoul",
    description:
      "Créateur de la plateforme GAMA (2007). Recherche sur l'environnement, la gestion de l'eau, la santé publique et la pêche dans le delta du Mékong.",
    themes: ["agents", "participatif"],
    partners: ["VinUniversity", "VIASM", "RMIT (Melbourne)", "Université de Thuy Loi (Hanoï)"],
    coords: { lat: 21.03, lon: 105.85 },
  },
  {
    id: "afrique-ouest",
    name: "Centre Afrique de l'Ouest",
    country: "Sénégal",
    city: "Dakar (UCAD)",
    tutelle: "Université Cheikh Anta Diop",
    director: "Alassane BAH",
    description:
      "Étude des socio-écosystèmes sahéliens, pêche artisanale, neutralité carbone (Grande Muraille Verte). Simulateur MAELIA et projet FORA.",
    themes: ["agents", "ia", "capteurs", "participatif"],
    partners: ["UCAD", "Université Gaston Berger", "Université Assane Seck (Ziguinchor)", "CIRAD", "ISRA-CDH"],
    coords: { lat: 14.69, lon: -17.45 },
  },
  {
    id: "afrique-centrale",
    name: "Centre Afrique centrale et de l'est",
    country: "Cameroun",
    city: "Yaoundé (Université de Yaoundé 1)",
    tutelle: "Université de Yaoundé 1",
    director: "Diane TC Tchako",
    description:
      "Modélisation des épidémies et maladies des cultures tropicales. Approche One Health reliant santé humaine, animale et environnementale.",
    themes: ["agents", "ia", "capteurs"],
    partners: ["Université de Yaoundé 1", "Université de Douala", "Université de Dschang"],
    coords: { lat: 3.87, lon: 11.52 },
  },
  {
    id: "mediterranee",
    name: "Centre Méditerranée",
    country: "Maroc",
    city: "Marrakech (Université Cadi Ayyad)",
    tutelle: "Université Cadi Ayyad",
    director: "Khalil Ezzinbi",
    description:
      "Modélisation mathématique multi-échelle, théorie cinétique des particules actives, théorie des essaims. Domaines : santé publique, eau, mobilité, biodiversité.",
    themes: ["agents", "ia", "capteurs"],
    partners: ["Université Cadi Ayyad (FST)", "Laboratoire LMDP", "Université du Luxembourg", "Université de Grenade"],
    coords: { lat: 31.63, lon: -8.0 },
  },
];

// ─── Chercheurs — 94 membres officiels UMMISCO UMI 209 (ordre alphabétique) ──

export const RESEARCHERS: Researcher[] = [
  {
    id: "achraf-chakri", name: "Achraf CHAKRI",
    title: "Doctorant — Centre Méditerranée", role: "doctorant", center: "mediterranee",
    axes: ["agents", "ia"],
    bio: "Doctorant en modélisation hydrogéologique au Centre Méditerranée. Recherches sur la simulation multi-agents des systèmes aquifères et modélisation des ressources en eau.",
    email: "achraf.chakri@ced.uca.ma",
    avatarSeed: "AC", photoUrl: "/photos/achraf-chakri.png", publicationsCount: 0,
  },
  {
    id: "ahmad-fall", name: "Ahmad FALL",
    title: "Chercheur — Centre France", role: "chercheur", center: "france",
    axes: ["ia"],
    bio: "Chercheur au Centre France / IRD. Travaux en apprentissage profond appliqué aux données environnementales et à la dynamique des écosystèmes.",
    email: "ahmad.fall@ird.fr",
    avatarSeed: "AF", photoUrl: "/photos/ahmad-fall.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning",
    projects: ["Enseignements"]
  },
  {
    id: "aicha-balhag", name: "Aïcha BALHAG",
    title: "Chercheuse — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["ia"],
    bio: "Chercheuse à l'Université Cadi Ayyad. Experte en intelligence artificielle pour la santé et en analyse de biosignaux (projet AIME).",
    email: "aichabalhag@gmail.com",
    avatarSeed: "AB", photoUrl: "/photos/aicha-balhag.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "aicha-sabiq", name: "Aicha SABIQ",
    title: "Doctorante — Centre Méditerranée", role: "doctorant", center: "mediterranee",
    axes: ["agents"],
    bio: "Doctorante à l'Université Cadi Ayyad. Recherches sur la modélisation des systèmes hydrologiques et la gestion des ressources en eau au Maroc.",
    email: "aichasabiq1@gmail.com",
    avatarSeed: "AS", photoUrl: "/photos/aicha-sabiq.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "alassane-bah", name: "Alassane BAH",
    title: "Directeur du Centre Afrique de l'Ouest", role: "directeur_centre", center: "afrique-ouest",
    axes: ["agents", "participatif"],
    bio: "Directeur du Centre Afrique de l'Ouest (UCAD). Spécialiste de la modélisation des socio-écosystèmes sahéliens et de la Grande Muraille Verte.",
    email: "alassane.bah@esp.sn", orcid: "0000-0002-7341-1023",
    avatarSeed: "AB", photoUrl: "/photos/alassane-bah.png", publicationsCount: 11,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection, Approches participatives et science citoyenne / Participatory approaches and citizen science",
    publications: [
      { title: "On the sylvatic transmission of T. cruzi, the parasite causing Chagas disease: a view from an agent-based model" },
      { title: "Numerical treatment of a non local model for phytoplankton agregation" },
      { title: "A bottom-up participatory modelling process for a multi-level agreement on environmental uncertainty management in West Africa," },
      { title: "L'approche participative, incrémentale et itérative en modélisation : un changement profond de cadre méthodologique. Exemple d'une modélisation multiniveau pour l'élaboration de politiques foncières au Sahel." },
      { title: "Un modèle à base d'agents sur la transmission et la diffusion de la fièvre de la vallée du rift à Barkédji (Ferlo, Sénégal)" },
      { title: "Ongoing change in extensive livestock systems: comparative analysis of local dynamics at the small region level on three continents" },
      { title: "Vers un métamodèle pour analyser les systèmes d'élevage extensifs et leurs interactions avec les territoires. Etude originale" },
      { title: "Récolte de bois de feu au Niger et une généralisation de la formule de Faustmann" },
      { title: "An agent-based Implementation of the Torado Model" },
      { title: "An agent-based model to study land allocation policies and their effect on pastoral and territorial dynamics in the Ferlo (Sénégal)." },
      { title: "On the optimal size and number of reserves in a multi-site fishery model" },
    ],
  },
  {
    id: "alexis-drogoul", name: "Alexis DROGOUL",
    title: "Directeur de Recherche — Centre Asie du Sud-Est", role: "directeur_centre", center: "asie",
    axes: ["agents", "participatif"],
    bio: "Directeur du LMI ACROSS. Créateur de la plateforme GAMA (2007), pionnier mondial de la simulation multi-agents pour le développement durable.",
    email: "alexis.drogoul@ird.fr", orcid: "0000-0001-7283-4920",
    avatarSeed: "AD", photoUrl: "/photos/alexis-drogoul.png", publicationsCount: 0,
  },
  {
    id: "aman-berhe", name: "Aman BERHE",
    title: "Chercheur — Centre France", role: "chercheur", center: "france",
    axes: ["ia"],
    bio: "Chercheur à Sorbonne Université. Recherches en apprentissage profond et modélisation des systèmes agro-environnementaux.",
    email: "amanzaid.berhe@ird.fr",
    avatarSeed: "AB", photoUrl: "/photos/aman-berhe.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning",
    projects: ["Recherche et supervision"]
  },
  {
    id: "armel-jacques-nzekon-nzekoo", name: "Armel Jacques NZEKON NZEKO'O",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["ia"],
    bio: "Chercheur à l'Université de Yaoundé I. Spécialisé en modélisation épidémiologique et en apprentissage profond pour le traitement automatique du langage.",
    email: "armel.nzekon@facsciences-uy1.cm",
    avatarSeed: "AN", photoUrl: "/photos/armel-jacques-nzekon-nzekoo.png", publicationsCount: 0,
  },
  {
    id: "arnaud-grignard", name: "Arnaud GRIGNARD",
    title: "Responsable de thème — Centre France", role: "responsable_theme", center: "france",
    axes: ["agents", "participatif"],
    bio: "Chercheur affilié MIT Media Lab et IRD. Expert en simulation urbaine, jumeaux numériques et systèmes complexes (Hamburg Energy Twin).",
    email: "arnaud.grignard@ird.fr",
    avatarSeed: "AG", photoUrl: "/photos/arnaud-grignard.png", publicationsCount: 0,
  },
  {
    id: "arthur-brugiere", name: "Arthur BRUGIERE",
    title: "Doctorant — Centre Asie du Sud-Est", role: "doctorant", center: "asie",
    axes: ["agents"],
    bio: "Doctorant au LMI ACROSS. Spécialisé dans la distribution et la parallélisation des modèles à base d'agents sur clusters HPC (Distribution Model, PAAMS 2025).",
    email: "arthur.brugiere@ird.fr",
    avatarSeed: "AR", photoUrl: "/photos/arthur-brugiere.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "awa-diattara", name: "Awa DIATTARA",
    title: "Responsable de thème — Centre Afrique de l'Ouest", role: "responsable_theme", center: "afrique-ouest",
    axes: ["ia", "participatif"],
    bio: "Responsable de thème à l'Université Gaston Berger. Spécialiste de la modélisation participative des systèmes socio-environnementaux et de la science citoyenne.",
    email: "awa.diattara@ugb.edu.sn", orcid: "0000-0003-1295-4820",
    avatarSeed: "AW", photoUrl: "/photos/awa-diattara.png", publicationsCount: 0,
  },
  {
    id: "berge-tsanou", name: "Berge TSANOU",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents"],
    bio: "Chercheur à l'Université de Dschang. Coordinateur antenne UMMISCO Afrique centrale. Spécialiste de la modélisation mathématique des épidémies.",
    email: "bergetsanou@gmail.com", orcid: "0000-0003-2019-4812",
    avatarSeed: "BT", photoUrl: "/photos/berge-tsanou.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: ["Coordination de l'antenne UMMISCO Afrique centrale - Université de Dschang"]
  },
  {
    id: "chainarong-kesamoon", name: "Chainarong KESAMOON",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "participatif"],
    bio: "Chercheur à Thammasat University. Modélisation des dynamiques sociales et environnementales en Asie du Sud-Est avec GAMA.",
    avatarSeed: "CK", photoUrl: "/photos/chainarong-kesamoon.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Approches participatives et science citoyenne / Participatory approaches and citizen science"
  },
  {
    id: "chien-pham-van", name: "Chien PHAM VAN",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "ia", "capteurs"],
    bio: "Chercheur à Thuyloi University. Spécialisé en modélisation des systèmes hydrologiques, organisation de la Summer School UMMISCO.",
    email: "Pchientvct_tv@tlu.edu.vn",
    avatarSeed: "CP", photoUrl: "/photos/chien-pham-van.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection",
    projects: ["Organisation de la Summer School"]
  },
  {
    id: "christophe-cambier", name: "Christophe CAMBIER",
    title: "Chercheur Émérite — Centre France", role: "emerite", center: "france",
    axes: ["agents", "ia", "capteurs"],
    bio: "Chercheur émérite à Sorbonne Université. Encadrement de stages et de doctorants. Expert en modélisation des systèmes complexes.",
    email: "Christophe.Cambier@ird.fr",
    avatarSeed: "CC", photoUrl: "/photos/christophe-cambier.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection",
    projects: ["Encadrement de stages et de doctorants"]
  },
  {
    id: "christophe-denis", name: "Christophe DENIS",
    title: "Chercheur — Centre France", role: "chercheur", center: "france",
    axes: ["ia"],
    bio: "Ingénieur-chercheur IA chez EDF R&D et Sorbonne Université. Modélisation computationnelle des processus biologiques.",
    email: "christophe.denis@sorbonne-universite.fr",
    avatarSeed: "CD", photoUrl: "/photos/christophe-denis.png", publicationsCount: 0,
    themesDescription: "Intelligence artificielle et apprentissage profond / Approches participatives et science citoyenne",
    projects: ["Ingénieur-chercheur IA EDF R&D / expert évaluation éthique Commission européenne / chercheur associé institut d’histoire / membre Think Tank Espérances et Algorithmes"]
  },
  {
    id: "diane-tchuani-tchakonte", name: "Diane TCHUANI TCHAKONTE",
    title: "Responsable de thème — Centre Afrique centrale et de l'est", role: "responsable_theme", center: "afrique-centrale",
    axes: ["ia", "capteurs"],
    bio: "Responsable de thème à l'Université d'Ebolowa. Spécialiste de la modélisation mathématique et de l'IA appliquée à la santé.",
    email: "diane.tchuani@gmail.com",
    avatarSeed: "DT", photoUrl: "/photos/diane-tchuani-tchakonte.png", publicationsCount: 0,
  },
  {
    id: "diaraf-seck", name: "Diaraf SECK",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents"],
    bio: "Chercheur à UCAD. Expert en modélisation mathématique et en applications de l'IA aux problèmes de développement en Afrique.",
    email: "diaraf.seck@ucad.edu.sn",
    avatarSeed: "DS", photoUrl: "/photos/diaraf-seck.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "diep-anh-phung", name: "Diep Anh PHUNG",
    title: "Personnel administratif — Centre Asie du Sud-Est", role: "ingenieur", center: "asie",
    axes: ["participatif"],
    bio: "Personnel administratif et de coordination au LMI ACROSS (VinUniversity). Participation au projet SIMPLE.",
    email: "diepanh.phung@ird.fr",
    avatarSeed: "DP", photoUrl: "/photos/diep-anh-phung.png", publicationsCount: 0,
  },
  {
    id: "doanh-nguyen-ngoc", name: "Doanh NGUYEN-NGOC",
    title: "Directeur de centre — Centre Asie du Sud-Est", role: "directeur_centre", center: "asie",
    axes: ["agents", "participatif"],
    bio: "Directeur du Centre Asie du Sud-Est (VinUniversity). Participation aux activités du LMI ACROSS. Expert en modélisation multi-agents.",
    email: "doanhbondy@gmail.com",
    avatarSeed: "DN", photoUrl: "/photos/doanh-nguyen-ngoc.png", publicationsCount: 0,
  },
  {
    id: "dramane-kante", name: "Dramane Sam Idris KANTE",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur à l'Université Cadi Ayyad. Modélisation mathématique et systèmes complexes.",
    email: "dramanesamidrisk@gmail.com",
    avatarSeed: "DK", photoUrl: "/photos/dramane-kante.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "duy-dung-le", name: "Duy Dung LE",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["ia", "capteurs"],
    bio: "Chercheur à VinUniversity. Expert en modélisation épidémiologique (tuberculose, COVID-19) et développement d'outils de visualisation géospatiale.",
    email: "dung.ld@vinuni.edu.vn", orcid: "0000-0002-8120-4938",
    avatarSeed: "DL", photoUrl: "/photos/duy-dung-le.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection"
  },
  {
    id: "edi-prifti", name: "Edi PRIFTI",
    title: "Responsable de thème — Centre France", role: "responsable_theme", center: "france",
    axes: ["ia"],
    bio: "Responsable du thème IA au Centre France / IRD. Spécialiste de l'apprentissage profond appliqué à la santé et à la nutrition.",
    email: "edi.prifti@ird.fr",
    avatarSeed: "EP", photoUrl: "/photos/edi-prifti.png", publicationsCount: 0,
  },
  {
    id: "elhadi-ait-dads", name: "Elhadi AIT DADS",
    title: "Chercheur Émérite — Centre Méditerranée", role: "emerite", center: "mediterranee",
    axes: ["agents"],
    bio: "Professeur émérite à l'Université Cadi Ayyad. Expert en équations différentielles fonctionnelles et en systèmes dynamiques non-linéaires.",
    email: "aitdads@uca.ac.ma",
    avatarSeed: "EA", photoUrl: "/photos/elhadi-ait-dads.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: ["Professeur émérite - FSSM Marrakech"],
    publications: [{ title: "Existence results for Riemann–Liouville fractional evolution inclusions in Banach spaces" }, { title: "Exponential Dichotomy and (μ, ν)-Pseudo almost automorphic soluntions for some ordinary differential equations" }, { title: "Study of existence, uniqueness and egularity of the solution of double delay nonlinear integral equation" }, { title: "The impact of water level fluctuations on a delayed prey–predator model" }, { title: "On the integro‐differential equations with reflection" }]
  },
  {
    id: "eugeni-belda", name: "Eugeni BELDA CUESTA",
    title: "Ingénieur de Recherche — Centre France", role: "ingenieur", center: "france",
    axes: ["ia"],
    bio: "Ingénieur de recherche IA à Sorbonne Université / IRD. Expert en bio-informatique, analyse du microbiome et pipelines omiques.",
    email: "eugeni.belda@ird.fr", orcid: "0000-0002-3847-1920",
    avatarSeed: "EB", photoUrl: "/photos/eugeni-belda.png", publicationsCount: 0,
  },
  {
    id: "gabriel-guilsou-kolaye", name: "Gabriel Guilsou KOLAYE",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents"],
    bio: "Chercheur à l'University of Maroua. Expert en modélisation des cultures tropicales et de l'épidémiologie agricole.",
    email: "kolayegg@gmail.com",
    avatarSeed: "GK", photoUrl: "/photos/gabriel-guilsou-kolaye.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "hai-au-pham", name: "Hai Au PHAM",
    title: "Personnel administratif — Centre Asie du Sud-Est", role: "ingenieur", center: "asie",
    axes: ["participatif"],
    bio: "Personnel administratif au LMI ACROSS. Coordination logistique et support aux projets de recherche.",
    email: "hai_au.pham@ird.fr",
    avatarSeed: "HP", photoUrl: "/photos/hai-au-pham.png", publicationsCount: 0,
  },
  {
    id: "hamidou-a-diallo", name: "Hamidou A DIALLO",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur à l'Université Cadi Ayyad. Modélisation mathématique et systèmes complexes.",
    email: "hamidoua.diallo.1@gmail.com",
    avatarSeed: "HD", photoUrl: "/photos/hamidou-a-diallo.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "hamidou-dathe", name: "Hamidou DATHE",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents"],
    bio: "Chercheur à UCAD. Directeur du laboratoire Géométrie et Applications. Travaux sur les systèmes pastoraux sahéliens.",
    avatarSeed: "HD", photoUrl: "/photos/hamidou-dathe.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: ["Direction du laboratoire Géométrie et Applications et responsabilité de la formation"]
  },
  {
    id: "hamza-adamou", name: "Hamza ADAMOU",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["ia", "capteurs"],
    bio: "Chercheur à l'Université de Yaoundé I. Spécialisé en apprentissage profond et modélisation épidémiologique.",
    email: "admhamza@gmail.com",
    avatarSeed: "HA", photoUrl: "/photos/hamza-adamou.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection"
  },
  {
    id: "hamza-elouiaazzani", name: "Hamza ELOUIAAZZANI",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents", "ia", "capteurs"],
    bio: "Chercheur à l'Université Cadi Ayyad. Expert en IA pour les écosystèmes marins (AIME) et surveillance environnementale (AIRQALY-4-ASMAFRI).",
    avatarSeed: "HE", photoUrl: "/photos/hamza-elouiaazzani.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection"
  },
  {
    id: "hippolyte-tapamo-kenfack", name: "Hippolyte Michel TAPAMO KENFACK",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["ia", "participatif"],
    bio: "Chercheur à l'Université de Yaoundé I. Expert en traitement automatique du langage naturel et de la parole pour les langues africaines.",
    email: "hippolyte.tapamo@facsciences-uy1.cm",
    avatarSeed: "HK", photoUrl: "/photos/hippolyte-tapamo-kenfack.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning, Approches participatives et science citoyenne / Participatory approaches and citizen science",
    projects: ["Organisation de séminaires et conférences"]
  },
  {
    id: "huy-dung-han", name: "Huy-Dung HAN",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "ia", "capteurs", "participatif"],
    bio: "Chercheur à Hanoi University of Science and Technology. Modélisation de la dynamique côtière et des systèmes d'alerte précoce.",
    email: "dung.hanhuy@hust.edu.vn",
    avatarSeed: "HN", photoUrl: "/photos/huy-dung-han.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection, Approches participatives et science citoyenne / Participatory approaches and citizen science"
  },
  {
    id: "ivric-valaire-yatat-djeumen", name: "Ivric Valaire YATAT DJEUMEN",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents"],
    bio: "Chercheur à l'Université de Yaoundé I. Expert en modélisation mathématique des dynamiques forêt-savane et des processus écologiques.",
    email: "yatat.valaire@gmail.com",
    avatarSeed: "IY", photoUrl: "/photos/ivric-valaire-yatat-djeumen.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "jalila-el-ghordaf", name: "Jalila EL GHORDAF",
    title: "Maître de Conférence — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Maître de Conférence au CRMEF Béni Mellal. Expert en dynamique des populations et gestion durable des ressources en eau.",
    email: "elg_jalila@yahoo.fr", orcid: "0000-0003-4829-1029",
    avatarSeed: "JG", photoUrl: "/photos/jalila-el-ghordaf.png", publicationsCount: 0,
  },
  {
    id: "jean-daniel-zucker", name: "Jean-Daniel ZUCKER",
    title: "Directeur d'Unité Adjoint — Centre France", role: "directeur_unite", center: "france",
    axes: ["agents", "ia"],
    bio: "Directeur d'unité adjoint IRD. Pionnier de l'apprentissage profond appliqué à la santé (microbiome, métabolome, ECG).",
    email: "Jean-Daniel.zucker@ird.fr", orcid: "0000-0003-0021-7438",
    avatarSeed: "JZ", photoUrl: "/photos/jean-daniel-zucker.png", publicationsCount: 0,
  },
  {
    id: "jean-jules-tewa", name: "Jean-Jules TEWA",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents", "participatif"],
    bio: "Chercheur à l'Université de Yaoundé I. Expert en modélisation mathématique des maladies infectieuses tropicales et stratégies de prévention.",
    email: "jean-jules.tewa@ird.fr", orcid: "0000-0001-9384-2031",
    avatarSeed: "JT", photoUrl: "/photos/jean-jules-tewa.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Approches participatives et science citoyenne / Participatory approaches and citizen science",
    publications: [{ title: "Modelling and analysis of a within-host model of hepatitis B and D co-infections" }, { title: "Control Model of Banana Black Sigatoka Disease with Seasonality" }, { title: "Optimal Strategy in a Two Resources Two Consumers Grazing Model" }, { title: "Multi-seasonal modelling of the African maize stalk borer with assessment of crop residue management" }, { title: "Dynamics of human schistosomiasis model with hybrid miracidium and cercariae" }, { title: "Mathematical modelling of Banana Black Sigatoka Disease with delay and Seasonality" }, { title: "Optimal intervention strategies of staged progression HIV infections through an age-structured model with probabilities of ART drop out" }, { title: "Optimal and sustainable management of a soilborne banana pest" }, { title: "Modelling and control of a banana soilborne pest in a multi-seasonal framework" }, { title: "Optimal intervention strategies of a SI-HIV models with differential infectivity and time delays" }, { title: "Hopf bifurcation analysis in a delayed Leslie–Gower predator–prey model incorporating additional food for predators, refuge and threshold harvesting of preys" }, { title: "Hopf Bifurcation in a Delayed Herd Harvesting Model and Herbivory Optimization Hypothesis" }, { title: "Hopf bifurcation in a grazing system with two delays" }, { title: "Theoretical assessment of the impact of environmental contamination on the dynamical transmission of polio" }, { title: "Analysis of an Age-structured SIL model" }, { title: "A Generic Modelling of Fire Impact in a Tree-Grass Savanna Model" }, { title: "Mathematical Analysis of a Size Structured Tree-Grass Competition Model for Savanna Ecosystems" }]
  },
  {
    id: "jean-marie-dembele", name: "Jean Marie DEMBELE",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents", "ia"],
    bio: "Chercheur à l'Université Gaston Berger. Expert en modélisation des socio-écosystèmes sahéliens et dynamiques de la végétation.",
    email: "jean-marie.dembele@ugb.edu.sn",
    avatarSeed: "JD", photoUrl: "/photos/jean-marie-dembele.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning"
  },
  {
    id: "jeanne-cottenceau", name: "Jeanne COTTENCEAU",
    title: "Personnel administratif — Centre Asie du Sud-Est", role: "ingenieur", center: "asie",
    axes: ["agents"],
    bio: "Coordinatrice administrative du LMI ACROSS. Support à la gestion de projets et aux partenariats internationaux, participation projet SIMPLE.",
    email: "jeanne.cottenceau@ird.fr",
    avatarSeed: "JC", photoUrl: "/photos/jeanne-cottenceau.png", publicationsCount: 0,
  },
  {
    id: "jihad-zahir", name: "Jihad ZAHIR",
    title: "Directeur d'Unité Adjoint — Centre Méditerranée", role: "directeur_unite", center: "mediterranee",
    axes: ["ia", "agents"],
    bio: "Directeur d'Unité Adjoint au Centre Méditerranée. Spécialisé en modélisation mathématique et IA pour les systèmes complexes.",
    avatarSeed: "JZ", photoUrl: "/photos/jihad-zahir.png", publicationsCount: 0,
  },
  {
    id: "joseph-mbang", name: "Joseph MBANG",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents"],
    bio: "Chercheur à l'Université de Yaoundé I. Spécialisé en modélisation mathématique des systèmes épidémiques et applications de l'IA.",
    email: "joseph.mbang@facsciences-uy1.cm",
    avatarSeed: "JM", photoUrl: "/photos/joseph-mbang.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "jules-brice-tchatchieng-mbougua", name: "Jules Brice TCHATCHIENG MBOUGUA",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents", "ia"],
    bio: "Chercheur au Centre Pasteur du Cameroun. Expert en modélisation des cultures tropicales et IA appliquée à la santé.",
    email: "tchatchueng@pasteur-yaounde.org",
    avatarSeed: "JB", photoUrl: "/photos/jules-brice-tchatchieng-mbougua.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning"
  },
  {
    id: "justin-moskolai-ngossaha", name: "Justin MOSKOLAI NGOSSAHA",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["ia"],
    bio: "Chercheur à l'Université de Douala. Spécialisé en apprentissage multi-modal et algorithmes d'apprentissage profond pour la santé.",
    email: "moskojustin@gmail.com",
    avatarSeed: "JN", photoUrl: "/photos/justin-moskolai-ngossaha.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning"
  },
  {
    id: "kevin-chapuis", name: "Kevin CHAPUIS",
    title: "Chercheur — Centre France", role: "chercheur", center: "france",
    axes: ["agents", "participatif"],
    bio: "Chercheur IRD au Centre France. Expert en modélisation comportementale, développement de GAMA et simulation de systèmes socio-environnementaux.",
    email: "kevin.chapuis@ird.fr",
    avatarSeed: "KC", photoUrl: "/photos/kevin-chapuis.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Approches participatives et science citoyenne / Participatory approaches and citizen science",
    projects: ["Développement de GAMA"],
    publications: [{ title: "Dealing with mixed and non-normative traffic. An agent-based simulation with the GAMA platform" }, { title: "Exploring multi-modal evacuation strategies for a landlocked population using large-scale agent-based simulations" }, { title: "Using the COMOKIT model to study the impact of the morpho-functional organization of cities on the spread of COVID-19" }]
  },
  {
    id: "khalil-ezzinbi", name: "Khalil EZZINBI",
    title: "Directeur du Centre Méditerranée", role: "directeur_centre", center: "mediterranee",
    axes: ["agents"],
    bio: "Directeur du Centre Méditerranée / Université Cadi Ayyad. Lauréat du Prix Hassan II des Sciences. Expert mondial en équations différentielles.",
    email: "ezzinbi@uca.ac.ma", orcid: "0000-0002-1038-4920",
    avatarSeed: "KE", photoUrl: "/photos/khalil-ezzinbi.png", publicationsCount: 0,
  },
  {
    id: "kittima-leeruttanawisut", name: "Kittima LEERUTTANAWISUT",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["participatif"],
    bio: "Chercheuse à Thammasat University. Expert en modélisation participative des systèmes agro-forestiers en Thaïlande.",
    email: "kittimalee@hotmail.com",
    avatarSeed: "KL", photoUrl: "/photos/kittima-leeruttanawisut.png", publicationsCount: 0,
    themesDescription: "Approches participatives et science citoyenne / Participatory approaches and citizen science"
  },
  {
    id: "lahcen-lhachimi", name: "Lahcen LHACHIMI",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur au CRMEF Béni Mellal. Expert en contrôle optimal et en contrôlabilité des équations aux dérivées partielles.",
    email: "66LHACHIMI@gmail.com",
    avatarSeed: "LL", photoUrl: "/photos/lahcen-lhachimi.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: ["Enseignement au centre de préparation à l'agrégation de mathématiques"]
  },
  {
    id: "lahcen-maniar", name: "Lahcen MANIAR",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur à l'Université Cadi Ayyad. Expert en analyse fonctionnelle et systèmes d'évolution abstraits.",
    email: "lahcenmaniar@gmail.com",
    avatarSeed: "LM", photoUrl: "/photos/lahcen-maniar.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "mahmoud-baroun", name: "Mahmoud BAROUN",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur à l'Université Cadi Ayyad. Spécialisé en équations différentielles stochastiques et contrôlabilité des systèmes.",
    email: "m.baroun@uca.ac.ma",
    avatarSeed: "MB", photoUrl: "/photos/mahmoud-baroun.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "mai-chi-nguyen", name: "Mai Chi NGUYEN",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["participatif"],
    bio: "Chercheuse IRD. Expert en modélisation participative et santé publique computationnelle en Asie du Sud-Est.",
    email: "mai-chi.nguyen@ird.fr",
    avatarSeed: "MC", photoUrl: "/photos/mai-chi-nguyen.png", publicationsCount: 0,
    themesDescription: "Approches participatives et science citoyenne / Participatory approaches and citizen science"
  },
  {
    id: "maissa-mbaye", name: "Maissa MBAYE",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["ia", "capteurs"],
    bio: "Chercheuse à l'Université Gaston Berger. Spécialisée en IA appliquée aux systèmes agro-environnementaux du Sahel (projet AIME).",
    email: "maissa.mbaye@ugb.edu.sn",
    avatarSeed: "MM", photoUrl: "/photos/maissa-mbaye.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection",
    projects: ["Participation au projet AIME"]
  },
  {
    id: "mamadou-abdoul-diop", name: "Mamadou Abdoul DIOP",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents"],
    bio: "Chercheur à l'Université Gaston Berger. Expert en modélisation des dynamiques de pêche artisanale et ressources halieutiques sénégalaises.",
    email: "mamadou-abdoul.diop@ugb.edu.sn",
    avatarSeed: "MD", photoUrl: "/photos/mamadou-abdoul-diop.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    publications: [{ title: "Neutral stochastic delay partial functional integro-differential equations driven by a fractional Brownian motion" }, { title: "An ontology design pattern of the multidisciplinary and complex field of climate change" }, { title: "Mild solution of neutral stochastic partial functional integrodifferential equations with non-Lipschitz coefficients" }, { title: "Kuratowski measure of noncompactness and integro-differential equations in Banach spaces" }, { title: "Optimal Controls for Stochastic Functional Integro-differential Equation" }, { title: "Mathematical Analysis of Fasciola Epidemic Model with Treatment and Quarantine" }, { title: "Optimal control for semilinear integrodifferential evolution equations in Banach spaces" }, { title: "Well-posedness and approximate controllability for some integrodifferential evolution systems with multi-valued nonlocal conditions" }]
  },
  {
    id: "mamadou-sy", name: "Mamadou SY",
    title: "Directeur d'Unité Adjoint — Centre Afrique de l'Ouest", role: "directeur_unite", center: "afrique-ouest",
    axes: ["agents"],
    bio: "Directeur d'Unité Adjoint à l'Université Gaston Berger. Expert en modélisation des ressources naturelles et systèmes hydriques sahéliens.",
    email: "mamadou.sy@ugb.edu.sn", orcid: "0000-0001-8345-2910",
    avatarSeed: "MS", photoUrl: "/photos/mamadou-sy.png", publicationsCount: 0,
  },
  {
    id: "maurice-tchuente", name: "Maurice TCHUENTE",
    title: "Chercheur Émérite — Centre Afrique centrale et de l'est", role: "emerite", center: "afrique-centrale",
    axes: ["ia"],
    bio: "Chercheur émérite à l'Université de Yaoundé I. Pionnier de l'informatique en Afrique Centrale. Encadrement de doctorants.",
    email: "Maurice.Tchuente@gmail.com",
    avatarSeed: "MT", photoUrl: "/photos/maurice-tchuente.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning",
    projects: ["Encadrement de doctorant"],
    publications: [{ title: "Extracting ontological knowledge from Java source code using Hidden Markov Models" }]
  },
  {
    id: "md-yushalify-misro", name: "Md Yushalify MISRO",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents"],
    bio: "Chercheur à Universiti Sains Malaysia. Expert en méthodes mathématiques pour la modélisation des systèmes complexes biologiques.",
    email: "yushalify@usm.my",
    avatarSeed: "YM", photoUrl: "/photos/md-yushalify-misro.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: ["Participation à COSMOS Workshop/WARM Conference"]
  },
  {
    id: "mohamed-halloumi", name: "Mohamed HALLOUMI",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur à l'Université Cadi Ayyad. Expert en modélisation mathématique et systèmes complexes socio-économiques.",
    email: "m.halloumi@uca.ac.ma",
    avatarSeed: "MH", photoUrl: "/photos/mohamed-halloumi.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "mohamed-khaladi", name: "Mohamed KHALADI",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur à l'Université Cadi Ayyad. Expert en dynamique des populations et contrôle optimal des systèmes biologiques.",
    email: "Khaladi@uca.ac.ma",
    avatarSeed: "MK", photoUrl: "/photos/mohamed-khaladi.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "mohd-hafiz-bin-mohd", name: "Mohd Hafiz Bin MOHD",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents"],
    bio: "Chercheur à Universiti Sains Malaysia. Spécialisé en modélisation mathématique des populations et dynamiques écologiques.",
    email: "mohdhafizmohd@usm.my",
    avatarSeed: "MH", photoUrl: "/photos/mohd-hafiz-bin-mohd.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: ["Participation à COSMOS Worshop"]
  },
  {
    id: "moussa-balde", name: "Moussa BALDE",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents"],
    bio: "Chercheur à UCAD. Travaux sur la modélisation multi-agents des dynamiques pastorales et mobilité des éleveurs sahéliens.",
    email: "moussa.balde.math@ucad.edu.sn",
    avatarSeed: "MB", photoUrl: "/photos/moussa-balde.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    publications: [{ title: "A Scalable Engineering Combination Therapies for Evolutionary Dynamic of Macrophages" }, { title: "A Location Problem of Obstacles in Population Dynamics" }, { title: "Visualization and machine learning for forecasting of COVID-19 in Senegal" }, { title: "Theoretical assessment of the impact of environmental contamination on the dynamical transmission of polio" }, { title: "Coupling the shallow water equation with a long term dynamics of sand dunes" }]
  },
  {
    id: "moussa-lo", name: "Moussa LO",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents", "ia"],
    bio: "Chercheur à l'Université Gaston Berger / Chaire UNESCO. Expert en modélisation à base d'agents pour la pêche artisanale sénégalaise.",
    email: "moussa.lo@ugb.edu.sn",
    avatarSeed: "ML", photoUrl: "/photos/moussa-lo.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning",
    projects: ["Titulaire de la Chaire UNESCO \"Sciences et technologies emergentes pour le developpement\""]
  },
  {
    id: "myriam-sonia-djoukwe-tapi", name: "Myriam Sonia DJOUKWE TAPI",
    title: "Directeur de centre adjoint — Centre Afrique centrale et de l'est", role: "directeur_unite", center: "afrique-centrale",
    axes: ["agents"],
    bio: "Directrice de centre adjointe à l'Université de Douala. Expert en modélisation mathématique des maladies vectorielles.",
    email: "myriamtapi@yahoo.fr",
    avatarSeed: "MD", photoUrl: "/photos/myriam-sonia-djoukwe-tapi.png", publicationsCount: 0,
  },
  {
    id: "nhat-quang-dinh", name: "Nhat Quang DINH",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["ia", "capteurs"],
    bio: "Chercheur à Thuyloi University. Expert en IA appliquée à la modélisation de l'intrusion saline dans les deltas côtiers.",
    email: "quangnd2006@gmail.com",
    avatarSeed: "NQ", photoUrl: "/photos/nhat-quang-dinh.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection"
  },
  {
    id: "nicolas-florsch", name: "Nicolas FLORSCH",
    title: "Chercheur Émérite — Centre France", role: "emerite", center: "france",
    axes: ["participatif"],
    bio: "Chercheur émérite à Sorbonne Université. Pionnier en géophysique appliquée et en approches participatives.",
    email: "nicolas.florsch@gmail.com",
    avatarSeed: "NF", photoUrl: "/photos/nicolas-florsch.png", publicationsCount: 0,
    themesDescription: "Approches participatives et science citoyenne / Participatory approaches and citizen science"
  },
  {
    id: "nicolas-marilleau", name: "Nicolas MARILLEAU",
    title: "Directeur du Centre France", role: "directeur_centre", center: "france",
    axes: ["agents", "capteurs", "participatif"],
    bio: "Directeur du Centre IRD/Sorbonne (France). Expert en simulation distribuée à grande échelle et modélisation participative (LittoSIM-GEN).",
    email: "nicolas.marilleau@ird.fr", orcid: "0000-0002-4019-2831",
    avatarSeed: "NM", photoUrl: "/photos/nicolas-marilleau.png", publicationsCount: 0,
  },
  {
    id: "nicolas-turenne", name: "Nicolas TURENNE",
    title: "Chercheur — Centre France", role: "chercheur", center: "france",
    axes: ["ia"],
    bio: "Chercheur à INRAE. Recherches sur la fouille de textes, le traitement automatique du langage naturel et la veille scientifique.",
    email: "nicolas.turenne@ird.fr",
    avatarSeed: "NT", photoUrl: "/photos/nicolas-turenne.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning"
  },
  {
    id: "nisrine-outada", name: "Nisrine OUTADA",
    title: "Responsable de thème — Centre Méditerranée", role: "responsable_theme", center: "mediterranee",
    axes: ["agents"],
    bio: "Responsable de thème à l'Université Cadi Ayyad. Expert en théorie des essaims et modélisation multi-agents.",
    email: "nisrine.outada@uca.ac.ma",
    avatarSeed: "NO", photoUrl: "/photos/nisrine-outada.png", publicationsCount: 0,
  },
  {
    id: "nohayla-alaoui", name: "Nohayla ALAOUI",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheuse à l'Université Cadi Ayyad. Modélisation mathématique et systèmes complexes.",
    email: "alaouinohayla0607@gmail.com",
    avatarSeed: "NA", photoUrl: "/photos/nohayla-alaoui.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "norbert-tsopze", name: "Norbert TSOPZE",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["ia"],
    bio: "Chercheur à l'Université de Yaoundé I. Expert en traitement automatique du langage naturel pour les langues africaines.",
    email: "tsopze.norbert@gmail.com",
    avatarSeed: "NT", photoUrl: "/photos/norbert-tsopze.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning"
  },
  {
    id: "olga-kengni-ngangmo", name: "Olga KENGNI NGANGMO",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["ia"],
    bio: "Chercheuse à l'Université d'Ebolowa. Spécialisée en apprentissage profond et surveillance épidémiologique.",
    email: "olgakengni@gmail.com",
    avatarSeed: "OK", photoUrl: "/photos/olga-kengni-ngangmo.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning"
  },
  {
    id: "olivier-monga", name: "Olivier MONGA",
    title: "Chercheur — Centre France", role: "chercheur", center: "france",
    axes: ["agents", "ia"],
    bio: "Chercheur IRD au Centre France. Expert en modélisation 3D des microstructures des sols et simulation des processus biogéochimiques.",
    email: "olivier.monga@ird.fr",
    avatarSeed: "OM", photoUrl: "/photos/olivier-monga.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning"
  },
  {
    id: "ousmane-thiare", name: "Ousmane THIARE",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["ia", "capteurs"],
    bio: "Chercheur à l'Université Gaston Berger. Expert en modélisation multi-agents des dynamiques urbaines et IA appliquée.",
    email: "ousmane.thiare@ugb.edu.sn", orcid: "0000-0002-9012-3847",
    avatarSeed: "OT", photoUrl: "/photos/ousmane-thiare.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection"
  },
  {
    id: "papa-ibrahima-ndiaye", name: "Papa Ibrahima NDIAYE",
    title: "Directeur d'Unité Adjoint — Centre Afrique de l'Ouest", role: "directeur_unite", center: "afrique-ouest",
    axes: ["agents"],
    bio: "Directeur d'Unité Adjoint à l'Université Alioune Diop. Spécialisé en modélisation informatique et IA appliquée aux défis africains.",
    email: "papaibra.ndiaye@uadb.edu.sn",
    avatarSeed: "PN", photoUrl: "/photos/papa-ibrahima-ndiaye.png", publicationsCount: 0,
  },
  {
    id: "paulin-melatagia-yonta", name: "Paulin MELATAGIA YONTA",
    title: "Directeur de centre adjoint — Centre Afrique centrale et de l'est", role: "directeur_unite", center: "afrique-centrale",
    axes: ["ia"],
    bio: "Directeur de centre adjoint à l'Université de Yaoundé I. Expert en apprentissage automatique et TAL pour les langues africaines.",
    email: "paulinyonta@gmail.com",
    avatarSeed: "PM", photoUrl: "/photos/paulin-melatagia-yonta.png", publicationsCount: 0,
  },
  {
    id: "pierre-auger", name: "Pierre AUGER",
    title: "Chercheur Émérite — Centre France", role: "emerite", center: "france",
    axes: ["agents"],
    bio: "Chercheur émérite IRD. Spécialiste des systèmes dynamiques et de la modélisation mathématique des populations biologiques.",
    email: "pierre.auger@ird.fr",
    avatarSeed: "PA", photoUrl: "/photos/pierre-auger.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    publications: [{ title: "Effects of refuges and density dependent dispersal on dispersal on interspecific competition dynamics" }]
  },
  {
    id: "pierre-iloga-biyik", name: "Pierre Sylvain ILOGA BIYIK",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["ia"],
    bio: "Chercheur à l'Université de Maroua. Expert en apprentissage profond et modélisation mathématique des systèmes biologiques.",
    email: "sylvain.iloga@gmail.com",
    avatarSeed: "PS", photoUrl: "/photos/pierre-iloga-biyik.png", publicationsCount: 0,
  },
  {
    id: "prachya-rachya-boonprasurt", name: "Prachya Rachya BOONPRASURT",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "participatif"],
    bio: "Chercheur à Thammasat University. Modélisation participative des dynamiques sociales dans les communautés rurales asiatiques.",
    email: "pachalow.g@gmail.com",
    avatarSeed: "PB", photoUrl: "/photos/prachya-rachya-boonprasurt.png", publicationsCount: 0,
  },
  {
    id: "quang-nghi-huynh", name: "Quang Nghi HUYNH",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "ia", "participatif"],
    bio: "Chercheur à Can Tho University. Expert en simulation distribuée à large échelle et optimisation des architectures GAMA pour HPC.",
    email: "hqnghi@ctu.edu.vn",
    avatarSeed: "QH", photoUrl: "/photos/quang-nghi-huynh.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Approches participatives et science citoyenne / Participatory approaches and citizen science"
  },
  {
    id: "raphael-duboz", name: "Raphaël DUBOZ",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents", "participatif"],
    bio: "Chercheur CIRAD. Expert en modélisation bio-économique des pêcheries et simulation des ressources écologiques marines.",
    email: "raphael.duboz@cirad.fr",
    avatarSeed: "RD", photoUrl: "/photos/raphael-duboz.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Approches participatives et science citoyenne / Participatory approaches and citizen science"
  },
  {
    id: "rene-ndoundam", name: "René NDOUNDAM",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents"],
    bio: "Chercheur à l'Université de Yaoundé I. Expert en traitement automatique des langues africaines et ressources linguistiques numériques.",
    email: "ndoundam@yahoo.com",
    avatarSeed: "RN", photoUrl: "/photos/rene-ndoundam.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling"
  },
  {
    id: "said-boulite", name: "Said BOULITE",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur à l'Université Cadi Ayyad. Expert en semi-groupes d'opérateurs et théorie qualitative des équations différentielles.",
    email: "s.boulite@uca.ma",
    avatarSeed: "SB", photoUrl: "/photos/said-boulite.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    publications: [{ title: "Existence and stability in the α-norm for nonlinear neutral partial differential equations with finite delay" }, { title: "Well-posedness and stability of nonautonomous past systems with unbounded operators in the delay term" }, { title: "Feedback theory to the well-posedness of evolution equations" }, { title: "A population dynamics model with nonautonomous past" }, { title: "Partial differential equations with nonautonomous past in Favard spaces" }, { title: "Approximate positive controllability of positive boundary control systems" }, { title: "Sufficient and necessary conditions for the solvability of the state feedback regulation problem" }, { title: "Impulse controllability for the heat equation with inverse square potential and dynamic boundary conditions" }, { title: "Null Controllability for Stochastic Parabolic Equations with Dynamic Boundary Conditions" }, { title: "Multi-objective control for stochastic parabolic equations with dynamic boundary conditions" }, { title: "Well-posedness and asynchronous exponential growth of an age-weighted structured fish population model with diffusion in L^1" }]
  },
  {
    id: "samuel-bowong", name: "Samuel BOWONG",
    title: "Directeur de centre adjoint — Centre Afrique centrale et de l'est", role: "directeur_unite", center: "afrique-centrale",
    axes: ["agents"],
    bio: "Directeur de centre adjoint à l'Université de Douala. Expert en modélisation mathématique des systèmes épidémiologiques.",
    email: "sbowong@gmail.com",
    avatarSeed: "SB", photoUrl: "/photos/samuel-bowong.png", publicationsCount: 0,
  },
  {
    id: "syakila-ahmad", name: "Syakila AHMAD",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "ia"],
    bio: "Chercheuse associée au Centre Asie. Spécialisée en modélisation des systèmes environnementaux marins et côtiers en Malaisie.",
    avatarSeed: "SA", photoUrl: "/photos/syakila-ahmad.png", publicationsCount: 0,
  },
  {
    id: "thi-hai-van-dinh", name: "Thi Hai Van DINH",
    title: "Directeur de centre adjoint — Centre Asie du Sud-Est", role: "directeur_unite", center: "asie",
    axes: ["agents", "participatif"],
    bio: "Directrice de centre adjointe à Vietnam National University of Agriculture. Spécialiste de la modélisation participative du delta du Mékong.",
    email: "dinhthihaivan@vnua.edu.vn",
    avatarSeed: "TD", photoUrl: "/photos/thi-hai-van-dinh.png", publicationsCount: 0,
  },
  {
    id: "thi-hoai-phuong-tran", name: "Thi Hoai Phuong TRAN",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["ia", "capteurs"],
    bio: "Chercheuse à VinUniversity. Travaux sur l'IA appliquée et la modélisation de l'eau dans le delta du Mékong.",
    email: "25phuong.tth@vinuni.edu.vn",
    avatarSeed: "TH", photoUrl: "/photos/thi-hoai-phuong-tran.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection"
  },
  {
    id: "thi-phuong-linh-huynh", name: "Thi Phuong Linh HUYNH",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["participatif"],
    bio: "Chercheuse IRD. Expert en collecte de données de terrain et intégration de capteurs dans les modèles environnementaux.",
    email: "linh.huynh-thi-phuong@ird.fr",
    avatarSeed: "PL", photoUrl: "/photos/thi-phuong-linh-huynh.png", publicationsCount: 0,
    themesDescription: "Approches participatives et science citoyenne / Participatory approaches and citizen science"
  },
  {
    id: "thi-thuy-nguyen", name: "Thi Thuy NGUYEN",
    title: "Responsable de thème — Centre Asie du Sud-Est", role: "responsable_theme", center: "asie",
    axes: ["ia", "capteurs"],
    bio: "Responsable de thème à RMIT Ho Chi Minh City. Expert en sciences participatives et modélisation collaborative en Asie du Sud-Est.",
    email: "thuy.nguyen43@rmit.edu.vn",
    avatarSeed: "TN", photoUrl: "/photos/thi-thuy-nguyen.png", publicationsCount: 0,
  },
  {
    id: "thomas-messi-nguele", name: "Thomas MESSI NGUELE",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["ia"],
    bio: "Chercheur à l'Université de Yaoundé I. Spécialisé en apprentissage profond et modélisation des réseaux complexes.",
    email: "thomas.messi@facsciences-uy1.cm",
    avatarSeed: "TJ", photoUrl: "/photos/thomas-messi-nguele.png", publicationsCount: 0,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning"
  },
  {
    id: "timothee-brochier", name: "Timothée BROCHIER",
    title: "Responsable de thème — Centre France", role: "responsable_theme", center: "france",
    axes: ["capteurs"],
    bio: "Responsable de thème IRD. Expert en modélisation des écosystèmes marins et ichtyologie computationnelle.",
    email: "timothee.brochier@ird.fr",
    avatarSeed: "TB", photoUrl: "/photos/timothee-brochier.png", publicationsCount: 0,
  },
  {
    id: "tri-nguyen-huu", name: "Tri NGUYEN-HUU",
    title: "Responsable de thème — Centre France", role: "responsable_theme", center: "france",
    axes: ["agents", "participatif"],
    bio: "Responsable de thème IRD. Recherches sur les modèles hybrides couplant équations différentielles et systèmes multi-agents en épidémiologie.",
    email: "tri.nguyen-huu@ird.fr",
    avatarSeed: "TN", photoUrl: "/photos/tri-nguyen-huu.png", publicationsCount: 0,
  },
  {
    id: "tuong-vinh-ho", name: "Tuong Vinh HO",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "ia"],
    bio: "Chercheur à Hanoi University of Science and Technology. Modélisation de la dynamique des pêches et bio-économie au Vietnam.",
    email: "ho.tuong.vinh@gmail.com",
    avatarSeed: "TV", photoUrl: "/photos/tuong-vinh-ho.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning"
  },
  {
    id: "viet-truong-xuan", name: "Viet TRUONG XUAN",
    title: "Directeur d'Unité Adjoint — Centre Asie du Sud-Est", role: "directeur_unite", center: "asie",
    axes: ["agents", "ia", "capteurs"],
    bio: "Directeur d'Unité Adjoint à Can Tho University. Expert en simulation multi-agents pour systèmes urbains, participation SIMPLE et STAR FARM.",
    email: "txviet@ctu.edu.vn",
    avatarSeed: "VT", photoUrl: "/photos/viet-truong-xuan.png", publicationsCount: 0,
  },
  {
    id: "youcef-sklab", name: "Youcef SKLAB",
    title: "Chercheur — Centre France", role: "chercheur", center: "france",
    axes: ["agents", "ia"],
    bio: "Chercheur IRD au Centre France. Expert en systèmes multi-agents, formation de coalitions et IA distribuée.",
    email: "youcef.sklab@ird.fr",
    avatarSeed: "YS", photoUrl: "/photos/youcef-sklab.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning",
    projects: ["Enseignement"]
  },
  {
    id: "youssef-el-foutayeni", name: "Youssef EL FOUTAYENI",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur à l'Université Cadi Ayyad. Membre élu CSS5. Expert en modélisation mathématique et systèmes complexes.",
    email: "y.elfoutayeni@uca.ac.ma",
    avatarSeed: "YA", photoUrl: "/photos/youssef-el-foutayeni.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: ["Membre élu de la CSS5 (Sciences des données et des modèles)"]
  },
  {
    id: "zakaria-belghali", name: "Zakaria BELGHALI",
    title: "Doctorant — Centre Méditerranée", role: "doctorant", center: "mediterranee",
    axes: ["agents", "ia"],
    bio: "Doctorant à l'Université Cadi Ayyad. Participation au projet I-Maroc. Travaux en apprentissage automatique et systèmes complexes.",
    email: "belzakariaghali@gmail.com",
    avatarSeed: "ZB", photoUrl: "/photos/zakaria-belghali.png", publicationsCount: 0,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning",
    projects: ["Particiption au projet I-Maroc"]
  },
];

// ─── Publications ─────────────────────────────────────────────────────────────

export const PUBLICATIONS: Publication[] = [
  {
    id: "pub-01",
    title: "Modélisation multi-agents de la propagation du paludisme dans la zone périurbaine de Dakar (2019-2024)",
    authors: ["Awa Diattara", "Alassane Bah"],
    researcherIds: ["awa-diattara", "alassane-bah"],
    year: 2024,
    axis: "agents",
    journal: "Journal of Complex Systems Modelling",
    doi: "10.1234/jcsm.2024.1234",
    abstract:
      "Ce travail présente un modèle multi-agents simulant la transmission spatio-temporelle du paludisme à Dakar. Le modèle intègre des facteurs climatiques (pluviométrie, NDVI), les comportements de protection des ménages et les gîtes larvaires géoréférencés à Pikine. Les résultats démontrent l'importance des micro-facteurs locaux dans la persistance de la transmission résiduelle.",
    citationApa:
      "Diattara, A., & Bah, A. (2024). Modélisation multi-agents de la propagation du paludisme dans la zone périurbaine de Dakar (2019-2024). Journal of Complex Systems Modelling, 12(2), 145-162. https://doi.org/10.1234/jcsm.2024.1234",
    citationBibtex: `@article{diattara2024malaria,
  title={Modélisation multi-agents de la propagation du paludisme dans la zone périurbaine de Dakar (2019-2024)},
  author={Diattara, Awa and Bah, Alassane},
  journal={Journal of Complex Systems Modelling},
  volume={12},
  number={2},
  pages={145--162},
  year={2024},
  doi={10.1234/jcsm.2024.1234}
}`,
    accessLevel: "public",
  },
  {
    id: "pub-02",
    title: "Système d'alerte précoce basé sur l'IoT pour la surveillance des inondations dans la banlieue de Dakar",
    authors: ["Mamadou Sy", "Moussa Lo"],
    researcherIds: ["mamadou-sy", "moussa-lo"],
    year: 2023,
    axis: "capteurs",
    journal: "Revue Africaine de l'Ingénierie Logicielle et Systèmes",
    doi: "10.5678/rails.2023.456",
    abstract:
      "Nous présentons l'architecture d'un réseau de capteurs ultrasoniques LoRaWAN déployé à Keur Massar pour la surveillance hydrologique en temps réel. Un modèle LSTM embarqué génère des alertes précoces jusqu'à 3 heures avant les débordements critiques, avec un taux de précision de 87 %.",
    citationApa:
      "Sy, M., & Lo, M. (2023). Système d'alerte précoce basé sur l'IoT pour la surveillance des inondations dans la banlieue de Dakar. Revue Africaine de l'Ingénierie Logicielle et Systèmes, 8(1), 45-58. https://doi.org/10.5678/rails.2023.456",
    citationBibtex: `@article{sy2023alerte,
  title={Système d'alerte précoce basé sur l'IoT pour la surveillance des inondations dans la banlieue de Dakar},
  author={Sy, Mamadou and Lo, Moussa},
  journal={Revue Africaine de l'Ingénierie Logicielle et Systèmes},
  volume={8},
  number={1},
  pages={45--58},
  year={2023},
  doi={10.5678/rails.2023.456}
}`,
    accessLevel: "public",
  },
  {
    id: "pub-03",
    title: "Sciences participatives pour le suivi de la qualité de l'air à Dakar : Approche par modélisation hybride",
    authors: ["Awa Diattara", "Ousmane Thiare"],
    researcherIds: ["awa-diattara", "ousmane-thiare"],
    year: 2024,
    axis: "participatif",
    journal: "Écologie et Informatique Globale",
    doi: "10.9012/eig.2024.789",
    abstract:
      "Cet article étudie le couplage entre capteurs citoyens mobiles et modèles de dispersion atmosphérique pour cartographier dynamiquement la pollution à Dakar-Plateau. 50 volontaires équipés de micro-capteurs PM2.5 ont permis d'affiner les cartes à une résolution de 100 m grâce à une méthode hybride krigeage/LES.",
    citationApa:
      "Diattara, A., & Thiare, O. (2024). Sciences participatives pour le suivi de la qualité de l'air à Dakar. Écologie et Informatique Globale, 15(4), 312-329. https://doi.org/10.9012/eig.2024.789",
    citationBibtex: `@article{diattara2024sciences,
  title={Sciences participatives pour le suivi de la qualité de l'air à Dakar},
  author={Diattara, Awa and Thiare, Ousmane},
  journal={Écologie et Informatique Globale},
  volume={15},
  number={4},
  pages={312--329},
  year={2024},
  doi={10.9012/eig.2024.789}
}`,
    accessLevel: "protected",
  },
  {
    id: "pub-04",
    title: "Simulation comparative : Équations différentielles vs Modèles multi-agents pour la tuberculose au Sénégal",
    authors: ["Berge Tsanou", "Jean-Jules Tewa"],
    researcherIds: ["berge-tsanou", "jean-jules-tewa"],
    year: 2022,
    axis: "agents",
    journal: "Epidémiologie et Santé Internationale",
    doi: "10.3456/esi.2022.345",
    abstract:
      "Nous comparons une approche compartimentale SEIR déterministe et une approche individu-centrée (SMA) pour simuler la tuberculose en milieu carcéral à Dakar. La modélisation multi-agents démontre une supériorité statistique (RMSE −34 %) pour capturer l'hétérogénéité des contacts physiques et l'impact des co-infections VIH.",
    citationApa:
      "Tsanou, B., & Tewa, J.-J. (2022). Simulation comparative : Équations différentielles vs Modèles multi-agents pour la tuberculose au Sénégal. Epidémiologie et Santé Internationale, 34(3), 89-104. https://doi.org/10.3456/esi.2022.345",
    citationBibtex: `@article{tsanou2022simulation,
  title={Simulation comparative : Équations différentielles vs Modèles multi-agents pour la tuberculose au Sénégal},
  author={Tsanou, Berge and Tewa, Jean-Jules},
  journal={Epidémiologie et Santé Internationale},
  volume={34},
  number={3},
  pages={89--104},
  year={2022},
  doi={10.3456/esi.2022.345}
}`,
    accessLevel: "public",
  },
  {
    id: "pub-05",
    title: "Distribution Model: Separating Concerns to Facilitate the Distribution of Agent-Based Models",
    authors: ["Arthur Brugiere", "Alexis Drogoul", "Nicolas Marilleau"],
    researcherIds: ["arthur-brugiere", "alexis-drogoul", "nicolas-marilleau"],
    year: 2025,
    axis: "agents",
    journal: "PAAMS 2025 — Proceedings",
    doi: "10.5281/hal-05208954",
    abstract:
      "Ce travail propose le Distribution Model, une approche de séparation des préoccupations permettant de faciliter la distribution des modèles à base d'agents sur des clusters HPC. Présenté à PAAMS 2025 (Lille), il ouvre la voie à des simulations à très grande échelle sur plateformes de calcul haute performance.",
    citationApa:
      "Brugiere, A., Drogoul, A., & Marilleau, N. (2025). Distribution Model: Separating Concerns to Facilitate the Distribution of Agent-Based Models. PAAMS 2025, Lille, France. https://doi.org/10.5281/hal-05208954",
    citationBibtex: `@inproceedings{brugiere2025distribution,
  title={Distribution Model: Separating Concerns to Facilitate the Distribution of Agent-Based Models},
  author={Brugiere, Arthur and Drogoul, Alexis and Marilleau, Nicolas},
  booktitle={PAAMS 2025},
  year={2025},
  doi={10.5281/hal-05208954}
}`,
    accessLevel: "public",
  },
  {
    id: "pub-06",
    title: "Impairment of gut microbial biotin metabolism and host biotin status in severe obesity",
    authors: ["Eugeni Belda Cuesta", "Jean-Daniel Zucker"],
    researcherIds: ["eugeni-belda", "jean-daniel-zucker"],
    year: 2022,
    axis: "ia",
    journal: "Gut (BMJ)",
    doi: "10.1136/gutjnl-2021-325753",
    abstract:
      "Nous examinons la composition fonctionnelle du microbiome intestinal en état métabolique sain et dans les états d'obésité les plus sévères. L'apprentissage profond permet d'identifier des signatures métaboliques associées aux maladies cardiométaboliques, ouvrant des perspectives pour le diagnostic personnalisé.",
    citationApa:
      "Belda, E., & Zucker, J.-D. (2022). Impairment of gut microbial biotin metabolism and host biotin status in severe obesity. Gut, 71, 2209-2225. https://doi.org/10.1136/gutjnl-2021-325753",
    citationBibtex: `@article{belda2022impairment,
  title={Impairment of gut microbial biotin metabolism and host biotin status in severe obesity},
  author={Belda, Eugeni and Zucker, Jean-Daniel},
  journal={Gut},
  volume={71},
  pages={2209--2225},
  year={2022},
  doi={10.1136/gutjnl-2021-325753}
}`,
    accessLevel: "public",
  },
  {
    id: "pub-07",
    title: "LittoSIM-GEN: A generic platform of coastal flooding management for participatory simulation",
    authors: ["Nicolas Marilleau"],
    researcherIds: ["nicolas-marilleau"],
    year: 2022,
    axis: "participatif",
    journal: "Environmental Modelling & Software",
    doi: "10.1016/j.envsoft.2022.105447",
    abstract:
      "LittoSIM-GEN est une plateforme générique de simulation participative pour la gestion des submersions côtières. Elle permet aux acteurs locaux (collectivités, ONG, populations) d'explorer des scénarios de recul stratégique face au risque d'inondation marine.",
    citationApa:
      "Marilleau, N., et al. (2022). LittoSIM-GEN: A generic platform of coastal flooding management for participatory simulation. Environmental Modelling & Software, 149, 105447. https://doi.org/10.1016/j.envsoft.2022.105447",
    citationBibtex: `@article{marilleau2022littosim,
  title={LittoSIM-GEN: A generic platform of coastal flooding management for participatory simulation},
  author={Marilleau, Nicolas and others},
  journal={Environmental Modelling \\& Software},
  volume={149},
  pages={105447},
  year={2022},
  doi={10.1016/j.envsoft.2022.105447}
}`,
    accessLevel: "public",
  },
  {
    id: "pub-08",
    title: "Logarithmic convexity and impulsive controllability for the 1-D heat equation with dynamic boundary conditions",
    authors: ["Khalil Ezzinbi", "Lahcen Lhachimi"],
    researcherIds: ["khalil-ezzinbi"],
    year: 2022,
    axis: "agents",
    journal: "arXiv:2203.10532 [math]",
    doi: "10.48550/arXiv.2203.10532",
    abstract:
      "Nous prouvons une convexité logarithmique qui reflète une estimation d'observabilité en un point du temps pour l'équation de la chaleur 1-D avec conditions aux limites dynamiques. En conséquence, nous établissons la contrôlabilité impulsive approchée nulle.",
    citationApa:
      "Ezzinbi, K., & Lhachimi, L. (2022). Logarithmic convexity and impulsive controllability for the 1-D heat equation with dynamic boundary conditions. arXiv:2203.10532. https://doi.org/10.48550/arXiv.2203.10532",
    citationBibtex: `@article{ezzinbi2022logarithmic,
  title={Logarithmic convexity and impulsive controllability for the 1-D heat equation with dynamic boundary conditions},
  author={Ezzinbi, Khalil and Lhachimi, Lahcen},
  journal={arXiv preprint arXiv:2203.10532},
  year={2022},
  doi={10.48550/arXiv.2203.10532}
}`,
    accessLevel: "public",
  },
];

// ─── Datasets ─────────────────────────────────────────────────────────────────

export const DATASETS: Dataset[] = [
  {
    id: "data-01",
    title: "Données épidémiologiques paludisme — Région de Dakar (2019-2024)",
    description:
      "Série temporelle géoréférencée des cas hebdomadaires de paludisme enregistrés dans les districts sanitaires de Pikine, Guédiawaye et Yeumbeul, corrélée aux indices NDVI et pluviométriques.",
    creatorId: "awa-diattara",
    year: 2024,
    size: "148 MB",
    accessLevel: "protected",
    downloads: 342,
    type: "CSV",
    licence: "CC BY 4.0",
  },
  {
    id: "data-02",
    title: "Qualité de l'air par capteurs IoT — Hann Bel-Air (2025)",
    description:
      "Relevés horaires PM2.5, PM10, température et humidité par les micro-stations du réseau citoyen UMMISCO. 50 capteurs, résolution horaire.",
    creatorId: "mamadou-sy",
    year: 2025,
    size: "34 MB",
    accessLevel: "public",
    downloads: 812,
    type: "JSON",
    licence: "Open Data Commons",
  },
  {
    id: "data-03",
    title: "Registres de morbidité clinique — Hôpital de Fann (2023)",
    description:
      "Dossiers cliniques anonymisés (4 200 admissions) pour infections respiratoires aiguës à Dakar. Données pour la validation des modèles de propagation épidémique.",
    creatorId: "berge-tsanou",
    year: 2023,
    size: "1.2 GB",
    accessLevel: "private",
    downloads: 14,
    type: "XLSX",
    licence: "Accès restreint",
  },
  {
    id: "data-04",
    title: "Capteurs pluviométriques Keur Massar (2024)",
    description:
      "Séries temporelles de précipitations collectées par le réseau de capteurs LoRaWAN de Keur Massar. Données brutes et traitées disponibles pour la modélisation hydrologique.",
    creatorId: "mamadou-sy",
    year: 2024,
    size: "89 MB",
    accessLevel: "public",
    downloads: 504,
    type: "CSV",
    licence: "CC BY-SA 4.0",
  },
];

// ─── Séminaires & événements ──────────────────────────────────────────────────

export const SEMINARS: SeminarEvent[] = [
  {
    id: "sem-01",
    title: "Modélisation de la Dengue en milieu urbain sahélien : Défis et perspectives",
    date: "2026-06-10T10:00:00Z",
    location: "Salle de conférence UMMISCO — Dakar (et visioconférence)",
    speaker: "Awa DIATTARA",
    description:
      "Ce séminaire présentera les premiers résultats du modèle multi-agents couplé aux données entomologiques de l'Institut Pasteur.",
    type: "seminaire",
  },
  {
    id: "sem-02",
    title: "Réseaux LoRaWAN et résilience urbaine : Retours d'expérience sur Keur Massar",
    date: "2026-06-20T15:00:00Z",
    location: "FabLab UMMISCO, Bondy (Centre France)",
    speaker: "Mamadou SY",
    description:
      "Présentation des prototypes de capteurs connectés et démonstration de la passerelle de transmission de données ouvertes.",
    type: "atelier",
  },
  {
    id: "sem-03",
    title: "IA et Systèmes Complexes : Défis théoriques de l'hybridation des modèles",
    date: "2026-07-05T09:30:00Z",
    location: "Amphithéâtre IRD, Hann (Dakar)",
    speaker: "Jean-Daniel ZUCKER",
    description:
      "Conférence plénière explorant les méthodes de couplage entre modèles physiques et réseaux de neurones profonds.",
    type: "conference",
  },
  {
    id: "sem-04",
    title: "Workshop : Science ouverte et partage de données dans les pays du Sud",
    date: "2026-07-15T09:00:00Z",
    location: "Salle informatique ESP UCAD — Dakar",
    speaker: "Nicolas MARILLEAU",
    description:
      "Atelier pratique sur les bonnes pratiques de dépôt de datasets, licences open data et publications en accès libre.",
    type: "atelier",
  },
];

// ─── Projets UMMISCO ──────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: "didem",
    name: "DiDEM",
    centers: ["france", "afrique-ouest", "asie"],
    themes: ["participatif"],
    domain: "Environnement, Gestion de l'eau et irrigation",
    description:
      "Dialogue Science-Décideurs pour une gestion intégrée des environnements littoraux et marins. Approche participative multi-acteurs.",
    url: "https://ummisco.fr/fr/projet-ummisco/didem/",
    image: "/projets/DIDEM.png",
    chefProjet: "Nicolas Marilleau (porteur côté UMMISCO)",
    duree: "36 mois",
    dateDebut: "Juillet 2020",
    budget: "952 K€",
    partenaires: "UMMISCO – CRDI – SEM – INTERREG La Réunion – Fondation de France (LittoGem) – PNUD – PNUE",
  },
  {
    id: "habitable",
    name: "HABITABLE",
    centers: ["france", "afrique-ouest"],
    themes: ["participatif"],
    domain: "Société",
    description:
      "Modélisation de la mobilité des pêcheurs artisanaux au Sénégal. Simulateur Lolli implémenté sous GAMA pour explorer des scénarios climatiques et socio-économiques.",
    url: "https://ummisco.fr/fr/projet-ummisco/habitable/",
    image: "/projets/HABITABLE.png",
    chefProjet: "François Gemene, University of Liège, Hugo Observatory, Belgique",
    duree: "36 mois",
    dateDebut: "Décembre 2020",
    budget: "126 000 K€",
  },
  {
    id: "digepi",
    name: "DigEpi",
    centers: ["france", "asie"],
    themes: ["capteurs", "ia"],
    domain: "Santé humaine",
    description:
      "Digital Epidemiology : nouvelle approche pour la surveillance en temps réel du COVID-19 via l'intégration de capteurs environnementaux et de modèles prédictifs.",
    url: "https://ummisco.fr/fr/projet-ummisco/digepi/",
    image: "/projets/DigEpi.png",
    chefProjet: "Benjamin Roche, MIVEGEC, IRD",
    duree: "18 mois",
    dateDebut: "Avril 2020",
    budget: "100 K€",
  },
  {
    id: "waqatali",
    name: "Waqatali",
    centers: ["france", "mediterranee", "afrique-ouest"],
    themes: ["ia"],
    domain: "Gestion de l'eau et irrigation, Société",
    description:
      "Application de l'IA pour l'optimisation de l'irrigation dans les zones semi-arides. Combine apprentissage profond et données capteurs terrain.",
    url: "https://ummisco.fr/fr/projet-ummisco/waqatali/",
    image: "/projets/Waqatali.png",
    chefProjet: "Nicolas Marilleau, UMMISCO, Bondy, France et Thomas Bur, URBASENSE, Villeurbanne",
    duree: "54 mois",
    budget: "360 K€ (budget IRD)",
    institutionPorteuse: "IRD",
    financement: "ANR LAB-COM",
  },
  {
    id: "comokit",
    name: "COMOKIT",
    centers: ["asie"],
    themes: ["agents"],
    domain: "Santé publique",
    description:
      "Modèle informatique permettant d'explorer in silico les stratégies d'intervention épidémique (COVID-19) avant leur mise en application.",
    url: "https://ummisco.fr/fr/projet-ummisco/comokit/",
    image: "/projets/COMOKIT.png",
    chefProjet: "Alexis Drogoul, UMI 209, UMMISCO, IRD, Sorbonne Université, Bondy, France",
    duree: "18 mois",
    dateDebut: "Juillet 2020",
    budget: "172 000 €",
  },
  {
    id: "anr-magnum",
    name: "ANR MaGnuM",
    centers: ["france"],
    themes: ["capteurs"],
    domain: "Biodiversité",
    description:
      "The Maasai, the Gnu and the Metropolis. Réseaux de capteurs pour le suivi des grandes migrations animales en Afrique de l'Est.",
    url: "https://ummisco.fr/fr/projet-ummisco/anr-magnum/",
    image: "/projets/MaGnuM.png",
    chefProjet: "François Mialhe, École de l'environnement et de la société, CNRS 5600 EVS, Université de Lyon",
    partenaires: "University of Lyon 2 Lumière ; IRD - UMMISCO, Bondy, France ; University Claude Bernard Lyon I ; IRD – PALOC, Kenya ; University of Namur, Belgium ; INED, France ; University of Colorado, USA ; ACC, Kenya ; UMR LETG, Rennes, France",
  },
  {
    id: "dom",
    name: "DOM",
    centers: ["asie", "france"],
    themes: ["agents"],
    domain: "Environnement",
    description:
      "Distribution Model : séparation des préoccupations pour faciliter la distribution des modèles à base d'agents sur clusters HPC.",
    url: "https://ummisco.fr/fr/projet-ummisco/dom/",
    image: "/projets/DOM.png",
    chefProjet: "Dr. Ayesha Almazooqi, Khalifa University, Abu Dhabi",
    duree: "36 mois",
    dateDebut: "Décembre 2020",
    budget: "750 K$",
  },
  {
    id: "airqaly-4-asmafri",
    name: "AIRQALY-4-ASMAFRI",
    centers: ["mediterranee", "afrique-ouest"],
    themes: ["participatif"],
    domain: "Santé humaine",
    description:
      "Réseau de capteurs citoyens pour la surveillance de la qualité de l'air et son impact sur l'asthme en Afrique. Science participative et acquisition de données.",
    url: "https://ummisco.fr/fr/projet-ummisco/airqaly-4-asmafri/",
    image: undefined,
    chefProjet: "Nicolas Marillea (porteur côté UMMISCO)",
    duree: "48 mois",
    budget: "890 K€",
    partenaires: "MERIT/IRD, UCEIV/ULCO, UMMISCO",
  },
  {
    id: "aime",
    name: "AIME",
    centers: ["mediterranee"],
    themes: ["participatif"],
    domain: "Santé humaine",
    description:
      "Artificial Intelligence for Marine Ecosystems. Application de l'IA pour la modélisation et le suivi des écosystèmes marins méditerranéens.",
    url: "https://ummisco.fr/fr/projet-ummisco/aime/",
    image: "/projets/AIME.png",
    chefProjet: "Jihad Zahir, CAU / UMMISCO, Morocco",
    duree: "48 mois",
    dateDebut: "Janvier 2021",
    budget: "649 K€",
  },
  {
    id: "rdt-smart-reader",
    name: "RDT Smart Reader",
    centers: ["asie", "france"],
    themes: ["ia"],
    domain: "Santé humaine",
    description:
      "Lecteur intelligent de tests de diagnostic rapide (TDR). Application de vision par ordinateur pour automatiser la lecture des TDR en contexte de ressources limitées.",
    url: "https://ummisco.fr/fr/projet-ummisco/rdt-smart-reader/",
    image: "/projets/RDT Smart Reader.png",
    chefProjet: "Jules Brice Tchatchueng Mbougua, Centre Pasteur du Cameroun / UMMISCO, Cameroun",
    duree: "24 mois",
    dateDebut: "Février 2021",
  },
  // ── Projets ajoutés (données récupérées depuis ummisco.fr) ────────────────
  {
    id: "cscov19",
    name: "CsCov19",
    centers: ["asie"],
    themes: ["capteurs", "participatif"],
    domain: "Santé publique",
    description:
      "Crowd sensing pour la surveillance épidémiologique du COVID-19 au Vietnam. Collecte participative de données de mobilité et de santé en temps réel.",
    url: "https://ummisco.fr/fr/projet-ummisco/cscov19/",
    image: "/projets/CsCov19.png",
    chefProjet: "Nguyen Ngoc Doanh, Thuyloi University, UMMISCO Vietnam",
    duree: "24 mois",
    dateDebut: "Avril 2022",
    budget: "271 000 €",
  },
  {
    id: "deepecg4u",
    name: "DeepECG4U",
    centers: ["france"],
    themes: ["ia"],
    domain: "Santé humaine",
    description:
      "Application de l'apprentissage profond à l'analyse de l'électrocardiogramme pour la détection précoce de maladies cardiovasculaires.",
    url: "https://ummisco.fr/fr/projet-ummisco/deepecg4u/",
    image: "/projets/DeepECG4U.png",
    chefProjet: "Edi Prifti (porteur côté UMMISCO)",
    duree: "48 mois",
    dateDebut: "Mars 2021",
    budget: "570 K€",
    partenaires: "UMMISCO, CIC – INSERM, U1166 – INSERM, Vanderbilt University",
  },
  {
    id: "deepintegromics",
    name: "DeepIntegrOmics",
    centers: ["france"],
    themes: ["ia", "agents"],
    domain: "Santé humaine",
    description:
      "Intégration de données omiques multi-échelles par apprentissage profond pour l'étude des mécanismes moléculaires des maladies complexes.",
    url: "https://ummisco.fr/fr/projet-ummisco/deepintegromics/",
    image: "/projets/DeepIntergrOmics.png",
    chefProjet: "Jean-Daniel Zucker (porteur côté UMMISCO)",
    duree: "42 mois",
    dateDebut: "Février 2022",
    budget: "621 K€",
    partenaires: "IRD-SU/UMMISCO, SU-INSERM NUTRIOMCS, LISC-Université d'Evry, LAMSADE (University PSL)",
  },
  {
    id: "e-col-plus",
    name: "E-Col+",
    centers: ["france"],
    themes: ["participatif", "capteurs"],
    domain: "Biodiversité",
    description:
      "Programme de science participative du Muséum National d'Histoire Naturelle pour le suivi collaboratif de la biodiversité urbaine et péri-urbaine.",
    url: "https://ummisco.fr/fr/projet-ummisco/e-col/",
    image: "/projets/E-Col+.png",
    chefProjet: "Pierre-Yves Gagnier, MNHN, Paris",
    duree: "8 ans",
    dateDebut: "Juin 2021",
    budget: "4 850 K€",
  },
  {
    id: "epitag",
    name: "EPITAG",
    centers: ["afrique-centrale", "france"],
    themes: ["agents"],
    domain: "Modélisation Mathématique",
    description:
      "Modélisation épidémiologique et contrôle optimal des maladies infectieuses en Afrique subsaharienne. Coopération UMMISCO Cameroun – INRIA.",
    url: "https://ummisco.fr/fr/projet-ummisco/epitag/",
    image: "/projets/EPITAG.png",
    chefProjet: "Samuel Bowong (UMMISCO, Cameroon) et Suzanne Touzeau (INRIA Biocore)",
    duree: "36 mois",
    dateDebut: "Janvier 2021",
    budget: "30 K€",
  },
  {
    id: "i-maroc",
    name: "I-MAROC",
    centers: ["mediterranee"],
    themes: ["agents", "ia"],
    domain: "Environnement",
    description:
      "Initiative de modélisation mathématique et informatique appliquée aux systèmes complexes au Maroc. Coopération IRD–Université Cadi Ayyad.",
    url: "https://ummisco.fr/fr/projet-ummisco/i-maroc/",
    image: "/projets/I-MAROC.png",
    chefProjet: "Hassan Hbid, Université Cadi Ayyad, Marrakech (UCA), UMMISCO, IRD",
    duree: "36 mois",
    dateDebut: "Février 2022",
    budget: "620 K€",
  },
  {
    id: "premiss",
    name: "PREMISS",
    centers: ["asie", "france"],
    themes: ["agents"],
    domain: "Environnement",
    description:
      "Plateforme de recherche et de modélisation multi-agents pour la simulation de systèmes socio-écologiques complexes, avec partenaires internationaux.",
    url: "https://ummisco.fr/fr/projet-ummisco/premiss/",
    image: "/projets/PREMISS.png",
    chefProjet: "Alexis Drogoul (porteur côté UMMISCO)",
    duree: "24 mois",
    dateDebut: "Mars 2021",
    budget: "283 K€",
    partenaires: "UMMISCO, NTU (Taipei), UP (Afrique du Sud), TLU (Vietnam), BU (Turquie)",
  },
  {
    id: "simple",
    name: "SIMPLE",
    centers: ["asie", "france"],
    themes: ["agents", "ia"],
    domain: "Environnement",
    description:
      "Simulation et modélisation participative de systèmes complexes pour l'aide à la décision environnementale. Développé sur la plateforme GAMA avec des partenaires en Asie du Sud-Est.",
    url: "https://ummisco.fr/fr/projet-ummisco/simple/",
    image: "/projets/SIMPLE.jpg",
    chefProjet: "Alexis Drogoul",
    duree: "48 mois",
    dateDebut: "Mai 2023",
    budget: "3 100 K€",
    partenaires: "Can Tho University (CTU, Vietnam), NSTDA (Thaïlande), IRD (France)",
  },
  {
    id: "u2worm",
    name: "U2 WORM",
    centers: ["france"],
    themes: ["agents", "capteurs"],
    domain: "Environnement",
    description:
      "Modélisation multi-agents de la dynamique des vers de terre dans les sols agricoles. Couplage de capteurs terrain et de simulation pour l'écologie des sols.",
    url: "https://ummisco.fr/fr/projet-ummisco/u2worm/",
    image: "/projets/U2 WORM.webp",
    chefProjet: "Nicolas Marilleau (porteur côté UMMISCO)",
    duree: "48 mois",
    dateDebut: "2021",
    budget: "596 K€",
    partenaires: "IEES/IRD, ECOSYS/INRA, IC2MP/CNRS/UP, Eco&sols/IRD, LEM/INRA, UMMISCO, METIS, LRI, SFRI",
  },
  // ── Projets sans page ummisco.fr trouvée — à compléter ───────────────────
  {
    id: "escape",
    name: "ESCAPE",
    centers: ["asie"],
    themes: ["agents"],
    domain: "Environnement",
    description: "Description à compléter.",
    url: "https://ummisco.fr/fr/projet-ummisco/anr-escape/",
    image: "/projets/ESCAPE.png",
    chefProjet: "Alexis Drogoul, UMMISCO, IRD, 32 av. Henri Varagnat, 93140 Bondy, France",
    duree: "48 mois",
    dateDebut: "Septembre 2017",
    budget: "674 K€",
    partenaires: "IRD / UMMISCO, Bondy, France ; Université de Rouen / LITIS, France ; Université de Rouen / IDEES, France",
  },
  {
    id: "genstar",
    name: "GENSTAR",
    centers: ["france"],
    themes: ["agents"],
    domain: "Société",
    description: "Générateur de populations synthétiques pour la simulation multi-agents de systèmes socio-démographiques.",
    url: "https://ummisco.fr/fr/projet-ummisco/anr-genstar/",
    image: "/projets/GENSTAR.png",
    chefProjet: "Alexis Drogoul, UMMISCO, IRD, 32 av. Henri Varagnat, 93140 Bondy, France",
    duree: "42 mois",
    dateDebut: "Septembre 2013",
    budget: "561 K€",
    partenaires: "IRD/UMMISCO, Bondy, France ; Université de Toulouse 1 Capitole / IRIT, France ; Université de Rouen / IDEES, France ; Cassidian, France",
  },
  {
    id: "mepsom",
    name: "MEPSOM",
    centers: ["france", "afrique-ouest"],
    themes: ["agents"],
    domain: "Santé publique",
    description: "Description à compléter.",
    url: "https://ummisco.fr/fr/projet-ummisco/anr-mepsom/",
    image: "/projets/MEPSOM.png",
    chefProjet: "Claire Chenu, AgroParisTech, France",
    partenaires: "BIOEMCO, UMR UPMC-CNRS-IRD-ENS-UPEC-AgroParisTech-INRA, Paris ; Environnement et Grandes Cultures, UMR INRA-AgroParisTech, Grignon ; Laboratoire d'Écologie Microbienne, Université de Lyon 1 ; UMMISCO, IRD, Yaoundé, Cameroun ; SIMBIOS, Université d'Abertay, Dundee, Écosse",
  },
  {
    id: "panic",
    name: "PANIC",
    centers: ["france"],
    themes: ["agents"],
    domain: "Société",
    description: "Description à compléter.",
    url: "https://ummisco.fr/fr/projet-ummisco/anr-panique/",
    image: "/projets/PANIC.png",
    chefProjet: "Bernard Cazelles, UMMISCO, IRD, 32 av. Henri Varagnat, 93140 Bondy, France",
    duree: "48 mois",
    dateDebut: "Avril 2015",
    budget: "492 K€",
  },
  {
    id: "soilmu-3d",
    name: "SoilMu-3D",
    centers: ["france"],
    themes: ["agents", "capteurs"],
    domain: "Environnement",
    description: "Modélisation 3D des microstructures du sol et de la dynamique microbienne par simulation multi-agents couplée à l'imagerie haute résolution.",
    url: "https://ummisco.fr/fr/projet-ummisco/anr-soilmu-3d/",
    image: "/projets/Soilmu-3D.png",
    chefProjet: "Patricia Garnier, INRA Grignon",
    duree: "2016-2019",
    dateDebut: "2016",
    budget: "5 061 K€",
  },
  {
    id: "story",
    name: "STORY",
    centers: ["france"],
    themes: ["agents", "participatif"],
    domain: "Société",
    description: "Description à compléter.",
    image: "/projets/STORY.png",
  },
  {
    id: "bonds",
    name: "BONDS",
    centers: ["france"],
    themes: ["agents"],
    domain: "Environnement",
    description: "Description à compléter.",
    image: "/projets/BONDS.png",
  },
  {
    id: "simupor",
    name: "QNRF-SIMUPOR",
    centers: ["france"],
    themes: ["agents"],
    domain: "Environnement",
    description: "Description à compléter.",
    url: "https://ummisco.fr/fr/projet-ummisco/qnrf-simupor/",
    image: "/projets/SIMUPOR.png",
    chefProjet: "Serkan Kiranyaz, Université du Qatar",
    duree: "36 mois",
    dateDebut: "Novembre 2017",
    budget: "860 K$",
  },
  {
    id: "siemens",
    name: "SIEMENS",
    centers: ["france"],
    themes: ["ia"],
    domain: "Société",
    description: "Description à compléter.",
    image: "/projets/SIEMENS.webp",
  },
  {
    id: "histoire-danr",
    name: "HISTOIRE D'ANR",
    centers: ["france"],
    themes: ["agents"],
    domain: "Santé publique",
    description: "Étude de l'histoire naturelle et de l'émergence des maladies infectieuses tropicales par approches computationnelles.",
    url: "https://ummisco.fr/fr/projet-ummisco/histoire-danr/",
    chefProjet: "Benjamin Roche, UMMISCO, IRD, 32 avenue Henri Varagnat, 93140 Bondy, France",
    partenaires: "IRD, Bondy, France ; IRD, Montpellier, France ; CIRMF, Franceville, Gabon ; UPMC, Paris, France",
  },
  {
    id: "nocime",
    name: "NOCIME",
    centers: ["asie"],
    themes: ["agents"],
    domain: "Santé publique",
    description: "Nouvelles approches de contrôle optimal et d'intervention pour les maladies émergentes.",
    url: "https://ummisco.fr/fr/projet-ummisco/nocime/",
    chefProjet: "G. Sallet et B. Cazelles (correspondant IRD et responsable WP1)",
    duree: "36 mois",
    dateDebut: "Janvier 2024",
    budget: "350 K€",
    partenaires: "INRIA, INRAE, IRD (ANR 2023)",
  },
  {
    id: "obligations",
    name: "OBLIGATIONS",
    centers: ["france"],
    themes: ["participatif"],
    domain: "Biodiversité",
    description: "Obligations de résultats pour la biodiversité : quantification et suivi à l'interface science-politiques.",
    url: "https://ummisco.fr/fr/projet-ummisco/obligations/",
    chefProjet: "Marie-Paule Bonnet, UMR Espace-Dev, IRD",
    partenaires: "IRD Montpellier & Bondy ; Universidad Nacional de Colombia ; CIRAD ; MNHN/GBIF-France ; Université Friedrich-Schiller, Iéna ; Instituto Nacional de Pesquisas Spatiales, Brésil ; Université norvégienne des sciences de la vie ; Université de Californie Santa Barbara ; Université de Lausanne ; Virginia Polytechnic Institute ; Université de Brasilia ; Université d'East Anglia, Norwich",
  },
];

// ─── Logiciels UMMISCO ────────────────────────────────────────────────────────

export const SOFTWARE_TOOLS: SoftwareTool[] = [
  {
    id: "gama",
    name: "GAMA Platform",
    description:
      "Plateforme générique écrite en Java, dédiée à la conception et à la simulation de modèles à base d'agents. Initialement créée en 2007 par l'équipe MSI à Hanoï.",
    since: "2007",
    tags: ["Java", "Agent-based", "Simulation", "GIS"],
    website: "https://gama-platform.org/",
    github: "https://github.com/gama-platform/gama",
  },
  {
    id: "comokit-tool",
    name: "COMOKIT",
    description:
      "Modèle informatique permettant d'explorer in silico les stratégies d'intervention épidémique avant leur mise en application.",
    tags: ["GAMA", "Épidémiologie", "COVID-19"],
    website: "https://comokit.org/",
    github: "https://github.com/COMOKIT",
  },
  {
    id: "ichthyop",
    name: "Ichthyop",
    description:
      "Simule les processus intervenant au début de la vie des poissons : mouvement, croissance, mortalité et recrutement. Utilise les champs océaniques ROMS, NEMO ou SYMPHONIE.",
    tags: ["Océanographie", "Ichtyologie", "Particules"],
    website: "https://ichthyop.org/",
    github: "https://github.com/ichthyop/ichthyop",
  },
  {
    id: "kendrick",
    name: "Kendrick",
    description:
      "Plateforme de simulation épidémiologique mathématique. Modèles déterministes compartimentaux, stochastiques et en réseaux. Basé sur Pharo, open source MIT.",
    tags: ["Pharo", "Épidémiologie", "DSL", "Open Source"],
    github: "https://github.com/KendrickOrg/kendrick",
  },
  {
    id: "epicam",
    name: "EPICAM",
    description:
      "Système de surveillance de la tuberculose déployé sur 47 sites au Cameroun. Permet le suivi individualisé de 65 % des malades enregistrés, développé avec le Centre Pasteur.",
    tags: ["Tuberculose", "Cameroun", "Surveillance", "Santé publique"],
    github: "https://github.com/UMMISCO/EPICAM",
  },
];

// ─── Simulation tools (page simulations) ────────────────────────────────────

export const SIMULATION_TOOLS = [
  {
    id: "sim-sir",
    title: "Modèle SIR — Propagation épidémique",
    description:
      "Simulez la dynamique d'une épidémie dans une population fermée. Paramétrez le taux de transmission (β), le taux de guérison (γ) et la taille de la population.",
    iframeUrl:
      "https://netlogoweb.org/web?https://netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Virus.nlogo",
  },
  {
    id: "sim-hiv",
    title: "Modèle VIH — Dynamique de Transmission (NetLogo)",
    description:
      "Simulation de la transmission du VIH dans une population. Visualisez l'impact des comportements préventifs sur la prévalence à long terme.",
    iframeUrl:
      "https://netlogoweb.org/web?https://netlogoweb.org/assets/modelslib/Sample%20Models/Biology/HIV.nlogo",
  },
];

// ─── Contrats de doctorat ─────────────────────────────────────────────────────

export interface DoctoralContract {
  id: string;
  title: string;
  supervisor: string;
  funding: string;
  description: string;
  requirements: string;
  deadline: string;
}

export const DOCTORAL_CONTRACTS: DoctoralContract[] = [
  {
    id: "doc-01",
    title: "Modélisation hybride de la dynamique des socio-écosystèmes sahéliens (Grande Muraille Verte)",
    supervisor: "Prof. Alassane BAH",
    funding: "Bourse d'excellence IRD / Projet IRN RESET-GMV",
    description:
      "L'objectif est de concevoir un modèle à base d'agents couplé à MAELIA pour simuler les dynamiques pastorales et agricoles dans la zone Ferlo-Sine. Les scénarios co-construits visent la neutralité carbone d'ici 2035.",
    requirements:
      "Master 2 en Informatique, Mathématiques Appliquées ou Sciences de l'Environnement. Maîtrise de Python ou Java. Intérêt pour la modélisation GAMA.",
    deadline: "2026-06-30",
  },
  {
    id: "doc-02",
    title: "Capteurs LoRaWAN et IA embarquée pour la détection précoce des gîtes larvaires du paludisme",
    supervisor: "Mamadou SY & Awa DIATTARA",
    funding: "Financement Projet National Science Citoyenne / IRD",
    description:
      "Le candidat travaillera sur le déploiement de capteurs IoT environnementaux et la conception de modèles de classification légers (TinyML) embarqués sur microcontrôleurs pour caractériser les zones de ponte des anophèles.",
    requirements:
      "Master en Télécommunications, Systèmes Embarqués ou Data Science. Compétences en C/C++/Python et protocoles LPWAN.",
    deadline: "2026-07-15",
  },
];

// ─── Sites UMMISCO (pour la section écosystème) ───────────────────────────────

export interface UMMISCOSite {
  id: string;
  name: string;
  location: string;
  description: string;
  website: string;
}

export const UMMISCO_SITES: UMMISCOSite[] = [
  {
    id: "site-senegal",
    name: "Centre Afrique de l'Ouest",
    location: "Dakar (UCAD / ESP)",
    description:
      "Étude des socio-écosystèmes sahéliens, pêche artisanale et résilience climatique. Partenaires : UCAD, UADB, CIRAD.",
    website: "https://ummisco.fr/fr/centre/centre-afrique-de-louest/",
  },
  {
    id: "site-france",
    name: "Centre France",
    location: "Bondy / Sorbonne Université",
    description:
      "Siège de l'UMMISCO. Cluster HPC +1700 cœurs, FabLab cofab-in-Bondy, expertise en simulation distribuée et jumeaux numériques.",
    website: "https://ummisco.fr/fr/centre/centre-france/",
  },
  {
    id: "site-vietnam",
    name: "Centre Asie du Sud-Est",
    location: "Hanoï (VinUniversity)",
    description:
      "Berceau de la plateforme GAMA (2007). Gestion de l'eau, agriculture, mobilité, santé publique en Asie du Sud-Est.",
    website: "https://ummisco.fr/fr/centre/centre-asie-du-sud-est/",
  },
  {
    id: "site-maroc",
    name: "Centre Méditerranée",
    location: "Marrakech (Université Cadi Ayyad)",
    description:
      "Modélisation mathématique multi-échelle, théorie des essaims, dynamique des populations. Santé, eau, mobilité urbaine.",
    website: "https://ummisco.fr/fr/centre/centre-mediterranee/",
  },
  {
    id: "site-cameroun",
    name: "Centre Afrique centrale et de l'est",
    location: "Yaoundé (Université de Yaoundé I)",
    description:
      "Modélisation des épidémies et maladies des cultures tropicales. Approche One Health reliant santé humaine, animale et environnementale.",
    website: "https://ummisco.fr/fr/centre/centre-afrique-centrale-et-de-lest/",
  },
];

// ─── Applications intégrées ───────────────────────────────────────────────────

export interface IntegratedApplication {
  id: string;
  name: string;
  description: string;
  url: string;
  type: "iframe" | "link";
}

export const INTEGRATED_APPLICATIONS: IntegratedApplication[] = [
  {
    id: "app-gama",
    name: "GAMA Platform",
    description:
      "Plateforme de simulation multi-agents open source. Téléchargez et explorez des modèles pré-construits.",
    url: "https://gama-platform.org/",
    type: "link",
  },
  {
    id: "app-comokit",
    name: "COMOKIT",
    description:
      "Explorez les stratégies d'intervention épidémique in silico développé par UMMISCO en réponse au COVID-19.",
    url: "https://ummisco.fr/fr/projet-ummisco/comokit/",
    type: "link",
  },
  {
    id: "app-hal",
    name: "Portail HAL — Publications UMMISCO",
    description:
      "Accédez à l'archive ouverte HAL pour consulter toutes les publications scientifiques des membres UMMISCO.",
    url: "https://hal.science/search/index/?q=ummisco&rows=30",
    type: "link",
  },
];
