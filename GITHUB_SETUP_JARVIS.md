# Jarvis — GitHub integration setup

> **Important:** Adding one file to GitHub cannot automatically enable messaging, phone calls, payments, shopping, or AI coding. Each feature needs the correct Android code, permissions, API/provider setup, and—in sensitive cases—user confirmation. This guide is a safe starting point, not a drop-in implementation.

## Before adding code

1. Keep API keys, signing passwords, and keystore files out of the repository.
2. If a real keystore or password was committed, treat it as exposed: rotate the credentials and replace the signing key as appropriate.
3. Use GitHub Actions **Secrets** for build credentials. Do not put secrets in `index.html`, JavaScript, or source files.
4. Check the repository's actual structure and build workflow before introducing new files.

## Feature boundaries

| Feature | What the app needs |
|---|---|
| Open a messaging app | Android intent / supported web URL; the user completes or confirms the action. |
| Send a message | A supported provider API and its authorization, or Android's user-approved share/reply flow. Do not silently send messages. |
| Place a phone call | Android call intent and user confirmation; direct calling permission is restricted and should not be used to bypass user consent. |
| Payments and orders | The provider's official API/SDK, secure server-side handling where required, and explicit confirmation before purchase/payment. |
| AI features | A backend or provider integration; never embed a private API key in client-side code. |

## Suggested repository structure

Adapt this to the files already present; do not overwrite existing project files blindly.

```text
web/
  index.html
  app.js
android/
  app/src/main/java/.../MainActivity.java
  app/src/main/AndroidManifest.xml
server/
  (optional backend; keep secrets in environment variables)
.github/
  workflows/
    (existing build workflow)
```

## Safe implementation sequence

1. Confirm the Android package name, build system (Gradle or generated project), and current entry activity.
2. Implement one feature at a time, beginning with opening an app or a share sheet.
3. Add only the Android permissions that the chosen feature truly requires.
4. Test on a device and verify that the user sees and approves sensitive actions.
5. Add provider APIs only after reviewing their official documentation and authorization requirements.
6. Store credentials as GitHub Actions Secrets for CI, and use a secure backend for runtime secrets. GitHub Actions secrets are not automatically available to a running Android app.

## Information needed for a compatible code file

To generate a drop-in file, provide the repository ZIP or the full, untruncated contents of:

- `index.html` and its JavaScript files;
- the Android activity that handles the UI or commands;
- `AndroidManifest.xml`;
- Gradle build files and the existing GitHub Actions workflow.

Redact API keys, signing passwords, tokens, and private certificates before sharing. Once the project structure is known, code can be written to match the actual package names and build setup.
