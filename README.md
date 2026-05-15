# CUNY 2X Tech — BMCC Achievement Portal

A full-stack student achievement portal for BMCC students from all majors to submit and showcase their internships, jobs, and career accomplishments.

Built by Alikhan Samidinov — Software Development Specialist Intern, CUNY 2X Tech (Spring 2026)

---

## What This Project Does

Students submit their career achievements through a form. Faculty reviews and approves submissions through a private dashboard. Approved students appear as cards on the public portal automatically.

---

## Tech Stack

- Frontend: HTML, CSS, JavaScript, Bootstrap 5
- Backend: Python, Flask
- Database: Google Sheets (via Google Sheets API)
- Deployment: Vercel (frontend) + Render (backend)

---

## File Structure

    bmcc-achievement-portal/
    ├── index.html          → public portal homepage
    ├── students.html       → all students and graduates with pagination
    ├── submit.html         → student achievement submission form
    ├── dashboard.html      → faculty approval dashboard
    ├── login.html          → faculty login page
    ├── app.js              → frontend JavaScript for index + cards
    ├── dashboard.js        → dashboard logic
    ├── login.js            → login logic
    ├── submit.js           → form submission logic
    ├── style.css           → main styles
    ├── dashboard.css       → dashboard styles
    ├── login.css           → login styles
    ├── submit.css          → form styles
    ├── server.py           → Flask backend
    ├── requirements.txt    → Python dependencies
    ├── Procfile            → Render deployment config
    ├── credentials.json    → Google API key (NEVER commit this)
    └── README.md           → this file

---

## How to Run Locally

1. Clone the repo
2. Add `credentials.json` to the project root (get from TeLisa or Google Cloud Console)
3. Install dependencies:

```bash
pip3 install -r requirements.txt
```

4. Start the backend:

```bash
python3 server.py
```

5. Open `index.html` with Live Server in VS Code or Cursor

---

## Google Sheets Setup

The project uses Google Sheets as the database. Sheet ID is hardcoded in `server.py`.

Column headers in row 1 must be exactly:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Name | Email | EMPLID | Company | Position | Start Date | LinkedIn | Achievement Type | Graduation Year | Photo URL | Status | Major |

---

## Faculty Login

Login credentials are hardcoded in `server.py` under `ALLOWED_USERS`. To add a new faculty account just add their email and password to that dictionary.

---

## Photo Uploads

Currently photos use an initials avatar fallback via ui-avatars.com. To enable real photo uploads integrate Cloudinary:

1. Create a Cloudinary account under a department email
2. Add `CLOUDINARY_URL` to environment variables
3. Update `submit.js` to upload to Cloudinary and save the returned URL
4. Update `server.py` to store the URL in the Photo URL column

---

## Deployment

- Frontend deployed on Vercel
- Backend deployed on Render
- After any backend change restart the Render service
- After any frontend change push to GitHub — Vercel auto-deploys

---

## For the Next Intern

- Never commit `credentials.json` to GitHub — it contains secret API keys
- To add a new faculty login edit `ALLOWED_USERS` in `server.py`
- To change the Google Sheet update `SHEET_ID` in `server.py`
- The Render free tier sleeps after 15 minutes — first request may be slow
- Cloudinary setup is the next priority for real photo uploads
- Consider adding a Major dropdown to the submit form for the Majors Represented metric

---

## Contact

Built during CUNY 2X Tech internship Spring 2026.
For questions contact TeLisa Daughry at CUNY 2X Tech.