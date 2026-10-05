# AGENTS GUIDELINES FOR S-BUILD WEB

## 1. PROJECT IDENTIFICATION & DEPLOYMENT TARGET
- **Project Name**: `sbuild-web`
- **Vercel Project**: `fitallests-projects/sbuild-web`
- **Vercel Project ID**: `prj_KVG3aJg5DBofO4o4XAaPTMOXc7UV` (configured in `.vercel/project.json`)
- **Production URL**: https://sbuild-web-pi.vercel.app/
- **GitHub Repository**: `fitallesttryhard/WEB`

## 2. CRITICAL DEPLOYMENT RULES (MUST FOLLOW - ZERO EXCEPTIONS)
1. **NEVER RELY ONLY ON `git push` FOR DEPLOYMENT**:
   - The GitHub repository `WEB` does NOT auto-deploy to Vercel via webhook for this project.
   - Simply running `git push` does NOT deploy the site and will cause the user to see outdated code.

2. **MANDATORY DEPLOY COMMAND**:
   - Whenever the user asks to deploy, update production, or "đẩy lên web / đẩy lên vercel / đẩy lên https://sbuild-web-pi.vercel.app/":
   - **YOU MUST ALWAYS RUN**:
     ```powershell
     npx vercel --prod --yes
     ```
     (or `npm run deploy`)
   - Do NOT create a new project or change `.vercel/project.json`.
   - Always verify the output log shows:
     - `Deploying sbuild-web`
     - `Inspect https://vercel.com/fitallests-projects/sbuild-web/...`
     - `Aliased https://sbuild-web-pi.vercel.app`
     - Status: `READY`
