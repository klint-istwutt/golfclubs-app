// app/impressum/page.tsx
import React from "react";

export default function ImpressumPage() {
  return (
    <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Impressum</h1>

      <section>
        <p>Angaben gemäß § 5 TMG:</p>
        <ul>
          <li><strong>Name:</strong> Benedikt Klein</li>
          <li><strong>Anschrift:</strong> Rintelner Str. 59, 32689 Kalletal, Deutschland</li>
          <li><strong>E-Mail:</strong> greenlog.app@gmail.com</li>
        </ul>
      </section>

      <section>
        <p><strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong></p>
        <ul>
          <li>Benedikt Klein</li>
          <li>Rintelner Str. 59, 32689 Kalletal, Deutschland</li>
          <li>E-Mail: greenlog.app@gmail.com</li>
        </ul>
      </section>



      <section>
        <h2>Haftungsausschluss / Disclaimer</h2>
        <p>
          Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. 
          Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. 
          Als Diensteanbieter bin ich gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. 
          Nach §§ 8 bis 10 TMG bin ich als Diensteanbieter jedoch nicht verpflichtet, 
          übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        </p>
        <p>
          Haftungsansprüche gegen den Website-Betreiber, die sich auf Schäden materieller oder ideeller Art beziehen, 
          welche durch die Nutzung der dargebotenen Informationen verursacht wurden, sind ausgeschlossen, soweit kein nachweislich vorsätzliches oder grob fahrlässiges Verschulden vorliegt.
        </p>
        <p>
          Links zu externen Webseiten Dritter werden sorgfältig geprüft, eine permanente Kontrolle der Inhalte dieser Seiten ist jedoch ohne konkrete Anhaltspunkte nicht zumutbar. 
          Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
        </p>
      </section>
    </main>
  );
}
