import type { UserRole } from "@/context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DBUser {
  id: string;
  nom: string;
  email: string;
  password: string; // plain text in dev mock — use bcrypt in production
  role: UserRole;
  langue: "fr" | "en";
  avatar?: string;              // data URL base64 ou URL externe
  biographie?: string;
  expertises?: string[];        // chercheur, responsable_axe, directeur
  // Tous rôles
  telephone?: string;
  orcid?: string;               // identifiant ORCID
  lienExterne?: string;         // Google Scholar / ResearchGate / LinkedIn
  // Chercheurs, responsables d'axe, directeur
  affiliation?: string;         // université / établissement
  centre?: string;              // Dakar, Bondy, Hanoï…
  organisation?: string;
  domaine?: string;
  // Étudiants / doctorants
  estDoctorant?: boolean;
  directeurThese?: string;
  anneeThese?: 1 | 2 | 3 | 4 | 5;
  universiteInscription?: string;
  // Partenaires
  typeOrganisation?: "academique" | "institutionnel" | "industriel" | "bailleur";
  pays?: string;
  siteWeb?: string;
  /** Extra granular permissions granted individually (on top of the role). */
  permissions?: string[];
  active?: boolean;
  createdAt: string;
}

// ─── ACL model (granular permissions + dynamically composed roles) ───────────

export interface Permission {
  id: string;
  group: string;
  label: string;
  description: string;
}

/** Catalogue des permissions atomiques du portail (modèle ACL). */
export const PERMISSIONS: Permission[] = [
  // Publications
  { id: "pub.read", group: "Publications", label: "Consulter les publications", description: "Lire les publications publiées sur le portail." },
  { id: "pub.submit", group: "Publications", label: "Soumettre une publication", description: "Déposer une publication soumise à validation d'un administrateur." },
  { id: "pub.publish_direct", group: "Publications", label: "Publier sans validation", description: "Mettre en ligne directement (réservé aux chercheurs)." },
  { id: "pub.validate", group: "Publications", label: "Valider / rejeter les publications", description: "Approuver ou rejeter les soumissions en attente." },
  // Datasets
  { id: "data.read_public", group: "Datasets", label: "Télécharger les datasets publics", description: "Accès aux jeux de données ouverts à tous." },
  { id: "data.read_protected", group: "Datasets", label: "Accéder aux datasets protégés", description: "Réservé aux membres d'UMMISCO." },
  { id: "data.read_private", group: "Datasets", label: "Accéder aux datasets privés", description: "Réservé à un groupe restreint et explicitement autorisé." },
  { id: "data.deposit", group: "Datasets", label: "Déposer des datasets", description: "Publier de nouveaux jeux de données avec leurs métadonnées." },
  // Simulations
  { id: "sim.run", group: "Simulations", label: "Lancer des simulations", description: "Exécuter les modèles intégrés (GAMA, NetLogo)." },
  // Axes thématiques
  { id: "axe.manage", group: "Axes thématiques", label: "Animer un axe thématique", description: "Mettre à jour actualités, publications et membres d'un axe." },
  // Administration
  { id: "user.manage", group: "Administration", label: "Gérer les utilisateurs", description: "Modifier les rôles et l'état des comptes." },
  { id: "role.manage", group: "Administration", label: "Composer les rôles ACL", description: "Créer et modifier des rôles en combinant des permissions." },
  { id: "acl.approve", group: "Administration", label: "Traiter les demandes d'accès", description: "Approuver ou refuser les demandes d'accès aux ressources." },
  { id: "analytics.view", group: "Administration", label: "Consulter le tableau de bord", description: "Voir les statistiques globales du portail." },
];

export interface DBRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  /** Rôle de base non supprimable (livré avec le système). */
  system?: boolean;
  createdAt: string;
}

export type AccessRequestStatus = "en_attente" | "approuvee" | "refusee";

export interface DBAccessRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  /** Permission demandée (id du catalogue PERMISSIONS). */
  permission: string;
  /** Ressource visée (libellé lisible) — dataset, fonctionnalité, axe… */
  resourceLabel: string;
  reason: string;
  status: AccessRequestStatus;
  createdAt: string;
  decidedAt?: string;
  decidedBy?: string;
}

export type PubStatus = "en_attente" | "validee" | "rejetee";
export type AccessLevel = "public" | "protected" | "private";
export type SimStatus = "en_cours" | "terminee" | "erreur";

export interface DBPublication {
  id: string;
  titre: string;
  resume: string;
  auteurs: string[];          // noms affichés
  authorIds: string[];        // IDs user (pour liens profil)
  journal?: string;           // nom de la revue ou conférence
  volume?: string;
  numero?: string;
  pages?: string;
  doi?: string;               // ex: 10.1234/jmsc.2024.001
  annee: number;
  datePublication: string;
  motsClefs: string[];
  fichierPdf?: string;        // URL ou nom de fichier (future: stockage serveur)
  googleScholarUrl?: string;
  datasetsLies: string[];     // IDs datasets associés
  statut: PubStatus;
  axe: string;
  accessLevel: AccessLevel;
  citationApa: string;
  citationBibtex: string;
}

export interface DBDataset {
  id: string;
  titre: string;
  description: string;
  type: string;
  licence: string;
  acces: AccessLevel;
  fichiers: string[];
  metadonnees: Record<string, string>;
  creatorId: string;
  creatorName?: string;
  size: string;
  downloads: number;
  dateDepot: string;
}

export interface DBSimulation {
  id: string;
  type: string;
  parametres: Record<string, unknown>;
  resultats?: Record<string, unknown>;
  statut: SimStatus;
  dateLancement: string;
  completionTime: number; // Unix ms when results will be ready
  userId: string;
  accesPublic: boolean;
}

export interface DBEvent {
  id: string;
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  lieu: string;
  capacite: number;
  inscrits: string[];
  type: "seminaire" | "conference" | "atelier" | "autre";
  speaker?: string;
}

export interface DBNewsletter {
  id: string;
  email: string;
  dateInscription: string;
}

export interface DBPartner {
  id: string;
  nom: string;
  type: "academique" | "institutionnel" | "industriel" | "bailleur";
  pays: string;
  description: string;
  website: string;
  logo?: string;
  projets: string[];
}

// ─── Signatures cryptographiques (Ed25519 / TweetNaCl) ───────────────────────

export type SignatureType = "profile" | "dataset" | "publication" | "attestation";

export interface DBSignature {
  id: string;
  /** DB user ID du signataire (payload.sub du JWT). */
  signerId: string;
  signerName: string;
  /** Type de cible signée. */
  type: SignatureType;
  /** ID de la cible (researcher.id, dataset.id, publication.id, ou attestation UUID). */
  targetId: string;
  /** Libellé humain de la cible (pour affichage sans re-fetch). */
  targetLabel: string;
  /** JSON canonique des données signées. */
  signedData: string;
  /** Signature Ed25519 encodée en hexadécimal (128 chars). */
  signatureHex: string;
  /** Clé publique Ed25519 du signataire (64 chars hex). */
  publicKeyHex: string;
  timestamp: string;
}

// ─── In-memory store (module singleton) ──────────────────────────────────────

const db = {
  users: new Map<string, DBUser>(),
  publications: new Map<string, DBPublication>(),
  datasets: new Map<string, DBDataset>(),
  simulations: new Map<string, DBSimulation>(),
  events: new Map<string, DBEvent>(),
  newsletter: new Map<string, DBNewsletter>(),
  partners: new Map<string, DBPartner>(),
  roles: new Map<string, DBRole>(),
  accessRequests: new Map<string, DBAccessRequest>(),
  signatures: new Map<string, DBSignature>(),
};

// ─── Seed data ────────────────────────────────────────────────────────────────

function seed() {
  // Users
  const now = new Date().toISOString();
  const users: DBUser[] = [
    {
      id: "u-admin", nom: "Professeur Cheikh Diallo", email: "admin@ummisco.sn",
      password: "admin123", role: "directeur" as UserRole, langue: "fr",
      biographie: "Directeur d'UMMISCO Dakar. Pionnier de la modélisation multi-agents en Afrique de l'Ouest.",
      expertises: ["Modélisation multi-agents", "Systèmes complexes", "Épidémiologie"],
      createdAt: now,
    },
    {
      id: "u-chercheur", nom: "Dr. Fatou Diop", email: "chercheur@ummisco.sn",
      password: "chercheur123", role: "chercheur" as UserRole, langue: "fr",
      biographie: "Spécialiste de la modélisation mathématique des maladies infectieuses.",
      expertises: ["Bio-Mathématiques", "Paludisme", "Science citoyenne"],
      estDoctorant: false, createdAt: now,
    },
    {
      id: "u-etudiant", nom: "Mamadou Sarr", email: "etudiant@ummisco.sn",
      password: "etudiant123", role: "etudiant" as UserRole, langue: "fr", createdAt: now,
    },
    {
      id: "u-partenaire", nom: "IRD France", email: "partenaire@ird.fr",
      password: "partenaire123", role: "partenaire" as UserRole, langue: "fr",
      organisation: "Institut de Recherche pour le Développement",
      domaine: "Recherche scientifique", createdAt: now,
    },
    {
      id: "u-respaxe", nom: "Dr. Moussa Ndiaye", email: "respaxe@ummisco.sn",
      password: "respaxe123", role: "responsable_axe" as UserRole, langue: "fr",
      expertises: ["IoT", "Systèmes embarqués", "FabLab"], createdAt: now,
    },
  ];

  users.forEach((u) => db.users.set(u.id, u));

  // Publications
  const publications: DBPublication[] = [
    {
      id: "pub-01",
      titre: "Modélisation multi-agents de la propagation du paludisme dans la zone périurbaine de Dakar (2019-2024)",
      resume: "Ce travail présente un modèle multi-agents (SMA) simulant la transmission spatio-temporelle du paludisme à Dakar. Le modèle intègre des facteurs climatiques (pluviométrie, température, NDVI), les comportements de protection des ménages (moustiquaires imprégnées, répulsifs) et les gîtes larvaires géoréférencés à Pikine. Les résultats démontrent l'importance des micro-facteurs locaux dans la persistance de la transmission résiduelle et permettent de calibrer des interventions ciblées à l'échelle des quartiers.",
      auteurs: ["Fatou Diop", "Cheikh Diallo"],
      authorIds: ["u-chercheur", "u-admin"],
      journal: "Journal de Modélisation des Systèmes Complexes",
      volume: "12",
      numero: "2",
      pages: "145-162",
      annee: 2024,
      datePublication: "2024-03-15",
      motsClefs: ["paludisme", "modèle multi-agents", "Dakar", "épidémiologie", "NDVI", "Pikine"],
      googleScholarUrl: "https://scholar.google.com/scholar?q=Mod%C3%A9lisation+multi-agents+paludisme+Dakar",
      datasetsLies: ["data-01"],
      statut: "validee",
      axe: "agents",
      accessLevel: "public",
      citationApa: "Diop, F., & Diallo, C. (2024). Modélisation multi-agents de la propagation du paludisme dans la zone périurbaine de Dakar (2019-2024). Journal de Modélisation des Systèmes Complexes, 12(2), 145-162.",
      citationBibtex: `@article{diop2024modelisation,
  title={Modélisation multi-agents de la propagation du paludisme dans la zone périurbaine de Dakar (2019-2024)},
  author={Diop, Fatou and Diallo, Cheikh},
  journal={Journal de Modélisation des Systèmes Complexes},
  volume={12},
  number={2},
  pages={145--162},
  year={2024}
}`,
    },
    {
      id: "pub-02",
      titre: "Système d'alerte précoce basé sur l'Internet des objets pour la surveillance des inondations dans la banlieue de Dakar",
      resume: "Nous présentons l'architecture complète d'un réseau de capteurs ultrasoniques LoRaWAN déployé à Keur Massar pour la surveillance hydrologique en temps réel. Le système mesure le niveau des nappes et canaux de drainage toutes les 5 minutes via 12 nœuds LoRa. Un modèle de prédiction local (LSTM léger embarqué sur microcontrôleur) génère des alertes précoces jusqu'à 3 heures avant les débordements critiques, avec un taux de précision de 87 % lors des tests de la saison 2024.",
      auteurs: ["Moussa Ndiaye", "Amadou Faye"],
      authorIds: ["u-respaxe"],
      journal: "Revue Africaine de l'Ingénierie Logicielle et Systèmes",
      volume: "8",
      numero: "1",
      pages: "45-58",
      annee: 2023,
      datePublication: "2023-09-01",
      motsClefs: ["LoRaWAN", "IoT", "inondations", "Dakar", "alerte précoce", "LSTM"],
      googleScholarUrl: "https://scholar.google.com/scholar?q=alerte+pr%C3%A9coce+IoT+inondations+Dakar",
      datasetsLies: ["data-04"],
      statut: "validee",
      axe: "capteurs",
      accessLevel: "public",
      citationApa: "Ndiaye, M., & Faye, A. (2023). Système d'alerte précoce basé sur l'IoT pour la surveillance des inondations dans la banlieue de Dakar. Revue Africaine de l'Ingénierie Logicielle et Systèmes, 8(1), 45-58.",
      citationBibtex: `@article{ndiaye2023systeme,
  title={Système d'alerte précoce basé sur l'IoT pour la surveillance des inondations dans la banlieue de Dakar},
  author={Ndiaye, Moussa and Faye, Amadou},
  journal={Revue Africaine de l'Ingénierie Logicielle et Systèmes},
  volume={8},
  number={1},
  pages={45--58},
  year={2023}
}`,
    },
    {
      id: "pub-03",
      titre: "Sciences participatives pour le suivi de la qualité de l'air à Dakar : Approche par modélisation hybride",
      resume: "Cet article étudie le couplage entre capteurs citoyens mobiles et modèles de dispersion atmosphérique pour cartographier dynamiquement la pollution à Dakar-Plateau. En équipant 50 volontaires de micro-capteurs PM2.5 connectés, nous avons constitué un jeu de données dense permettant d'affiner les cartes de pollution à une résolution de 100 m. La méthode hybride couplant krigeage et simulation LES (Large Eddy Simulation) identifie des pics de pollution horaires non captés par les 4 stations fixes officielles.",
      auteurs: ["Amadou Faye", "Fatou Diop"],
      authorIds: ["u-chercheur"],
      journal: "Écologie et Informatique Globale",
      volume: "15",
      numero: "4",
      pages: "312-329",
      annee: 2024,
      datePublication: "2024-06-01",
      motsClefs: ["PM2.5", "science citoyenne", "pollution atmosphérique", "krigeage", "LES", "Dakar"],
      googleScholarUrl: "https://scholar.google.com/scholar?q=sciences+participatives+qualit%C3%A9+air+Dakar",
      datasetsLies: ["data-02"],
      statut: "en_attente",
      axe: "participatif",
      accessLevel: "protected",
      citationApa: "Faye, A., & Diop, F. (2024). Sciences participatives pour le suivi de la qualité de l'air à Dakar. Écologie et Informatique Globale, 15(4), 312-329.",
      citationBibtex: `@article{faye2024sciences,
  title={Sciences participatives pour le suivi de la qualité de l'air à Dakar},
  author={Faye, Amadou and Diop, Fatou},
  journal={Écologie et Informatique Globale},
  volume={15},
  number={4},
  pages={312--329},
  year={2024}
}`,
    },
    {
      id: "pub-04",
      titre: "Simulation comparative : Équations différentielles vs Modèles multi-agents pour la tuberculose au Sénégal",
      resume: "Nous comparons une approche classique compartimentale SEIR déterministe et une approche individu-centrée (SMA NetLogo) pour simuler la propagation de la tuberculose en milieu carcéral à Dakar. Sur 6 mois de simulation calibrée sur données SMIT 2021-2022, la modélisation multi-agents démontre une supériorité statistique (RMSE −34 %) pour capturer l'hétérogénéité des contacts physiques rapprochés et l'impact des co-infections VIH. Nos résultats orientent les politiques de dépistage systématique trimestriel.",
      auteurs: ["Fatou Diop", "Cheikh Diallo"],
      authorIds: ["u-chercheur", "u-admin"],
      journal: "Epidémiologie et Santé Internationale",
      volume: "34",
      numero: "3",
      pages: "89-104",
      annee: 2022,
      datePublication: "2022-11-20",
      motsClefs: ["tuberculose", "SEIR", "SMA", "comparaison", "Sénégal", "milieu carcéral"],
      googleScholarUrl: "https://scholar.google.com/scholar?q=tuberculose+SEIR+SMA+S%C3%A9n%C3%A9gal",
      datasetsLies: [],
      statut: "validee",
      axe: "agents",
      accessLevel: "public",
      citationApa: "Diop, F., & Diallo, C. (2022). Simulation comparative : SEIR vs SMA pour la tuberculose au Sénégal. Epidémiologie et Santé Internationale, 34(3), 89-104.",
      citationBibtex: `@article{diop2022simulation,
  title={Simulation comparative : Équations différentielles vs SMA pour la tuberculose au Sénégal},
  author={Diop, Fatou and Diallo, Cheikh},
  journal={Epidémiologie et Santé Internationale},
  volume={34},
  number={3},
  pages={89--104},
  year={2022}
}`,
    },
    {
      id: "pub-05",
      titre: "Modélisation multi-échelle de la dynamique sédimentaire et de l'érosion côtière sur la Langue de Barbarie",
      resume: "La rupture anthropique de la Langue de Barbarie en 2003 a reconfiguré profondément la morphodynamique de la côte nord du Sénégal. Ce travail propose un modèle hydro-sédimentaire couplant un automate cellulaire 2D (résolution 5 m) et un modèle de vagues spectraux (SWAN) pour projeter le recul du trait de côte sur l'horizon 2025-2035 sous trois scénarios de hausse du niveau marin (RCP 2.6, 4.5, 8.5). Les résultats montrent un recul moyen de 4,2 à 12,7 m/an selon le scénario, avec des zones d'accrétion paradoxale dans les secteurs sous influence lagunaire.",
      auteurs: ["Cheikh Diallo", "Amadou Faye"],
      authorIds: ["u-admin"],
      journal: "Journal Océanographique d'Afrique de l'Ouest",
      volume: "29",
      numero: "1",
      pages: "12-28",
      annee: 2023,
      datePublication: "2023-04-10",
      motsClefs: ["érosion côtière", "Langue de Barbarie", "Saint-Louis", "RCP", "automate cellulaire", "SWAN"],
      googleScholarUrl: "https://scholar.google.com/scholar?q=%C3%A9rosion+c%C3%B4ti%C3%A8re+Langue+de+Barbarie",
      datasetsLies: [],
      statut: "validee",
      axe: "agents",
      accessLevel: "public",
      citationApa: "Diallo, C., & Faye, A. (2023). Modélisation multi-échelle de la dynamique sédimentaire sur la Langue de Barbarie. Journal Océanographique d'Afrique de l'Ouest, 29(1), 12-28.",
      citationBibtex: `@article{diallo2023modelisation,
  title={Modélisation multi-échelle de la dynamique sédimentaire sur la Langue de Barbarie},
  author={Diallo, Cheikh and Faye, Amadou},
  journal={Journal Océanographique d'Afrique de l'Ouest},
  volume={29},
  number={1},
  pages={12--28},
  year={2023}
}`,
    },
    {
      id: "pub-06",
      titre: "Conception de stations pluviométriques ouvertes et reproductibles à faible coût au FabLab de l'ESP",
      resume: "Ce travail documente la conception complète d'un pluviomètre électronique à augets basculants imprimé en 3D et équipé d'une carte ESP32 LoRa pour transmission sans fil. Le coût matériel total (28 €) est réduit d'un facteur 10 par rapport aux équipements industriels du marché (Campbell CS700 : ~280 €), tout en maintenant un taux d'erreur de calibration inférieur à 3 % testé sur 6 mois en conditions sahéliennes. Les fichiers de fabrication (STL, PCB, code Arduino) sont publiés sous licence CERN-OHL-S v2.",
      auteurs: ["Moussa Ndiaye"],
      authorIds: ["u-respaxe"],
      journal: "Technologies Ouvertes pour le Développement",
      volume: "6",
      numero: "1",
      pages: "101-115",
      annee: 2024,
      datePublication: "2024-02-28",
      motsClefs: ["pluviomètre", "open hardware", "ESP32", "LoRa", "impression 3D", "FabLab"],
      googleScholarUrl: "https://scholar.google.com/scholar?q=pluviom%C3%A8tre+open+source+FabLab+ESP",
      datasetsLies: ["data-04"],
      statut: "validee",
      axe: "capteurs",
      accessLevel: "public",
      citationApa: "Ndiaye, M. (2024). Conception de stations pluviométriques ouvertes au FabLab de l'ESP. Technologies Ouvertes pour le Développement, 6(1), 101-115.",
      citationBibtex: `@article{ndiaye2024pluvio,
  title={Conception de stations pluviométriques ouvertes et reproductibles au FabLab de l'ESP},
  author={Ndiaye, Moussa},
  journal={Technologies Ouvertes pour le Développement},
  volume={6},
  number={1},
  pages={101--115},
  year={2024}
}`,
    },
  ];

  publications.forEach((p) => db.publications.set(p.id, p));

  // No dataset seeds — static datasets are displayed from ummiscoData on the frontend.
  // Real datasets are created by authenticated users via POST /api/datasets.

  // Events
  const events: DBEvent[] = [
    {
      id: "ev-01",
      titre: "Modélisation de la Dengue en milieu urbain sahélien : Défis et perspectives",
      description: "Ce séminaire présentera les premiers résultats du modèle multi-agents couplé aux données entomologiques de l'Institut Pasteur.",
      dateDebut: "2026-06-10T10:00:00Z",
      dateFin: "2026-06-10T12:00:00Z",
      lieu: "Salle de conférence UMMISCO — ESP Dakar",
      capacite: 60,
      inscrits: [],
      type: "seminaire",
      speaker: "Dr. Fatou Diop",
    },
    {
      id: "ev-02",
      titre: "Réseaux LoRaWAN et résilience urbaine : Retours d'expérience sur Keur Massar",
      description: "Présentation des prototypes de pluviomètres connectés et démonstration de la passerelle de transmission de données ouvertes.",
      dateDebut: "2026-06-20T15:00:00Z",
      dateFin: "2026-06-20T17:00:00Z",
      lieu: "FabLab UMMISCO, ESP UCAD",
      capacite: 30,
      inscrits: [],
      type: "atelier",
      speaker: "Dr. Moussa Ndiaye",
    },
    {
      id: "ev-03",
      titre: "IA et Systèmes Complexes : Défis théoriques de l'hybridation des modèles",
      description: "Conférence plénière explorant les méthodes de couplage entre modèles physiques et réseaux de neurones profonds.",
      dateDebut: "2026-07-05T09:30:00Z",
      dateFin: "2026-07-05T12:00:00Z",
      lieu: "Amphithéâtre IRD, Route des Pères Maristes, Hann",
      capacite: 150,
      inscrits: [],
      type: "conference",
      speaker: "Prof. Cheikh Diallo",
    },
    {
      id: "ev-04",
      titre: "Workshop : Science ouverte et partage de données dans les pays du Sud",
      description: "Atelier pratique sur les bonnes pratiques de dépôt de datasets, licences open data et publications en accès libre.",
      dateDebut: "2026-07-15T09:00:00Z",
      dateFin: "2026-07-16T17:00:00Z",
      lieu: "Salle informatique ESP UCAD",
      capacite: 25,
      inscrits: [],
      type: "atelier",
    },
  ];

  events.forEach((e) => db.events.set(e.id, e));

  // Partners
  const partners: DBPartner[] = [
    {
      id: "p-ird",
      nom: "IRD — Institut de Recherche pour le Développement",
      type: "institutionnel",
      pays: "France",
      description: "Partenaire fondateur d'UMMISCO. Fournit des financements et accueille les chercheurs dans les laboratoires français.",
      website: "https://www.ird.fr",
      projets: ["UMMISCO UMI", "ANR-ModSystèmes"],
    },
    {
      id: "p-ucad",
      nom: "UCAD — Université Cheikh Anta Diop",
      type: "academique",
      pays: "Sénégal",
      description: "Université hôte principale d'UMMISCO Dakar. Rattachement administratif à l'École Supérieure Polytechnique.",
      website: "https://www.ucad.sn",
      projets: ["ESP-UMMISCO", "Formation doctorale"],
    },
    {
      id: "p-pasteur",
      nom: "Institut Pasteur de Dakar",
      type: "academique",
      pays: "Sénégal",
      description: "Partenaire scientifique clé pour les recherches épidémiologiques et entomologiques sur le paludisme et la dengue.",
      website: "https://www.pasteur.sn",
      projets: ["Modélisation Paludisme Pikine", "Surveillance Dengue"],
    },
    {
      id: "p-anr",
      nom: "ANR — Agence Nationale de la Recherche",
      type: "bailleur",
      pays: "France",
      description: "Bailleur de fonds principal pour les projets franco-sénégalais de modélisation des systèmes complexes.",
      website: "https://anr.fr",
      projets: ["ANR-ModSystèmes", "ANR-IoT-Resilience"],
    },
    {
      id: "p-saed",
      nom: "SAED — Société d'Aménagement et d'Exploitation du Delta",
      type: "institutionnel",
      pays: "Sénégal",
      description: "Partenaire terrain pour les données hydrologiques du Fleuve Sénégal et les modèles de gestion de l'eau.",
      website: "https://www.saed.sn",
      projets: ["Hydrologie Fleuve Sénégal"],
    },
    {
      id: "p-inrae",
      nom: "INRAE — Institut National de Recherche pour l'Agriculture",
      type: "academique",
      pays: "France",
      description: "Collaborations sur la modélisation des agro-écosystèmes et la gestion durable des ressources naturelles.",
      website: "https://www.inrae.fr",
      projets: ["Agro-systèmes Afrique Sahel"],
    },
  ];

  partners.forEach((p) => db.partners.set(p.id, p));

  // ── Rôles ACL par défaut (composés de permissions) ──────────────────────────
  const roles: DBRole[] = [
    {
      id: "role-visiteur", name: "Visiteur", system: true, createdAt: now,
      description: "Grand public et médias — consultation uniquement.",
      permissions: ["pub.read", "data.read_public"],
    },
    {
      id: "role-etudiant", name: "Étudiant / Doctorant", system: true, createdAt: now,
      description: "Soumet des publications (validation requise) et consulte les ressources protégées.",
      permissions: ["pub.read", "pub.submit", "data.read_public", "data.read_protected", "sim.run"],
    },
    {
      id: "role-chercheur", name: "Chercheur", system: true, createdAt: now,
      description: "Publie directement, dépose des datasets, lance des simulations.",
      permissions: ["pub.read", "pub.publish_direct", "data.read_public", "data.read_protected", "data.deposit", "sim.run"],
    },
    {
      id: "role-responsable_axe", name: "Responsable d'axe", system: true, createdAt: now,
      description: "Chercheur qui anime un axe thématique et accède aux données privées de son axe.",
      permissions: ["pub.read", "pub.publish_direct", "data.read_public", "data.read_protected", "data.read_private", "data.deposit", "sim.run", "axe.manage"],
    },
    {
      id: "role-partenaire", name: "Partenaire / Bailleur", system: true, createdAt: now,
      description: "Accède aux livrables et lance des simulations sans contrainte.",
      permissions: ["pub.read", "data.read_public", "sim.run"],
    },
    {
      id: "role-directeur", name: "Directeur (super-utilisateur)", system: true, createdAt: now,
      description: "Contrôle total : permissions, rôles, validation et statistiques.",
      permissions: PERMISSIONS.map((p) => p.id),
    },
  ];
  roles.forEach((r) => db.roles.set(r.id, r));

  // ── Demandes d'accès en attente (pour la démo du Directeur) ─────────────────
  const requests: DBAccessRequest[] = [
    {
      id: "req-01", userId: "u-etudiant", userName: "Mamadou Sarr", userEmail: "etudiant@ummisco.sn",
      permission: "data.read_private",
      resourceLabel: "Dataset privé — Registres de morbidité clinique (Hôpital de Fann, 2023)",
      reason: "Travaux de mémoire de Master sur les infections respiratoires aiguës à Dakar : besoin d'accéder aux dossiers anonymisés pour calibrer mon modèle SEIR.",
      status: "en_attente", createdAt: "2026-06-09T09:30:00Z",
    },
    {
      id: "req-02", userId: "u-partenaire", userName: "IRD France", userEmail: "partenaire@ird.fr",
      permission: "data.read_protected",
      resourceLabel: "Dataset protégé — Données épidémiologiques paludisme (Dakar, 2019-2024)",
      reason: "Co-analyse dans le cadre du projet ANR pour croiser nos relevés entomologiques avec les séries de cas hebdomadaires.",
      status: "en_attente", createdAt: "2026-06-11T14:05:00Z",
    },
    {
      id: "req-03", userId: "u-etudiant", userName: "Mamadou Sarr", userEmail: "etudiant@ummisco.sn",
      permission: "pub.publish_direct",
      resourceLabel: "Fonctionnalité — Publication directe sans validation",
      reason: "Mes deux derniers articles ayant été validés, je sollicite le droit de publication directe en tant que doctorant avancé.",
      status: "en_attente", createdAt: "2026-06-12T08:15:00Z",
    },
  ];
  requests.forEach((r) => db.accessRequests.set(r.id, r));
}

// Seed only once
let seeded = false;
if (!seeded) {
  seed();
  seeded = true;
}

export default db;
