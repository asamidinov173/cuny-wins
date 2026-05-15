// ============================================
// LOGIN PAGE
// ============================================

const API = 'http://127.0.0.1:5000';

// Toggle password visibility
function togglePassword() {
  const input = document.getElementById('passwordInput');
  input.type = input.type === 'password' ? 'text' : 'password';
}

// Handle login
async function handleLogin() {
  const email    = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();
  const errorMsg = document.getElementById('errorMsg');

  // Empty field check
  if (!email || !password) {
    errorMsg.style.display = 'block';
    errorMsg.textContent   = 'Please enter both email and password.';
    return;
  }

  try {
    const res  = await fetch(`${API}/login`, {
      method:      'POST',
      headers:     { 'Content-Type': 'application/json' },
      credentials: 'include',
      body:        JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
      window.location.href = 'dashboard.html';
    } else {
      errorMsg.style.display = 'block';
      errorMsg.textContent   = 'Invalid email or password. Please try again.';
    }

  } catch (err) {
    errorMsg.style.display = 'block';
    errorMsg.textContent   = 'Could not connect to server. Make sure it is running.';
  }
}

// Press Enter to login
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') handleLogin();
});