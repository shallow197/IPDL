"use client";

import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function ContactsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-slate-900 pb-8 mb-10">
          <span className="text-[10px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">
            Recommandations & Contact
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Écrivez-nous vos idées, suggestions et recommandations
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-3xl">
            Utilisez ce formulaire pour nous envoyer une recommandation, une demande de collaboration ou un retour sur le site.
            Vos messages sont pris en compte par l'équipe UMMISCO et traités dans les 48 heures.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <ContactForm />

          <aside className="rounded-3xl border border-slate-900 bg-slate-900/40 p-8 space-y-6 text-sm text-slate-400">
            <div>
              <h2 className="text-lg font-bold text-white">Pourquoi nous écrire ?</h2>
              <p className="mt-3 leading-relaxed text-slate-300">
                UMMISCO reçoit des recommandations sur les publications, les collaborations, les thématiques de recherche et les événements.
                Partagez votre question ou votre idée, et l'équipe vous répondra rapidement.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Informations utiles</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <strong className="text-slate-200">Délai de réponse :</strong> généralement sous 48h.
                </li>
                <li>
                  <strong className="text-slate-200">Type de message :</strong> recommandation, suggestion, partenariat, question scientifique.
                </li>
                <li>
                  <strong className="text-slate-200">Email de contact :</strong> contact.ummisco@ucad.edu.sn
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
