---
title: "Kostenlose KI-API-Angebote haben versteckte Kosten"
slug: "kostenlose-ki-apis-haben-versteckte-kosten"
claim: "Gratis-KI-API-Tiers sind selten wirklich kostenlos: Prompt-Logging für Training, VC-finanzierte Upsell-Pfade und EU-Sperren machen sie für datenschutzbewusste Nutzer ungeeignet."
evidence:
  - "OpenRouter Free-Tier: Prompt-Logging für Training möglich; $10 Top-up schaltet 1.000 Anfragen/Tag frei (klassischer Free-then-ensnare-Pfad)"
  - "Google AI Studio Free-Tier: laut Google-Regionsdokumentation NICHT in der EU verfügbar — für Deutschland nutzlos"
  - "Groq Free-Tier: Rate-Limits 2026 gesenkt (1.000 Anfragen/Tag), VC-finanziert"
  - "Eigene Infrastruktur (SearXNG + lokale Modelle) liefert dasselbe ohne diese Nachteile"
validationTier: "A"
source: "OpenRouter-Dokumentation + Google-Regionsdokumentation + awesome-free-llm-apis (verifiziert August 2026)"
date: 2026-08-03
tags: ["ki", "api", "datenschutz", "kosten"]
---

## Kernaussage

„100+ kostenlose KI-API-Keys" klingt großartig — bis man die AGB liest. Die Free-Tiers großer Anbieter finanzieren sich durch Daten oder Upsells, und ein Headline-Angebot (Google) ist in der EU gesperrt.

## Warum das zählt

Für jemanden mit eigener Infrastruktur sind diese Angebote meist ein Rückschritt: prompt-logging = Datenschutzverletzung, VC-Upsell = Abhängigkeit, Rate-Limits = weniger Leistung als selbst gehostet.

## Grenzen (ehrlich)

Eine Ausnahme: GitHub Models (Microsoft) trainiert nicht mit Unternehmensdaten — für gezielte Modellvergleiche (z. B. GPT-4o) nutzbar, ohne das Prinzip zu verletzen.
