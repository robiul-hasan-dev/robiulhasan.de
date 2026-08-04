---
title: "Selbst-gehostete Infrastruktur schlägt Workarounds"
slug: "self-hosted-beats-workarounds"
claim: "Wenn eine Plattform dich aktiv einschränkt (CAPTCHAs, Rate-Limits, Tracking), ist der langfristig beste Weg, die Infrastruktur selbst zu besitzen — nicht sie zu umgehen."
evidence:
  - "Titan Search: 0 CAPTCHAs nach Umstieg von Google auf SearXNG (August 2026)"
  - "42 Ergebnisse pro Anfrage, unbegrenztes Volumen, €0 Kosten"
  - "Kein einzelner Suchanbieter kann ein Nutzungsprofil aufbauen (Metasearch-Effekt)"
validationTier: "A"
source: "Eigene Projekterfahrung + EPEC-Architektur-Entscheidungen (ADR-010)"
date: 2026-08-02
tags: ["self-hosting", "privacy", "infrastructure"]
---

## Behauptung

Wenn eine Plattform dich aktiv einschränkt, ist Selbstbesitz der nachhaltigste Weg.

## Evidenz

- **Titan Search** (siehe [Projekt](/projects/titan-search/)): Nach dem Umstieg von Google auf eine selbst-gehostete SearXNG-Instanz traten **keine CAPTCHAs mehr** auf.
- Die Lösung kostete **€0 zusätzlich** (bestehender VPS) und läuft 24/7 ohne Rate-Limits.
- Metasearch aggregiert viele Engines — kein Anbieter erhält das vollständige Suchprofil.

## Validierungsstufe

**A — Verifiziert durch eigene Projekterfahrung.** Die Behauptung wurde in Produktion getestet und die Ergebnisse sind dokumentiert.

## Grenzen

- Gilt nicht für alle Fälle: Manche Dienste (z.B. YouTube-Transkripte) lassen sich auch selbst-gehostet nicht umgehen, weil die Blocker auf IP-Ebene liegen.
- Selbst-Hosting erfordert Wartungsaufwand (Updates, Überwachung).
