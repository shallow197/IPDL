import { COMPLETE_RESEARCHERS_DATA } from '../src/data/researchers_complete_pdf_data';
import { RESEARCHERS } from '../src/data/ummiscoData';

// Map complete researcher data back to ummiscoData entries
export function enrichResearchersWithCompleteData() {
  const enrichedCount = { updated: 0, notFound: 0 };

  for (const completeData of COMPLETE_RESEARCHERS_DATA) {
    const researcher = RESEARCHERS.find(r => r.name === completeData.name);

    if (researcher) {
      // Add themes description
      if (completeData.themesDescription) {
        researcher.themesDescription = completeData.themesDescription;
      }

      // Add projects
      if (completeData.projects && completeData.projects.length > 0) {
        researcher.projects = completeData.projects;
      }

      // Add publications
      if (completeData.publications && completeData.publications.length > 0) {
        researcher.publications = completeData.publications.map(pub =>
          typeof pub === 'string'
            ? { title: pub }
            : pub
        );
      }

      enrichedCount.updated++;
    } else {
      enrichedCount.notFound++;
      console.warn(`Researcher not found: ${completeData.name}`);
    }
  }

  return enrichedCount;
}

// Export stats
export const integrationStats = {
  totalInUmmisco: RESEARCHERS.length,
  totalInCompleteData: COMPLETE_RESEARCHERS_DATA.length,
  integrationTarget: '94 researchers with full themes, projects, and publications'
};
