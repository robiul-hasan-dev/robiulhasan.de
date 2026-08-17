---
title: "Titan/OS — selbst gehostetes Multi-Agent-Automationssystem"
slug: "titan-os"
factId: "project-titan-os"
status: "in-progress"
published: true
featured: true
date: 2026-08-02
dateRange: "2026 – laufend"
role: "Alleiniger Entwurf, Aufbau und Betrieb (persönliches System)."
summary: "Ein selbst gehostetes Multi-Agent-System, das wiederkehrende Betriebsabläufe bündelt — als persönliches Arbeitssystem, nicht als kommerzielles Produkt."
problem: "Eine Einzelperson braucht organisatorische Struktur für wiederkehrende Recherche-, Wissens- und Prüfaufgaben — ohne ein Team dafür zu haben."
constraints:
  - "Nur selbst gehostet auf einem einzelnen VPS."
  - "Ausschließlich quelloffene Komponenten (MIT/Apache/AGPL)."
  - "Keine externen SaaS-Abhängigkeiten für Kernabläufe."
methods:
  - "Spezialisierte Agenten für abgegrenzte Aufgaben statt eines Monolithen."
  - "Gemeinsame PostgreSQL-Datenbasis mit pgvector für semantische Verknüpfung."
  - "Zeitgesteuerte Abläufe mit einem zusammengeführten Digest."
technologies: ["PostgreSQL", "pgvector", "Docker", "Python"]
outcomes:
  - claim: "Mehrere wiederkehrende Abläufe laufen zeitgesteuert und selbst gehostet."
tags: ["ai-agents", "architecture", "self-hosted", "automation"]
---

## Ansatz

Spezialisierte Agenten übernehmen jeweils eine abgegrenzte Aufgabe — Recherche,
Wissensablage, Prüf-Gates — statt eines einzelnen Monolithen. Eine gemeinsame
PostgreSQL-Datenbasis (mit pgvector) dient als einzige Quelle der Wahrheit und
verknüpft Einträge semantisch.

## Aktueller Stand

Das System ist ein persönliches Arbeitssystem in laufender Entwicklung, kein
kommerzielles Produkt. Mehrere Agenten sind noch eng umrissene Skripte; die
Abgrenzung zwischen „Skript" und „Abteilung" ist noch nicht überall erreicht.
Übergreifende Orchestrierung ist neu und braucht längeren Realbetrieb, bevor
belastbare Aussagen möglich sind. Konkrete Kennzahlen werden erst ausgewiesen,
wenn sie extern überprüfbar sind.
