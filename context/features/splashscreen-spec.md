# Splash Screen Spec

## Overview

This is the launch (splash) experience the user sees while the app boots and decides where to route them (auth → onboarding → tabs). It comes in two layers:

1. **Native splash** — the static screen the OS shows *before React Native has started running*, configured through `expo-splash-screen` and baked into the iOS/Android builds.
2. **Animated splash** — a React Native screen that takes over the instant JS is ready and plays the brand motion, then routes the user on.

Use the screenshot referenced below for how both layers should look. The design is built from four motion ideas, labelled in the design: **animated flame ignition · ember bloom · rising sparks · loading shimmer**.

## Theme-awareness (important)

"Theme-aware" here means the **OS-level appearance** (system Light/Dark), which exists *before* React Native starts — **not** the app's own in-app theme.

- This is **not** the project's `@/hooks/use-color-scheme` hook — that reads the in-app Zustand `settingsStore`, which defaults to `'dark'` and isn't even hydrated at launch. Using it would make the splash ignore the OS theme.
- **Native layer:** the OS picks the Light/Dark splash variant itself, from the device system theme, with zero JS. Enabled by `userInterfaceStyle: "automatic"` (already set in `app.json`) plus a `dark` variant in the `expo-splash-screen` plugin config.
- **Animated layer:** read the system theme from React Native core — `Appearance.getColorScheme()` / `useColorScheme` imported **from `react-native`** (the OS appearance API), so the animated screen continues in exactly the theme the native splash already showed.

The two layers must share the same background color per theme so the native → animated handoff has no flash or color jump.

## Requirements

- Implement the splash UI EXACTLY (pixel-perfect) as shown in @context/screenshots/splash-screen.png, for both the **Dark** and **Light** states shown side-by-side
- Theme is chosen by the **device/OS** system appearance, as described above — verify by flipping the OS theme (not any in-app toggle)
- Cross-platform: iOS + Android (and must not crash on web). Safe-area aware, centered, responsive across phone sizes via flex / percentage layout
- **Native splash (`app.json` → `expo-splash-screen`)**: provide Light + Dark variants so the first painted frame matches the OS theme:
  - light: `backgroundColor` `#FAFAFA`, flame splash image
  - `dark.backgroundColor` `#0D0D0D`, `dark.image` flame splash image (dark-optimized)
  - keep the native splash up via `preventAutoHideAsync()` until fonts + first animation frame are ready, then `hideAsync()` — no flash/jump
- **Animated splash composition**, vertically centered as a group, top → bottom:
  - **Flame logo** — gradient flame (amber/orange `#F59E0B` → deep orange, gold tip) on a soft radial **ember bloom** glow
  - **`CreatorLog`** wordmark — bold; white on dark, near-black (`#11181C`) on light
  - **`Show up. Every day.`** tagline — muted, small, letter-spaced
  - **Loading shimmer** — thin horizontal track near the bottom with a highlight sweeping left→right on a loop
  - **`v2.0`** — small muted version label pinned at the very bottom
- Animations must use `react-native-reanimated` only — no core `Animated` API (per @context/coding-standards.md)
- After the intro animation completes AND the boot/auth check resolves, route on with `router.replace` (no splash entry in the back stack):
  - no session → `/(auth)/sign-in`
  - session, onboarding incomplete → `/(onboarding)/platforms`
  - session, onboarding complete → `/(tabs)`
  - auth wiring isn't built yet — gate behind a single `getInitialRoute()` helper that currently returns the auth route, so the real check drops in later without touching the UI
- Do not hardcode colors in the animated layer — use tokens from @context/constants/colors.ts (`AppColors`) and @context/constants/typography.ts; select the variant from the **OS** scheme

## Design Details

| Element        | Dark (`#0D0D0D` bg)                   | Light (`#FAFAFA` bg)                   |
| -------------- | ------------------------------------- | -------------------------------------- |
| Ember bloom    | warm amber radial glow, ~0.35 opacity | warm amber radial glow, ~0.18 opacity  |
| Flame          | amber→orange→gold gradient            | same gradient                          |
| `CreatorLog`   | `#FFFFFF` (bold)                      | `#11181C` (bold)                       |
| Tagline        | `textSecondary` `#A0A0A0`             | `textMuted` `#9BA1A6`                   |
| Shimmer track  | subtle light track over dark          | subtle dark track over light           |
| `v2.0`         | `textMuted` `#555555`                 | `textMuted` `#9BA1A6`                   |

- Status bar: `StatusBar style="auto"` (or driven by the OS scheme) — light content on dark, dark content on light.
- Flame + glow group sits slightly above mid-screen; wordmark + tagline just under it; shimmer + version anchored toward the bottom.

## Animation Specs

| Animation        | Trigger        | Approx. timing      | Detail                                                                            |
| ---------------- | -------------- | ------------------- | --------------------------------------------------------------------------------- |
| Flame ignition   | On mount       | 400–600ms, ease-out | Flame scales `0.6 → 1` + opacity `0 → 1` (spring), slight upward settle            |
| Ember bloom      | On mount, loop | 1.8–2.4s loop       | Radial glow opacity/scale gently pulses (breathing) behind the flame              |
| Rising sparks    | On mount, loop | staggered 1.5–2.5s  | 4–6 small amber dots float upward around the flame, fading out, staggered delays  |
| Loading shimmer  | On mount, loop | ~1.2s loop          | Highlight band translates across the track left→right on repeat                   |
| Exit / handoff   | Boot resolved  | 250ms fade          | Whole screen fades/scales out, then `router.replace` to the resolved route        |

## Technical Plan

1. **Flame asset (shared)** — a single gradient flame PNG, `assets/images/splash-flame.png` (1024², gold→amber→orange, transparent background, centered with padding). It is used by **both** the native splash and the animated splash so the flame is pixel-identical across layers. Rendered from the Ionicons `flame` path so it stays on-brand with `components/auth/AuthLogo.tsx`.
   - `expo-image` (already a dependency) renders the flame in the animated layer.
   - `expo-linear-gradient` — shimmer highlight band only.
   - Ember-bloom radial glow is faked with stacked semi-transparent amber circles (opacity decay outward) — no `react-native-svg` needed.
   - No masked-view / gradient-fill stack is required, so there is no web fallback branch.
2. **Native splash config** (`app.json`) — the `expo-splash-screen` plugin block points `image` + `dark.image` at `splash-flame.png` with `dark.backgroundColor`/`backgroundColor` per theme, so the OS shows the correct themed static splash (with the brand flame) before JS runs. `userInterfaceStyle` stays `"automatic"`.
3. **OS theme source** — a tiny helper (e.g. `hooks/use-system-color-scheme.ts`) wrapping `useColorScheme` **from `react-native`**, kept deliberately separate from the in-app `@/hooks/use-color-scheme`. The animated splash uses this one only.
4. **Entry orchestration** — add `app/index.tsx` as the routed entry: renders `<AnimatedSplash />`, runs `getInitialRoute()` (boot/auth check), and on animation-complete + route-resolved calls `router.replace`. Register in `app/_layout.tsx` `Stack` with `headerShown: false`; owns the `expo-splash-screen` `preventAutoHideAsync`/`hideAsync` lifecycle.
5. **Components** (`components/splash/`, per project structure):
   - `AnimatedSplash.tsx` — themed full-screen container; lays out flame group + wordmark + tagline + shimmer + version; owns ignition + exit animations and the `onFinish` callback; reads the OS scheme.
   - `FlameLogo.tsx` — gradient flame (shared `splash-flame.png` via `expo-image`) + ember-bloom glow (ignition + breathing pulse).
   - `RisingSparks.tsx` — floating spark particles (reanimated, staggered loop).
   - `LoadingShimmer.tsx` — shimmer track + sweeping highlight band.

## File Structure

```
app/
  index.tsx                        # entry: renders AnimatedSplash, resolves route, router.replace
  _layout.tsx                      # register index screen (headerShown:false) + native splash hide lifecycle
hooks/
  use-system-color-scheme.ts       # OS appearance (react-native useColorScheme) — NOT the in-app theme store
components/
  splash/
    AnimatedSplash.tsx             # full themed screen + ignition/exit orchestration
    FlameLogo.tsx                  # masked gradient flame + ember bloom glow
    RisingSparks.tsx               # rising amber spark particles
    LoadingShimmer.tsx             # bottom shimmer loading bar
assets/
  images/
    splash-flame.png               # shared gradient flame — native splash + animated FlameLogo
```

## References

- @context/screenshots/splash-screen.png
- @context/coding-standards.md
- @context/project-overview.md
- @context/constants/colors.ts
- @context/constants/typography.ts
- @components/auth/AuthLogo.tsx (existing flame tile — brand parity)
