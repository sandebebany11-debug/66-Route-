import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
import { salon } from "@/data/content";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum">
      <section>
        <h2 className="font-display text-lg text-paper">Angaben gemäß § 5 TMG</h2>
        <p>
          {salon.name}
          <br />
          {salon.owner}
          <br />
          {salon.address.street}
          <br />
          {salon.address.zip} {salon.address.city}
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg text-paper">Kontakt</h2>
        <p>
          Telefon: {salon.phone}
          <br />
          E-Mail: {salon.email}
        </p>
      </section>
      <section>
        <h2 className="font-display text-lg text-paper">Verantwortlich für den Inhalt</h2>
        <p>{salon.owner}, Anschrift wie oben.</p>
      </section>
      <p className="text-xs text-paper/40">
        Hinweis: Dieses Impressum ist eine Vorlage auf Basis der öffentlich verfügbaren
        Kontaktdaten und sollte vor Veröffentlichung durch den Betreiber geprüft und ggf.
        um Umsatzsteuer-ID, Handelsregistereintrag o.&nbsp;Ä. ergänzt werden.
      </p>
    </LegalPage>
  );
}
