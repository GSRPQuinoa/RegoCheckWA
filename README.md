# WA Vehicle Check — live PlateAPI integration

A mobile-first PWA for WA registration lookups. Enter a plate once; the server calls PlateAPI with `state=WA` and `detailed=true`, then the app displays vehicle, engine and explicit drivetrain details where the source provides them.

## Security — read first

**Never commit an API key to GitHub or put it in browser JavaScript.** The key belongs in Vercel's encrypted Environment Variables as `PLATEAPI_KEY`. The included `.gitignore` excludes local `.env` files.

If an API key has been pasted into a chat, ticket, screenshot, or repository, rotate it in the provider dashboard before deployment and use the new key only in Vercel.

## Deploy with GitHub + Vercel

1. Rotate the key that was shared in chat.
2. Create a new private GitHub repository (recommended) named `wa-vehicle-check`.
3. Extract this ZIP and upload the project files/folders to the repository root.
4. Create/sign into Vercel at https://vercel.com and choose **Add New → Project**.
5. Import the `wa-vehicle-check` GitHub repository. Vercel detects the serverless function in `api/lookup.js`.
6. In project **Settings → Environment Variables**, add:
   - Name: `PLATEAPI_KEY`
   - Value: your newly rotated PlateAPI key
   - Environments: Production, Preview (optional), Development (optional)
7. Save, then **Deploy**. If you add/change the key later, redeploy.
8. Open the Vercel deployment URL on iPhone Safari → Share → Add to Home Screen.

## Test

PlateAPI documents `TEST123` as a permanent sandbox plate. It returns a fixed Toyota Hilux example and does not consume lookup quota. Search `TEST123` in the app after deployment to test the complete connection. It is a sandbox response, not a real registration result.

## What the app returns

- Vehicle make/model and model-year range
- Engine displacement and engine code if present in `detailed_description`
- Drivetrain: RWD, FWD, AWD or 4WD only when explicitly present in the provider data
- Alternative variants if the provider says the plate match is multiple/ambiguous

The app deliberately displays **Unknown** rather than guessing if drivetrain or engine data is absent. A plate lookup may return multiple candidate variants; choose the correct candidate where necessary.

## API details

Server function calls:
`GET https://api.plateapi.com.au/api/v1/lookup?plate=...&state=WA&detailed=true`

Authentication header:
`X-API-Key: <PLATEAPI_KEY>`

Only the serverless function sees the key. The browser calls the same-origin `/api/lookup` endpoint.

PlateAPI documentation: https://plateapi.com.au/docs/lookup/

## Important

This is a personal-use lookup interface. Check PlateAPI's current plan and terms for your intended deployment/use. The app does not scrape WA DoT or Repco websites. It displays the vehicle information returned by PlateAPI; it is not a substitute for an official registration-status check.