# Netlify Contact Form - Final

Form `contact` is configured for Netlify Forms and submits URL-encoded data to `/`.

Important:
- Netlify's spam filter (Akismet) can classify valid-looking submissions as spam. There is no HTML/JS flag that can force a submission to Verified.
- The honeypot field is empty for normal users and is positioned off-screen instead of using `display:none`.
- If legitimate submissions continue to land in Spam, enable Netlify reCAPTCHA 2 for this form in the Netlify dashboard and redeploy. This adds a stronger anti-bot signal.
- After deployment, verify that `contact` appears under Forms and configure Form submission notifications to `ridscool9@gmail.com`.
