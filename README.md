# Insurance Comparator
<p align="center">
  <img src="public/LG_original.svg" alt="Insurance Comparator Logo" width="200" />
</p>

[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Next.js](https://img.shields.io/badge/Next.js-%23000000.svg?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Un’applicazione web responsive in **Next.js** e **TypeScript** che consente di confrontare rapidamente preventivi di diverse compagnie assicurative.

---

## 📋 Table of Contents

- [Insurance Comparator](#insurance-comparator)
  - [📋 Table of Contents](#-table-of-contents)
  - [🚀 Features](#-features)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🏗️ Project Structure](#️-project-structure)

---

## 🚀 Features

- 🎯 **Ricerca preventivi**  
  Inserisci i parametri (tipo di assicurazione, età, massimale, ecc.) per ottenere quotazioni in tempo reale.

- 📊 **Confronto dinamico**  
  Visualizza i preventivi affiancati, ordina e filtra per prezzo, copertura o valutazione.

- 🔄 **Aggiornamento live**  
  Utilizzo di hook custom per ricaricare i dati senza ricaricare la pagina.

- 🖥️ **Responsive design**  
  Layout ottimizzato per desktop, tablet e mobile.

- ⚙️ **Configurazione flessibile**  
  Modifica facilmente i provider tramite `components.json` o file di ambiente.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)  
- **Linguaggio**: TypeScript  
- **UI & Styling**: React, Tailwind CSS, PostCSS  
- **Linting & Formatting**: ESLint, Prettier  
- **Package Manager**: npm (o yarn / pnpm / bun)  
- **Deployment**: Vercel (consigliato)

---

## 🏗️ Project Structure


##Testing
Add the .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000