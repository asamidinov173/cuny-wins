// ============================================
// DASHBOARD — FILTER TABLE
// ============================================
function filterTable(status, btn) {
    const rows = document.querySelectorAll('tbody tr');
    const buttons = document.querySelectorAll('.filter-btn');
  
    // Update active button
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  
    // Show/hide rows
    rows.forEach(row => {
      if (status === 'all' || row.dataset.status === status) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }
  
  // ============================================
  // APPROVE A ROW
  // ============================================
  function approveRow(btn) {
    const confirmed = confirm('Are you sure you want to approve this submission?');
    if (!confirmed) return;
  
    const row = btn.closest('tr');
    row.dataset.status = 'approved';
    row.querySelector('.badge-pending, .badge-rejected').className = 'badge-approved';
    row.querySelector('.badge-approved').textContent = 'Approved';
    row.querySelector('td:last-child').innerHTML = '<span class="text-muted">–</span>';
    updateCounts();
  }
  
  // ============================================
  // REJECT A ROW
  // ============================================
  function rejectRow(btn) {
    const confirmed = confirm('Are you sure you want to reject this submission?');
    if (!confirmed) return;
  
    const row = btn.closest('tr');
    row.dataset.status = 'rejected';
    row.querySelector('.badge-pending, .badge-approved').className = 'badge-rejected';
    row.querySelector('.badge-rejected').textContent = 'Rejected';
    row.querySelector('td:last-child').innerHTML = '<span class="text-muted">–</span>';
    updateCounts();
  }
  
  // ============================================
  // UPDATE STAT COUNTS
  // ============================================
  function updateCounts() {
    const rows = document.querySelectorAll('tbody tr');
    let total    = rows.length;
    let pending  = 0;
    let approved = 0;
    let rejected = 0;
  
    rows.forEach(row => {
      if (row.dataset.status === 'pending')  pending++;
      if (row.dataset.status === 'approved') approved++;
      if (row.dataset.status === 'rejected') rejected++;
    });
  
    document.getElementById('totalCount').textContent    = total;
    document.getElementById('pendingCount').textContent  = pending;
    document.getElementById('approvedCount').textContent = approved;
    document.getElementById('rejectedCount').textContent = rejected;
  
    // Update filter tab labels
    const btns = document.querySelectorAll('.filter-btn');
    btns[0].textContent = `All (${total})`;
    btns[1].textContent = `Pending (${pending})`;
    btns[2].textContent = `Approved (${approved})`;
    btns[3].textContent = `Rejected (${rejected})`;
  }
  
  // ============================================
  // DOWNLOAD CSV
  // ============================================
  function downloadCSV() {
    const rows = document.querySelectorAll('tbody tr');
    let csv = 'Student Name,Company,Position,Start Date,LinkedIn,Status\n';
  
    rows.forEach(row => {
      if (row.style.display !== 'none') {
        const cells      = row.querySelectorAll('td');
        const name       = cells[1].innerText.trim();
        const company    = cells[2].innerText.trim();
        const position   = cells[3].innerText.trim();
        const startDate  = cells[4].innerText.trim();
        const linkedin   = cells[5].querySelector('a') ? cells[5].querySelector('a').href : '';
        const status     = cells[6].innerText.trim();
        csv += `"${name}","${company}","${position}","${startDate}","${linkedin}","${status}"\n`;
      }
    });
  
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'student_submissions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }