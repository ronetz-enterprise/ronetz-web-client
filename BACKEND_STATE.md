# WiFi Platform Backend — État Actuel

**Date** : 2026-04-20  
**Version** : 1.0.0-SNAPSHOT  
**Stack** : Spring Boot 3.4.4 · Java 21 · PostgreSQL 16 · Maven 9 modules

---

## 1. Architecture

```
wifi-platform-parent (pom.xml)
├── shared-kernel            → Value Objects purs, exceptions domaine
├── platform-contracts       → Interfaces inter-BC (Ports)
├── bc-iam                   → Identity & Access Management
├── bc-network-ops           → Topologie réseau (domaines, sites, routeurs)
├── bc-commerce              → Catalogue produits + souscriptions
├── bc-payments              → Paiements PSP + webhooks
├── bc-access-sessions       → Tokens WiFi + synchronisation RADIUS
├── bc-analytics-audit       → Événements domaine + audit trail
└── platform-app             → Point d'entrée unique (Spring Boot app)
```

**Principes appliqués :**
- Hexagonale stricte : `domain/` → `application/` → `infrastructure/`
- Domaine pur : zéro `@Spring` / `jakarta.persistence` dans `/domain/`
- Inter-BC via Ports synchrones (sauf Analytics : `@Async`)
- Multi-tenant : RLS PostgreSQL activée sur toutes les tables métier
- Migrations Flyway V1–V6 versionnées
- Argon2id (m=64MB, t=3, p=4) pour les mots de passe
- JWT HMAC-SHA256 avec rotation des refresh tokens

---

## 2. Shared Kernel (`com.wifiplatform.shared`)

### Value Objects

| Classe | Description | Validation |
|--------|-------------|------------|
| `Money` | Montant immuable (BigDecimal scale=2) | Négatif interdit, même devise pour add/subtract |
| `Currency` | Enum devise | XAF, XOF, NGN, GHS, KES, UGX, RWF, ZMW, MWK, EUR, USD |
| `Email` | Adresse email normalisée lowercase | Regex RFC 5322 simple |
| `PhoneNumber` | Numéro E.164 | `^\+[1-9]\d{6,14}$` |
| `CountryCode` | ISO 3166-1 alpha-2 | Regex `^[A-Z]{2}$` |

### Exceptions

| Exception | HTTP | Usage |
|-----------|------|-------|
| `DomainException` | 400 | Règle domaine violée (base) |
| `BusinessRuleViolationException` | 422 | Transition état invalide |
| `EntityNotFoundException` | 404 | Agrégat introuvable |

---

## 3. Platform Contracts (`com.wifiplatform.contracts`)

Interfaces pures (pas de Spring) définissant la communication inter-BC.

| Interface | Direction | Implémenté dans |
|-----------|-----------|-----------------|
| `PaymentNotifier` | Paym
￼
Individual
￼
Team & Enterprise
￼
API
Free
Try Claude
$0
Free for everyone

Try Claude
Try Claude
Chat on web, iOS, Android, and on your desktop
Generate code and visualize data
Write, edit, and create content
Analyze text and images
Ability to search the web
Memory across conversations
Create files and execute code
Unlock more from Claude with desktop extensions
Connect Slack and Google Workspace services
Integrate any context or tool through connectors with remote MCP
Extended thinking for complex work
ents → Commerce | `PaymentNotifierImpl` (bc-commerce) |
| `TokenIssuePort` | Commerce → Access-Sessions | `IssueTokenHandler` (bc-access-sessions) |
| `RouterActivationPort` | NetworkOps → Access (optionnel) | Non implémenté (MVP) |
| `DomainEventPublisher` | Tous → Analytics | `DomainEventPublisherAdapter` (bc-analytics) |

### Records contrats

**`PaymentCompletedNotification`**
```
paymentId: UUID, subscriptionId: UUID, tenantId: UUID,
amount: BigDecimal, currency: String, pspReference: String
```

**`TokenIssueRequest`**
```
subscriptionId: UUID, userId: UUID, tenantId: UUID, siteId: UUID,
durationMinutes: int, dataVolumeMb: int, maxConcurrentDevices: int
```

**`TokenIssuedResult`**
```
tokenId: UUID, username: String, accessCode: String, expiresAt: Instant
```

---

## 4. BC-IAM — Identity & Access Management

### Fonctionnalités implémentées
- Inscription avec hash Argon2id
- Login avec émission JWT (15 min) + refresh token (30 jours, SHA-256 en base)
- Rotation des refresh tokens (révocation de l'ancien à chaque refresh)
- Gestion utilisateurs SUPER_ADMIN : liste, activation/désactivation, suppression douce
- Modèle multi-tenant : chaque `User` appartient à un `Tenant`

### Modèle domaine

**`User`** : id, tenantId, email (Email), phoneNumber (PhoneNumber), countryCode, role (UserRole), active, deleted, createdAt, lastLoginAt  
Méthodes : `register()`, `login()`, `promoteToAdminWifi()`, `toggleActive()`, `softDelete()`, `invalidateAllTokens()`

**`UserRole`** : `CLIENT` | `ADMIN_WIFI` | `SUPER_ADMIN`

**`Tenant`** : id, name, countryCode, active, createdAt

**`RefreshToken`** : id, userId, tokenHash, expiresAt, revoked  
Méthodes : `revoke()`, `isExpired()`

### Endpoints

#### `POST /auth/register`
Crée un nouvel utilisateur CLIENT.

**Request** `RegisterRequest`
```json
{
  "email": "user@example.com",
  "password": "P@ssword1",
  "phoneNumber": "+2376XXXXXXXX",
  "countryCode": "CM",
  "tenantId": "uuid"
}
```
**Response 201** `AuthTokensDto`
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "raw-token",
  "expiresIn": 900
}
```

#### `POST /auth/login`
**Request** `LoginRequest`
```json
{ "email": "user@example.com", "password": "P@ssword1" }
```
**Response 200** `AuthTokensDto` (même structure)

#### `POST /auth/refresh`
**Request** `RefreshTokenRequest`
```json
{ "refreshToken": "raw-token" }
```
**Response 200** `AuthTokensDto` (nouveau token, ancien révoqué)

#### `GET /admin/users` *(SUPER_ADMIN)*
**Response 200** `List<UserDto>`
```json
[{
  "id": "uuid",
  "email": "...",
  "phoneNumber": "...",
  "countryCode": "CM",
  "role": "CLIENT",
  "active": true,
  "tenantId": "uuid"
}]
```

#### `PUT /admin/users/{id}/toggle-active` *(SUPER_ADMIN)*
**Response 200** `UserDto`

#### `DELETE /admin/users/{id}` *(SUPER_ADMIN)*
**Response 204**

---

## 5. BC-Network-Ops — Topologie Réseau

### Fonctionnalités implémentées
- Création de domaines réseau (NetworkDomain)
- Création de sites rattachés à un domaine
- Provisionnement de routeurs : génération automatique des clés WireGuard (X25519 via BouncyCastle), allocation IP pool `10.8.x.x/30`, génération secret RADIUS
- Cycle de vie routeur : PROVISIONED → ACTIVE → OFFLINE → (ACTIVE via heartbeat)
- Rotation des secrets (clés VPN + RADIUS)
- Heartbeat (mise à jour `lastHeartbeatAt`, restauration OFFLINE→ACTIVE)
- Décommissionnement irréversible

### Modèle domaine

**`NetworkDomain`** : id, tenantId, name, countryCode, createdAt

**`Site`** : id, tenantId, domainId, name, address, radiusServerId, createdAt

**`Router`** : id, tenantId, siteId, name, vpnPublicKey, vpnPrivateKeyEncrypted, vpnIpAddress, radiusSecretEncrypted, status, lastHeartbeatAt  
**`RouterStatus`** : `PROVISIONED` | `ACTIVE` | `OFFLINE` | `DECOMMISSIONED`

### Endpoints

#### `POST /api/domains` *(ADMIN_WIFI+)*
**Request** `CreateDomainRequest`
```json
{ "name": "Cameroun", "countryCode": "CM" }
```
**Response 201** `DomainDto`
```json
{ "id": "uuid", "name": "Cameroun", "countryCode": "CM", "tenantId": "uuid" }
```

#### `POST /api/sites` *(ADMIN_WIFI+)*
**Request** `CreateSiteRequest`
```json
{
  "domainId": "uuid",
  "name": "Site Yaoundé Centre",
  "address": "Av. Kennedy, Yaoundé",
  "radiusServerId": "uuid"
}
```
**Response 201** `SiteDto`
```json
{ "id": "uuid", "domainId": "uuid", "name": "...", "address": "...", "tenantId": "uuid" }
```

#### `POST /api/routers` *(ADMIN_WIFI+)*
**Request** `ProvisionRouterRequest`
```json
{ "siteId": "uuid", "name": "router-01" }
```
**Response 201** `RouterDto`
```json
{
  "id": "uuid",
  "name": "router-01",
  "siteId": "uuid",
  "vpnPublicKey": "base64==",
  "vpnIpAddress": "10.8.0.1",
  "status": "PROVISIONED",
  "tenantId": "uuid"
}
```

#### `PUT /api/routers/{id}/activate` *(ADMIN_WIFI+)*
**Response 200** `RouterDto` (status=ACTIVE)

#### `POST /api/routers/{id}/heartbeat` *(public — appelé par le routeur)*
**Response 204**

#### `POST /api/routers/{id}/rotate-secrets` *(ADMIN_WIFI+)*
**Response 200** `RouterDto` (nouvelles clés générées)

---

## 6. BC-Commerce — Catalogue & Souscriptions

### Fonctionnalités implémentées
- CRUD produits (forfaits WiFi) avec validation prix/durée/quota
- Création de souscription (CLIENT → PENDING)
- Passage à PAID déclenché par paiement confirmé (via PaymentNotifier port)
- Attribution automatique du token d'accès après paiement (appel TokenIssuePort)
- Annulation de souscription (PENDING → CANCELLED)

### Modèle domaine

**`Product`** : id, tenantId, name, description, price (Money), durationMinutes, dataVolumeMb, maxConcurrentDevices, active  
Invariants : prix > 0, durée > 0, quota > 0

**`Subscription`** : id, tenantId, userId, productId, siteId, price (Money), status, tokenId, paymentId, paidAt, cancelledAt  
**`SubscriptionStatus`** : `PENDING` | `PAID` | `CANCELLED` | `EXPIRED`

### Endpoints

#### `GET /api/products` *(AUTH)*
**Response 200** `List<ProductDto>`
```json
[{
  "id": "uuid",
  "name": "Forfait 1h",
  "description": "Accès 1 heure illimité",
  "priceAmount": 200.00,
  "priceCurrency": "XAF",
  "durationMinutes": 60,
  "dataVolumeMb": 500,
  "maxConcurrentDevices": 1,
  "active": true
}]
```

#### `POST /api/products` *(ADMIN_WIFI+)*
**Request** `CreateProductRequest`
```json
{
  "name": "Forfait 1h",
  "description": "...",
  "priceAmount": 200.00,
  "priceCurrency": "XAF",
  "durationMinutes": 60,
  "dataVolumeMb": 500,
  "maxConcurrentDevices": 1
}
```
**Response 201** `ProductDto`

#### `PUT /api/products/{id}` *(ADMIN_WIFI+)*
**Response 200** `ProductDto`

#### `DELETE /api/products/{id}` *(ADMIN_WIFI+)*
**Response 204**

#### `POST /api/subscriptions` *(CLIENT+)*
**Request** `CreateSubscriptionRequest`
```json
{ "productId": "uuid", "siteId": "uuid" }
```
**Response 201** `SubscriptionDto`
```json
{
  "id": "uuid",
  "userId": "uuid",
  "productId": "uuid",
  "siteId": "uuid",
  "status": "PENDING",
  "priceAmount": 200.00,
  "priceCurrency": "XAF",
  "tokenId": null,
  "paidAt": null
}
```

#### `GET /api/subscriptions/mine` *(CLIENT+)*
**Response 200** `List<SubscriptionDto>`

#### `DELETE /api/subscriptions/{id}` *(CLIENT+)*
**Response 204** (annulation si PENDING)

---

## 7. BC-Payments — Paiements PSP

### Fonctionnalités implémentées
- Initiation d'un paiement Flutterwave (crée `Payment` INITIATED + `PaymentIntent` PSP)
- Réception webhook Flutterwave (vérification signature HMAC-SHA256)
- Idempotence webhook : contrainte UNIQUE sur `event_id_psp`
- Transition Payment : INITIATED → COMPLETED / FAILED
- Notification Commerce via `PaymentNotifier` port (synchrone, transactionnel)

### Modèle domaine

**`Payment`** : id, tenantId, subscriptionId, userId, amount (Money), status, pspReference, initiatedAt, completedAt  
**`PaymentStatus`** : `INITIATED` | `COMPLETED` | `FAILED`

**`WebhookEvent`** : id, tenantId, eventIdPsp (UNIQUE), payload, processedAt (immuable après création)

### Endpoints

#### `POST /api/payments/initiate` *(CLIENT+)*
**Request** `InitiatePaymentRequest`
```json
{ "subscriptionId": "uuid", "phoneNumber": "+2376XXXXXXXX" }
```
**Response 201** `PaymentDto`
```json
{
  "id": "uuid",
  "subscriptionId": "uuid",
  "amount": 200.00,
  "currency": "XAF",
  "status": "INITIATED",
  "paymentLink": "https://checkout.flutterwave.com/..."
}
```

#### `POST /webhook/psp/flutterwave` *(public)*
Header requis : `verif-hash: <secret>`  
**Request** : payload JSON Flutterwave natif  
**Response 200** (idempotent — rejoue silencieusement si `event_id_psp` déjà traité)

---

## 8. BC-Access-Sessions — Tokens WiFi

### Fonctionnalités implémentées
- Émission de token d'accès (username + code d'accès) après souscription payée
- Cycle de vie : ACTIVE → REVOKED / QUOTA_EXHAUSTED
- Suivi consommation données (`recordDataUsage` → auto-exhaustion)
- Synchronisation RADIUS simulée (logs + TODO insertion réelle dans `radcheck`)
- Génération username basée sur le siteId (format `site-{prefix}-{random}`)

### Modèle domaine

**`Token`** : id, tenantId, subscriptionId, userId, siteId, username, accessCodeHash, status, issuedAt, expiresAt, dataConsumedMb, rule (AccessRule)  
**`AccessRule`** (VO) : durationMinutes, dataVolumeMb, maxConcurrentDevices, quotaResetPolicy  
**`TokenStatus`** : `ACTIVE` | `REVOKED` | `QUOTA_EXHAUSTED`  
**`QuotaResetPolicy`** : `FIXED` | `ROLLING`

*Pas de controller REST dédié en MVP — accès via le contrat `TokenIssuePort` uniquement.*

---

## 9. BC-Analytics-Audit — Événements & Audit

### Fonctionnalités implémentées
- Publication asynchrone (`@Async`) des événements domaine depuis tous les BCs
- Persistance immuable (`StoredDomainEvent`) — PostgreSQL RULE bloquant UPDATE/DELETE
- Audit trail append-only (`AuditLog`) avec action, acteur, cible, timestamp
- Structure pour snapshots KPI (table `kpi_snapshots` — calcul à implémenter)

### Modèle domaine

**`StoredDomainEvent`** : id, tenantId, eventId, aggregateType, aggregateId, eventType, payload (JSON), occurredAt

**`AuditLog`** : id, tenantId, action (AuditAction), actorId, targetType, targetId, metadata, occurredAt

**`AuditAction`** : `USER_REGISTERED`, `USER_LOGIN`, `USER_DELETED`, `SUBSCRIPTION_CREATED`, `PAYMENT_COMPLETED`, `TOKEN_ISSUED`, `ROUTER_PROVISIONED`, `ROUTER_DECOMMISSIONED`

*Pas de controller REST — accès aux données via outils BI/requêtes directes.*

---

## 10. Platform App — Configuration

### Sécurité

| Route | Accès |
|-------|-------|
| `POST /auth/**` | Public |
| `POST /webhook/psp/**` | Public |
| `POST /api/routers/*/heartbeat` | Public |
| `GET /api/products` | Authentifié |
| `POST /api/products`, `PUT`, `DELETE` | ADMIN_WIFI+ |
| `POST /api/domains`, `POST /api/sites`, `POST /api/routers` | ADMIN_WIFI+ |
| `PUT /api/routers/*/activate`, rotate-secrets | ADMIN_WIFI+ |
| `POST /api/subscriptions`, `GET /api/subscriptions/mine` | CLIENT+ |
| `POST /api/payments/initiate` | CLIENT+ |
| `GET /admin/**`, `PUT /admin/**`, `DELETE /admin/**` | SUPER_ADMIN |

### Variables d'environnement requises

| Variable | Description |
|----------|-------------|
| `DB_URL` | JDBC URL PostgreSQL |
| `DB_USERNAME` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | Mot de passe PostgreSQL |
| `JWT_SECRET` | Secret HMAC-SHA256 (base64, 256 bits min) |
| `JWT_EXPIRATION_MS` | Expiration access token (défaut : 900000 = 15 min) |
| `FLUTTERWAVE_SECRET_HASH` | Secret de vérification webhooks Flutterwave |
| `FLUTTERWAVE_SECRET_KEY` | Clé API Flutterwave |

### Démarrage

```bash
cd Rik_api/
mvn clean package -DskipTests
java -jar platform-app/target/platform-app-1.0.0-SNAPSHOT.jar
```

**Prérequis** : PostgreSQL 16+ avec `CREATE EXTENSION pgcrypto;`, Java 21+, Maven 3.9+

---

## 11. Base de Données — Schémas

| Schéma | Tables | RLS |
|--------|--------|-----|
| `iam` | users, refresh_tokens | ✅ tenant_isolation |
| `network_ops` | domains, sites, routers | ✅ tenant_isolation |
| `access_sessions` | tokens | ✅ tenant_isolation |
| `commerce` | products, subscriptions | ✅ tenant_isolation |
| `payments` | payments, webhook_events, refunds | ✅ (webhook_events: allow_all) |
| `analytics` | domain_events, audit_log, kpi_snapshots | ✅ tenant_isolation |

Migrations Flyway : V1 (iam) → V2 (network_ops) → V3 (access_sessions) → V4 (commerce) → V5 (payments) → V6 (analytics)

---

## 12. Tests

| Module | Tests | Couverture |
|--------|-------|------------|
| shared-kernel | `MoneyTest` (6 tests) | Money VO complet |
| bc-iam | `UserTest` (8 tests) + `IamArchitectureTest` | Domaine + ArchUnit |
| bc-network-ops | `RouterTest` (5 tests) + `NetworkOpsArchitectureTest` | Domaine + ArchUnit |
| bc-commerce | `SubscriptionTest` (4 tests) + `CommerceArchitectureTest` | Domaine + ArchUnit |
| bc-payments | `PaymentTest` (4 tests) + `PaymentsArchitectureTest` | Domaine + ArchUnit |
| bc-access-sessions | `TokenTest` (6 tests) + `AccessArchitectureTest` | Domaine + ArchUnit |
| bc-analytics-audit | `AnalyticsArchitectureTest` | ArchUnit |

**Règles ArchUnit par BC (3 règles chacun) :**
1. `domain/` n'importe pas `org.springframework.*` ni `jakarta.persistence.*`
2. `domain/` n'importe pas `infrastructure.**`
3. `application/` n'importe pas `infrastructure.**`

---

## 13. Ce qui reste à implémenter

| Fonctionnalité | Priorité |
|----------------|----------|
| `PawapayAdapter` (second PSP) | Haute |
| `KpiAggregatorService` (`@Scheduled` 5 min) | Moyenne |
| Controller REST Access-Sessions (statut token, révocation) | Moyenne |
| Controller REST Analytics/Audit (SUPER_ADMIN) | Basse |
| Migration JWT → RS256 asymétrique | Basse |
| Tests intégration Testcontainers (couche infrastructure) | Haute |
| Coverage domaine > 80% | Haute |
| Tests E2E REST | Moyenne |
| Pipeline CI/CD GitHub Actions | Haute |
| Docker Compose complet (PostgreSQL + RADIUS + app) | Haute |
| `SimulatedRadiusSynchronizer` → vraie intégration FreeRADIUS | Moyenne |
