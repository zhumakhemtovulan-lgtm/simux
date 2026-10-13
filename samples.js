# SIMUX — AI Case Championship Simulator (MVP v1.0)

SIMUX helps students prepare for business case championships:
**generate a realistic case → solve it under time pressure → get AI jury feedback → defend it in Q&A → track progress.**

Built for the Technopreneurship course (MNU ISE, Fall 2026/27) from survey research with 65 students
(main pains: time pressure, information overload, no quality feedback).

## Features
| Feature | Problem it solves |
|---|---|
| AI case generator (12 industries × 7 case types × 3 levels, Kazakhstan context, exhibits with noise and missing data) | Lack of realistic practice |
| Countdown timer (15–60 min) with overtime | Working under time pressure |
| Guided 5-step workspace (problem → structure → analysis → recommendation → risks) | Structuring the case, filtering information |
| AI coach — 3 Socratic hints per case (never gives the answer) | Getting stuck, lack of experience |
| AI jury — 0–100 score on 5 criteria, strengths, fixes, missed insights, model solution | No quality feedback |
| Jury Q&A simulation — 3 tough questions, answers rated | Presentation / Q&A anxiety |
| Progress dashboard — score trend, skills by criterion, weakest skill, history, data export | Tracking progress |
| 2 hand-written sample cases with answer keys | Works for demos even if AI is slow |

## Tech
- Frontend: plain HTML/CSS/JavaScript (no build step), data stored in the browser (localStorage)
- Backend: one Vercel serverless function `api/ai.js`
- AI: Google Gemini API (free tier; auto-fallback across `gemini-2.5-flash`, `gemini-flash-latest`, `gemini-2.5-flash-lite`…)
- Hosting: Vercel (free Hobby plan) + Vercel Web Analytics

## Deploy (free, ~15 minutes)
1. **Gemini key:** go to https://aistudio.google.com/apikey → sign in with Google → *Create API key* → copy it.
2. **GitHub:** create an account at https://github.com → *New repository* → name `simux`, Public → *Create*.
   On the repo page click *uploading an existing file* and drag in **all files and the `api` folder** from this project
   (`index.html`, `app.js`, `samples.js`, `styles.css`, `package.json`, `vercel.json`, `README.md`, `api/ai.js`) → *Commit changes*.
3. **Vercel:** go to https://vercel.com → *Sign up with GitHub* → *Add New… → Project* → import `simux`.
   Before clicking Deploy open *Environment Variables* and add: Name `GEMINI_API_KEY`, Value = your key → *Deploy*.
4. Open the link (e.g. `https://simux.vercel.app`) → *Practice* → *Generate case*. Done.
5. Optional: Vercel project → *Analytics* → *Enable* (free visitor stats for the course report).
6. Optional: put your Google Form feedback link into `CONFIG.feedbackUrl` at the top of `app.js` (edit the file on GitHub — Vercel redeploys automatically).

If you add the key after deploying: Vercel → Settings → Environment Variables → add → *Deployments → … → Redeploy*.

## AI contribution statement
- **AI-generated:** the application code was written with Claude (Anthropic) following the team's product
  specification; in-app content (cases, hints, feedback) is generated at runtime by Google Gemini.
- **Team-built:** problem discovery and survey (65 responses), product concept, feature priorities from survey insights,
  sample cases review, deployment, user testing and feedback analysis.
- **Verification:** the team tested every flow (case generation, hints, evaluation, Q&A, dashboard) on desktop and mobile,
  checked sample case calculations by hand, and compared AI jury scores across strong vs weak test answers.
- **Responsible AI:** all generated companies are fictional; the UI warns that AI may make mistakes; no accounts or
  personal data are collected; history stays in the user's browser.
