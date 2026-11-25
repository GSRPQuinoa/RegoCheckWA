# WA Vehicle Check

A simple mobile-friendly Western Australian registration lookup app. It uses PlateAPI to retrieve the make, model, year range, engine and drivetrain details where the provider supplies them.

## Deploy it

This project needs **Vercel** (or another serverless host) because `api/lookup.js` is a backend function. GitHub Pages alone cannot run that API function.

1. Rotate any PlateAPI key that has been shared in a chat, screenshot or repository.
2. Sign in to [Vercel](https://vercel.com).
3. Choose **Add New → Project**, then import `GSRPQuinoa/RegoCheckWA` from GitHub.
4. In the Vercel project, open **Settings → Environment Variables**.
5. Add `PLATEAPI_KEY` and paste your newly rotated PlateAPI key as its value. Do not add the key to any website file or commit it to GitHub.
6. Deploy (or redeploy after adding the environment variable).
7. Open the Vercel URL and test with PlateAPI's free sandbox plate `TEST123`. It should return a Toyota Hilux sandbox example, not a real registration.
8. On iPhone, open the Vercel URL in Safari → Share → Add to Home Screen.

## What it shows

- Registration lookup for WA
- Vehicle make, model and year range
- Engine displacement and engine code when supplied
- RWD, FWD, AWD or 4WD when explicitly present in the provider's detailed vehicle description
- Alternative variants when PlateAPI returns multiple matches
- Recent searches stored locally on the device

The app shows **Unknown** rather than guessing if the provider does not supply a drivetrain or engine detail. Always verify important details against the vehicle itself.

## API configuration

The backend calls:

`GET https://api.plateapi.com.au/api/v1/lookup?plate=...&state=WA&detailed=true`

Authentication is sent in the `X-API-Key` header using the server-side `PLATEAPI_KEY` environment variable. The browser calls the same-origin `/api/lookup` endpoint; the key is never sent to browser JavaScript.

Official API docs: https://plateapi.com.au/docs/lookup/
