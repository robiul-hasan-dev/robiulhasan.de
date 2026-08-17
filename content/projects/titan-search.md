---
title: "Titan Search — selbst gehostete, private Suche"
slug: "titan-search"
factId: "project-titan-search"
status: "prototype"
published: true
featured: false
date: 2026-08-02
dateRange: "2026"
role: "Alleiniger Entwurf, Aufbau und Betrieb (persönliches System)."
summary: "Eine private, selbst gehostete Suchinfrastruktur auf Basis einer quelloffenen Metasuche — ohne Tracking, als internes Werkzeug."
problem: "Automatisierte Recherche stößt bei kommerziellen Suchmaschinen auf CAPTCHAs und Ratenbegrenzungen — nötig war eine private, eigenständige Suche."
constraints:
  - "Nur selbst gehostet; SearXNG nie öffentlich exponiert (ADR-010)."
  - "Kein Tracking, keine Suchhistorie, keine Drittanbieter-Cookies."
methods:
  - "SearXNG als quelloffene Metasuche in Docker, an die lokale Schnittstelle gebunden."
  - "Schlanker Wrapper zur Zusammenfassung der Rohergebnisse."
technologies: ["SearXNG", "Docker", "Python"]
outcomes:
  - claim: "Interne, tracking-freie Suche ohne Abhängigkeit von einer einzelnen kommerziellen Engine."
tags: ["search", "self-hosted", "docker", "privacy"]
---

## Ansatz

Eine quelloffene Metasuche (SearXNG) läuft in Docker und aggregiert Ergebnisse
mehrerer Engines, ohne Nutzer zu verfolgen. Ein schlanker Wrapper fasst die
Rohergebnisse zusammen. SearXNG ist nur an die lokale Schnittstelle gebunden und
nie öffentlich exponiert.

## Aktueller Stand

Prototyp im internen Betrieb. Es gibt noch keine Zwischenspeicherung, und die
Ergebnisqualität hängt von der Verfügbarkeit der einzelnen Engines ab. Konkrete
Kennzahlen (Ergebnisanzahl, Verfügbarkeit) sind nicht extern belegt und werden
daher nicht ausgewiesen.
