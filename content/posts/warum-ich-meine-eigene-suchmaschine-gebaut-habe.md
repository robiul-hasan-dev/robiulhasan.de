---
title: "Warum ich Google aufgegeben habe — und meine eigene Suchmaschine gebaut habe"
slug: "warum-ich-meine-eigene-suchmaschine-gebaut-habe"
published: true
date: 2026-08-02
tags: ["search", "self-hosted", "privacy", "ai"]
summary: "Google blockt automatisierte Recherche mit CAPTCHAs. Statt zu kämpfen, habe ich meine eigene private Suchinfrastruktur gebaut — für 0 Euro und ohne Tracking."
lang: "de"
featured: true
---

## Das Problem

Mein KI-Betriebssystem muss ständig recherchieren. Und Google hat mir dabei ständig Steine in den Weg gelegt:

- **CAPTCHA nach CAPTCHA** — automatisierte Anfragen wurden konsequent geblockt
- **Rate-Limits** — unregelmäßig, undokumentiert, nervig
- **Tracking** — jede Suche ein Datenpunkt für das Google-Profil

Ich stand vor einer Wahl: kämpfen (Proxies, Browser-Automation, CAPTCHA-Solver — alles fragil und teuer) oder **die Infrastruktur selbst besitzen**.

## Die Entscheidung

Ich habe mich für Selbstbesitz entschieden. Die Alternative war nicht "Google oder nichts" — es gibt eine dritte Option:

```
SearXNG (Open-Source Metasuchmaschine)
    + KI-Synthese-Schicht
    + eigener Docker-Server
    = private, unbegrenzte, tracking-freie Suche
```

## Die Architektur

- **SearXNG** in Docker, gebunden an die lokale Schnittstelle (nie öffentlich exponiert)
- **Eigene Settings** — "Titan Search", auf meine Bedürfnisse abgestimmt
- **KI-Synthese-Wrapper** — rohe Ergebnisse werden zu intelligenten Antworten
- **42 Ergebnisse pro Anfrage**, keine CAPTCHAs, kein Limit

## Die Ergebnisse

| Metrik | Vorher (Google) | Nachher (Titan Search) |
|--------|-----------------|------------------------|
| CAPTCHA-Blocks | Ständig | **0** |
| Kosten | €0 (aber verlorene Zeit) | **€0** (nachhaltig) |
| Privatsphäre | Jede Suche getrackt | **Nichts getrackt** |
| Verfügbarkeit | Rate-Limits | **24/7 unbegrenzt** |

## Was ich gelernt habe

1. **CAPTCHAs sind kein technisches Problem — sie sind ein Signal.** Das Signal heißt: Besitze deine Infrastruktur.
2. **Metasearch ist die Privatsphäre-Antwort.** Wenn viele Suchmaschinen aggregiert werden, kann kein einzelner Anbieter dein Profil bauen.
3. **Die KI-Schicht ist der Unterschied.** Rohe Suchergebnisse sind Daten; synthetisierte Antworten sind Intelligenz.

## Selbstkritik

- Die Qualität schwankt je nach Zustand der zugrunde liegenden Engines — Failover fehlt noch
- Kein Cache-Layer — wiederholte Anfragen laden neu
- Die Synthesequalität hängt vom verwendeten Modell ab

*Dieser Artikel ist die Geschichte hinter dem Projekt [Titan Search](/projects/titan-search/).*
