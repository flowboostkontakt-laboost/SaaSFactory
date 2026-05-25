🎨 Specyfikacja Frontendu: SaaS-Factory.ai

## 1. Architektura UI i Stack Technologiczny

- Framework: React, preferowany Next.js
- Stylizacja: Tailwind CSS
- Komponenty: Headless UI lub Shadcn UI
- Płatności: Locus Checkout SDK lub iframe integration

## 2. Panel Zarządzania Fabryką (The Founder Dashboard)

To interfejs, w którym właściciel monitoruje wygenerowane mikro-SaaS i steruje pipeline'em tworzenia.

### A. Sekcja `Command Center`

- Centralne pole tekstowe do wydawania promptów dla systemu
- Status buildera pokazujący etapy:
  - `Architecting`
  - `Coding`
  - `Deploying`
  - `Integrating Payments`
  - `Active`
  - `Failed`

### B. `Portfolio & Metrics`

Każdy wygenerowany Mikro-SaaS ma własną kartę z:

- `Live URL`
- `Revenue (USDC)`
- `Status`
- `Last Transaction`
- `Sunset Countdown`

Dashboard pokazuje też:

- `Global Treasury`
- liczbę projektów `Active`
- liczbę projektów `Under Evaluation`
- liczbę projektów `Sunset Pending`

## 3. Interfejs Wygenerowanych Mikro-SaaS (End-User UI)

Każda aplikacja wygenerowana przez Agent Developer musi zawierać stałe elementy strukturalne.

### A. Mechanizm Paywall (Locus Checkout Flow)

- Standardowy modal płatności wywoływany przy funkcjach premium
- Dynamiczne pricing cards, np. `1 generation = 1 USDC`
- Trigger płatności oparty o backendowy endpoint tworzący sesję checkout

### B. Standaryzowany Layout

- `Hero Section`
- `Tool Interface`
- `Results Section`
- `Payment Trigger`
- opcjonalnie `WalletConnect`

## 4. Wytyczne dla Agenta Dewelopera (Frontend Prompting)

Agent generujący frontend musi przestrzegać następujących zasad:

- używać wyłącznie Tailwind CSS do stylizacji
- budować UI mobile-first
- używać jednego wspólnego modułu płatności
- nie umieszczać sekretów Locus po stronie klienta

Przykład integracji:

```tsx
import { LocusPayButton } from "./locus-module";

<LocusPayButton amount="2.00" currency="USDC" />
```

## 5. Monitoring Efemeryczności (The `Sunset` UI)

Panel musi wizualnie ostrzegać, gdy biznes zbliża się do progu 72h bez transakcji.

Wymagania:

- czerwony licznik odliczający czas do wygaszenia
- badge `Under Evaluation` lub `Sunset Pending`
- link do szczegółów projektu i historii transakcji

## 6. Powiązanie Frontendu z API

Frontend powinien korzystać z następujących kontraktów:

- `POST /api/projects` do tworzenia nowego projektu
- `GET /api/projects` do listy projektów w dashboardzie
- `GET /api/projects/:projectId` do widoku szczegółowego
- `GET /api/projects/:projectId/runs` do osi czasu pipeline'u
- `POST /api/projects/:projectId/payment-sessions` do uruchamiania checkoutu
- `GET /api/treasury/summary` do sekcji finansowej dashboardu

## 7. Decyzja UI dla MVP

Frontend MVP powinien być realny produktowo, ale oparty o kontrolowany zakres:

- jeden dashboard operatorski
- jeden widok szczegółów projektu
- jeden wspólny szablon mikro-SaaS
- jeden wspólny komponent checkoutu
- statusy pipeline'u i statusy sunset działające na prawdziwych danych backendowych

Nie wchodzi do MVP:

- pełny builder wizualny
- wiele niezależnych motywów per projekt
- zaawansowana personalizacja layoutów przez użytkownika końcowego

## 8. Kluczowe Stany UI

### Status projektu

- `draft`
- `architecting`
- `coding`
- `deploying`
- `integrating_payments`
- `active`
- `under_evaluation`
- `sunset_pending`
- `archived`
- `failed`

### Status płatności

- `created`
- `pending`
- `paid`
- `failed`
- `expired`

### Status deploymentu

- `queued`
- `building`
- `ready`
- `failed`
- `archived`
