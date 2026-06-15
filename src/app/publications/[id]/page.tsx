import React, { use } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpen, Users, Calendar, FileText, ExternalLink } from "lucide-react";
import { PUBLICATION, RESEARCHERS } from "@/data/ummiscoData";
import { scholarUrl } from "@/lib/scholar";
import Footer from "@/components/Footer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicationPage({ params }: PageProps) {
  const { id } = await params;

  // First try to find in global PUBLICATION array
  let publication = PUBLICATION.find((p) => p.id === id);
  let fromResearcher = false;

  // If not found, search in researcher's individual publications
  if (!publication) {
    for (const researcher of RESEARCHERS) {
      if (researcher.publications) {
        const foundPub = researcher.publications.find(
          (pub) => `${researcher.id}-${pub.title.substring(0, 20).replace(/\s+/g, '-')}` === id
        );
        if (foundPub) {
          fromResearcher = true;
          // Redirect to Google Scholar instead of showing empty detail page
          redirect(scholarUrl({ title: foundPub.title }));
        }
      }
    }
  }

  if (!publication) {
    notFound();
  }

  const authors = RESEARCHERS.filter((r) => publication.researcherIds.includes(r.id));

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* Back Link */}
        <Link
          href="/publications"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-8 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux publications</span>
        </Link>

        {/* Publication Card */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/10 p-8 mb-10">

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-6 leading-relaxed">{publication.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-slate-900">
            {publication.year && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-400">{publication.year}</span>
              </div>
            )}
            {publication.journal && (
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-400 italic">{publication.journal}</span>
              </div>
            )}
          </div>

          {/* Abstract */}
          {publication.abstract && (
            <div className="mb-8">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Résumé
              </h2>
              <p className="text-slate-400 leading-relaxed">{publication.abstract}</p>
            </div>
          )}

          {/* Authors */}
          {authors.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Auteurs ({authors.length})
              </h2>
              <div className="space-y-2">
                {authors.map((author) => (
                  <Link
                    key={author.id}
                    href={`/chercheurs/${author.id}`}
                    className="block p-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-200">{author.name}</div>
                        <div className="text-xs text-slate-500">{author.title}</div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-600" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Citations */}
          {(publication.citationApa || publication.citationBibtex) && (
            <div className="mb-8">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Citations</h2>
              <div className="space-y-4">
                {publication.citationApa && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">APA</p>
                    <pre className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap break-words">
                      {publication.citationApa}
                    </pre>
                  </div>
                )}
                {publication.citationBibtex && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">BibTeX</p>
                    <pre className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap break-words">
                      {publication.citationBibtex}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DOI Link */}
          {publication.doi && (
            <div className="pt-8 border-t border-slate-900">
              <a
                href={`https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-900/40 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                <span>Voir sur DOI</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
