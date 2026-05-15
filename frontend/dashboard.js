const API = 'https://cuny2xtech-platform.onrender.com';

// ============================================
// LOAD SUBMISSIONS FROM GOOGLE SHEETS
// ============================================
async function loadSubmissions() {
  try {
    const res  = await fetch(`${API}/submissions`, {
      credentials: 'include'
    });
    const data = await res.json();

    if (!data.success) {
      console.error('Failed to load submissions:', data.message);
      return;
    }

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    data.submissions.forEach((row, i) => {
      const status     = row['Status'] || 'Pending';
      const badgeClass = status === 'Approved' ? 'badge-approved'
                       : status === 'Rejected' ? 'badge-rejected'
                       : 'badge-pending';

      const actions = (status === 'Pending')
        ? `<div class="d-flex gap-2">
             <button class="btn-approve" onclick="updateStatus(${i + 2}, 'Approved', this)">Approve</button>
             <button class="btn-reject"  onclick="updateStatus(${i + 2}, 'Rejected', this)">Reject</button>
           </div>`
        : `<span class="text-muted">–</span>`;

      tbody.innerHTML += `
        <tr data-status="${status.toLowerCase()}" data-row="${i + 2}">
          <td><img src="https://ui-avatars.com/api/?name=${encodeURIComponent(row['Name'] || 'S')}&background=4444cc&color=fff&size=36" class="table-photo"></td>
          <td>${row['Name']       || '–'}</td>
          <td>${row['Company']    || '–'}</td>
          <td>${row['Position']   || '–'}</td>
          <td>${row['Start Date'] || '–'}</td>
          <td><a href="${row['LinkedIn'] || '#'}" target="_blank" class="table-link">View Profile</a></td>
          <td><span class="${badgeClass}">${status}</span></td>
          <td>${actions}</td>
        </tr>`;
    });

    updateCounts();

  } catch (err) {
    console.error('Could not connect to server:', err);
  }
}

// ============================================
// UPDATE STATUS — APPROVE OR REJECT
// ============================================
async function updateStatus(rowIndex, status, btn) {
  const confirmed = confirm(`Are you sure you want to ${status.toLowerCase()} this submission?`);
  if (!confirmed) return;

  try {
    const res  = await fetch(`${API}/update-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ rowIndex, status })
    });
    const data = await res.json();

    if (data.success) {
      loadSubmissions();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (err) {
    alert('Could not connect to server.');
  }
}

// ============================================
// FILTER TABLE
// ============================================
function filterTable(status, btn) {
  const rows    = document.querySelectorAll('tbody tr');
  const buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  rows.forEach(row => {
    row.style.display = (status === 'all' || row.dataset.status === status) ? '' : 'none';
  });
}

// ============================================
// UPDATE STAT COUNTS
// ============================================
function updateCounts() {
  const rows = document.querySelectorAll('tbody tr');
  let total = 0, pending = 0, approved = 0, rejected = 0;

  rows.forEach(row => {
    total++;
    if (row.dataset.status === 'pending')  pending++;
    if (row.dataset.status === 'approved') approved++;
    if (row.dataset.status === 'rejected') rejected++;
  });

  document.getElementById('totalCount').textContent    = total;
  document.getElementById('pendingCount').textContent  = pending;
  document.getElementById('approvedCount').textContent = approved;
  document.getElementById('rejectedCount').textContent = rejected;

  const btns = document.querySelectorAll('.filter-btn');
  if (btns[0]) btns[0].textContent = `All (${total})`;
  if (btns[1]) btns[1].textContent = `Pending (${pending})`;
  if (btns[2]) btns[2].textContent = `Approved (${approved})`;
  if (btns[3]) btns[3].textContent = `Rejected (${rejected})`;
}

// ============================================
// DOWNLOAD CSV
// ============================================
function downloadCSV() {
  const rows = document.querySelectorAll('tbody tr');
  let csv = 'Student Name,Company,Position,Start Date,LinkedIn,Status\n';

  rows.forEach(row => {
    if (row.style.display !== 'none') {
      const cells     = row.querySelectorAll('td');
      const name      = cells[1]?.innerText.trim();
      const company   = cells[2]?.innerText.trim();
      const position  = cells[3]?.innerText.trim();
      const startDate = cells[4]?.innerText.trim();
      const linkedin  = cells[5]?.querySelector('a')?.href || '';
      const status    = cells[6]?.innerText.trim();
      csv += `"${name}","${company}","${position}","${startDate}","${linkedin}","${status}"\n`;
    }
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'submissions.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', loadSubmissions);