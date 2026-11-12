---
title: 'App di emergenza per la Croce Rossa: il nostro primo grande progetto'
description: 'Come un gruppo di 12 volontari ha costruito in 4 mesi un sistema di coordinamento per la Croce Rossa locale, migliorando la gestione delle emergenze sul territorio.'
date: 2025-02-01
tags:
  - posts
  - impatto
  - case study
---

Era l'estate del 2024 quando Martina, coordinatrice della sezione locale della Croce Rossa, ci scrisse con una richiesta semplice ma urgente: *"Gestiamo ancora i turni dei volontari con fogli Excel e chat WhatsApp. Quando arriva un'emergenza, perdiamo tempo prezioso a cercare chi è disponibile."*

In pochi giorni avevamo formato un team di 12 volontari. Quattro mesi dopo, l'app era in produzione.

## Il problema reale

La gestione di un'organizzazione di volontari è sorprendentemente complessa:

- **Disponibilità variabile**: i volontari cambiano turni, partono in vacanza, si ammalano
- **Competenze eterogenee**: non tutti i volontari sono qualificati per tutti gli interventi
- **Urgenza**: nelle emergenze ogni minuto conta
- **Comunicazione frammentata**: notifiche su WhatsApp, email, telefonate

Il sistema precedente funzionava — a malapena — in condizioni normali. In un'emergenza, diventava un collo di bottiglia.

## La soluzione

Abbiamo costruito un'app React Native con backend Node.js che risolve questi problemi:

```
📱 App mobile → Volontari gestiscono disponibilità e ricevono notifiche push
🖥️ Dashboard web → Coordinatori assegnano turni e lanciano alert
📊 Reportistica → Statistiche automatiche per rendiconto verso la sede nazionale
```

Alcune scelte tecniche che ci hanno permesso di muoverci velocemente:

1. **PostgreSQL** per la solidità dei dati (storico interventi, turni, ecc.)
2. **Firebase Cloud Messaging** per le notifiche push affidabili
3. **Offline-first**: l'app funziona anche senza connessione stabile

## Cosa abbiamo imparato

Questo progetto ci ha insegnato molto su come lavorare bene in team distribuiti:

- **Le interviste con gli utenti sono essenziali**: le prime 2 settimane le abbiamo dedicate a intervistare Martina e i volontari. Senza queste interviste avremmo costruito la cosa sbagliata.
- **Il MVP funziona**: abbiamo rilasciato una versione minima in 6 settimane, raccogliendo feedback prima di aggiungere funzionalità.
- **La documentazione non è un optional**: scrivere una buona documentazione ha permesso alla Croce Rossa di gestire autonomamente l'app dopo il rilascio.

## L'impatto

Dopo 12 mesi di utilizzo:

- **Tempo di reazione alle emergenze ridotto del 40%**: dal ricevimento dell'alert all'assegnazione dei volontari
- **Tasso di copertura turni: 98%**: contro il 87% con il sistema precedente
- **Zero ore perse** per problemi organizzativi nelle emergenze dell'ultimo anno

Martina ci ha scritto dopo sei mesi: *"Non so come avremmo gestito l'alluvione di novembre senza questa app."*

---

Il codice è open source: [github.com/codicesolidale/emergency-app](https://github.com/codicesolidale)

Vuoi costruire qualcosa di simile per la tua organizzazione? [Scrivici →](/it/unisciti/)
