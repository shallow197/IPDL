import { UMMISCO_EXTERNAL_PUBLICATIONS } from "./ummiscoExternalPublications";

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
  themesDescription?: string;
  projects?: string[];
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
  url?: string;
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
  partenaires?: string;
  institutionPorteuse?: string;
  financement?: string;
}

export interface SoftwareTool {
  id: string;
  name: string;
  description: string;
  since?: string;
  tags: string[];
  website?: string;
  github?: string;
  logoUrl?: string;
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
    bio: "Doctorant en modélisation hydrogéologique au Centre Méditerranée. Recherches sur la simulation multi-agents des systèmes aquifères.",
    avatarSeed: "AC", photoUrl: "/photos/achraf-chakri.png", publicationsCount: 2,
  },
  {
    id: "ahmad-fall", name: "Ahmad FALL",
    title: "Chercheur — Centre France", role: "chercheur", center: "france",
    axes: ["ia", "agents"],
    bio: "Chercheur au Centre France. Travaux en apprentissage automatique appliqué aux données environnementales et à la dynamique des écosystèmes.",
    avatarSeed: "AF", photoUrl: "/photos/ahmad-fall.png", publicationsCount: 14,
  },
  {
    id: "aicha-balhag", name: "Aïcha BALHAG",
    title: "Chercheuse — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["ia", "capteurs"],
    bio: "Chercheuse au Centre Méditerranée. Expert en intelligence artificielle pour la santé et en analyse de biosignaux (projet AIME).",
    avatarSeed: "AB", photoUrl: "/photos/aicha-balhag.png", publicationsCount: 9,
  },
  {
    id: "aicha-sabiq", name: "Aicha SABIQ",
    title: "Doctorante — Centre Méditerranée", role: "doctorant", center: "mediterranee",
    axes: ["agents", "capteurs"],
    bio: "Doctorante au Centre Méditerranée. Recherches sur la modélisation des systèmes hydrologiques et la gestion des ressources en eau au Maroc.",
    avatarSeed: "AS", photoUrl: "/photos/aicha-sabiq.png", publicationsCount: 2,
  },
  {
    id: "alassane-bah", name: "Alassane BAH",
    title: "Directeur du Centre Afrique de l'Ouest", role: "directeur_centre", center: "afrique-ouest",
    axes: ["agents", "ia", "capteurs", "participatif"],
    bio: "Spécialiste de la modélisation des socio-écosystèmes sahéliens et de la Grande Muraille Verte. Directeur du Centre Afrique de l'Ouest depuis sa création.",
    email: "alassane.bah@esp.sn", orcid: "0000-0002-7341-1023",
    avatarSeed: "AB", photoUrl: "/photos/alassane-bah.png", publicationsCount: 11,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    publications: [
      { title: "On the sylvatic transmission of T. cruzi, the parasite causing Chagas disease: a view from an agent-based model" },
      { title: "Numerical treatment of a non local model for phytoplankton agregation" },
      { title: "A bottom-up participatory modelling process for a multi-level agreement on environmental uncertainty management in West Africa" },
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
    bio: "Créateur de la plateforme GAMA (2007). Pionnier mondial de la simulation multi-agents pour le développement durable en Asie du Sud-Est.",
    email: "alexis.drogoul@ird.fr", orcid: "0000-0001-7283-4920",
    avatarSeed: "AD", photoUrl: "/photos/alexis-drogoul.png", publicationsCount: 38,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: ["Directeur du LMI ACROSS"],
    publications: [
      { title: "Complex environment representation in epidemiology ABM: application on H5N1 propagation" },
      { title: "Adaptation strategies in the Mekong delta" },
      { title: "Designing social simulation to (seriously) support decision-making: COMOKIT, an agent-based modelling toolkit to analyse and compare the impacts of public health interventions against COVID-19" },
      { title: "Gama : a simulation platform that integrates geographical information data, agent-based modeling and multi-scale control" },
      { title: "Simulation of Emergency Evacuation of Pedestrians along the Road Networks in Nhatrang City" },
      { title: "Spatial Estimator of Brown Plant Hopper Density from Light Traps Data" },
      { title: "Un modèle à base d'agents sur la transmission et la diffusion de la fièvre de la vallée du rift à Barkédji (Ferlo, Sénégal)" },
      { title: "Multi-Level Agent-Based Modeling: a Generic Approach and an Implementation" },
      { title: "Optimizing an Environmental Surveillance Network with Gaussian Process Entropy." },
      { title: "Using high-level 3D Graphics library in agent-based simulation platform" },
      { title: "Gama 1.6 : Advancing the Art of Complex Agent-Based Modeling and Simulation" },
      { title: "Online analysis and visualization of agent based models" },
      { title: "Modeling and simulation of shrimp diseases propagation in river networks and inside pond" },
      { title: "Multiscale MAS modelling to simulate the soil environment: Application to soil ecology" },
      { title: "Simulating Urban Growth with Raster and Vector models : A case study for the city of Can Tho, Vietnam" },
      { title: "An implementation of framework of business intelligence for agent-based simulation" },
      { title: "Exploring Agent Architectures for Farmer Behavior in Land-Use Change. A Case Study in Coastal Area of the Vietnamese Mekong Delta" },
      { title: "Modeling a Surveillance Network Based on Unit Disk Graph Technique – Application for Monitoring the Invasion of Insects in Mekong Delta Region" },
      { title: "Modelling Multi-Criteria Decision Making Ability of Agents in Agent-Based Rice Pest Risk Assessment Model" },
      { title: "Toward an Agent-Based Multi-scale Recommendation System for Brown Plant Hopper Control" },
      { title: "Designing Multi-criteria Decision Making Agents in Agent-Based Model for Rice Pest Risk Management" },
      { title: "Upscaling and Assessing Information of Agriculture Indicators in Agent-Based Assessment Model from Field to Region Scale" },
      { title: "COMOKIT v2: A multi-scale approach to modeling and simulating epidemic control policies" },
      { title: "Artificial intelligence for sustainability science" },
      { title: "A land-use change model to study climate change adaptation strategies in the Mekong Delta" },
      { title: "LUCAS-GEMMES : Integrated dynamics of adaptation strategies in the Vietnamese Mekong Delta" },
      { title: "Handling multiple levels in agent-based models of complex socio-environmental systems: A comprehensive review" },
      { title: "Un partenariat de recherche pour améliorer les méthodologies de la science de la durabilité" },
      { title: "Large-scale Epidemiological Modelling: Exploring the Impact of the ASEAN Economic Corridors Policy on the Dengue Fever Epidemic" },
      { title: "Using Parallel Computing to Improve the Scalability of Models with BDI Agents" },
      { title: "Synthèse des séances plénières : complexité et transition énergétique" },
      { title: "Gen*: a generic toolkit to generate spatially explicit synthetic populations" },
      { title: "On the Unity and Diversity of Computer Simulation" },
      { title: "COMOKIT BUILDING: simulating the impact of NPI against Covid-19 at building scale" },
      { title: "An Agent-Based Modeling Approach for Understanding Land-use Adaptation in the Mekong Delta under the Context of Climate Change" },
      { title: "COMOKIT advanced user interface: Dashboard" },
      { title: "GAMA: 14 years and counting" },
      { title: "Vulnérabilité face aux catastrophes naturelles : comportements de mise en protection et gestion de l'évacuation en cas de crue rapide" },
    ],
  },
  {
    id: "aman-berhe", name: "Aman BERHE",
    title: "Chercheur — Centre France", role: "chercheur", center: "france",
    axes: ["ia"],
    bio: "Chercheur au Centre France. Recherches sur la modélisation des systèmes agro-environnementaux et les méthodes de collecte de données en Afrique.",
    email: "amanzaid.berhe@ird.fr",
    avatarSeed: "AB", photoUrl: "/photos/aman-berhe.png", publicationsCount: 2,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning",
    publications: [
      { title: "Towards Interpretable and point-of-care disease prediction from metagenomics data: applications to Cardio-Metabolic Disease" },
      { title: "AliBERT: A Pre-trained Language Model for French Biomedical Text" },
    ],
  },
  {
    id: "armel-jacques-nzekon-nzekoo", name: "Armel Jacques NZEKON NZEKO'O",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["ia"],
    bio: "Chercheur spécialisé en modélisation épidémiologique et en apprentissage profond pour le traitement automatique du langage.",
    email: "armel.nzekon@facsciences-uy1.cm",
    avatarSeed: "AN", photoUrl: "/photos/armel-jacques-nzekon-nzekoo.png", publicationsCount: 4,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning",
    publications: [
      { title: "Social Network Analysis of Developers' and Users' Mailing Lists of Some Free Open Source Software" },
      { title: "A general graph-based framework for top-N recommendation using content, temporal and trust information" },
      { title: "Link Stream Graph for Temporal Recommendations" },
      { title: "Recommender system taking into account the availability forecast of product categories" },
    ],
  },
  {
    id: "arnaud-grignard", name: "Arnaud GRIGNARD",
    title: "Responsable de thème — Centre France", role: "responsable_theme", center: "france",
    axes: ["agents", "ia", "capteurs", "participatif"],
    bio: "Expert en simulation urbaine et jumeaux numériques. Travaux sur la simulation du potentiel de réchauffement global dans les bâtiments (Hamburg Energy Twin).",
    email: "arnaud.grignard@ird.fr",
    avatarSeed: "AG", photoUrl: "/photos/arnaud-grignard.png", publicationsCount: 18,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    publications: [
      { title: "Using Agent-Based Modelling to Understand Advantageous Behaviours Against COVID-19 Transmission in the Built Environment" },
      { title: "Experimenting the Impact of Pedestrianisation on Urban Pollution Using Tangible Agent-Based Simulations: Application to Hoan Kiem District, Hanoi, Vietnam" },
      { title: "CityScope Hanoi: interactive simulation for water management in the Bac Hung Hai irrigation system" },
      { title: "HoanKiemAir: simulating impacts of urban management practices on traffic and air pollution using a tangible agent-based model" },
      { title: "Building, composing and experimenting complex spatial models with the GAMA platform" },
      { title: "Participatory Modeling and Simulation with the GAMA Platform" },
      { title: "Coupling equation based models and agent-based models: example of a multi-strains and switch SIR toy model" },
      { title: "Marrakair: une simulation participative pour observer les émissions atmosphériques du trafic routier en milieu urbain" },
      { title: "Toward an Agent-Based and Equation-Based Coupling Framework" },
      { title: "Introduction to Netlogo" },
      { title: "Reproducing and exploring past events using agent-based geo-historical models" },
      { title: "Des données géographiques à la simulation à base d'agents: application de la plate-forme GAMA" },
      { title: "ARCHIVES: Reconstructing past catastrophes through simulation to better anticipate future ones" },
      { title: "Using high-level 3D Graphics library in agent-based simulation platform" },
      { title: "Gama 1.6 : Advancing the Art of Complex Agent-Based Modeling and Simulation" },
      { title: "Online analysis and visualization of agent based models" },
      { title: "Gama : multi-level and complex environment for agent-based models and simulations" },
      { title: "A model-view/controller approach to support visualization and online data analysis of Agent-based simulations" },
    ],
  },
  {
    id: "arthur-brugiere", name: "Arthur BRUGIERE",
    title: "Doctorant — Centre Asie du Sud-Est", role: "doctorant", center: "asie",
    axes: ["agents"],
    bio: "Doctorant spécialisé dans la distribution et la parallélisation des modèles à base d'agents sur clusters HPC (Distribution Model, PAAMS 2025).",
    email: "arthur.brugiere@ird.fr",
    avatarSeed: "AR", photoUrl: "/photos/arthur-brugiere.png", publicationsCount: 3,
  },
  {
    id: "awa-diattara", name: "Awa DIATTARA",
    title: "Responsable de thème — Centre Afrique de l'Ouest", role: "responsable_theme", center: "afrique-ouest",
    axes: ["agents", "participatif"],
    bio: "Responsable de thème. Spécialiste de la modélisation participative des systèmes socio-environnementaux sahéliens et de la science citoyenne.",
    email: "awa.diattara@ucad.edu.sn", orcid: "0000-0003-1295-4820",
    avatarSeed: "AW", photoUrl: "/photos/awa-diattara.png", publicationsCount: 17,
  },
  {
    id: "berge-tsanou", name: "Berge TSANOU",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents", "ia"],
    bio: "Spécialiste de la modélisation mathématique des épidémies (dengue, paludisme, VIH) et de l'approche One Health pour la surveillance sanitaire.",
    email: "berge.tsanou@uy1.uninet.cm", orcid: "0000-0003-2019-4812",
    avatarSeed: "BT", photoUrl: "/photos/berge-tsanou.png", publicationsCount: 21,
  },
  {
    id: "chainarong-kesamoon", name: "Chainarong KESAMOON",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "participatif"],
    bio: "Chercheur au Centre Asie. Modélisation des dynamiques sociales et environnementales en Asie du Sud-Est avec GAMA.",
    avatarSeed: "CK", photoUrl: "/photos/chainarong-kesamoon.png", publicationsCount: 8,
  },
  {
    id: "chien-pham-van", name: "Chien PHAM VAN",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "capteurs"],
    bio: "Chercheur spécialisé en modélisation des systèmes hydrologiques et en gestion des risques naturels au Vietnam.",
    avatarSeed: "CP", photoUrl: "/photos/chien-pham-van.png", publicationsCount: 12,
  },
  {
    id: "christophe-cambier", name: "Christophe CAMBIER",
    title: "Chercheur Émérite — Centre France", role: "emerite", center: "france",
    axes: ["agents"],
    bio: "Chercheur émérite au Centre France. Expert en modélisation des systèmes complexes et en intelligence artificielle distribuée.",
    avatarSeed: "CC", photoUrl: "/photos/christophe-cambier.png", publicationsCount: 47,
  },
  {
    id: "christophe-denis", name: "Christophe DENIS",
    title: "Chercheur — Centre France", role: "chercheur", center: "france",
    axes: ["agents", "ia"],
    bio: "Chercheur au Centre France. Spécialisé en modélisation computationnelle des processus biologiques et des dynamiques de populations.",
    avatarSeed: "CD", photoUrl: "/photos/christophe-denis.png", publicationsCount: 18,
  },
  {
    id: "diane-tchuani-tchakonte", name: "Diane TCHUANI TCHAKONTE",
    title: "Responsable de thème — Centre Afrique centrale et de l'est", role: "responsable_theme", center: "afrique-centrale",
    axes: ["agents", "ia"],
    bio: "Responsable de thème au Centre Cameroun. Spécialiste de la modélisation mathématique des épidémies et des maladies infectieuses tropicales.",
    avatarSeed: "DT", photoUrl: "/photos/diane-tchuani-tchakonte.png", publicationsCount: 16,
  },
  {
    id: "diaraf-seck", name: "Diaraf SECK",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents", "ia"],
    bio: "Chercheur au Centre Afrique de l'Ouest. Expert en modélisation mathématique et en applications de l'IA aux problèmes de développement en Afrique.",
    avatarSeed: "DS", photoUrl: "/photos/diaraf-seck.png", publicationsCount: 15,
  },
  {
    id: "diep-anh-phung", name: "Diep Anh PHUNG",
    title: "Personnel administratif — Centre Asie du Sud-Est", role: "ingenieur", center: "asie",
    axes: ["agents"],
    bio: "Personnel administratif et de coordination au Centre Asie du Sud-Est (VinUniversity).",
    avatarSeed: "DP", photoUrl: "/photos/diep-anh-phung.png", publicationsCount: 2,
  },
  {
    id: "doanh-nguyen-ngoc", name: "Doanh NGUYEN-NGOC",
    title: "Directeur de centre — Centre Asie du Sud-Est", role: "directeur_centre", center: "asie",
    axes: ["agents", "participatif"],
    bio: "Directeur du Centre Asie du Sud-Est (VinUniversity). Expert en modélisation multi-agents des systèmes environnementaux et épidémiologiques.",
    email: "doanhbondy@gmail.com",
    avatarSeed: "DN", photoUrl: "/photos/doanh-nguyen-ngoc.png", publicationsCount: 18,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: ["Participation aux activités LMI Across/Cosmos Lab/VNCEM"],
    publications: [
      { title: "CityScope Hanoi: interactive simulation for water management in the Bac Hung Hai irrigation system" },
      { title: "Designing social simulation to (seriously) support decision-making: COMOKIT, an agent-based modelling toolkit to analyse and compare the impacts of public health interventions against COVID-19" },
      { title: "Effects of fast density dependent dispersal on pre-emptive competition dynamics" },
      { title: "A stage structured population model with mature individuals using hawk and dove tactics" },
      { title: "Effects of migration of three competing species on their distributions in multizone environment" },
      { title: "Simulating biological dynamics using partial differential equations: application to decomposition of organic matter in 3D soil structure" },
      { title: "Modeling Microbial Decomposition in Real 3D Soil Structures Using Partial Differential Equations" },
      { title: "Can Fishing Pressure Invert the Outcome of Interspecific Competition? The Case of the Thiof and of the Octopus Along the Senegalese Coast" },
      { title: "Effects of Behavioural Strategy on the Exploitative Competition Dynamics" },
      { title: "A multi-scale model for spreading of infectious disease in an office building" },
      { title: "Spatial heterogeneity, fast migration and coexistence of intraguild predation dynamics" },
      { title: "Drug Repositioning by Integrating Known Disease-Gene and Drug-Target Associations in a Semi-supervised Learning Model" },
      { title: "Proceedings of the First Vietnamese-French Joint Conference on Applications of Mathematics to Ecology, Bio-economics, Epidemiology and Health Care: Hanoi and Tuanchau, Vietnam, December 12–15, 2016" },
      { title: "Optimization of municipal solid waste transportation by integrating GIS analysis, equation-based, and agent-based model" },
      { title: "An Agent-Based Co-modeling Approach to Simulate the Evacuation of a Population in the Context of a Realistic Flooding Event: A Case Study in Hanoi (Vietnam)" },
      { title: "COMOKIT BUILDING: simulating the impact of NPI against Covid-19 at building scale" },
      { title: "Handling multiple levels in agent-based models of complex socio-environmental systems: A comprehensive review" },
      { title: "An agent-based model for mixed traffic in Vietnam based on virtual local lanes" },
    ],
  },
  {
    id: "dramane-kante", name: "Dramane Sam Idris KANTE",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["ia", "participatif"],
    bio: "Chercheur au Centre Méditerranée. Spécialisé en intelligence artificielle pour les systèmes marins et en sciences participatives.",
    avatarSeed: "DK", photoUrl: "/photos/dramane-kante.png", publicationsCount: 7,
  },
  {
    id: "duy-dung-le", name: "Duy Dung LE",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "ia"],
    bio: "Expert en modélisation épidémiologique (tuberculose, COVID-19) et développement d'outils de visualisation géospatiale comme GeoTuberculosis.",
    email: "duy-dung.le@vinuni.edu.vn", orcid: "0000-0002-8120-4938",
    avatarSeed: "DL", photoUrl: "/photos/duy-dung-le.png", publicationsCount: 15,
  },
  {
    id: "edi-prifti", name: "Edi PRIFTI",
    title: "Responsable de thème — Centre France", role: "responsable_theme", center: "france",
    axes: ["ia"],
    bio: "Responsable du thème IA au Centre France. Spécialiste de l'apprentissage profond appliqué aux données biomédicales et à la nutrition.",
    email: "edi.prifti@ird.fr",
    avatarSeed: "EP", photoUrl: "/photos/edi-prifti.png", publicationsCount: 27,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning",
    publications: [
      { title: "Enhancing plant morphological trait identification in herbarium collections through deep learning–based segmentation" },
      { title: "Identification of Non-Plant Elements in Herbarium Images Using YOLO" },
      { title: "SIM-Net: A Multimodal Fusion Network Using Inferred 3D Object Shape Point Clouds from RGB Images for 2D Classification" },
      { title: "Enhancing YOLOv7 for Plant Organs Detection Using Attention-Gate Mechanism" },
      { title: "Deep learning methods in metagenomics: a review" },
      { title: "Towards a Deep Learning-Powered Herbarium Image Analysis Platform" },
      { title: "Herbarium Image Segmentation Dataset with Plant Masks for Enhanced Morphological Trait Analysis" },
      { title: "Intelligence artificielle et rythmologie : apports et limites" },
      { title: "Extracting Masks from Herbarium Specimen Images Based on Object Detection and Image Segmentation Techniques" },
      { title: "Functional alterations and predictive capacity of gut microbiome in type 2 diabetes" },
      { title: "Microbiome and metabolome features of the cardiometabolic disease spectrum" },
      { title: "Impairment of gut microbial biotin metabolism and host biotin status in severe obesity: effect of biotin and prebiotic supplementation on improved metabolism" },
      { title: "Association of N-Acetyl Asparagine with QTc in Diabetes: A Metabolomics Study" },
      { title: "Echocardiography and renin-aldosterone interplay as predictors of death in COVID-19" },
      { title: "Combinatorial, additive and dose-dependent drug–microbiome associations" },
      { title: "Protein supplementation during an energy-restricted diet induces visceral fat loss and gut microbiota amino acid metabolism activation: a randomized trial" },
      { title: "Deep learning analysis of electrocardiogram for risk prediction of drug-induced arrhythmias and diagnosis of long QT syndrome" },
      { title: "Exploring Semi-Quantitative Metagenomic Studies Using Oxford Nanopore Sequencing: A Computational and Experimental Protocol" },
      { title: "Gut microbiota changes after metabolic surgery in adult diabetic patients with mild obesity: a randomised controlled trial" },
      { title: "Altered subcutaneous adipose tissue parameters after switching ART-controlled HIV+ patients to raltegravir/maraviroc" },
      { title: "Intestinal alteration of a-gustducin and sweet taste signaling pathway in metabolic diseases is partly rescued after weight loss and diabetes remission" },
      { title: "Imidazole propionate is increased in diabetes and associated with dietary patterns and altered microbial ecology" },
      { title: "Statin therapy is associated with lower prevalence of gut microbiota dysbiosis" },
      { title: "From correlation to causality: the case of Subdoligranulum" },
      { title: "Gut Microbiota Profile of Obese Diabetic Women Submitted to Roux-en-Y Gastric Bypass and Its Association with Food Intake and Postoperative Diabetes Remission" },
      { title: "Author Correction: Imidazole propionate is increased in diabetes and associated with dietary patterns and altered microbial ecology" },
      { title: "Interpretable and accurate prediction models for metagenomics data" },
    ],
  },
  {
    id: "elhadi-ait-dads", name: "Elhadi AIT DADS",
    title: "Emérite", role: "emerite", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur émérite spécialiste des équations différentielles fonctionnelles et des systèmes dynamiques non-linéaires à l'Université Cadi Ayyad.",
    email: "aitdads@uca.ac.ma",
    avatarSeed: "EA", photoUrl: "/photos/elhadi-ait-dads.png", publicationsCount: 5,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    publications: [
      { title: "Existence results for Riemann–Liouville fractional evolution inclusions in Banach spaces" },
      { title: "Exponential Dichotomy and (μ, ν)-Pseudo almost automorphic soluntions for some ordinary differential equations" },
      { title: "Study of existence, uniqueness and egularity of the solution of double delay nonlinear integral equation" },
      { title: "The impact of water level fluctuations on a delayed prey–predator model" },
      { title: "On the integro‐differential equations with reflection" },
    ],
  },
  {
    id: "eugeni-belda", name: "Eugeni BELDA CUESTA",
    title: "Ingénieur de Recherche — Centre France", role: "ingenieur", center: "france",
    axes: ["ia", "capteurs"],
    bio: "Expert en bio-informatique et analyse du microbiome intestinal. Développe des pipelines d'analyse omique intégratifs pour la santé métabolique.",
    email: "eugeni.belda@ird.fr", orcid: "0000-0002-3847-1920",
    avatarSeed: "EB", photoUrl: "/photos/eugeni-belda.png", publicationsCount: 34,
  },
  {
    id: "gabriel-guilsou-kolaye", name: "Gabriel Guilsou KOLAYE",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents"],
    bio: "Chercheur au Centre Cameroun. Expert en modélisation de l'épidémiologie et de la gestion des maladies des cultures tropicales en relation avec le changement climatique.",
    avatarSeed: "GK", photoUrl: "/photos/gabriel-guilsou-kolaye.png", publicationsCount: 11,
  },
  {
    id: "hai-au-pham", name: "Hai Au PHAM",
    title: "Personnel administratif — Centre Asie du Sud-Est", role: "ingenieur", center: "asie",
    axes: ["agents"],
    bio: "Personnel administratif au Centre Asie du Sud-Est. Coordination logistique et support aux projets de recherche.",
    avatarSeed: "HP", photoUrl: "/photos/hai-au-pham.png", publicationsCount: 1,
  },
  {
    id: "hamidou-a-diallo", name: "Hamidou A DIALLO",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["ia", "capteurs"],
    bio: "Chercheur au Centre Méditerranée. Expert en intelligence artificielle appliquée aux systèmes de surveillance environnementale.",
    avatarSeed: "HD", photoUrl: "/photos/hamidou-a-diallo.png", publicationsCount: 8,
  },
  {
    id: "hamidou-dathe", name: "Hamidou DATHE",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents", "capteurs"],
    bio: "Chercheur au Centre Afrique de l'Ouest. Travaux sur la modélisation des systèmes pastoraux sahéliens et le changement climatique.",
    avatarSeed: "HD", photoUrl: "/photos/hamidou-dathe.png", publicationsCount: 10,
  },
  {
    id: "hamza-adamou", name: "Hamza ADAMOU",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents", "ia"],
    bio: "Chercheur au Centre Cameroun. Spécialisé en modélisation des systèmes épidémiologiques et en décisions des modèles d'apprentissage profond.",
    avatarSeed: "HA", photoUrl: "/photos/hamza-adamou.png", publicationsCount: 9,
  },
  {
    id: "hamza-elouiaazzani", name: "Hamza ELOUIAAZZANI",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["ia", "capteurs"],
    bio: "Expert en intelligence artificielle pour les écosystèmes marins (AIME) et la surveillance de la qualité de l'air (AIRQALY-4-ASMAFRI).",
    email: "hamza.elouiaazzani@uca.ma",
    avatarSeed: "HE", photoUrl: "/photos/hamza-elouiaazzani.png", publicationsCount: 8,
  },
  {
    id: "hippolyte-tapamo-kenfack", name: "Hippolyte Michel TAPAMO KENFACK",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["ia", "capteurs"],
    bio: "Chercheur au Centre Cameroun. Expert en traitement automatique du langage naturel et de la parole pour les langues africaines.",
    avatarSeed: "HK", photoUrl: "/photos/hippolyte-tapamo-kenfack.png", publicationsCount: 14,
  },
  {
    id: "huy-dung-han", name: "Huy-Dung HAN",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "capteurs"],
    bio: "Chercheur au Centre Asie. Spécialisé en modélisation de la dynamique côtière et des systèmes d'alerte précoce aux inondations.",
    avatarSeed: "HN", photoUrl: "/photos/huy-dung-han.png", publicationsCount: 10,
  },
  {
    id: "ivric-valaire-yatat-djeumen", name: "Ivric Valaire YATAT DJEUMEN",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents"],
    bio: "Chercheur au Centre Cameroun. Expert en modélisation mathématique des dynamiques forêt-savane et des processus de changement d'état en écologie.",
    avatarSeed: "IY", photoUrl: "/photos/ivric-valaire-yatat-djeumen.png", publicationsCount: 10,
  },
  {
    id: "jalila-el-ghordaf", name: "Jalila EL GHORDAF",
    title: "Maître de Conférence — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents", "capteurs"],
    bio: "Maître de Conférence à l'Université Cadi Ayyad. Expert en dynamique des populations et gestion durable des ressources en eau au Maroc.",
    email: "jalila.elghordaf@uca.ma", orcid: "0000-0003-4829-1029",
    avatarSeed: "JG", photoUrl: "/photos/jalila-el-ghordaf.png", publicationsCount: 18,
  },
  {
    id: "jean-daniel-zucker", name: "Jean-Daniel ZUCKER",
    title: "Directeur d'Unité Adjoint — Centre France", role: "directeur_unite", center: "france",
    axes: ["agents", "ia"],
    bio: "Pionnier de l'apprentissage profond appliqué à la santé (microbiome, métabolome). Coordinateur de DeepIntegrOmics et DeepECG4U.",
    email: "Jean-Daniel.zucker@ird.fr", orcid: "0000-0003-0021-7438",
    avatarSeed: "JZ", photoUrl: "/photos/jean-daniel-zucker.png", publicationsCount: 1,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    publications: [
      { title: "Rescuing public health data : A South-East Asia Regional Initiative to build a Dengue Database" },
    ],
  },
  {
    id: "jean-jules-tewa", name: "Jean-Jules TEWA",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents", "participatif"],
    bio: "Expert en modélisation mathématique des maladies infectieuses tropicales. Travaux sur la dynamique des pathogènes et les stratégies de prévention.",
    email: "jean-jules.tewa@ird.fr", orcid: "0000-0001-9384-2031",
    avatarSeed: "JT", photoUrl: "/photos/jean-jules-tewa.png", publicationsCount: 21,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    publications: [
      { title: "Modelling and analysis of a within-host model of hepatitis B and D co-infections" },
      { title: "Control Model of Banana Black Sigatoka Disease with Seasonality" },
      { title: "Optimal Strategy in a Two Resources Two Consumers Grazing Model" },
      { title: "Multi-seasonal modelling of the African maize stalk borer with assessment of crop residue management" },
      { title: "Dynamics of human schistosomiasis model with hybrid miracidium and cercariae" },
      { title: "Spatio-temporal modelling of tree-grass dynamics in humid savannas: Interplay between nonlocal competition and nonlocal facilitation" },
      { title: "Mathematical modelling of Banana Black Sigatoka Disease with delay and Seasonality" },
      { title: "Optimal intervention strategies of staged progression HIV infections through an age-structured model with probabilities of ART drop out" },
      { title: "When and how to fallow: first steps towards banana crop yield improvement through optimal and sustainable control of a soilborne pest" },
      { title: "Optimal and sustainable management of a soilborne banana pest" },
      { title: "Short-term forecasts of the COVID-19 pandemic: a study case of Cameroon" },
      { title: "Modelling and control of a banana soilborne pest in a multi-seasonal framework" },
      { title: "Optimal intervention strategies of a SI-HIV models with differential infectivity and time delays" },
      { title: "Hopf bifurcation analysis in a delayed Leslie–Gower predator–prey model incorporating additional food for predators, refuge and threshold harvesting of preys" },
      { title: "Hopf Bifurcation in a Delayed Herd Harvesting Model and Herbivory Optimization Hypothesis" },
      { title: "Hopf bifurcation in a grazing system with two delays" },
      { title: "Theoretical assessment of the impact of environmental contamination on the dynamical transmission of polio" },
      { title: "Analysis of an Age-structured SIL model" },
      { title: "A Generic Modelling of Fire Impact in a Tree-Grass Savanna Model" },
      { title: "Mathematical Analysis of a Size Structured Tree-Grass Competition Model for Savanna Ecosystems" },
    ],
  },
  {
    id: "jean-marie-dembele", name: "Jean Marie DEMBELE",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents"],
    bio: "Chercheur au Centre Afrique de l'Ouest. Expert en modélisation des socio-écosystèmes sahéliens et des dynamiques de la végétation.",
    avatarSeed: "JD", photoUrl: "/photos/jean-marie-dembele.png", publicationsCount: 12,
  },
  {
    id: "jeanne-cottenceau", name: "Jeanne COTTENCEAU",
    title: "Personnel administratif — Centre Asie du Sud-Est", role: "ingenieur", center: "asie",
    axes: ["agents"],
    bio: "Coordinatrice administrative du Centre Asie du Sud-Est. Support à la gestion de projets et aux partenariats internationaux.",
    email: "jeanne.cottenceau@ird.fr",
    avatarSeed: "JC", photoUrl: "/photos/jeanne-cottenceau.png", publicationsCount: 1,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    publications: [
      { title: "Un partenariat de recherche pour améliorer les méthodologies de la science de la durabilité" },
    ],
  },
  {
    id: "jihad-zahir", name: "Jihad ZAHIR",
    title: "Directeur d'Unité Adjoint — Centre Méditerranée", role: "directeur_unite", center: "mediterranee",
    axes: ["ia"],
    bio: "Directeur d'Unité Adjoint au Centre Méditerranée. Spécialisé en modélisation mathématique et en intelligence artificielle pour les systèmes complexes.",
    email: "j.zahir@uca.ac.ma",
    avatarSeed: "JZ", photoUrl: "/photos/jihad-zahir.png", publicationsCount: 15,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning",
    projects: ["Participation aux projets AIME et EDGE"],
    publications: [
      { title: "AgriFuture: A New Theory of Change Approach to Building Climate-Resilient Agriculture" },
      { title: "Towards Distributed Learning in Internet of Things. Air Quality Monitoring Use Case" },
      { title: "Air Quality Monitoring Using Deterministic and Statistical Methods" },
      { title: "Geographic Disaggregation of Textual Social Media Data: A Machine Learning-based Approach" },
      { title: "IADD: An integrated Arabic dialect identification dataset" },
      { title: "Arabic Sexist Comments Detection in Youtube: A Context-Aware Opinion Analysis Approach" },
      { title: "Big Data and Reality Mining in Healthcare: Promise and Potential" },
      { title: "Enabling distributed intelligence in Internet of Things: an air quality monitoring use case" },
      { title: "A Dataset to Support Sexist Content Detection in Arabic Text" },
      { title: "Towards Distributed Learning in Internet of Things. Air Quality Monitoring Use Case" },
      { title: "Author Gender Identification from Arabic Youtube Comments" },
      { title: "Responsive cities and data gathering: challenges and opportunities" },
      { title: "FUTURE-AI: International consensus guideline for trustworthy and deployable artificial intelligence in healthcare" },
      { title: "Assessing Ocean's Legal Protection Using AI: A New Dataset and a BERT-Based Classifier" },
      { title: "A Transformer-Based Nlp Pipeline for Enhanced Extraction of Botanical Information using Camembert on French Literature" },
    ],
  },
  {
    id: "joseph-mbang", name: "Joseph MBANG",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents", "ia"],
    bio: "Chercheur au Centre Cameroun. Spécialisé en modélisation mathématique des systèmes épidémiques et en applications de l'IA à la santé publique.",
    avatarSeed: "JM", photoUrl: "/photos/joseph-mbang.png", publicationsCount: 12,
  },
  {
    id: "jules-brice-tchatchieng-mbougua", name: "Jules Brice TCHATCHIENG MBOUGUA",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents", "capteurs"],
    bio: "Chercheur au Centre Cameroun. Expert en modélisation des cultures tropicales et en détection des maladies agricoles par capteurs.",
    avatarSeed: "JB", photoUrl: "/photos/jules-brice-tchatchieng-mbougua.png", publicationsCount: 8,
  },
  {
    id: "justin-moskolai-ngossaha", name: "Justin MOSKOLAI NGOSSAHA",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["ia", "capteurs"],
    bio: "Chercheur au Centre Cameroun. Spécialisé en apprentissage multi-modal et en développement d'algorithmes d'apprentissage profond pour la santé.",
    avatarSeed: "JN", photoUrl: "/photos/justin-moskolai-ngossaha.png", publicationsCount: 9,
  },
  {
    id: "kevin-chapuis", name: "Kevin CHAPUIS",
    title: "Chercheur — Centre France", role: "chercheur", center: "france",
    axes: ["agents", "participatif"],
    bio: "Chercheur au Centre France. Expert en modélisation comportementale et en simulation de systèmes socio-environnementaux avec GAMA.",
    email: "kevin.chapuis@ird.fr",
    avatarSeed: "KC", photoUrl: "/photos/kevin-chapuis.png", publicationsCount: 13,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    publications: [
      { title: "COMOKIT v2: A multi-scale approach to modeling and simulating epidemic control policies" },
      { title: "Dealing with mixed and non-normative traffic. An agent-based simulation with the GAMA platform" },
      { title: "Exploring multi-modal evacuation strategies for a landlocked population using large-scale agent-based simulations" },
      { title: "Generation of Synthetic Populations in Social Simulations: A Review of Methods and Practices" },
      { title: "An Agent-Based Co-modeling Approach to Simulate the Evacuation of a Population in the Context of a Realistic Flooding Event: A Case Study in Hanoi (Vietnam)" },
      { title: "Experimenting the Impact of Pedestrianisation on Urban Pollution Using Tangible Agent-Based Simulations: Application to Hoan Kiem District, Hanoi, Vietnam" },
      { title: "Using the COMOKIT model to study the impact of the morpho-functional organization of cities on the spread of COVID-19" },
      { title: "COMOKIT : un environnement générique et modulaire pour analyser les impacts des politiques d'intervention contre l'épidémie de COVID-19" },
      { title: "Vulnérabilité face aux catastrophes naturelles : comportements de mise en protection et gestion de l'évacuation en cas de crue rapide" },
      { title: "HoanKiemAir: simulating impacts of urban management practices on traffic and air pollution using a tangible agent-based model" },
      { title: "Designing social simulation to (seriously) support decision-making: COMOKIT, an agent-based modelling toolkit to analyse and compare the impacts of public health interventions against COVID-19" },
      { title: "COMOKIT: A Modeling Kit to Understand, Analyze, and Compare the Impacts of Mitigation Policies Against the COVID-19 Epidemic at the Scale of a City" },
      { title: "ESCAPE: Exploring by Simulation Cities Awareness on Population Evacuation" },
    ],
  },
  {
    id: "khalil-ezzinbi", name: "Khalil EZZINBI",
    title: "Directeur du Centre Méditerranée", role: "directeur_centre", center: "mediterranee",
    axes: ["agents"],
    bio: "Lauréat du Prix Hassan II des Sciences. Expert mondial en équations différentielles avec retard et leurs applications aux systèmes complexes.",
    email: "ezzinbi@uca.ac.ma", orcid: "0000-0002-1038-4920",
    avatarSeed: "KE", photoUrl: "/photos/khalil-ezzinbi.png", publicationsCount: 3,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    publications: [
      { title: "Pseudo almost periodic solutions for some parabolic evolution equations with Stepanov-like pseudo almost periodic forcing terms" },
      { title: "Almost automorphic solutions for nonautonomous parabolic evolution equations" },
      { title: "Compact almost automorphic solutions for semilinear parabolic evolution equations" },
    ],
  },
  {
    id: "kittima-leeruttanawisut", name: "Kittima LEERUTTANAWISUT",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "participatif"],
    bio: "Chercheuse au Centre Asie. Expert en modélisation participative des systèmes agro-forestiers et des pratiques d'utilisation des terres en Thaïlande.",
    avatarSeed: "KL", photoUrl: "/photos/kittima-leeruttanawisut.png", publicationsCount: 9,
  },
  {
    id: "lahcen-lhachimi", name: "Lahcen LHACHIMI",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur au Centre Méditerranée. Expert en contrôle optimal et en contrôlabilité des équations aux dérivées partielles stochastiques.",
    avatarSeed: "LL", photoUrl: "/photos/lahcen-lhachimi.png", publicationsCount: 12,
  },
  {
    id: "lahcen-maniar", name: "Lahcen MANIAR",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur au Centre Méditerranée. Expert en analyse fonctionnelle et en systèmes d'évolution abstraits avec applications à la dynamique des populations.",
    avatarSeed: "LM", photoUrl: "/photos/lahcen-maniar.png", publicationsCount: 38,
  },
  {
    id: "mahmoud-baroun", name: "Mahmoud BAROUN",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur au Centre Méditerranée. Spécialisé en équations différentielles stochastiques et en contrôlabilité des systèmes dégénérés.",
    avatarSeed: "MB", photoUrl: "/photos/mahmoud-baroun.png", publicationsCount: 9,
  },
  {
    id: "mai-chi-nguyen", name: "Mai Chi NGUYEN",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "ia"],
    bio: "Chercheuse au Centre Asie. Expert en modélisation des dynamiques de propagation des épidémies et en santé publique computationnelle.",
    avatarSeed: "MC", photoUrl: "/photos/mai-chi-nguyen.png", publicationsCount: 11,
  },
  {
    id: "maissa-mbaye", name: "Maissa MBAYE",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["ia", "agents"],
    bio: "Chercheuse au Centre Afrique de l'Ouest. Spécialisée en intelligence artificielle appliquée aux systèmes agro-environnementaux du Sahel.",
    avatarSeed: "MM", photoUrl: "/photos/maissa-mbaye.png", publicationsCount: 8,
  },
  {
    id: "mamadou-abdoul-diop", name: "Mamadou Abdoul DIOP",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents"],
    bio: "Chercheur au Centre Afrique de l'Ouest. Expert en modélisation des dynamiques de pêche artisanale et des ressources halieutiques sénégalaises.",
    email: "mamadou-abdoul.diop@ugb.edu.sn",
    avatarSeed: "MD", photoUrl: "/photos/mamadou-abdoul-diop.png", publicationsCount: 8,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    publications: [
      { title: "Neutral stochastic delay partial functional integro-differential equations driven by a fractional Brownian motion" },
      { title: "An ontology design pattern of the multidisciplinary and complex field of climate change" },
      { title: "Mild solution of neutral stochastic partial functional integrodifferential equations with non-Lipschitz coefficients" },
      { title: "Kuratowski measure of noncompactness and integro-differential equations in Banach spaces" },
      { title: "Optimal Controls for Stochastic Functional Integro-differential Equation" },
      { title: "Mathematical Analysis of Fasciola Epidemic Model with Treatment and Quarantine" },
      { title: "Optimal control for semilinear integrodifferential evolution equations in Banach spaces" },
      { title: "Well-posedness and approximate controllability for some integrodifferential evolution systems with multi-valued nonlocal conditions" },
    ],
  },
  {
    id: "mamadou-sy", name: "Mamadou SY",
    title: "Directeur d'Unité Adjoint — Centre Afrique de l'Ouest", role: "directeur_unite", center: "afrique-ouest",
    axes: ["agents"],
    bio: "Directeur d'Unité Adjoint. Expert en modélisation des ressources naturelles et des systèmes hydriques sahéliens.",
    email: "mamadou.sy@ugb.edu.sn", orcid: "0000-0001-8345-2910",
    avatarSeed: "MS", photoUrl: "/photos/mamadou-sy.png", publicationsCount: 1,
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    publications: [
      { title: "Optimal Control of Thermal Pollution Emitted by Power Plants" },
    ],
  },
  {
    id: "maurice-tchuente", name: "Maurice TCHUENTE",
    title: "Chercheur Émérite — Centre Afrique centrale et de l'est", role: "emerite", center: "afrique-centrale",
    axes: ["ia"],
    bio: "Chercheur émérite, pionnier de l'informatique en Afrique Centrale. Travaux fondateurs en automates cellulaires et systèmes parallèles.",
    email: "Maurice.Tchuente@gmail.com",
    avatarSeed: "MT", photoUrl: "/photos/maurice-tchuente.png", publicationsCount: 1,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning",
    publications: [
      { title: "Extracting ontological knowledge from Java source code using Hidden Markov Models" },
    ],
  },
  {
    id: "md-yushalify-misro", name: "Md Yushalify MISRO",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "ia"],
    bio: "Chercheur associé au Centre Asie. Expert en méthodes mathématiques pour la modélisation des systèmes complexes biologiques.",
    avatarSeed: "YM", photoUrl: "/photos/md-yushalify-misro.png", publicationsCount: 14,
  },
  {
    id: "mohamed-halloumi", name: "Mohamed HALLOUMI",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["ia", "agents"],
    bio: "Chercheur au Centre Méditerranée. Expert en intelligence artificielle et en modélisation des systèmes complexes socio-économiques.",
    avatarSeed: "MH", photoUrl: "/photos/mohamed-halloumi.png", publicationsCount: 10,
  },
  {
    id: "mohamed-khaladi", name: "Mohamed KHALADI",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur au Centre Méditerranée. Expert en dynamique des populations, contrôle optimal et modélisation des systèmes biologiques.",
    avatarSeed: "MK", photoUrl: "/photos/mohamed-khaladi.png", publicationsCount: 24,
  },
  {
    id: "mohd-hafiz-bin-mohd", name: "Mohd Hafiz Bin MOHD",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents"],
    bio: "Chercheur associé au Centre Asie. Spécialisé en modélisation mathématique des populations et des dynamiques écologiques.",
    avatarSeed: "MH", photoUrl: "/photos/mohd-hafiz-bin-mohd.png", publicationsCount: 7,
  },
  {
    id: "moussa-balde", name: "Moussa BALDE",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents"],
    bio: "Chercheur au Centre Afrique de l'Ouest. Travaux sur la modélisation multi-agents des dynamiques pastorales et de la mobilité des éleveurs.",
    avatarSeed: "MB", photoUrl: "/photos/moussa-balde.png", publicationsCount: 7,
  },
  {
    id: "moussa-lo", name: "Moussa LO",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents"],
    bio: "Expert en modélisation à base d'agents pour la pêche artisanale et les dynamiques bioéconomiques des ressources halieutiques sénégalaises.",
    avatarSeed: "ML", photoUrl: "/photos/moussa-lo.png", publicationsCount: 9,
  },
  {
    id: "myriam-sonia-djoukwe-tapi", name: "Myriam Sonia DJOUKWE TAPI",
    title: "Directeur de centre adjoint — Centre Afrique centrale et de l'est", role: "directeur_unite", center: "afrique-centrale",
    axes: ["agents", "ia"],
    bio: "Directrice de centre adjointe. Expert en modélisation mathématique des maladies vectorielles et des stratégies de contrôle épidémique.",
    avatarSeed: "MD", photoUrl: "/photos/myriam-sonia-djoukwe-tapi.png", publicationsCount: 12,
  },
  {
    id: "nhat-quang-dinh", name: "Nhat Quang DINH",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "capteurs"],
    bio: "Chercheur au Centre Asie. Expert en modélisation de l'intrusion saline et de la gestion de l'eau dans les deltas côtiers.",
    avatarSeed: "NQ", photoUrl: "/photos/nhat-quang-dinh.png", publicationsCount: 8,
  },
  {
    id: "nicolas-florsch", name: "Nicolas FLORSCH",
    title: "Chercheur Émérite — Centre France", role: "emerite", center: "france",
    axes: ["capteurs", "agents"],
    bio: "Chercheur émérite pionnier en géophysique appliquée et en méthodes instrumentales innovantes pour l'étude des sols.",
    avatarSeed: "NF", photoUrl: "/photos/nicolas-florsch.png", publicationsCount: 52,
  },
  {
    id: "nicolas-marilleau", name: "Nicolas MARILLEAU",
    title: "Directeur du Centre France", role: "directeur_centre", center: "france",
    axes: ["agents", "participatif"],
    bio: "Expert en simulation distribuée à grande échelle et modélisation participative pour la gestion côtière (LittoSIM-GEN). Directeur du Centre IRD/Sorbonne.",
    email: "nicolas.marilleau@ird.fr", orcid: "0000-0002-4019-2831",
    avatarSeed: "NM", photoUrl: "/photos/nicolas-marilleau.png", publicationsCount: 55,
  },
  {
    id: "nicolas-turenne", name: "Nicolas TURENNE",
    title: "Chercheur — Centre France", role: "chercheur", center: "france",
    axes: ["ia", "agents"],
    bio: "Chercheur au Centre France. Recherches sur la fouille de textes, le traitement automatique du langage naturel et la veille scientifique.",
    avatarSeed: "NT", photoUrl: "/photos/nicolas-turenne.png", publicationsCount: 22,
  },
  {
    id: "nisrine-outada", name: "Nisrine OUTADA",
    title: "Responsable de centre — Centre Méditerranée", role: "responsable_theme", center: "mediterranee",
    axes: ["agents", "ia"],
    bio: "Responsable au Centre Méditerranée. Expert en théorie des essaims et en modélisation multi-agents inspirée de la physique statistique.",
    avatarSeed: "NO", photoUrl: "/photos/nisrine-outada.png", publicationsCount: 15,
  },
  {
    id: "nohayla-alaoui", name: "Nohayla ALAOUI",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["ia", "capteurs"],
    bio: "Chercheuse au Centre Méditerranée. Spécialisée en intelligence artificielle pour la surveillance environnementale et la mobilité urbaine.",
    avatarSeed: "NA", photoUrl: "/photos/nohayla-alaoui.png", publicationsCount: 6,
  },
  {
    id: "norbert-tsopze", name: "Norbert TSOPZE",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["ia", "capteurs"],
    bio: "Chercheur au Centre Cameroun. Expert en traitement automatique du langage naturel pour les langues africaines et en apprentissage profond.",
    avatarSeed: "NT", photoUrl: "/photos/norbert-tsopze.png", publicationsCount: 16,
  },
  {
    id: "olga-kengni-ngangmo", name: "Olga KENGNI NGANGMO",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents", "ia"],
    bio: "Chercheuse au Centre Cameroun. Spécialisée en modélisation des dynamiques biologiques et en IA appliquée à la surveillance épidémiologique.",
    avatarSeed: "OK", photoUrl: "/photos/olga-kengni-ngangmo.png", publicationsCount: 7,
  },
  {
    id: "olivier-monga", name: "Olivier MONGA",
    title: "Chercheur — Centre France", role: "chercheur", center: "france",
    axes: ["agents", "capteurs"],
    bio: "Chercheur au Centre France. Expert en modélisation 3D des microstructures des sols et en simulation des processus biogéochimiques (ANR SOILμ-3D).",
    avatarSeed: "OM", photoUrl: "/photos/olivier-monga.png", publicationsCount: 38,
  },
  {
    id: "ousmane-thiare", name: "Ousmane THIARE",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents", "ia"],
    bio: "Expert en modélisation multi-agents des dynamiques urbaines et en IA appliquée aux systèmes complexes africains.",
    email: "ousmane.thiare@ucad.edu.sn", orcid: "0000-0002-9012-3847",
    avatarSeed: "OT", photoUrl: "/photos/ousmane-thiare.png", publicationsCount: 11,
  },
  {
    id: "papa-ibrahima-ndiaye", name: "Papa Ibrahima NDIAYE",
    title: "Directeur d'Unité Adjoint — Centre Afrique de l'Ouest", role: "directeur_unite", center: "afrique-ouest",
    axes: ["agents", "ia"],
    bio: "Directeur d'Unité Adjoint. Spécialisé en modélisation informatique des systèmes complexes et en intelligence artificielle appliquée aux défis de l'Afrique.",
    avatarSeed: "PN", photoUrl: "/photos/papa-ibrahima-ndiaye.png", publicationsCount: 20,
  },
  {
    id: "paulin-melatagia-yonta", name: "Paulin MELATAGIA YONTA",
    title: "Directeur de centre adjoint — Centre Afrique centrale et de l'est", role: "directeur_unite", center: "afrique-centrale",
    axes: ["agents", "ia"],
    bio: "Directeur de centre adjoint. Expert en apprentissage automatique et en traitement automatique du langage pour les langues africaines.",
    avatarSeed: "PM", photoUrl: "/photos/paulin-melatagia-yonta.png", publicationsCount: 19,
  },
  {
    id: "pierre-auger", name: "Pierre AUGER",
    title: "Chercheur Émérite — Centre France", role: "emerite", center: "france",
    axes: ["agents"],
    bio: "Chercheur émérite spécialiste des systèmes dynamiques et de la modélisation mathématique des populations biologiques.",
    avatarSeed: "PA", photoUrl: "/photos/pierre-auger.png", publicationsCount: 68,
  },
  {
    id: "pierre-iloga-biyik", name: "Pierre Sylvain ILOGA BIYIK",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents"],
    bio: "Chercheur au Centre Cameroun. Expert en modélisation mathématique des systèmes biologiques et en méthodes d'analyse de la dynamique des populations.",
    avatarSeed: "PS", photoUrl: "/photos/pierre-iloga-biyik.png", publicationsCount: 6,
  },
  {
    id: "prachya-rachya-boonprasurt", name: "Prachya Rachya BOONPRASURT",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "participatif"],
    bio: "Chercheur au Centre Asie. Modélisation des dynamiques sociales et participatives dans les communautés rurales d'Asie du Sud-Est.",
    avatarSeed: "PB", photoUrl: "/photos/prachya-rachya-boonprasurt.png", publicationsCount: 6,
  },
  {
    id: "quang-nghi-huynh", name: "Quang Nghi HUYNH",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents"],
    bio: "Chercheur au Centre Asie. Expert en simulation distribuée à large échelle et optimisation des architectures GAMA pour le HPC.",
    avatarSeed: "QH", photoUrl: "/photos/quang-nghi-huynh.png", publicationsCount: 5,
  },
  {
    id: "raphael-duboz", name: "Raphaël DUBOZ",
    title: "Chercheur — Centre Afrique de l'Ouest", role: "chercheur", center: "afrique-ouest",
    axes: ["agents", "participatif"],
    bio: "Chercheur au Centre Afrique de l'Ouest. Expert en modélisation bio-économique des pêcheries et en simulation des ressources écologiques marines.",
    avatarSeed: "RD", photoUrl: "/photos/raphael-duboz.png", publicationsCount: 18,
  },
  {
    id: "rene-ndoundam", name: "René NDOUNDAM",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["ia", "capteurs"],
    bio: "Chercheur au Centre Cameroun. Expert en traitement automatique des langues africaines et en développement de ressources linguistiques numériques.",
    avatarSeed: "RN", photoUrl: "/photos/rene-ndoundam.png", publicationsCount: 11,
  },
  {
    id: "said-boulite", name: "Said BOULITE",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["agents"],
    bio: "Chercheur au Centre Méditerranée. Expert en semi-groupes d'opérateurs et en théorie qualitative des équations différentielles abstraites.",
    avatarSeed: "SB", photoUrl: "/photos/said-boulite.png", publicationsCount: 14,
  },
  {
    id: "samuel-bowong", name: "Samuel BOWONG",
    title: "Directeur de centre adjoint — Centre Afrique centrale et de l'est", role: "directeur_unite", center: "afrique-centrale",
    axes: ["agents"],
    bio: "Expert en modélisation mathématique des systèmes épidémiologiques complexes et en contrôle optimal des maladies infectieuses.",
    avatarSeed: "SB", photoUrl: "/photos/samuel-bowong.png", publicationsCount: 45,
  },
  {
    id: "syakila-ahmad", name: "Syakila AHMAD",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "ia"],
    bio: "Chercheuse associée au Centre Asie. Spécialisée en modélisation des systèmes environnementaux marins et côtiers en Malaisie.",
    avatarSeed: "SA", photoUrl: "/photos/syakila-ahmad.png", publicationsCount: 9,
  },
  {
    id: "thi-hai-van-dinh", name: "Thi Hai Van DINH",
    title: "Directeur de centre adjoint — Centre Asie du Sud-Est", role: "directeur_unite", center: "asie",
    axes: ["agents", "participatif"],
    bio: "Directrice de centre adjointe au Centre Asie du Sud-Est. Spécialiste de la modélisation des systèmes agro-environnementaux dans le delta du Mékong.",
    avatarSeed: "TD", photoUrl: "/photos/thi-hai-van-dinh.png", publicationsCount: 22,
  },
  {
    id: "thi-hoai-phuong-tran", name: "Thi Hoai Phuong TRAN",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["participatif", "agents"],
    bio: "Chercheuse au Centre Asie. Travaux sur la modélisation participative de la gestion de l'eau et de l'agriculture dans le delta du Mékong.",
    avatarSeed: "TH", photoUrl: "/photos/thi-hoai-phuong-tran.png", publicationsCount: 7,
  },
  {
    id: "thi-phuong-linh-huynh", name: "Thi Phuong Linh HUYNH",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents", "capteurs"],
    bio: "Chercheuse au Centre Asie. Expert en collecte de données de terrain et en intégration de capteurs dans les modèles environnementaux.",
    avatarSeed: "PL", photoUrl: "/photos/thi-phuong-linh-huynh.png", publicationsCount: 6,
  },
  {
    id: "thi-thuy-nguyen", name: "Thi Thuy NGUYEN",
    title: "Responsable de thème — Centre Asie du Sud-Est", role: "responsable_theme", center: "asie",
    axes: ["participatif", "agents"],
    bio: "Responsable de thème au Centre Asie. Expert en sciences participatives et modélisation collaborative des systèmes socio-environnementaux.",
    avatarSeed: "TN", photoUrl: "/photos/thi-thuy-nguyen.png", publicationsCount: 16,
  },
  {
    id: "thomas-messi-nguele", name: "Thomas MESSI NGUELE",
    title: "Chercheur — Centre Afrique centrale et de l'est", role: "chercheur", center: "afrique-centrale",
    axes: ["agents", "ia"],
    bio: "Chercheur au Centre Cameroun. Spécialisé en modélisation des réseaux complexes et en simulation des dynamiques de propagation.",
    avatarSeed: "TJ", photoUrl: "/photos/thomas-messi-nguele.png", publicationsCount: 8,
  },
  {
    id: "timothee-brochier", name: "Timothée BROCHIER",
    title: "Responsable de thème — Centre France", role: "responsable_theme", center: "france",
    axes: ["agents", "capteurs"],
    bio: "Responsable de thème au Centre France. Expert en modélisation des écosystèmes marins et en ichtyologie computationnelle.",
    avatarSeed: "TB", photoUrl: "/photos/timothee-brochier.png", publicationsCount: 24,
  },
  {
    id: "tri-nguyen-huu", name: "Tri NGUYEN-HUU",
    title: "Responsable de thème — Centre France", role: "responsable_theme", center: "france",
    axes: ["agents", "ia"],
    bio: "Responsable de thème au Centre France. Recherches sur les modèles hybrides couplant équations différentielles et systèmes multi-agents en épidémiologie.",
    avatarSeed: "TN", photoUrl: "/photos/tri-nguyen-huu.png", publicationsCount: 19,
  },
  {
    id: "tuong-vinh-ho", name: "Tuong Vinh HO",
    title: "Chercheur — Centre Asie du Sud-Est", role: "chercheur", center: "asie",
    axes: ["agents"],
    bio: "Chercheur au Centre Asie. Modélisation de la dynamique des pêches et de la bio-économie des ressources halieutiques au Vietnam.",
    avatarSeed: "TV", photoUrl: "/photos/tuong-vinh-ho.png", publicationsCount: 8,
  },
  {
    id: "viet-truong-xuan", name: "Viet TRUONG XUAN",
    title: "Directeur d'Unité Adjoint — Centre Asie du Sud-Est", role: "directeur_unite", center: "asie",
    axes: ["agents"],
    bio: "Expert en simulation à base d'agents pour les systèmes urbains et la gestion des ressources naturelles au Vietnam.",
    avatarSeed: "VT", photoUrl: "/photos/viet-truong-xuan.png", publicationsCount: 28,
  },
  {
    id: "youcef-sklab", name: "Youcef SKLAB",
    title: "Chercheur — Centre France", role: "chercheur", center: "france",
    axes: ["ia", "agents"],
    bio: "Chercheur au Centre France. Expert en systèmes multi-agents, formation de coalitions et intelligence artificielle distribuée.",
    avatarSeed: "YS", photoUrl: "/photos/youcef-sklab.png", publicationsCount: 15,
  },
  {
    id: "youssef-el-foutayeni", name: "Youssef EL FOUTAYENI",
    title: "Chercheur — Centre Méditerranée", role: "chercheur", center: "mediterranee",
    axes: ["ia", "agents"],
    bio: "Chercheur au Centre Méditerranée. Expert en apprentissage automatique et en modélisation des systèmes dynamiques complexes.",
    avatarSeed: "YA", photoUrl: "/photos/youssef-el-foutayeni.png", publicationsCount: 7,
  },
  {
    id: "zakaria-belghali", name: "Zakaria BELGHALI",
    title: "Doctorant — Centre Méditerranée", role: "doctorant", center: "mediterranee",
    axes: ["ia", "agents"],
    bio: "Doctorant au Centre Méditerranée. Travaux sur l'apprentissage automatique et la modélisation des systèmes dynamiques complexes.",
    avatarSeed: "ZB", photoUrl: "/photos/zakaria-belghali.png", publicationsCount: 1,
  },
  {
    id: "diane-tchuani-tchakonte", name: "Diane TCHUANI TCHAKONTE",
    title: "Responsable de thème — Centre Afrique centrale et de l'est", role: "responsable_theme", center: "afrique-centrale",
    axes: ["ia", "capteurs"],
    bio: "Responsable de thème au Centre Afrique centrale et de l'est. Experte en intelligence artificielle et capteurs pour les applications en Afrique.",
    email: "diane.tchuani@gmail.com",
    avatarSeed: "DT", photoUrl: "/photos/diane-tchuani-tchakonte.png", publicationsCount: 1,
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning",
    publications: [
      { title: "Adaptive healing procedure for lifetime improvement in Wireless Sensor Networks" },
    ],
  },
];

// ─── Publications ─────────────────────────────────────────────────────────────

export const PUBLICATIONS_SEED: Publication[] = [];

const existingPublicationIds = new Set(PUBLICATIONS_SEED.map((pub) => pub.id));

export const PUBLICATION: Publication[] = [
  ...PUBLICATIONS_SEED,
  ...UMMISCO_EXTERNAL_PUBLICATIONS.filter((pub) => !existingPublicationIds.has(pub.id)),
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
  },
  {
    id: "comokit",
    name: "COMOKIT",
    centers: ["asie"],
    themes: ["agents"],
    domain: "Santé publique",
    description:
      "Modèle informatique permettant d'explorer in silico les stratégies d'intervention épidémique (COVID-19) avant leur mise en application.",
    url: "https://comokit.org/",
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
  },
  {
    id: "airqaly-4-asmafri",
    name: "AIRQALY-4-ASMAFRI",
    centers: ["mediterranee"],
    themes: ["participatif", "capteurs"],
    domain: "Santé humaine",
    description:
      "Réseau de capteurs citoyens pour la surveillance de la qualité de l'air et son impact sur l'asthme en Afrique. Science participative et acquisition de données.",
    url: "https://ummisco.fr/fr/projet-ummisco/airqaly-4-asmafri/",
  },
  {
    id: "aime",
    name: "AIME",
    centers: ["mediterranee"],
    themes: ["ia", "participatif"],
    domain: "Santé humaine",
    description:
      "Artificial Intelligence for Marine Ecosystems. Application de l'IA pour la modélisation et le suivi des écosystèmes marins méditerranéens.",
    url: "https://ummisco.fr/fr/projet-ummisco/aime/",
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
    name: "ANR ESCAPE",
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
    name: "OBLIGATIONS",
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
    logoUrl: "/logos/logos-logiciels/gama-logo.png",
  },
  {
    id: "comokit-tool",
    name: "COMOKIT",
    description:
      "Modèle informatique permettant d'explorer in silico les stratégies d'intervention épidémique avant leur mise en application.",
    tags: ["GAMA", "Épidémiologie", "COVID-19"],
    website: "https://comokit.org/",
    github: "https://github.com/COMOKIT",
    logoUrl: "/logos/logos-logiciels/logo-comokit.png",
  },
  {
    id: "ichthyop",
    name: "Ichthyop",
    description:
      "Simule les processus intervenant au début de la vie des poissons : mouvement, croissance, mortalité et recrutement. Utilise les champs océaniques ROMS, NEMO ou SYMPHONIE.",
    tags: ["Océanographie", "Ichtyologie", "Particules"],
    website: "https://ichthyop.org/",
    github: "https://github.com/ichthyop/ichthyop",
    logoUrl: "/logos/logos-logiciels/cropped-logo_ichtyop.png",
  },
  {
    id: "kendrick",
    name: "Kendrick",
    description:
      "Plateforme de simulation épidémiologique mathématique. Modèles déterministes compartimentaux, stochastiques et en réseaux. Basé sur Pharo, open source MIT.",
    tags: ["Pharo", "Épidémiologie", "DSL", "Open Source"],
    github: "https://github.com/KendrickOrg/kendrick",
    logoUrl: "/logos/logos-logiciels/kendrick-logo.png",
  },
  {
    id: "epicam",
    name: "EPICAM",
    description:
      "Système de surveillance de la tuberculose déployé sur 47 sites au Cameroun. Permet le suivi individualisé de 65 % des malades enregistrés, développé avec le Centre Pasteur.",
    tags: ["Tuberculose", "Cameroun", "Surveillance", "Santé publique"],
    github: "https://github.com/UMMISCO/EPICAM",
    logoUrl: "/logos/logos-logiciels/New-epiCam-logo.webp",
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
    supervisor: "Professeur Alassane BAH",
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
    url: "https://comokit.org/",
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
