# ilovelinkedin — SPEC.md

## 1. Concept & Vision

**ilovelinkedin** is a premium portfolio generation platform that transforms LinkedIn profiles into stunning portfolio pages. The experience feels like a luxury concierge service — warm, professional, and effortlessly elegant. Users land, connect their LinkedIn, pick a theme, and watch their portfolio come to life.

**Aesthetic:** "Warm Professional" — premium without being cold, sophisticated without being pretentious. Think high-end design agency meets approachable tech product.

---

## 2. Design Language

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Background | Warm Ivory | `#FAF8F5` |
| Surface | Pure White | `#FFFFFF` |
| Primary Text | Deep Charcoal | `#1C1C1E` |
| Secondary Text | Warm Gray | `#6B6B6B` |
| Accent | Amber Gold | `#C8963E` |
| Accent Hover | Deep Gold | `#A67B2E` |
| Border | Soft Cream | `#E8E4DE` |
| Success | Sage Green | `#4A7C59` |
| Error | Terracotta | `#C25450` |

### Typography
- **Display/Headings:** `DM Serif Display` (Google Fonts) — elegant, distinctive serif
- **Body:** `DM Sans` (Google Fonts) — clean, modern, pairs perfectly
- **Monospace accents:** `JetBrains Mono` for URLs/status codes

### Spatial System
- Base unit: 4px
- Content max-width: 1200px
- Card padding: 32px
- Section spacing: 80px
- Border radius: 16px (cards), 12px (buttons), 8px (inputs)

### Motion Philosophy
- **Page load:** Staggered fade-up reveals (opacity 0→1, translateY 20px→0, 600ms ease-out, 100ms stagger)
- **Hover states:** Subtle lift (translateY -4px) + shadow expansion, 200ms ease
- **Status transitions:** Smooth color morphs, 300ms
- **Create button:** Ripple effect on click
- **Cards:** Gentle scale on hover (1.0 → 1.02)

### Visual Assets
- Icons: Lucide React (consistent, clean)
- LinkedIn logo: Official brand SVG
- Decorative: Subtle dot grid pattern in hero, gold accent lines

---

## 3. Layout & Structure

### Page Structure
Single-page application with two main sections stacked vertically:

1. **Hero Section** — Compact but impactful
   - Logo/wordmark left
   - Tagline center
   - "Create Portfolio" CTA button right
   - Subtle dot-grid background pattern

2. **Portfolios Section** — Main content
   - Section header with count
   - Grid of portfolio cards (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
   - Empty state when no portfolios
   - "Create New" card always visible at end of grid

### Responsive Strategy
- Mobile-first
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Cards stack single-column on mobile
- Hero compresses to centered layout on mobile

---

## 4. Features & Interactions

### Core Features

#### 4.1 User Identity (Anonymous UUID)
- On first visit, generate a UUID v4 and store in `localStorage` under key `ilovelinkedin_user_uuid`
- All API calls include this UUID as `x-user-uuid` header
- No authentication required

#### 4.2 Portfolio Listing
- On page load, fetch portfolios for current user UUID
- Show: LinkedIn URL, Theme, Status badge, Created date, Deployed URL (if done)
- Polling: Auto-refresh every 5 seconds for jobs with status SCRAPING, BUILDING, DEPLOYING, or EVALUATING
- Manual refresh button available
- Max 5 portfolios per user (enforced in API, shown in UI)

#### 4.3 Create Portfolio
- Modal/page with form:
  - LinkedIn Profile URL (required, validated)
  - Theme selector (visual cards showing theme preview)
- Submit creates job via POST /api/jobs
- On success: job appears in list with "SCRAPING" status, polling begins
- Max 5 portfolios — if at limit, show friendly message

#### 4.4 Status Polling
- Active polling for jobs in non-terminal states: SCRAPING, BUILDING, DEPLOYING, EVALUATING
- Polling interval: 5 seconds
- On DONE or FAILED: stop polling for that job
- Show real-time status badge updates

### Status States & Badges
| Status | Badge Color | Icon |
|--------|-------------|------|
| PENDING | Gray | Clock |
| SCRAPING | Blue | Loader |
| BUILDING | Purple | Sparkles |
| DEPLOYING | Amber | Rocket |
| EVALUATING | Cyan | Eye |
| DONE | Green | Check |
| FAILED | Red | X |

### Interactions Detail
- **Card hover:** Lift + shadow expand + slight scale
- **Create button:** Scroll to/create modal + ripple effect
- **Form submit:** Button shows loading spinner, disabled state
- **LinkedIn URL validation:** Real-time, show green check or red X
- **Theme card selection:** Gold border + checkmark overlay on selected
- **Status change:** Smooth badge color transition

### Edge Cases
- **Empty list:** Friendly illustration + "Create your first portfolio" CTA
- **At 5 portfolios:** Show counter "5/5" + disabled create button with tooltip
- **API error:** Toast notification with retry option
- **Invalid LinkedIn URL:** Inline validation error, prevent submit
- **Job FAILED:** Show error message in card, allow retry (create new job)

---

## 5. Component Inventory

### Header
- Logo: "ilovelinkedin" wordmark in DM Serif Display
- Tagline: "Turn your LinkedIn into a stunning portfolio"
- CTA: "Create Portfolio" button (accent color)

### PortfolioCard
- **Default:** White card, border, subtle shadow
- **Hover:** Elevated shadow, slight scale
- **Loading:** Skeleton pulse animation
- Content: LinkedIn URL (truncated), Theme name, Status badge, Date, Action buttons
- Actions: View (if DONE), Copy Link, Retry (if FAILED)

### StatusBadge
- Pill shape, icon + text
- Color per status (see table above)
- Subtle background tint

### ThemeSelector
- Grid of theme preview cards
- Each card: Mini preview of theme colors/layout + theme name
- **Available themes:** minimal-dark, corporate-blue, linkedin-profile, creative-bold, elegant-minimal
- Selected: Gold border + checkmark

### CreateModal / CreatePage
- Full-screen overlay or dedicated page
- Form with LinkedIn URL input + Theme selector
- Submit button with loading state
- Close/cancel option

### EmptyState
- Centered illustration (SVG)
- Headline: "No portfolios yet"
- Subtext: "Connect your LinkedIn and we'll create a stunning portfolio for you"
- CTA button

### Toast Notifications
- Success: Green left border
- Error: Red left border
- Auto-dismiss: 5 seconds
- Manual dismiss button

---

## 6. Technical Approach

### Framework & Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom CSS variables
- **ORM:** Prisma
- **Database:** Neon PostgreSQL (shared with portfolio-generator)
- **Components:** Shadcn/UI (Button, Input, Label, Toast)
- **Icons:** Lucide React

### API Design

#### GET /api/jobs
- Headers: `x-user-uuid: <uuid>`
- Response: `{ jobs: Job[] }`
- Returns all jobs for the user, ordered by created_at DESC

#### POST /api/jobs
- Headers: `x-user-uuid: <uuid>`
- Body: `{ linkedinUrl: string, theme: string }`
- Validations:
  - LinkedIn URL must be valid LinkedIn profile URL
  - User must have < 5 jobs
  - Theme must be valid
- Response: `{ job: Job }`
- Errors: 400 (validation), 409 (quota exceeded)

#### GET /api/jobs/[id]
- Headers: `x-user-uuid: <uuid>`
- Response: `{ job: Job }`

### Data Model

```prisma
model Job {
  id              String    @id @default(uuid())
  userUuid        String    @map("user_uuid")
  ipAddress       String?   @map("ip_address")
  linkedinUrl     String    @map("linkedin_url")
  theme           String
  status          String    @default("PENDING")
  scrapedData     Json?     @map("scraped_data")
  githubRepoUrl   String?   @map("github_repo_url")
  deployedUrl     String?   @map("deployed_url")
  errorMessage    String?   @map("error_message")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  needsAiBuild    Boolean   @default(false) @map("needs_ai_build")

  @@index([userUuid])
  @@map("jobs")
}
```

### Key Implementation Notes
- Prisma client singleton in `lib/db.ts`
- UUID generation: `crypto.randomUUID()` (native browser)
- Polling: `setInterval` in client component, cleanup on unmount
- localStorage UUID read/write on mount (useEffect)
- API calls via fetch with proper headers
- Status badges with inline SVG icons
- No server-side state — all client-side React

### Valid Themes
```typescript
const THEMES = [
  { id: 'minimal-dark', name: 'Minimal Dark', colors: '#0F0F0F, #FFFFFF, #3B82F6' },
  { id: 'corporate-blue', name: 'Corporate Blue', colors: '#1E3A5F, #FFFFFF, #2563EB' },
  { id: 'linkedin-profile', name: 'LinkedIn Style', colors: '#0A66C2, #FFFFFF, #70B5F9' },
  { id: 'creative-bold', name: 'Creative Bold', colors: '#7C3AED, #FFFFFF, #F59E0B' },
  { id: 'elegant-minimal', name: 'Elegant Minimal', colors: '#1C1C1E, #FAF8F5, #C8963E' },
]
```
