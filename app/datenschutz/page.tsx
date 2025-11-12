// app/datenschutz/page.tsx
import React from "react";

export default function DatenschutzPage() {
  return (
    <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Datenschutzerklärung</h1>

      <section>
        <h2>1. Datenschutz auf einen Blick</h2>
        <p>
          Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Personenbezogene Daten
          werden nur im Rahmen der gesetzlichen Bestimmungen erhoben und verarbeitet.
        </p>
      </section>

      <section>
        <h2>2. Erhebung und Speicherung personenbezogener Daten</h2>
        <p>
          Wenn Sie sich auf unserer Website registrieren oder den Newsletter abonnieren, erheben wir folgende Daten:
        </p>
        <ul>
          <li>Name (optional)</li>
          <li>E-Mail-Adresse</li>
          <li>ggf. weitere Daten, die für den Login oder die Bereitstellung unseres Services erforderlich sind</li>
        </ul>
        <p>Diese Daten werden ausschließlich für die nachfolgend beschriebenen Zwecke genutzt.</p>
      </section>

      <section>
        <h2>3. Nutzung der Daten</h2>
        <ul>
          <li>
            <strong>Login / Passwort-Reset:</strong> Ihre E-Mail-Adresse wird benötigt, um Ihnen Zugang
            zu Ihrem Benutzerkonto zu ermöglichen und Passwort-Reset-Anfragen zu bearbeiten. Rechtsgrundlage: Art. 6 Abs. 1 S. 1 lit. b DSGVO.
          </li>
          <li>
            <strong>Newsletter:</strong> Ihre E-Mail-Adresse wird verwendet, um Ihnen unseren Newsletter
            zuzusenden. Rechtsgrundlage: Art. 6 Abs. 1 S. 1 lit. a DSGVO (Einwilligung). Die Anmeldung zum Newsletter erfolgt über ein <strong>Double-Opt-in-Verfahren</strong>.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Weitergabe von Daten</h2>
        <p>
          Ihre Daten werden <strong>nicht an Dritte weitergegeben</strong>, außer dies ist gesetzlich
          vorgeschrieben oder zur Abwicklung Ihrer Anmeldung erforderlich (z. B. Versanddienstleister für den Newsletter).
        </p>
      </section>

      <section>
        <h2>5. Cookies</h2>
        <p>
          Unsere Website verwendet Cookies, um die Nutzerfreundlichkeit zu verbessern. Sie können die Verwendung
          von Cookies jederzeit über Ihren Browser deaktivieren.
        </p>
      </section>

      <section>
        <h2>6. Speicherdauer</h2>
        <p>
          Wir speichern Ihre personenbezogenen Daten nur solange, wie es für die oben genannten Zwecke erforderlich
          ist oder gesetzlich vorgeschrieben.
        </p>
      </section>

      <section>
        <h2>7. Rechte der Nutzer</h2>
        <p>Sie haben jederzeit das Recht auf:</p>
        <ul>
          <li>Auskunft über Ihre gespeicherten Daten</li>
          <li>Berichtigung unrichtiger Daten</li>
          <li>Löschung Ihrer Daten („Recht auf Vergessenwerden“)</li>
          <li>Einschränkung der Verarbeitung</li>
          <li>Widerspruch gegen die Verarbeitung</li>
          <li>Datenübertragbarkeit</li>
        </ul>
        <p>
          Für den Newsletter können Sie sich jederzeit <strong>abmelden</strong>, indem Sie den Link am Ende jeder E-Mail nutzen.
        </p>
      </section>

      <section>
        <h2>8. Ansprechpartner für Datenschutz</h2>
        <p>[Name / Kontaktdaten des Datenschutzbeauftragten, falls vorhanden]</p>
      </section>
    </main>
  );
}
