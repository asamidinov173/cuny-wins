# ============================================
# CUNY WINS PORTAL — FLASK BACKEND
# server.py
# ============================================

from flask import Flask, request, jsonify, session
from flask_cors import CORS
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime

app = Flask(__name__)
app.secret_key = "cuny_wins_secret_2026"
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5500", "http://localhost:5500", "http://127.0.0.1:5501", "http://localhost:5501"])

# ============================================
# GOOGLE SHEETS SETUP
# ============================================
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

SHEET_ID = "1V8WC59kCMvYddGUvaGGrYQV0VtWU3AoTTS9xLOn6xUA"

def get_sheet():
    creds  = Credentials.from_service_account_file('credentials.json', scopes=SCOPES)
    client = gspread.authorize(creds)
    return client.open_by_key(SHEET_ID).sheet1

# ============================================
# ALLOWED FACULTY USERS
# ============================================
ALLOWED_USERS = {
    "alikhan@bmcc.cuny.edu":    "Intern2026!",
    "tdaughtry@bmcc.cuny.edu": "Cuny2xTech2026!",
    "tfairley@bmcc.cuny.edu":    "Cuny2xTech2026!"
}

# ============================================
# ROUTES
# ============================================

@app.route('/')
def index():
    return jsonify({"message": "CUNY Wins Server is running!"})

# ============================================
# LOGIN
# ============================================
@app.route('/login', methods=['POST'])
def login():
    data     = request.get_json()
    email    = data.get('email', '').strip()
    password = data.get('password', '').strip()

    if email in ALLOWED_USERS and ALLOWED_USERS[email] == password:
        session['user'] = email
        return jsonify({"success": True, "email": email})
    return jsonify({"success": False, "message": "Invalid email or password"})

# ============================================
# LOGOUT
# ============================================
@app.route('/logout')
def logout():
    session.pop('user', None)
    return jsonify({"success": True})

# ============================================
# CHECK AUTH
# ============================================
@app.route('/check-auth')
def check_auth():
    if 'user' in session:
        return jsonify({"authenticated": True, "email": session['user']})
    return jsonify({"authenticated": False})

# ============================================
# SUBMIT ACHIEVEMENT
# ============================================
@app.route('/submit', methods=['POST'])
def submit():
    try:
        data        = request.get_json()
        name        = data.get('name', '')
        email       = data.get('email', '')
        emplid      = data.get('emplid', '')
        company     = data.get('company', '')
        position    = data.get('position', '')
        start_date  = data.get('startDate', '')
        linkedin    = data.get('linkedin', '')
        achievement = data.get('achievement', '')
        grad_year   = data.get('gradYear', '')
        photo_url   = data.get('photoUrl', '')
        major       = data.get('major', '')
        timestamp   = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        sheet = get_sheet()
        sheet.append_row([
            timestamp, name, email, emplid, company,
            position, start_date, linkedin,
            achievement, grad_year, photo_url, 'Pending', major
        ])

        return jsonify({"success": True, "message": "Achievement submitted!"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

# ============================================
# GET ALL SUBMISSIONS (Dashboard)
# ============================================
@app.route('/submissions', methods=['GET'])
def get_submissions():
    try:
        if 'user' not in session:
            return jsonify({"success": False, "message": "Not authenticated"})

        sheet = get_sheet()
        rows  = sheet.get_all_records()
        return jsonify({"success": True, "submissions": rows})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

# ============================================
# UPDATE STATUS (Approve / Reject)
# ============================================
@app.route('/update-status', methods=['POST'])
def update_status():
    try:
        if 'user' not in session:
            return jsonify({"success": False, "message": "Not authenticated"})

        data       = request.get_json()
        row_index  = data.get('rowIndex')
        new_status = data.get('status')

        sheet = get_sheet()
        sheet.update_cell(row_index, 12, new_status)  # Column L = Status

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

# ============================================
# GET APPROVED CURRENT STUDENTS
# Newest first — limit 3 for homepage
# ============================================
@app.route('/approved', methods=['GET'])
def get_approved():
    try:
        sheet = get_sheet()
        rows  = sheet.get_all_records()

        students = [
            row for row in rows
            if row.get('Status') == 'Approved'
            and row.get('Achievement Type') != 'Full-Time Job'
        ]

        students.reverse()

        limit = request.args.get('limit')
        if limit:
            students = students[:int(limit)]

        return jsonify({"success": True, "students": students})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

# ============================================
# GET APPROVED GRADUATES
# Newest first — limit 3 for homepage
# ============================================
@app.route('/graduates', methods=['GET'])
def get_graduates():
    try:
        sheet = get_sheet()
        rows  = sheet.get_all_records()

        graduates = [
            row for row in rows
            if row.get('Status') == 'Approved'
            and row.get('Achievement Type') == 'Full-Time Job'
        ]

        graduates.reverse()

        limit = request.args.get('limit')
        if limit:
            graduates = graduates[:int(limit)]

        return jsonify({"success": True, "graduates": graduates})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

# ============================================
# GET METRICS
# ============================================
@app.route('/metrics', methods=['GET'])
def get_metrics():
    try:
        sheet = get_sheet()
        rows  = sheet.get_all_records()

        approved = [row for row in rows if row.get('Status') == 'Approved']

        total_students = len(approved)
        companies      = len(set(row.get('Company', '') for row in approved if row.get('Company')))
        majors         = len(set(row.get('Major', '') for row in approved if row.get('Major')))

        return jsonify({
            "success":       True,
            "totalStudents": total_students,
            "companies":     companies,
            "majors":        majors
        })

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

# ============================================
# RUN SERVER
# ============================================
if __name__ == '__main__':
    app.run(debug=True, port=5000)