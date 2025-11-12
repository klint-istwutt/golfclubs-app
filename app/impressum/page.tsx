// app/impressum/page.tsx
import React from "react";

export default function ImpressumPage() {
  return (
    <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Impressum</h1>

      <section>
        <p>Angaben gemäß § 5 TMG:</p>
        <ul>
          <li><strong>Name / Firmenname:</strong> [Dein Name oder Firmenname]</li>
          <li><strong>Anschrift:</strong> [Straße, Hausnummer, PLZ, Ort, Land]</li>
          <li><strong>Telefon:</strong> [Telefonnummer]</li>
          <li><strong>E-Mail:</strong> [E-Mail-Adresse]</li>
        </ul>
      </section>

      <section>
        <p><strong>Vertreten durch:</strong> [Name der vertretungsberechtigten Person, z. B. Geschäftsführer]</p>
      </section>

      <section>
        <ul>
          <li><strong>Registereintrag:</strong> [z. B. Handelsregister, Registernummer]</li>
          <li><strong>Umsatzsteuer-ID:</strong> [falls vorhanden]</li>
        </ul>
      </section>

      <section>
        <p><strong>Berufshaftpflichtversicherung:</strong> [Name und Sitz der Versicherung, ggf. Geltungsbereich]</p>
      </section>

      <section>
        <p><strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong> [Name, Anschrift, ggf. E-Mail]</p>
      </section>
    </main>
  );
}
