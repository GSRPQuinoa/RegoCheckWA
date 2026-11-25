# WA Rego Companion

An iPhone-friendly Progressive Web App (PWA) shell for keeping WA DoT and public Repco vehicle lookup entry points together.

## Important integration limitation

This first version is a **single app interface**, but it does not automatically retrieve or merge the providers' returned data.

- Repco's website terms prohibit spidering, scraping, robots, and other automated access to its website content.
- WA DoT's online service terms also restrict automated access. The official service may also block being embedded in another website.
- Because neither provider has supplied an approved public API/integration for this project, this app does not scrape either service, bypass browser protections, or claim to display verified results itself.

The app attempts to show both provider websites inside the app panels. If a provider blocks embedding, use **Open official site**. The provider may require the plate to be entered again. This is a functional launch point, not a verified automated dual-search integration.

Official entry points:
- WA DoT vehicle rego check: https://online.transport.wa.gov.au/webExternal/registration/?0
- Repco public website: https://www.repco.com.au/

## Publish using GitHub Pages

1. Create a new GitHub repository, e.g. `wa-rego-companion`.
2. Upload all files and folders from this project to the repository root (not the ZIP file itself).
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main**, folder **/(root)**, then Save.
6. Wait for GitHub Pages to publish. Your app URL will look like `https://YOUR-USERNAME.github.io/wa-rego-companion/`.

## Install on iPhone

1. Open the published GitHub Pages URL in Safari.
2. Tap **Share**.
3. Choose **Add to Home Screen**.
4. Enable **Open as Web App** if shown, then tap **Add**.

## Local preview

You can open `index.html` for a basic preview. Service-worker/offline installation requires HTTPS or localhost.

## Files

- `index.html` – app interface
- `styles.css` – responsive iPhone styling
- `app.js` – search history and provider panels
- `manifest.webmanifest` – installable app metadata
- `sw.js` – basic offline caching
- `icons/` – app icons

## Next step for true automatic results

To show merged DoT and Repco results without leaving the app, the providers must authorise an API, data feed, or supported integration. Add those credentials and documented endpoints on a secure backend (never put private API keys in the public GitHub Pages code).