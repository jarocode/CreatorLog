## CreatorLog

CreatorLog is A mobile-first content consistency tracker for creators on LinkedIn, TikTok, and YouTube.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

- `npx expo start` — start the dev server
- `npm run ios` / `npm run android` / `npm run web` — start for a specific platform
- `npx expo lint` — run ESLint (uses eslint-config-expo flat config)
- `npx expo export --platform web` — build static web output
- `eas build --profile development` — create a development build via EAS
- `eas build --profile development-simulator` — create an iOS simulator dev build

## EAS Build Profiles

Defined in `eas.json`: `development` (dev client, internal), `preview` (internal distribution), `production` (auto-increment), `development-simulator` (iOS simulator).
