---
title: "Titan Shield — automatisiertes Sicherheits-Monitoring"
slug: "titan-shield"
factId: "project-titan-shield"
status: "prototype"
published: true
featured: false
date: 2026-08-02
dateRange: "2026"
role: "Alleiniger Entwurf, Aufbau und Betrieb (persönliches System)."
summary: "Ein zeitgesteuertes Monitoring, das Authentifizierungs-Logs, Ports, Dateiintegrität und Docker-Ereignisse prüft und nur im Fehlerfall alarmiert."
problem: "Ein öffentlich erreichbarer VPS braucht kontinuierliche Sicherheitsprüfung; manuelle Kontrolle skaliert nicht und übersieht stille Fehler."
constraints:
  - "Läuft auf einem einzelnen Host; Logs in geschützter, nicht öffentlicher Ablage."
  - "Watchdog-Prinzip: keine Ausgabe, solange alles ruhig ist (kein Alarm-Spam)."
methods:
  - "Zeitgesteuerte Prüfungen von Auth-Logs, Ports, Dateiintegrität und Docker-Ereignissen."
  - "Erwartungsliste offener Ports statt reiner Anomalie-Heuristik."
technologies: ["Linux", "Bash", "Python"]
outcomes:
  - claim: "Automatisierte, wiederkehrende Sicherheitsprüfungen mit Alarmierung nur im Fehlerfall."
tags: ["security", "monitoring", "linux"]
---

## Ansatz

Ein zeitgesteuerter Monitor prüft in Intervallen Authentifizierungs-Logs, offene
Ports gegen eine erwartete Liste, Dateiintegrität und Docker-Ereignisse. Ein
Watchdog meldet nur im Fehlerfall — kein Rauschen, wenn alles ruhig ist.

## Aktueller Stand

Prototyp auf einem einzelnen Host. Cloud-Firewall-Regeln werden bislang manuell
geprüft; eine Anbindung an bestehende Sperrlisten fehlt noch. Angaben zu
geblockten Zugriffen oder gefundenen Problemen sind nicht extern überprüfbar und
werden daher nicht als Kennzahl veröffentlicht.
