# Authentication Spec

## Overview

Wire the existing (UI-only) auth screens under `app/(auth)/` to Supabase Auth, add session persistence, and make the app route by real auth + onboarding state. The screens, shared primitives, and copy already exist (see the Auth Screens UI + Onboarding history in `context/current-feature.md`); this feature makes them functional and connects them to the launch flow established by the splash screen (`lib/getInitialRoute.ts`).

Auth flow target (project-overview §4.2):

```
Splash → session check → (no session) Auth → (new user) Onboarding → Home
                       → (existing session, onboarding done) Home
```

## Current State (what exists / what's missing)

- **Exists:** `app/(auth)/{sign-in,sign-up,forgot-password}.tsx` (light+dark, pixel-complete), shared `components/auth/*`, `services/supabase.ts` (typed client), DB schema + RLS + `handle_new_user` trigger (auto-creates `public.profiles` from `full_name` metadata), `lib/getInitialRoute.ts` (splash routing hook, stubbed to sign-in), `stores/onboardingStore.ts`.
- **Missing / broken:**
  - `services/supabase.ts` sets `persistSession: true` but has **no `storage` adapter** → sessions will NOT persist on React Native. Must add storage (coding standards mandate MMKV; not yet installed).
  - No `stores/authStore.ts` (session + profile + `onAuthStateChange` listener).
  - Auth screen handlers are `setTimeout` stubs; Apple/Google/magic-link are no-ops.
  - No `app/(auth)/reset-password.tsx` (deep-link target for password reset).
  - Onboarding "Let's go!" routes to `/` without persisting `platform_configs` / `notification_prefs` or setting `profiles.onboarding_completed` — so the routing gate has nothing to read.
  - DEBUG-only nav: auth screens' back arrows call `router.back()` to Settings; Settings has temporary links into auth/onboarding. These must go once the real flow lands.

## Requirements

### Phase 1 — Email/password core (the main ask for `app/(auth)/_layout.tsx`)

- **Session storage:** the Supabase session holds the access + refresh tokens, so back the client's `storage` adapter with **`expo-secure-store`** (encrypted keychain/keystore). Use **`react-native-mmkv`** for other, non-sensitive persisted app data (e.g. cached profile/display name, UI flags) — never AsyncStorage. Note: SecureStore advises values ≤ 2KB; if a serialized session exceeds it, chunk the value across keys in the adapter.
- **`stores/authStore.ts`** (Zustand): holds `session`, `user`, `profile`, `initializing`, `isAuthenticated`. On app start, hydrate via `supabase.auth.getSession()` and subscribe to `supabase.auth.onAuthStateChange`. Exposes `signOut()`. Fetches the `profiles` row (for `display_name`, `onboarding_completed`).
- **Sign in:** `supabase.auth.signInWithPassword({ email, password })`. Inline field errors (no alerts), button spinner during the call (reuse existing `submitting` + `PrimaryButton` loading).
- **Sign up:** `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`. The trigger creates the profile. Email confirmation is **not** enabled on the remote project, so sign-up returns a session and routes new users straight to `/(onboarding)/platforms`. Still branch defensively on the response (`data.session === null` ⇒ confirmation required ⇒ "Check your inbox") so enabling confirmation later doesn't break the flow.
- **Validation:** validate inputs before calling Supabase (email shape, password length ≥ config `minimum_password_length`). Use the existing `PasswordStrengthMeter` thresholds on sign-up. Standards call for Zod — add a small `types/validation.ts` (auth schemas) or inline zod schemas.
- **Routing gate:** replace the `getInitialRoute()` stub to read real state — no session → `/(auth)/sign-in`; session && !`onboarding_completed` → `/(onboarding)/platforms`; session && done → `/(tabs)`. Add a root auth guard so sign-out / token loss bounces back to auth (e.g. in `app/_layout.tsx` or a `useProtectedRoute` hook keyed off `authStore`).
- **Sign out:** wire a real sign-out (Settings has an Account section placeholder) → `supabase.auth.signOut()` → guard redirects to sign-in.
- **Onboarding completion:** on "Let's go!", upsert `platform_configs` (from `selectedPlatforms` + `weeklyGoals`) and `notification_prefs` (from `reminders`), set `profiles.onboarding_completed = true`, then `router.replace('/(tabs)')`. (Required for the gate to function; offline-first sync queue is out of scope here — direct writes are fine for first pass.)
- **Cleanup:** remove DEBUG auth/onboarding links from `app/(tabs)/settings.tsx`; sign-in is the entry (no back arrow), sign-up/forgot-password back-arrow to sign-in.
- **Error handling:** structured `{ success, data, error }` from auth service calls; user-friendly inline messages; never surface raw Supabase error strings.

### Phase 2 — Magic link + password reset (deep links)

- **Magic link:** `supabase.auth.signInWithOtp({ email })` from sign-in's "Email me a magic link" → flip to "Check your inbox" state. Handle the `creatorlog://` redirect with `expo-linking` + `expo-web-browser` and create the session from the returned URL.
- **Password reset:** `supabase.auth.resetPasswordForEmail(email, { redirectTo: 'creatorlog://reset-password' })` (forgot-password already has request↔sent UI). Add `app/(auth)/reset-password.tsx` (new password + confirm) that handles the deep link and calls `supabase.auth.updateUser({ password })`. Register it in `app/(auth)/_layout.tsx`.
- Centralize deep-link/session-from-URL handling (e.g. `services/authLinking.ts`).

### Phase 3 — Apple & Google SSO (needs provider config)

- UI buttons already exist. Implement `supabase.auth.signInWithIdToken({ provider, token })` using `expo-apple-authentication` (Apple, required by App Store) and `@react-native-google-signin/google-signin` (Google). Apple shown before Google on iOS (HIG).
- **Blocked on config:** providers are `enabled = false` in `supabase/config.toml`; needs Apple Service ID / Google OAuth client IDs in the Supabase dashboard + `app.json` plugin/entitlement setup + new native deps (requires a fresh dev build). Treat as a separate slice once credentials are provisioned.

## Backend / Config Notes

- `handle_new_user` already creates the profile row — do **not** insert profiles from the client.
- RLS lets a user read/update only their own `profiles` row; `platform_configs` and `notification_prefs` are full CRUD for the owner — onboarding writes are allowed under the anon key + user session.
- Local `config.toml`: `enable_confirmations = false` (email signups auto-confirm) and `minimum_password_length = 6` — the **remote** project may differ; gate the "check your inbox" branch on the actual `signUp` response (`data.session === null` ⇒ confirmation required), not a hardcoded assumption.
- Apple/Google external providers and SMTP are disabled in config — Phase 2 magic-link/reset emails rely on the project's email setup; Phase 3 needs provider credentials.

## Technical Plan

1. Install `expo-secure-store` + `react-native-mmkv`; add a SecureStore-backed `storage` adapter (`services/secureStorage.ts`) and pass it to `createClient(..., { auth: { storage, autoRefreshToken, persistSession, detectSessionInUrl: false } })`. MMKV instance for other persisted data.
2. Build `services/auth.ts` — thin wrappers returning `{ success, data, error }` for signIn/signUp/signOut/magic-link/resetPassword/updatePassword.
3. Build `stores/authStore.ts` — session/profile state + `onAuthStateChange` subscription + `initializing` flag.
4. Replace `lib/getInitialRoute.ts` body with the real session + `onboarding_completed` decision; add a root route guard (`hooks/useProtectedRoute.ts`) wired in `app/_layout.tsx`.
5. Wire the three existing screens to `services/auth.ts` (real handlers, inline errors, spinners); add `app/(auth)/reset-password.tsx` (Phase 2).
6. Add `services/onboarding.ts` (or extend the store) to persist configs + flip `onboarding_completed` on completion.
7. Add Zod auth schemas (`types/validation.ts`); validate before network calls.
8. Remove DEBUG nav from `settings.tsx`; fix auth back-arrow behavior.
9. Verify on device (Android dev build + iOS sim): sign-up → onboarding → home; sign-in; bad-credential errors; kill/relaunch persists session; sign-out returns to auth. `npx tsc --noEmit` + `npx expo lint` clean.

## File Structure

```
app/
  _layout.tsx                      # mount auth guard (useProtectedRoute)
  (auth)/
    _layout.tsx                    # + register reset-password (Phase 2)
    sign-in.tsx                    # wire signInWithPassword + magic link
    sign-up.tsx                    # wire signUp (full_name metadata)
    forgot-password.tsx            # wire resetPasswordForEmail
    reset-password.tsx             # NEW — deep-link target, updateUser({password})
services/
  supabase.ts                      # + SecureStore storage adapter
  secureStorage.ts                 # NEW — expo-secure-store adapter (session tokens)
  auth.ts                          # NEW — auth call wrappers ({success,data,error})
  authLinking.ts                   # NEW (Phase 2) — deep-link/session-from-URL
  onboarding.ts                    # NEW — persist configs + onboarding_completed
stores/
  authStore.ts                     # NEW — session + profile + listener
hooks/
  useProtectedRoute.ts             # NEW — redirect by auth state
types/
  validation.ts                    # NEW — zod auth schemas
```

## Resolved Decisions

- **Scope now:** Phase 1 only (email/password + session persistence + routing gate + onboarding completion + sign-out + DEBUG cleanup). Phases 2–3 are follow-ups.
- **Session storage:** `expo-secure-store` for the Supabase session/tokens; `react-native-mmkv` for other non-sensitive persisted data.
- **Email confirmation:** not enabled on the remote project → sign-up returns a session and routes to onboarding (response still checked defensively).

## References

- @context/project-overview.md (§4.2 auth flow, §4.3 navigation, §5 stack, §6 schema, §11.4 auth wireframes)
- @context/coding-standards.md
- @app/(auth)/_layout.tsx · @app/(auth)/sign-in.tsx · @app/(auth)/sign-up.tsx · @app/(auth)/forgot-password.tsx
- @services/supabase.ts · @supabase/migrations/001_create_profiles.sql · @supabase/migrations/006_create_rls_policies.sql · @supabase/config.toml
- @lib/getInitialRoute.ts · @stores/onboardingStore.ts
