Oto dokumentacja techniczna poziomu CTO dla projektu SaaS-Factory.ai. Dokument ten definiuje architekturę systemową, przepływy danych oraz integracje wymagane do zbudowania autonomicznego inkubatora w ekosystemie Locus.

# Dokumentacja Architektoniczna: SaaS-Factory.ai

Dotyczy: wdrożenia w ramach Locus Paygentic Hackathon #4.

## 1. Wizja Systemu (High-Level)

SaaS-Factory to wieloagentowy system operacyjny zbudowany na LocusFounder, który automatyzuje cykl:

`Idea -> Kod -> Deployment -> Płatności -> Zarządzanie zyskiem`

System ma eliminować czynnik ludzki z codziennego procesu operacyjnego i działać jak autonomiczny fundusz Micro-SaaS.

## 2. Stos Technologiczny (Tech Stack)

- Orkiestracja: LocusFounder
- Silnik AI: OpenAI
- Backend: Node.js
- Interfejs operatorski: Discord.js lub panel webowy
- Frontend generowany: React + Tailwind CSS
- Finanse: Locus Checkout + Locus Wallets
- Infrastructure-as-Code: GitHub + Vercel API

## 3. Architektura Agentowa (Multi-Agent Pipeline)

### A. Agent Architect (The Strategist)

Zadanie: dekompozycja promptu użytkownika na specyfikację techniczną.

Logika:
- implementacja protokołu `Decision-First`
- decyzje o stacku i funkcjach przy około 80% pewności
- unikanie pętli dopytywania użytkownika o szczegóły niekrytyczne

### B. Agent Developer (The Engineer)

Zadanie: generowanie kodu źródłowego aplikacji.

Integracja:
- musi wstrzykiwać standaryzowany `Locus-Pay-Module`
- moduł automatycznie konfiguruje `checkout_session` przy użyciu Locus API
- agent nie powinien ręcznie zarządzać kluczami płatności per wygenerowana aplikacja

### C. Agent Treasurer (The CFO)

Zadanie: zarządzanie kapitałem i monitoring rentowności.

Logika:
- polling salda portfeli Locus Wallets przypisanych do każdego projektu
- automatyczny sweep zysków do portfela nadrzędnego
- pozostawianie rezerwy na koszty operacyjne, np. kredyty LLM i opłaty transakcyjne

## 4. Schemat Przepływu Płatności (Paygentic Flow)

1. Przy wdrożeniu nowego Mikro-SaaS system tworzy unikalny `sub-wallet` w ekosystemie Locus.
2. Aplikacja końcowa wywołuje Locus Checkout dla każdej płatnej akcji użytkownika.
3. Środki trafiają do sub-walleta przypisanego do konkretnej instancji Mikro-SaaS.
4. Agent Treasurer rozlicza przychód, koszty i harmonogram sweepów lub payoutów.

## 5. Monitoring i Cykl Życia (Ephemeral Logic)

System musi posiadać zaimplementowany mechanizm `Sunset`.

- Metryka: brak transakcji w Locus Checkout przez 72 godziny
- Akcja: automatyczne usunięcie deploymentu z Vercel, archiwizacja repozytorium GitHub i zamknięcie aktywnej instancji biznesu

## 6. Wyzwania Implementacyjne do Rozwiązania

- Wstrzykiwanie parametrów sesji: zapewnienie, że Agent Developer poprawnie przekazuje parametry sesji z Locus API do dynamicznie tworzonych komponentów React
- Zarządzanie kosztami API: mechanizm Skarbnika musi zawsze zostawiać bezpieczny margines środków na koszty operacyjne AI

## 7. Model Danych

Minimalny model danych dla MVP powinien składać się z poniższych encji.

### `projects`

Reprezentuje wygenerowany mikro-SaaS.

- `id`
- `name`
- `slug`
- `prompt`
- `status` (`draft`, `architecting`, `coding`, `deploying`, `integrating_payments`, `active`, `under_evaluation`, `sunset_pending`, `archived`, `failed`)
- `template_type`
- `live_url`
- `repo_url`
- `vercel_project_id`
- `sub_wallet_id`
- `last_transaction_at`
- `sunset_at`
- `created_at`
- `updated_at`

### `project_runs`

Reprezentuje pojedynczy przebieg pipeline'u agentowego.

- `id`
- `project_id`
- `trigger_type` (`manual`, `auto`, `retry`)
- `current_stage`
- `stage_status`
- `architect_output`
- `developer_output`
- `deployment_output`
- `error_message`
- `started_at`
- `finished_at`

### `payment_sessions`

Reprezentuje sesje checkout dla płatnych akcji.

- `id`
- `project_id`
- `external_session_id`
- `pricing_key`
- `amount`
- `currency`
- `status` (`created`, `pending`, `paid`, `failed`, `expired`)
- `checkout_url`
- `created_at`
- `updated_at`

### `wallets`

Reprezentuje portfel główny lub podrzędny w Locus.

- `id`
- `wallet_type` (`master`, `sub_wallet`)
- `project_id` nullable
- `external_wallet_id`
- `address`
- `balance`
- `currency`
- `last_synced_at`

### `transactions`

Rejestr wpływów i sweepów.

- `id`
- `project_id`
- `wallet_id`
- `payment_session_id` nullable
- `external_transaction_id`
- `transaction_type` (`payment`, `refund`, `sweep`, `payout`, `fee`)
- `amount`
- `currency`
- `status`
- `occurred_at`
- `metadata`

### `deployments`

Reprezentuje wdrożenia projektu.

- `id`
- `project_id`
- `provider` (`vercel`)
- `environment` (`preview`, `production`)
- `external_deployment_id`
- `deployment_url`
- `status`
- `created_at`

## 8. API i Kontrakty Endpointów

Backend powinien wystawiać prosty, stabilny zestaw endpointów dla dashboardu, generatora i integracji webhookowych.

### `POST /api/projects`

Tworzy nowy projekt i uruchamia pipeline.

Request:

```json
{
  "prompt": "Zbuduj generator polityki prywatności dla sklepów Web3",
  "templateType": "tool",
  "pricing": {
    "amount": "1.00",
    "currency": "USDC",
    "unitLabel": "1 generation"
  }
}
```

Response:

```json
{
  "project": {
    "id": "proj_123",
    "name": "Privacy Policy Generator",
    "status": "architecting"
  },
  "run": {
    "id": "run_123",
    "currentStage": "architecting"
  }
}
```

### `GET /api/projects`

Zwraca listę projektów do dashboardu.

### `GET /api/projects/:projectId`

Zwraca szczegóły projektu, revenue, status sunset i ostatni deployment.

### `GET /api/projects/:projectId/runs`

Zwraca historię przebiegów pipeline'u.

### `POST /api/projects/:projectId/payment-sessions`

Tworzy sesję checkout dla płatnej akcji w mikro-SaaS.

Request:

```json
{
  "pricingKey": "default_generation",
  "amount": "1.00",
  "currency": "USDC",
  "successUrl": "https://tool.example/success",
  "cancelUrl": "https://tool.example/cancel"
}
```

Response:

```json
{
  "sessionId": "sess_123",
  "checkoutUrl": "https://checkout.locus.example/session/sess_123",
  "status": "created"
}
```

### `POST /api/webhooks/locus/checkout`

Webhook odbierający zmiany statusu płatności.

Obsługiwane zdarzenia:
- `checkout.session.created`
- `checkout.session.paid`
- `checkout.session.failed`
- `checkout.session.expired`

### `POST /api/webhooks/vercel/deployments`

Webhook odbierający zmiany statusu deploymentów.

### `POST /api/internal/sunset/run`

Wewnętrzny endpoint uruchamiany przez scheduler, który sprawdza projekty bez transakcji przez 72h i oznacza je do wygaszenia albo archiwizuje.

### `GET /api/treasury/summary`

Zwraca global treasury, listę walletów i przychód per projekt.

## 9. Dokładny Flow Integracji z Locus

Poniższy przepływ powinien być przyjęty jako kontrakt implementacyjny dla MVP.

### A. Provisioning projektu

1. Użytkownik tworzy projekt w dashboardzie.
2. Backend zapisuje rekord `project` w statusie `architecting`.
3. System tworzy lub przypisuje `sub-wallet` w Locus.
4. `sub_wallet_id` zostaje zapisany w projekcie przed deploymentem produkcyjnym.

### B. Konfiguracja płatności

1. Agent Developer generuje mikro-SaaS ze wspólnym komponentem `LocusPayButton`.
2. Frontend nie komunikuje się bezpośrednio z sekretnymi kluczami Locus.
3. Frontend wywołuje `POST /api/projects/:projectId/payment-sessions`.
4. Backend tworzy sesję checkout przez Locus API.
5. Backend zapisuje rekord `payment_sessions` i zwraca `checkoutUrl` lub `sessionId`.

### C. Finalizacja płatności

1. Użytkownik końcowy kończy checkout.
2. Locus wysyła webhook do `/api/webhooks/locus/checkout`.
3. Backend aktualizuje `payment_sessions.status`.
4. Backend zapisuje rekord w `transactions`.
5. Backend aktualizuje `projects.last_transaction_at`.
6. Dashboard oraz projekt end-user odświeżają stan płatności.

### D. Synchronizacja walletów

1. Scheduler lub Agent Treasurer okresowo pobiera salda sub-walletów.
2. Backend aktualizuje tabelę `wallets`.
3. Dashboard oblicza `revenue per project` i `global treasury`.
4. Jeśli saldo przekracza próg, Treasurer wykonuje sweep do walleta głównego.

### E. Sunset flow

1. Scheduler porównuje `last_transaction_at` z aktualnym czasem.
2. Jeśli minęły 72 godziny bez transakcji, projekt otrzymuje status `sunset_pending`.
3. Dashboard pokazuje czerwony countdown i ostrzeżenie.
4. Po przekroczeniu progu system:
   - usuwa deployment z Vercel
   - archiwizuje repo
   - oznacza projekt jako `archived`

## 10. Decyzja Produktowa dla MVP

Dla MVP należy przyjąć wersję częściowo autonomiczną, a nie w pełni autonomiczną.

Zakres MVP:
- realny dashboard i realny backend orchestration
- realny model projektów, deploymentów i płatności
- generator oparty o jeden lub kilka szablonów, a nie dowolne pełne generowanie produktu od zera
- możliwość podpięcia prawdziwego Locus Checkout, ale z ograniczoną liczbą scenariuszy
- sunset logic działający na poziomie statusów i automatyzacji backendowej

Poza MVP:
- pełna autonomia podejmowania decyzji biznesowych
- dowolne generowanie złożonych aplikacji bez szablonów
- zaawansowany self-healing deployment pipeline
- wielokanałowa orkiestracja agentów produkcyjnych

Powód tej decyzji:
- zmniejszenie ryzyka integracyjnego
- szybsze demo hackathonowe
- łatwiejsze testowanie kontraktów z Locus i Vercel

## 11. Deploy Pipeline: GitHub + Vercel

Docelowy pipeline wdrożeniowy dla każdego mikro-SaaS:

1. Agent Architect przygotowuje spec projektu.
2. Agent Developer generuje kod na podstawie szablonu.
3. Backend tworzy repozytorium GitHub lub branch projektu.
4. Kod zostaje wypchnięty do repo.
5. Backend tworzy projekt w Vercel przez API albo podłącza repo do istniejącego teamu.
6. Ustawiane są zmienne środowiskowe:
   - `LOCUS_API_KEY`
   - `LOCUS_WEBHOOK_SECRET`
   - `PROJECT_ID`
   - `SUB_WALLET_ID`
   - `NEXT_PUBLIC_APP_URL`
7. Vercel uruchamia build i deployment.
8. Po sukcesie backend zapisuje `deployment_url` i aktualizuje `project.live_url`.
9. Backend aktywuje monitoring webhooków Vercel i scheduler sunset.

### Minimalne statusy deploymentu

- `queued`
- `building`
- `ready`
- `failed`
- `archived`

### Wymagania operacyjne

- każdy projekt musi mieć własny identyfikator środowiska
- sekrety trzymane wyłącznie po stronie backendu lub Vercel
- webhooki Locus i Vercel muszą być idempotentne
- retry deploymentu nie może tworzyć zduplikowanych walletów ani zduplikowanych checkout sessions
