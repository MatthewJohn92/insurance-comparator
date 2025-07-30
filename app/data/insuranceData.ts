// app/data/insuranceData.ts
export const insuranceData = {
  "opportunita": {
    "id": "OP-12345",
    "tipologia": "Nuova polizza",
    "argomento": "Assicurazione Auto test",
    "gestore": "Matteo Luca",
    "consulente": "Anna Bianchi",
    "prodotti_assicurativi": ["RC Auto", "Casco Completo"],
    "situazione_corrente": "Cliente con polizza RC base presso altra compagnia, in scadenza.",
    "esigenza_cliente": "Copertura completa per nuovo veicolo Tesla, protezione contro tutti i rischi e assistenza stradale premium."
  },
  "cliente": {
    "nome_completo": "Mario Rossi",
    "tipologia_cliente": "Privato",
    "nome_azienda": "",
    "forma_giuridica": "",
    "nome": "Mario",
    "cognome": "Rossi",
    "data_di_nascita": "1985-05-20",
    "indirizzo_via": "Via Roma, 10",
    "indirizzo_cap": "6600",
    "indirizzo_citta": "Locarno",
    "telefono_principale": "+41 79 123 45 67",
    "email": "mario.rossi@email.com"
  },
  "categorieCoperture": [
    {
      "nome": "Responsabilità civile (RC)",
      "microCoperture": [
        { "id": "rc_danni_terzi", "nome": "Danni a terzi (persone, animali, cose)" },
        { "id": "rc_danni_traino", "nome": "Danni causati da traino" },
        { "id": "rc_guida_terzi", "nome": "Guida da parte di terzi" }
      ]
    },
    {
      "nome": "Casco parziale",
      "microCoperture": [
        { "id": "cp_furto", "nome": "Furto (veicolo o accessori)" },
        { "id": "cp_incendio", "nome": "Incendio ed esplosione" },
        { "id": "cp_vetri", "nome": "Rottura vetri" },
        { "id": "cp_eventi_naturali", "nome": "Eventi naturali" },
        { "id": "cp_collisione_animali", "nome": "Collisioni con animali" },
        { "id": "cp_vandalismo", "nome": "Atti vandalici non dolosi" }
      ]
    },
    {
      "nome": "Casco totale",
      "microCoperture": [
        { "id": "ct_collisione", "nome": "Danni da collisione (colpa propria)" },
        { "id": "ct_ribaltamento", "nome": "Ribaltamento o uscita di strada" },
        { "id": "ct_urti", "nome": "Urti contro oggetti fissi" }
      ]
    },
    {
      "nome": "Infortuni",
      "microCoperture": [
        { "id": "in_conducente", "nome": "Infortuni del conducente" },
        { "id": "in_spese_mediche", "nome": "Rimborso spese mediche" },
        { "id": "in_passeggeri", "nome": "Estensione passeggeri" }
      ]
    },
    {
      "nome": "Protezione giuridica",
      "microCoperture": [
        { "id": "pg_spese_legali", "nome": "Spese legali per controversie" },
        { "id": "pg_assistenza_litigi", "nome": "Assistenza litigi (officine, etc.)" }
      ]
    },
    {
      "nome": "Assistenza",
      "microCoperture": [
        { "id": "as_traino", "nome": "Traino del veicolo" },
        { "id": "as_riparazione_posto", "nome": "Riparazione sul posto" },
        { "id": "as_alloggio", "nome": "Alloggio/trasporto alternativo" }
      ]
    },
    {
      "nome": "Veicolo sostitutivo",
      "microCoperture": [
        { "id": "vs_durante_riparazione", "nome": "Durante riparazione o furto" },
        { "id": "vs_giorni_max", "nome": "Numero di giorni massimo" },
        { "id": "vs_tipo_veicolo", "nome": "Tipo di veicolo incluso" }
      ]
    }
  ],
  "offerte": [
    {
      "id": 1, "company": "Zurich", "logo": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Zurich_Insurance_Group_logo.svg", "policyNumber": "ZUR-0812", "premium_annuale": 886.80, "pdf_link": "https://www.orimi.com/pdf-test.pdf",
      "tipo_richiesta": "Emissione", "variante": "Standard", "riassunto_offerta": "Copertura completa con franchigie standard. Ottimo rapporto qualità-prezzo.", "osservazione": "Buona copertura generale con un premio competitivo.",
      "coverages": {
        "rc_danni_terzi": { "covered": true, "score": 5, "details": "Copertura fino a 100M CHF." }, "rc_danni_traino": { "covered": true, "score": 4, "details": "Incluso fino a 2000kg." }, "rc_guida_terzi": { "covered": true, "score": 3, "details": "Solo conducenti >25 anni." }, "cp_furto": { "covered": true, "score": 4, "details": "Franchigia 200 CHF." }, "cp_incendio": { "covered": true, "score": 5, "details": "Senza franchigia." }, "cp_vetri": { "covered": true, "score": 5, "details": "Senza franchigia per riparazione." }, "cp_eventi_naturali": { "covered": true, "score": 4, "details": "Standard." }, "cp_collisione_animali": { "covered": true, "score": 4, "details": "Standard." }, "cp_vandalismo": { "covered": false, "score": 0, "details": "Opzionale." }, "ct_collisione": { "covered": true, "score": 4, "details": "Franchigia 1000 CHF." }, "ct_ribaltamento": { "covered": true, "score": 4, "details": "Incluso." }, "ct_urti": { "covered": true, "score": 4, "details": "Incluso." }, "in_conducente": { "covered": true, "score": 3, "details": "Massimale 50k CHF." }, "in_spese_mediche": { "covered": true, "score": 3, "details": "Fino a 5k CHF." }, "in_passeggeri": { "covered": false, "score": 0, "details": "Opzionale." }, "pg_spese_legali": { "covered": false, "score": 0, "details": "Non inclusa." }, "pg_assistenza_litigi": { "covered": false, "score": 0, "details": "Non inclusa." }, "as_traino": { "covered": true, "score": 3, "details": "Solo Svizzera." }, "as_riparazione_posto": { "covered": true, "score": 3, "details": "Limitato." }, "as_alloggio": { "covered": false, "score": 0, "details": "Non incluso." }, "vs_durante_riparazione": { "covered": true, "score": 3, "details": "Incluso." }, "vs_giorni_max": { "covered": true, "score": 3, "details": "Max 7 giorni." }, "vs_tipo_veicolo": { "covered": true, "score": 2, "details": "Categoria piccola." }
      }
    },
    {
      "id": 2, "company": "AXA", "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/AXA_Logo.svg/2560px-AXA_Logo.svg.png", "policyNumber": "AXA-45B", "premium_annuale": 982.80, "pdf_link": "https://www.orimi.com/pdf-test.pdf",
      "tipo_richiesta": "Emissione", "variante": "Premium", "riassunto_offerta": "Copertura Top di gamma, ideale per chi cerca la massima sicurezza.", "osservazione": "Offerta premium con coperture eccellenti e franchigie basse.",
      "coverages": {
        "rc_danni_terzi": { "covered": true, "score": 5, "details": "Copertura fino a 100M CHF." }, "rc_danni_traino": { "covered": true, "score": 5, "details": "Senza limiti di peso." }, "rc_guida_terzi": { "covered": true, "score": 5, "details": "Nessuna restrizione." }, "cp_furto": { "covered": true, "score": 5, "details": "Senza franchigia." }, "cp_incendio": { "covered": true, "score": 5, "details": "Senza franchigia." }, "cp_vetri": { "covered": true, "score": 5, "details": "Senza franchigia." }, "cp_eventi_naturali": { "covered": true, "score": 5, "details": "Estesa a martore." }, "cp_collisione_animali": { "covered": true, "score": 5, "details": "Senza franchigia." }, "cp_vandalismo": { "covered": true, "score": 4, "details": "Franchigia 200 CHF." }, "ct_collisione": { "covered": true, "score": 5, "details": "Franchigia 500 CHF." }, "ct_ribaltamento": { "covered": true, "score": 5, "details": "Incluso." }, "ct_urti": { "covered": true, "score": 5, "details": "Incluso." }, "in_conducente": { "covered": true, "score": 4, "details": "Massimale 100k CHF." }, "in_spese_mediche": { "covered": true, "score": 4, "details": "Fino a 10k CHF." }, "in_passeggeri": { "covered": true, "score": 4, "details": "Inclusa." }, "pg_spese_legali": { "covered": true, "score": 4, "details": "Copertura base." }, "pg_assistenza_litigi": { "covered": false, "score": 0, "details": "Opzionale." }, "as_traino": { "covered": true, "score": 5, "details": "Europa 24/7." }, "as_riparazione_posto": { "covered": true, "score": 4, "details": "Standard." }, "as_alloggio": { "covered": true, "score": 4, "details": "Fino a 2 notti." }, "vs_durante_riparazione": { "covered": true, "score": 4, "details": "Incluso." }, "vs_giorni_max": { "covered": true, "score": 4, "details": "Max 15 giorni." }, "vs_tipo_veicolo": { "covered": true, "score": 4, "details": "Categoria media." }
      }
    },
    {
      "id": 3, "company": "Helvetia", "logo": "https://upload.wikimedia.org/wikipedia/commons/6/66/Helvetia_logo_422x129.png", "policyNumber": "HELV-7C4", "premium_annuale": 834.00, "pdf_link": "https://www.orimi.com/pdf-test.pdf",
      "tipo_richiesta": "Emissione", "variante": "Economy", "riassunto_offerta": "La scelta più conveniente per una protezione essenziale.", "osservazione": "L'opzione più economica, ideale per chi cerca le coperture essenziali.",
      "coverages": {
        "rc_danni_terzi": { "covered": true, "score": 5, "details": "Copertura fino a 100M CHF." }, "rc_danni_traino": { "covered": true, "score": 3, "details": "Incluso fino a 1500kg." }, "rc_guida_terzi": { "covered": true, "score": 4, "details": "Nessuna restrizione." }, "cp_furto": { "covered": true, "score": 3, "details": "Franchigia 500 CHF." }, "cp_incendio": { "covered": true, "score": 5, "details": "Senza franchigia." }, "cp_vetri": { "covered": true, "score": 3, "details": "Franchigia 200 CHF." }, "cp_eventi_naturali": { "covered": true, "score": 4, "details": "Standard." }, "cp_collisione_animali": { "covered": true, "score": 4, "details": "Standard." }, "cp_vandalismo": { "covered": true, "score": 3, "details": "Franchigia 500 CHF." }, "ct_collisione": { "covered": true, "score": 3, "details": "Franchigia 1500 CHF." }, "ct_ribaltamento": { "covered": true, "score": 3, "details": "Incluso." }, "ct_urti": { "covered": true, "score": 3, "details": "Incluso." }, "in_conducente": { "covered": false, "score": 0, "details": "Opzionale." }, "in_spese_mediche": { "covered": false, "score": 0, "details": "Opzionale." }, "in_passeggeri": { "covered": false, "score": 0, "details": "Opzionale." }, "pg_spese_legali": { "covered": true, "score": 3, "details": "Base." }, "pg_assistenza_litigi": { "covered": true, "score": 3, "details": "Base." }, "as_traino": { "covered": true, "score": 4, "details": "Svizzera." }, "as_riparazione_posto": { "covered": false, "score": 0, "details": "Non incluso." }, "as_alloggio": { "covered": false, "score": 0, "details": "Non incluso." }, "vs_durante_riparazione": { "covered": true, "score": 2, "details": "Incluso." }, "vs_giorni_max": { "covered": true, "score": 2, "details": "Max 3 giorni." }, "vs_tipo_veicolo": { "covered": true, "score": 2, "details": "Categoria piccola." }
      }
    },
    {
      "id": 4, "company": "Allianz", "logo": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Allianz.svg", "policyNumber": "ALZ-2025", "premium_annuale": 938.40, "pdf_link": "https://www.orimi.com/pdf-test.pdf",
      "tipo_richiesta": "Sostituzione", "variante": "Comfort", "riassunto_offerta": "Un eccellente compromesso tra costo e completezza delle coperture.", "osservazione": "Solida offerta con buon equilibrio tra costo e coperture.",
      "coverages": {
        "rc_danni_terzi": { "covered": true, "score": 5, "details": "Copertura fino a 100M CHF." }, "rc_danni_traino": { "covered": true, "score": 4, "details": "Incluso fino a 2500kg." }, "rc_guida_terzi": { "covered": true, "score": 4, "details": "Nessuna restrizione." }, "cp_furto": { "covered": true, "score": 4, "details": "Franchigia 200 CHF." }, "cp_incendio": { "covered": true, "score": 5, "details": "Senza franchigia." }, "cp_vetri": { "covered": true, "score": 4, "details": "Franchigia 100 CHF." }, "cp_eventi_naturali": { "covered": true, "score": 4, "details": "Standard." }, "cp_collisione_animali": { "covered": true, "score": 5, "details": "Senza franchigia." }, "cp_vandalismo": { "covered": true, "score": 4, "details": "Franchigia 200 CHF." }, "ct_collisione": { "covered": true, "score": 4, "details": "Franchigia 1000 CHF." }, "ct_ribaltamento": { "covered": true, "score": 4, "details": "Incluso." }, "ct_urti": { "covered": true, "score": 4, "details": "Incluso." }, "in_conducente": { "covered": true, "score": 4, "details": "Massimale 80k CHF." }, "in_spese_mediche": { "covered": true, "score": 4, "details": "Fino a 8k CHF." }, "in_passeggeri": { "covered": true, "score": 3, "details": "Base." }, "pg_spese_legali": { "covered": true, "score": 3, "details": "Base." }, "pg_assistenza_litigi": { "covered": false, "score": 0, "details": "Opzionale." }, "as_traino": { "covered": true, "score": 4, "details": "Europa." }, "as_riparazione_posto": { "covered": true, "score": 3, "details": "Limitato." }, "as_alloggio": { "covered": true, "score": 3, "details": "Fino a 1 notte." }, "vs_durante_riparazione": { "covered": true, "score": 3, "details": "Incluso." }, "vs_giorni_max": { "covered": true, "score": 3, "details": "Max 5 giorni." }, "vs_tipo_veicolo": { "covered": true, "score": 3, "details": "Categoria media." }
      }
    },
    {
      "id": 5, "company": "Baloise", "logo": "https://upload.wikimedia.org/wikipedia/commons/8/88/Baloise_Logo_2022.svg", "policyNumber": "BAL-CH-25", "premium_annuale": 861.60, "pdf_link": "https://www.orimi.com/pdf-test.pdf",
      "tipo_richiesta": "Emissione", "variante": "Plus", "riassunto_offerta": "Protezione giuridica estesa e buon rapporto qualità-prezzo.", "osservazione": "Ottimo rapporto qualità/prezzo. Alcune coperture extra sono base.",
      "coverages": {
        "rc_danni_terzi": { "covered": true, "score": 5, "details": "Copertura fino a 100M CHF." }, "rc_danni_traino": { "covered": true, "score": 4, "details": "Incluso fino a 2000kg." }, "rc_guida_terzi": { "covered": true, "score": 5, "details": "Nessuna restrizione." }, "cp_furto": { "covered": true, "score": 4, "details": "Franchigia 300 CHF." }, "cp_incendio": { "covered": true, "score": 5, "details": "Senza franchigia." }, "cp_vetri": { "covered": true, "score": 4, "details": "Franchigia 150 CHF." }, "cp_eventi_naturali": { "covered": true, "score": 4, "details": "Standard." }, "cp_collisione_animali": { "covered": true, "score": 4, "details": "Standard." }, "cp_vandalismo": { "covered": true, "score": 3, "details": "Franchigia 500 CHF." }, "ct_collisione": { "covered": true, "score": 4, "details": "Franchigia 1000 CHF." }, "ct_ribaltamento": { "covered": true, "score": 4, "details": "Incluso." }, "ct_urti": { "covered": true, "score": 4, "details": "Incluso." }, "in_conducente": { "covered": true, "score": 3, "details": "Massimale 60k CHF." }, "in_spese_mediche": { "covered": true, "score": 3, "details": "Fino a 6k CHF." }, "in_passeggeri": { "covered": true, "score": 3, "details": "Base." }, "pg_spese_legali": { "covered": true, "score": 4, "details": "Estesa." }, "pg_assistenza_litigi": { "covered": true, "score": 4, "details": "Inclusa." }, "as_traino": { "covered": true, "score": 3, "details": "Svizzera." }, "as_riparazione_posto": { "covered": true, "score": 3, "details": "Limitato." }, "as_alloggio": { "covered": true, "score": 2, "details": "Solo trasporto." }, "vs_durante_riparazione": { "covered": false, "score": 0, "details": "Opzionale." }, "vs_giorni_max": { "covered": false, "score": 0, "details": "Opzionale." }, "vs_tipo_veicolo": { "covered": false, "score": 0, "details": "Opzionale." }
      }
    }
  ]
};

// Aggiungi questa nuova riga
export type InsuranceData = typeof insuranceData;

// Lascia anche gli altri export dei tipi
export type Offer = (typeof insuranceData.offerte)[0];
export type Category = (typeof insuranceData.categorieCoperture)[0];
export type MicroCoverage = Category['microCoperture'][0];