import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
import { salon } from "@/data/content";

export const metadata: Metadata = { title: "Datenschutz" };

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <section>
        <h2 className="font-display text-lg text-paper">1. Verantwortlicher</h2>
        <p>
          {salon.owner}
          <br />
          {salon.name}
          <br />
          {salon.address.street}, {salon.address.zip} {salon.address.city}
          <br />
          E-Mail: {salon.email}
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg text-paper">2. Kontaktaufnahme</h2>
        <p>
          Wenn Sie uns per E-Mail, Telefon oder über die Terminanfrage auf dieser Website
          kontaktieren, werden Ihre Angaben zur Bearbeitung der Anfrage und für den Fall
          von Anschlussfragen gespeichert. Diese Daten geben wir nicht ohne Ihre
          Einwilligung weiter.
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg text-paper">3. Ihre Rechte</h2>
        <p>
          Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und
          Einschränkung der Verarbeitung Ihrer bei uns gespeicherten personenbezogenen
          Daten. Wenden Sie sich hierzu an {salon.email}.
        </p>
      </section>
      <p className="text-xs text-paper/40">
        Hinweis: Diese Datenschutzerklärung ist eine allgemeine Vorlage und ersetzt keine
        Rechtsberatung. Bitte vor Veröffentlichung durch eine fachkundige Stelle prüfen
        lassen, insbesondere wenn Analyse-Tools, Cookies oder ein Buchungssystem
        eingebunden werden.
      </p>
    </LegalPage>
  );
}
