# SIPETA - Laravel + React + Inertia.js Stack

## Architecture Overview

This is a **Laravel 12** backend with **React 19** (TypeScript) frontend via **Inertia.js 2.0**. Authentication uses **Laravel Fortify** with two-factor support. The UI is built with **shadcn/ui** components (Radix UI + Tailwind CSS v4).

**Key Stack:**
- Backend: PHP 8.2+, Laravel 12, MySQL
- Frontend: React 19, TypeScript, Vite 7
- Bridge: Inertia.js 2.0 (SPA-like experience without API endpoints)
- Auth: Laravel Fortify (login, registration, 2FA, password reset)
- UI: shadcn/ui (New York style), Tailwind v4, Radix UI primitives
- Routing: Laravel Wayfinder (type-safe route generation)
- Code Quality: Laravel Pint, ESLint, Prettier, PHPUnit

## Critical Patterns

### 1. Type-Safe Routing with Wayfinder
**Never** hardcode routes. Use auto-generated route functions from `@/routes`:

```tsx
import { dashboard, profile } from '@/routes';

// For navigation
<Link href={dashboard().url}>Dashboard</Link>

// For forms (includes CSRF)
<Form {...profile.update.form()}>
```

Routes are generated from Laravel routes → `resources/js/routes/index.ts`. After changing routes, routes regenerate on Vite reload.

### 2. Inertia Forms Pattern
Use Inertia's `<Form>` component for all form submissions (handles CSRF, validation):

```tsx
import { Form } from '@inertiajs/react';
import { store } from '@/routes/login';

<Form {...store.form()} resetOnSuccess={['password']}>
  {({ processing, errors }) => (
    <>
      <Input name="email" />
      <InputError message={errors.email} />
      <Button type="submit" disabled={processing}>Submit</Button>
    </>
  )}
</Form>
```

**Do not** use Inertia's `useForm()` hook - this project uses native forms with Wayfinder's `.form()` helpers.

### 3. Component Organization
```
resources/js/
├── components/       # Shared app components
│   ├── ui/          # shadcn primitives (generated, rarely edit)
│   └── *.tsx        # Custom components (app-shell, nav, etc.)
├── layouts/         # Page layouts (app-layout, auth-layout)
├── pages/           # Inertia page components (match route render calls)
├── routes/          # Generated type-safe routes (DO NOT EDIT)
├── types/           # TypeScript interfaces (User, SharedData, etc.)
└── lib/utils.ts     # cn() helper for class merging
```

### 4. Styling with Tailwind + cn()
Use `cn()` utility from `@/lib/utils` for conditional classes:

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className // allow prop overrides
)} />
```

**Tailwind v4** is via Vite plugin. Use CSS variables for theming (defined in `resources/css/app.css`).

### 5. Controller → Inertia Rendering
Backend controllers use `Inertia::render()` to pass data to React pages:

```php
// ProfileController.php
public function edit(Request $request): Response
{
    return Inertia::render('settings/profile', [
        'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
        'status' => $request->session()->get('status'),
    ]);
}
```

Frontend page matches path: `resources/js/pages/settings/profile.tsx`.

### 6. Shared Data & Auth
Global props available on every page via `usePage<SharedData>().props`:

```tsx
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

const { auth, sidebarOpen, name, quote } = usePage<SharedData>().props;
const user = auth.user; // Authenticated user
```

Check `resources/js/types/index.d.ts` for `SharedData` and `User` interfaces.

## Development Workflow

### Start Development Server
```bash
composer dev
```
This runs concurrently (via `concurrently`):
- `php artisan serve` (localhost:8000)
- `php artisan queue:listen`
- `php artisan pail` (real-time logs)
- `npm run dev` (Vite HMR)

**SSR Mode** (optional): `composer dev:ssr`

### Testing
```bash
composer test            # PHPUnit tests
npm run types           # TypeScript type checking
npm run lint            # ESLint + auto-fix
npm run format          # Prettier + organize imports
```

Tests use `RefreshDatabase` trait. Feature tests in `tests/Feature/`, factories in `database/factories/`.

### Linting & Formatting
- **PHP**: Laravel Pint (runs on save if configured)
- **JS/TS**: ESLint 9 (flat config) + Prettier
- **Imports**: Auto-organized via `prettier-plugin-organize-imports`

## Project-Specific Conventions

### TypeScript Path Aliases
```tsx
@/components → resources/js/components
@/layouts    → resources/js/layouts
@/lib        → resources/js/lib
@/routes     → resources/js/routes
@/types      → resources/js/types
```

### shadcn/ui Components
Generated components in `resources/js/components/ui/`. Configuration in `components.json`:
- Style: `new-york`
- Icon library: `lucide-react`
- CSS variables: enabled

To add components: Use shadcn CLI (if available) or copy from shadcn docs.

### Authentication Routes
Laravel Fortify handles all auth routes (defined in vendor). Key routes:
- `/login`, `/register`, `/logout`
- `/forgot-password`, `/reset-password`
- `/two-factor-challenge`
- `/email/verify`

Customized in `app/Providers/FortifyServiceProvider.php`.

### Database
Default: MySQL (`DB_CONNECTION=mysql`). Uses migrations in `database/migrations/`. Run `php artisan migrate` after pulling schema changes.

### Environment
`.env` file controls config. Key variables:
- `APP_URL`: localhost:8000 (dev)
- `DB_*`: Database credentials
- `SESSION_DRIVER=database`: Sessions stored in DB
- `QUEUE_CONNECTION=database`: Jobs queued in DB

## Common Tasks

### Add a New Page
1. Create route in `routes/web.php`:
   ```php
   Route::get('my-page', fn() => Inertia::render('my-page'))->name('my.page');
   ```
2. Create `resources/js/pages/my-page.tsx`:
   ```tsx
   import AppLayout from '@/layouts/app-layout';
   export default function MyPage() {
     return <AppLayout>Content</AppLayout>;
   }
   ```
3. Route auto-generates in `@/routes` (use `myPage()` function).

### Add a shadcn Component
1. Check if it exists in `resources/js/components/ui/`
2. If not, copy from [shadcn docs](https://ui.shadcn.com) into `ui/` folder
3. Update `components.json` if needed

### Update TypeScript Types
Edit `resources/js/types/index.d.ts`. Common types:
- `User`: Authenticated user model
- `SharedData`: Global Inertia props
- `BreadcrumbItem`, `NavItem`: Navigation types

### Run Artisan Commands
```bash
php artisan route:list   # See all routes
php artisan tinker       # REPL
php artisan pail         # Real-time logs
php artisan migrate      # Run migrations
```

## Gotchas

- **Don't edit** `resources/js/routes/index.ts` - it's auto-generated by Wayfinder
- **React Compiler** is enabled (`babel-plugin-react-compiler`) - avoid breaking Rules of Hooks
- **Inertia forms** handle CSRF automatically via `.form()` helpers - no manual token needed
- **Tailwind v4** uses Vite plugin (no `tailwind.config.js`), config in `resources/css/app.css`
- **Route flushes**: Use `router.flushAll()` when logging out (see `user-menu-content.tsx`)
- **Breadcrumbs**: Pass array to `AppLayout` via `breadcrumbs` prop (see `dashboard.tsx`)

## Key Files Reference

- `routes/web.php` - Application routes
- `routes/settings.php` - Settings routes (profile, password, 2FA)
- `app/Providers/FortifyServiceProvider.php` - Auth configuration
- `resources/js/app.tsx` - Frontend entry point
- `resources/js/layouts/app-layout.tsx` - Main authenticated layout
- `vite.config.ts` - Vite configuration (React Compiler, Wayfinder)
- `composer.json` - PHP dependencies & scripts
- `package.json` - Node dependencies & scripts
