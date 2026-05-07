// ============================================
// LOGIN PAGE
// ============================================

// Temporary allowed users — will move to server.py in Phase 4
const ALLOWED_USERS = {
    "alikhan@bmcc.cuny.edu": "Bmcc2026!",
    "supervisor@bmcc.cuny.edu": "Bmcc2026!"
  };
  
  // Toggle password visibility
  function togglePassword() {
    const input = document.getElementById('passwordInput');
    input.type = input.type === 'password' ? 'text' : 'password';
  }
  
  // Handle login
  function handleLogin() {
    const email    = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();
    const errorMsg = document.getElementById('errorMsg');
  
    // Empty field check
    if (!email || !password) {
      errorMsg.style.display = 'block';
      errorMsg.textContent = 'Please enter both email and password.';
      return;
    }
  
    // Check credentials
    if (ALLOWED_USERS[email] && ALLOWED_USERS[email] === password) {
      window.location.href = 'dashboard.html';
    } else {
      errorMsg.style.display = 'block';
      errorMsg.textContent = 'Invalid email or password. Please try again.';
    }
  }
  
  // Press Enter to login
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleLogin();
  });