# AI Interaction Guidelines

## Communication

- Be concise and direct
- Explain non-obvious decisions briefly
- Ask before large refactors or architectural changes
- Don't add features not in the project spec or `context/current-feature.md`
- Never delete files without clarification
- If a React Native/Expo approach differs from web conventions, explain why

## Workflow

This is the common workflow that we will use for every single feature/fix:

1. **Document** — Document the feature in `context/current-feature.md`
2. **Branch** — Create new branch for feature, fix, etc
3. **Implement** — Implement the feature/fix described in `context/current-feature.md`
4. **Test** — Verify it works on device/simulator. Run `npx expo-doctor` and `npx tsc --noEmit` and fix any errors
5. **Iterate** — Iterate and change things if needed
6. **Commit** — Only after type-check passes and everything works on device
7. **Merge** — Merge to main
8. **Delete Branch** — Delete branch after merge
9. **Review** — Review AI-generated code periodically and on demand
10. Mark as completed in `context/current-feature.md` and add to history

Do NOT commit without permission and until type-check passes. If it fails, fix the issues first.

## Branching

We will create a new branch for every feature/fix. Name branch **feature/[feature]** or **fix/[fix]**, etc. Ask to delete the branch once merged.

## Commits

- Ask before committing (don't auto-commit)
- Use conventional commit messages (feat:, fix:, chore:, etc.)
- Keep commits focused (one feature/fix per commit)
- Never put "Generated With Claude" or any AI attribution in commit messages

## When Stuck

- If something isn't working after 2–3 attempts, stop and explain the issue
- Don't keep trying random fixes
- Ask for clarification if requirements are unclear
- If it's a platform-specific issue (iOS vs Android), say which platform and what the error is

## Code Changes

- Make minimal changes to accomplish the task
- Don't refactor unrelated code unless asked
- Don't add "nice to have" features
- Preserve existing patterns in the codebase
- Always use the project's Zustand stores and MMKV — don't introduce new state solutions
- Never swap out navigation patterns — we use Expo Router exclusively

## Code Review

Review AI-generated code periodically, especially for:

- Security (Supabase RLS assumptions, input validation, push token handling)
- Performance (unnecessary re-renders, unoptimized FlatLists, heavy computations in render)
- Logic errors (timezone edge cases in streak calculations, off-by-one in weekly goals)
- Patterns (matches existing codebase? uses `@/` imports? follows `coding-standards.md`?)
