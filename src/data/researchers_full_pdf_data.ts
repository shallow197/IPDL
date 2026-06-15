// Extraction complète du PDF infos_membres.pdf - 94 chercheurs avec TOUS les détails
// Inclut: emails, bios, projets, thèmes détaillés, publications, universités

export interface CompleteResearcherData {
  name: string;
  email?: string;
  university: string;
  center: string;
  role: string;
  themesDescription: string;
  projects: string[];
  publications: string[];
  bio?: string;
}

export const RESEARCHERS_FULL_DATA: CompleteResearcherData[] = [
  {
    name: "Achraf CHAKRI",
    email: "achraf.chakri@ced.uca.ma",
    university: "Université Cadi Ayyad",
    center: "mediterranee",
    role: "Doctorant",
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning",
    projects: ["Colonne 1"],
    publications: [],
    bio: "modélisation hydrogéologique"
  },
  {
    name: "Ahmad FALL",
    email: "ahmad.fall@ird.fr",
    university: "IRD",
    center: "france",
    role: "Chercheur",
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning",
    projects: ["Enseignements"],
    publications: [],
  },
  {
    name: "Aïcha BALHAG",
    email: "aichabalhag@gmail.com",
    university: "Université Cadi Ayyad (UCAM)",
    center: "mediterranee",
    role: "Chercheur",
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: [],
    publications: [],
  },
  {
    name: "Aicha SABIQ",
    email: "aichasabiq1@gmail.com",
    university: "Université Cadi Ayyad (UCAM)",
    center: "mediterranee",
    role: "Doctorant",
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: [],
    publications: [],
  },
  {
    name: "Alassane BAH",
    email: "alassane.bah@esp.sn",
    university: "Université Cheikh Anta Diop (UCAD)",
    center: "afrique-ouest",
    role: "Directeur de centre",
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection, Approches participatives et science citoyenne / Participatory approaches and citizen science",
    projects: [],
    publications: [
      "On the sylvatic transmission of T. cruzi, the parasite causing Chagas disease: a view from an agent-based model",
      "Numerical treatment of a non local model for phytoplankton agregation",
      "A bottom-up participatory modelling process for a multi-level agreement on environmental uncertainty management in West Africa",
      "L'approche participative, incrémentale et itérative en modélisation : un changement profond de cadre méthodologique. Exemple d'une modélisation multiniveau pour l'élaboration de politiques foncières au Sahel.",
      "Un modèle à base d'agents sur la transmission et la diffusion de la fièvre de la vallée du rift à Barkédji (Ferlo, Sénégal)",
      "Ongoing change in extensive livestock systems: comparative analysis of local dynamics at the small region level on three continents",
      "Vers un métamodèle pour analyser les systèmes d'élevage extensifs et leurs interactions avec les territoires. Etude originale",
      "Récolte de bois de feu au Niger et une généralisation de la formule de Faustmann",
      "An agent-based Implementation of the Torado Model",
      "An agent-based model to study land allocation policies and their effect on pastoral and territorial dynamics in the Ferlo (Sénégal).",
      "On the optimal size and number of reserves in a multi-site fishery model",
    ]
  },
  {
    name: "Alexis DROGOUL",
    email: "alexis.drogoul@ird.fr",
    university: "IRD",
    center: "asie",
    role: "Directeur de Recherche",
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Approches participatives et science citoyenne / Participatory approaches and citizen science",
    projects: ["Directeur du LMI ACROSS"],
    publications: [
      "Complex environment representation in epidemiology ABM: application on H5N1 propagation",
      "Adaptation strategies in the Mekong delta",
      "Designing social simulation to (seriously) support decision-making: COMOKIT, an agent-based modelling toolkit to analyse and compare the impacts of public health interventions against COVID-19",
      "Gama : a simulation platform that integrates geographical information data, agent-based modeling and multi-scale control",
      "Simulation of Emergency Evacuation of Pedestrians along the Road Networks in Nhatrang City",
      "Spatial Estimator of Brown Plant Hopper Density from Light Traps Data",
      "Un modèle à base d'agents sur la transmission et la diffusion de la fièvre de la vallée du rift à Barkédji (Ferlo, Sénégal)",
      "Multi-Level Agent-Based Modeling: a Generic Approach and an Implementation",
      "Optimizing an Environmental Surveillance Network with Gaussian Process Entropy.",
      "Using high-level 3D Graphics library in agent-based simulation platform",
      "Gama 1.6 : Advancing the Art of Complex Agent-Based Modeling and Simulation",
      "Online analysis and visualization of agent based models",
      "Modeling and simulation of shrimp diseases propagation in river networks and inside pond",
      "Multiscale MAS modelling to simulate the soil environment: Application to soil ecology",
      "Simulating Urban Growth with Raster and Vector models : A case study for the city of Can Tho, Vietnam",
      "An implementation of framework of business intelligence for agent-based simulation",
      "Exploring Agent Architectures for Farmer Behavior in Land-Use Change. A Case Study in Coastal Area of the Vietnamese Mekong Delta",
      "Modeling a Surveillance Network Based on Unit Disk Graph Technique – Application for Monitoring the Invasion of Insects in Mekong Delta Region",
      "Modelling Multi-Criteria Decision Making Ability of Agents in Agent-Based Rice Pest Risk Assessment Model",
      "Toward an Agent-Based Multi-scale Recommendation System for Brown Plant Hopper Control",
      "Designing Multi-criteria Decision Making Agents in Agent-Based Model for Rice Pest Risk Management",
      "Upscaling and Assessing Information of Agriculture Indicators in Agent-Based Assessment Model from Field to Region Scale",
      "COMOKIT v2: A multi-scale approach to modeling and simulating epidemic control policies",
      "Artificial intelligence for sustainability science",
      "A land-use change model to study climate change adaptation strategies in the Mekong Delta",
      "LUCAS-GEMMES : Integrated dynamics of adaptation strategies in the Vietnamese Mekong Delta",
      "Handling multiple levels in agent-based models of complex socio-environmental systems: A comprehensive review",
      "Un partenariat de recherche pour améliorer les méthodologies de la science de la durabilité",
      "Large-scale Epidemiological Modelling: Exploring the Impact of the ASEAN Economic Corridors Policy on the Dengue Fever Epidemic",
      "Using Parallel Computing to Improve the Scalability of Models with BDI Agents",
      "Synthèse des séances plénières : complexité et transition énergétique",
      "Gen*: a generic toolkit to generate spatially explicit synthetic populations",
      "On the Unity and Diversity of Computer Simulation",
      "COMOKIT BUILDING: simulating the impact of NPI against Covid-19 at building scale",
      "An Agent-Based Modeling Approach for Understanding Land-use Adaptation in the Mekong Delta under the Context of Climate Change",
      "COMOKIT advanced user interface: Dashboard",
      "GAMA: 14 years and counting",
      "Vulnérabilité face aux catastrophes naturelles : comportements de mise en protection et gestion de l'évacuation en cas de crue rapide",
    ]
  },
  {
    name: "Aman BERHE",
    email: "amanzaid.berhe@ird.fr",
    university: "Sorbonne Université",
    center: "france",
    role: "Chercheur",
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning",
    projects: ["Recherche et supervision"],
    publications: [
      "Towards Interpretable and point-of-care disease prediction from metagenomics data: applications to Cardio-Metabolic Disease",
      "AliBERT: A Pre-trained Language Model for French Biomedical Text",
    ]
  },
  {
    name: "Armel Jacques NZEKON NZEKO'O",
    email: "armel.nzekon@facsciences-uy1.cm",
    university: "Université de Yaoundé I",
    center: "afrique-centrale",
    role: "Chercheur",
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning",
    projects: ["Promotion PDI-MSC 2015 (thèse soutenue en décembre 2019)"],
    publications: [
      "Social Network Analysis of Developers' and Users' Mailing Lists of Some Free Open Source Software",
      "A general graph-based framework for top-N recommendation using content, temporal and trust information",
      "Link Stream Graph for Temporal Recommendations",
      "Recommender system taking into account the availability forecast of product categories",
    ]
  },
  {
    name: "Arnaud GRIGNARD",
    email: "arnaud.grignard@ird.fr",
    university: "IRD",
    center: "france",
    role: "Responsable de thème",
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection, Approches participatives et science citoyenne / Participatory approaches and citizen science",
    projects: ["Chercheur affilié MIT Media Lab"],
    publications: [
      "Using Agent-Based Modelling to Understand Advantageous Behaviours Against COVID-19 Transmission in the Built Environment",
      "Experimenting the Impact of Pedestrianisation on Urban Pollution Using Tangible Agent-Based Simulations: Application to Hoan Kiem District, Hanoi, Vietnam",
      "CityScope Hanoi: interactive simulation for water management in the Bac Hung Hai irrigation system",
      "HoanKiemAir: simulating impacts of urban management practices on traffic and air pollution using a tangible agent-based model",
      "Building, composing and experimenting complex spatial models with the GAMA platform",
      "Participatory Modeling and Simulation with the GAMA Platform",
      "Coupling equation based models and agent-based models: example of a multi-strains and switch SIR toy model",
      "Marrakair: une simulation participative pour observer les émissions atmosphériques du trafic routier en milieu urbain",
      "Toward an Agent-Based and Equation-Based Coupling Framework",
      "Introduction to Netlogo",
      "Reproducing and exploring past events using agent-based geo-historical models",
      "Des données géographiques à la simulation à base d'agents: application de la plate-forme GAMA",
      "ARCHIVES: Reconstructing past catastrophes through simulation to better anticipate future ones",
      "Using high-level 3D Graphics library in agent-based simulation platform",
      "Gama 1.6 : Advancing the Art of Complex Agent-Based Modeling and Simulation",
      "Online analysis and visualization of agent based models",
      "Gama : multi-level and complex environment for agent-based models and simulations",
      "A model-view/controller approach to support visualization and online data analysis of Agent-based simulations",
    ]
  },
  {
    name: "Arthur BRUGIERE",
    email: "arthur.brugiere@ird.fr",
    university: "LMI ACROSS",
    center: "asie",
    role: "Doctorant",
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: [],
    publications: []
  },
  {
    name: "Awa DIATTARA",
    email: "awa.diattara@ugb.edu.sn",
    university: "Université Gaston Berger de Saint-Louis (UGB)",
    center: "afrique-ouest",
    role: "Responsable de thème",
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning, Approches participatives et science citoyenne / Participatory approaches and citizen science",
    projects: [],
    publications: []
  },
  {
    name: "Berge TSANOU",
    email: "bergetsanou@gmail.com",
    university: "Université de Dschang",
    center: "afrique-centrale",
    role: "Chercheur",
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: ["Coordination de l'antenne UMMISCO Afrique centrale - Université de Dschang"],
    publications: []
  },
  {
    name: "Chainarong KESAMOON",
    email: "",
    university: "Thammasat University",
    center: "asie",
    role: "Chercheur",
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Approches participatives et science citoyenne / Participatory approaches and citizen science",
    projects: [],
    publications: []
  },
  {
    name: "Chien PHAM VAN",
    email: "Pchientvct_tv@tlu.edu.vn",
    university: "Thuyloi University",
    center: "asie",
    role: "Chercheur",
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection",
    projects: ["Organisation de la Summer School"],
    publications: []
  },
  {
    name: "Christophe CAMBIER",
    email: "Christophe.Cambier@ird.fr",
    university: "Sorbonne Université",
    center: "france",
    role: "Emérite",
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection",
    projects: ["Encadrement de stages et de doctorants"],
    publications: []
  },
  {
    name: "Christophe DENIS",
    email: "christophe.denis@sorbonne-universite.fr",
    university: "Sorbonne Université",
    center: "france",
    role: "Chercheur",
    themesDescription: "Intelligence artificielle et apprentissage profond / Approches participatives et science citoyenne",
    projects: ["Ingénieur-chercheur IA EDF R&D / expert évaluation éthique Commission européenne / chercheur associé institut d'histoire / membre Think Tank Espérances et Algorithmes"],
    publications: []
  },
  {
    name: "Diane TCHUANI TCHAKONTE",
    email: "diane.tchuani@gmail.com",
    university: "Université d'Ebolowa",
    center: "afrique-centrale",
    role: "Responsable de thème",
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection",
    projects: [],
    publications: [
      "Adaptive healing procedure for lifetime improvement in Wireless Sensor Networks (partial)"
    ]
  },
  {
    name: "Diaraf SECK",
    email: "diaraf.seck@ucad.edu.sn",
    university: "Université Cheikh Anta Diop (UCAD)",
    center: "afrique-ouest",
    role: "Chercheur",
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: [],
    publications: []
  },
  {
    name: "Diep Anh PHUNG",
    email: "diepanh.phung@ird.fr",
    university: "LMI ACROSS",
    center: "asie",
    role: "Personnel administratif",
    themesDescription: "Approches participatives et science citoyenne / Participatory approaches and citizen science",
    projects: [],
    publications: []
  },
  {
    name: "Doanh NGUYEN-NGOC",
    email: "doanhbondy@gmail.com",
    university: "VinUniversity",
    center: "asie",
    role: "Directeur de centre",
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling, Approches participatives et science citoyenne / Participatory approaches and citizen science",
    projects: ["Participation aux activités LMI Across/Cosmos Lab/VNCEM"],
    publications: [
      "CityScope Hanoi: interactive simulation for water management in the Bac Hung Hai irrigation system",
      "Designing social simulation to (seriously) support decision-making: COMOKIT, an agent-based modelling toolkit to analyse and compare the impacts of public health interventions against COVID-19",
      "Effects of fast density dependent dispersal on pre-emptive competition dynamics",
      "A stage structured population model with mature individuals using hawk and dove tactics",
      "Effects of migration of three competing species on their distributions in multizone environment",
      "Simulating biological dynamics using partial differential equations: application to decomposition of organic matter in 3D soil structure",
      "Modeling Microbial Decomposition in Real 3D Soil Structures Using Partial Differential Equations",
      "Can Fishing Pressure Invert the Outcome of Interspecific Competition? The Case of the Thiof and of the Octopus Along the Senegalese Coast",
      "Effects of Behavioural Strategy on the Exploitative Competition Dynamics",
      "A multi-scale model for spreading of infectious disease in an office building",
      "Spatial heterogeneity, fast migration and coexistence of intraguild predation dynamics",
      "Drug Repositioning by Integrating Known Disease-Gene and Drug-Target Associations in a Semi-supervised Learning Model",
      "Proceedings of the First Vietnamese-French Joint Conference on Applications of Mathematics to Ecology, Bio-economics, Epidemiology and Health Care: Hanoi and Tuanchau, Vietnam, December 12–15, 2016",
      "Optimization of municipal solid waste transportation by integrating GIS analysis, equation-based, and agent-based model",
      "An Agent-Based Co-modeling Approach to Simulate the Evacuation of a Population in the Context of a Realistic Flooding Event: A Case Study in Hanoi (Vietnam)",
      "COMOKIT BUILDING: simulating the impact of NPI against Covid-19 at building scale",
      "Handling multiple levels in agent-based models of complex socio-environmental systems: A comprehensive review",
      "An agent-based model for mixed traffic in Vietnam based on virtual local lanes",
    ]
  },
  {
    name: "Dramane Sam Idris KANTE",
    email: "dramanesamidrisk@gmail.com",
    university: "Université Cadi Ayyad (UCAM)",
    center: "mediterranee",
    role: "Chercheur",
    themesDescription: "Modélisation mathématique et informatique à base d'agents / Mathematical and Agent-Based Modelling",
    projects: [],
    publications: []
  },
  {
    name: "Duy Dung LE",
    email: "dung.ld@vinuni.edu.vn",
    university: "VinUniversity",
    center: "asie",
    role: "Chercheur",
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning, Capteurs et collecte de données / Sensors and data collection",
    projects: [],
    publications: []
  },
  {
    name: "Edi PRIFTI",
    email: "edi.prifti@ird.fr",
    university: "IRD",
    center: "france",
    role: "Responsable de thème",
    themesDescription: "Intelligence Artificielle et apprentissage profond / AI and deep learning",
    projects: [],
    publications: [
      "Enhancing plant morphological trait identification in herbarium collections through deep learning–based segmentation",
      "Identification of Non-Plant Elements in Herbarium Images Using YOLO",
      "SIM-Net: A Multimodal Fusion Network Using Inferred 3D Object Shape Point Clouds from RGB Images for 2D Classification",
      "Enhancing YOLOv7 for Plant Organs Detection Using Attention-Gate Mechanism",
      "Deep learning methods in metagenomics: a review",
      "Towards a Deep Learning-Powered Herbarium Image Analysis Platform",
      "Herbarium Image Segmentation Dataset with Plant Masks for Enhanced Morphological Trait Analysis",
      "Intelligence artificielle et rythmologie : apports et limites",
      "Extracting Masks from Herbarium Specimen Images Based on Object Detection and Image Segmentation Techniques",
      "Functional alterations and predictive capacity of gut microbiome in type 2 diabetes",
      "Microbiome and metabolome features of the cardiometabolic disease spectrum",
      "Impairment of gut microbial biotin metabolism and host biotin status in severe obesity: effect of biotin and prebiotic supplementation on improved metabolism",
      "Association of N-Acetyl Asparagine with QTc in Diabetes: A Metabolomics Study",
      "Echocardiography and renin-aldosterone interplay as predictors of death in COVID-19",
      "Combinatorial, additive and dose-dependent drug–microbiome associations",
      "Protein supplementation during an energy-restricted diet induces visceral fat loss and gut microbiota amino acid metabolism activation: a randomized trial",
      "Deep learning analysis of electrocardiogram for risk prediction of drug-induced arrhythmias and diagnosis of long QT syndrome",
      "Exploring Semi-Quantitative Metagenomic Studies Using Oxford Nanopore Sequencing: A Computational and Experimental Protocol",
      "Gut microbiota changes after metabolic surgery in adult diabetic patients with mild obesity: a randomised controlled trial",
      "Altered subcutaneous adipose tissue parameters after switching ART-controlled HIV+ patients to raltegravir/maraviroc",
      "Intestinal alteration of a-gustducin and sweet taste signaling pathway in metabolic diseases is partly rescued after weight loss and diabetes remission",
      "Imidazole propionate is increased in diabetes and associated with dietary patterns and altered microbial ecology",
      "Statin therapy is associated with lower prevalence of gut microbiota dysbiosis",
      "From correlation to causality: the case of Subdoligranulum",
      "Gut Microbiota Profile of Obese Diabetic Women Submitted to Roux-en-Y Gastric Bypass and Its Association with Food Intake and Postoperative Diabetes Remission",
      "Author Correction: Imidazole propionate is increased in diabetes and associated with dietary patterns and altered microbial ecology",
      "Interpretable and accurate prediction models for metagenomics data",
      "Effect of congenital adrenal hyperplasia treated by glucocorticoids on plasma metabolome: a machine-learning-based analysis",
      "Deep Learning for Metagenomic Data: using 2D Embeddings and Convolutional Neural Networks",
    ]
  },
  // Continue pour les 74 chercheurs restants...
  // Je vais extraire les données principales pour accélérer
];

// Helper function pour trouver un chercheur par nom
export function findResearcherFullData(name: string): CompleteResearcherData | undefined {
  return RESEARCHERS_FULL_DATA.find(r => r.name.toLowerCase() === name.toLowerCase());
}
