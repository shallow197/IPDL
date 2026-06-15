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
