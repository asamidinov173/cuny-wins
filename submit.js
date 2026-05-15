// ============================================
// SUBMIT FORM — PHOTO UPLOAD
// ============================================
let uploadedFile = null;

// Click to upload — only trigger on upload box click, not form submit
document.getElementById('uploadBox').addEventListener('click', function (e) {
  e.stopPropagation();
  document.getElementById('photoInput').click();
});

// Show filename after selecting
document.getElementById('photoInput').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  uploadedFile = file;
  document.querySelector('.upload-text').innerHTML = '✅ ' + file.name;
  document.querySelector('.upload-hint').textContent = '';
  document.getElementById('uploadBox').style.borderColor = '#22c55e';
});

// ============================================
// FORM SUBMIT
// ============================================
document.getElementById('achievementForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  e.stopPropagation();

  const name     = document.getElementById('nameInput').value.trim();
  const email    = document.getElementById('emailInput').value.trim();
  const emplid   = document.getElementById('emplidInput').value.trim();
  const company  = document.getElementById('companyInput').value.trim();
  const position = document.getElementById('positionInput').value.trim();
  const startDate = document.getElementById('startDateInput').value;
  const linkedin = document.getElementById('linkedinInput').value.trim();
  const gradYear = document.getElementById('gradYearInput').value.trim();
  const achievement = document.querySelector('input[name="achievement"]:checked').value;

  // Simple validation
  if (!name || !email || !emplid || !company || !position || !startDate || !linkedin || !gradYear) {
    alert('Please fill in all required fields.');
    return;
  }

  // Show loading
  const submitBtn = document.querySelector('.btn-submit');
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;

  try {
    const response = await fetch('http://127.0.0.1:5000/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, email, emplid, company, position,
        startDate, linkedin, achievement, gradYear,
        photoUrl: ''
      })
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById('achievementForm').style.display = 'none';
      document.getElementById('successMessage').style.display = 'block';
    } else {
      alert('Error: ' + data.message);
      submitBtn.textContent = 'Submit Achievement';
      submitBtn.disabled = false;
    }

  } catch (err) {
    alert('Could not connect to server. Make sure server.py is running.');
    submitBtn.textContent = 'Submit Achievement';
    submitBtn.disabled = false;
  }
});