# Onboarding Screens Spec

## Overview

This is for the Onboarding screens a new user encounters after sign up which includes a 3-stage flow: picking a platform (Platform screen ui), Setting weekly goals (Weekly goals ui) and Setting Reminders ui . Use the screenshot referenced in this file for how they should look.

## Requirements

- Implement the Platform setting onboarding ui EXACTLY (pixel-perfect) as it is shown in @context/screenshots/onboarding-platforms-screen.png
- Implement the Weekly goals setting onboarding ui EXACTLY (pixel-perfect) as it is shown in @context/screenshots/onboarding-weekly-goals-screen.png
- Implement the reminders setting ui EXACTLY (pixel-perfect) as it is shown in @context/screenshots/onboarding-reminders-screen.png
- Note that the ui shown in @context/screenshots/onboarding-push-prompt.png is a default ios prompt ui for notification permissions this shouldn't be designed but implemented so that on clicking "Let's go" button in the reminders ui, it triggers the permission prompt ui to be displayed (for both ios and android)
- Note each of the 3 screens represent a step in a 3-stage onboarding flow
- Ensure for all 3 screens,You must pay attention to every design detail and implement Exactly as it appears in the screenshots, you must implement Dark mode and light mode state as shown in the screenshots, follow the coding standards at @context/coding-standards.md and also maintain the project structure in @context/project-overview.md

## References

- @context/screenshots/onboarding-platforms-screen.png
- @context/screenshots/onboarding-weekly-goals-screen.png
- @context/screenshots/onboarding-reminders-screen.png
- @context/screenshots/onboarding-push-prompt.png
- @context/coding-standards.md
- @context/project-overview.md
