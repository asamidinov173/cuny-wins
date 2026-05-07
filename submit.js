// ============================================
// SUBMIT FORM — PHOTO UPLOAD
// ============================================
let uploadedFile = null;

const uploadBox = document.getElementById('uploadBox');

// Click to upload
uploadBox.addEventListener('click', function () {
  document.getElementById('photoInput').click();
});

// Show filename after selecting
document.getElementById('photoInput').addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    if (!validatePhoto(file)) return;
    uploadedFile = file;
    document.querySelector('.upload-text').innerHTML = '✅ ' + file.name;
    document.querySelector('.upload-hint').textContent = '';
    uploadBox.style.borderColor = '#22c55e';
  }
});

// Drag and drop
uploadBox.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadBox.style.borderColor = '#5b5bd6';
  uploadBox.style.background = '#f0f0ff';
});

uploadBox.addEventListener('dragleave', () => {
  uploadBox.style.borderColor = '#ccc';
  uploadBox.style.background = 'white';
});

uploadBox.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    if (!validatePhoto(file)) return;
    uploadedFile = file;
    document.querySelector('.upload-text').innerHTML = '✅ ' + file.name;
    document.querySelector('.upload-hint').textContent = '';
    uploadBox.style.borderColor = '#22c55e';
    uploadBox.style.background = 'white';
  }
});

// Validate photo
function validatePhoto(file) {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    showUploadError('Only PNG and JPG files are allowed.');
    return false;
  }
  if (file.size > maxSize) {
    showUploadError('File size must be under 5MB.');
    return false;
  }
  return true;
}

function showUploadError(msg) {
  document.querySelector('.upload-text').innerHTML = '❌ ' + msg;
  document.querySelector('.upload-hint').textContent = '';
  uploadBox.style.borderColor = '#ef4444';
}

// ============================================
// FORM VALIDATION
// ============================================
document.getElementById('achievementForm').addEventListener('submit', function (e) {
  e.preventDefault();
  clearErrors();

  let isValid = true;

  // Photo
  if (!uploadedFile) {
    showFieldError('photoError', 'Please upload a photo.');
    uploadBox.style.borderColor = '#ef4444';
    isValid = false;
  }

  // Name
  const name = document.getElementById('nameInput').value.trim();
  if (!name) {
    showFieldError('nameError', 'Please enter your full name.');
    isValid = false;
  }

  // Email
  const email = document.getElementById('emailInput').value.trim();
  if (!email) {
    showFieldError('emailError', 'Please enter your email.');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showFieldError('emailError', 'Please enter a valid email address.');
    isValid = false;
  }

  // EMPLID
  const emplid = document.getElementById('emplidInput').value.trim();
  if (!emplid) {
    showFieldError('emplidError', 'Please enter your Student ID.');
    isValid = false;
  } else if (!/^\d+$/.test(emplid)) {
    showFieldError('emplidError', 'Student ID must contain numbers only.');
    isValid = false;
  }

  // Company
  const company = document.getElementById('companyInput').value.trim();
  if (!company) {
    showFieldError('companyError', 'Please enter the company name.');
    isValid = false;
  }

  // Position
  const position = document.getElementById('positionInput').value.trim();
  if (!position) {
    showFieldError('positionError', 'Please enter your position.');
    isValid = false;
  }

  // Start Date
  const startDate = document.getElementById('startDateInput').value;
  if (!startDate) {
    showFieldError('startDateError', 'Please select a start date.');
    isValid = false;
  }

  // LinkedIn
  const linkedin = document.getElementById('linkedinInput').value.trim();
  if (!linkedin) {
    showFieldError('linkedinError', 'Please enter your LinkedIn URL.');
    isValid = false;
  } else if (!linkedin.includes('linkedin.com')) {
    showFieldError('linkedinError', 'Please enter a valid LinkedIn URL.');
    isValid = false;
  }

  // Graduation Year
  const gradYear = document.getElementById('gradYearInput').value.trim();
  if (!gradYear) {
    showFieldError('gradYearError', 'Please enter your graduation year.');
    isValid = false;
  }

  // If all valid — show success
  if (isValid) {
    showSuccess();
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================
function showFieldError(id, message) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
  }
}

function clearErrors() {
  const errors = document.querySelectorAll('.field-error');
  errors.forEach(e => {
    e.textContent = '';
    e.style.display = 'none';
  });
  uploadBox.style.borderColor = '#ccc';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showSuccess() {
  document.getElementById('achievementForm').style.display = 'none';
  document.getElementById('successMessage').style.display = 'block';
}