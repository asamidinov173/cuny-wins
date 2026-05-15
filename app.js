const API = 'http://127.0.0.1:5000';

// ============================================
// SCROLL REVEAL
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================
// ANIMATED NUMBER COUNTER
// ============================================
function animateCounter(el, target, duration = 1400) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.metric-number[data-target]').forEach(el => counterObserver.observe(el));

// ============================================
// NAVBAR — shadow on scroll
// ============================================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNavbar');
  if (!nav) return;
  nav.style.boxShadow = window.scrollY > 40
    ? '0 4px 24px rgba(37,99,235,0.3)'
    : 'none';
}, { passive: true });

// ============================================
// BUILD CARD HTML — shared by index + students
// ============================================
function buildStudentCard(student, isGraduate = false) {
  const name     = student['Name']             || 'Student';
  const company  = student['Company']          || '–';
  const position = student['Position']         || '–';
  const date     = student['Start Date']       || '–';
  const linkedin = student['LinkedIn']         || '#';
  const type     = student['Achievement Type'] || (isGraduate ? 'Full-Time Job' : 'Internship');

  const cardClass  = isGraduate ? 'graduate-card' : 'student-card';
  const topClass   = isGraduate ? 'grad-card-top'  : 'card-top';
  const badgeClass = isGraduate ? 'badge-graduate'  : 'badge-student';
  const badgeText  = isGraduate ? '🎓 Graduate'     : '💼 Current Student';
  const boxClass   = isGraduate ? 'opportunity-box-grad' : 'opportunity-box';
  const infoClass  = isGraduate ? 'card-info-grad'  : 'card-info-student';
  const iconColor  = isGraduate ? '#7c3aed'          : '#4444cc';
  const btnClass   = isGraduate ? 'btn-grad'         : 'btn btn-primary';
  const bgColor    = isGraduate ? '7c3aed'           : '4444cc';
  const avatar     = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=fff&size=130`;

  return `
    <div class="col-md-4">
      <div class="${cardClass}">
        <div class="${topClass}">
          <img src="${avatar}" alt="${name}" class="student-photo">
        </div>
        <div class="card-bottom">
          <h5 class="fw-bold">${name}</h5>
          <span class="${badgeClass}">${badgeText}</span>
          <div class="${boxClass} mt-3">
            <div class="d-flex align-items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="${iconColor}" viewBox="0 0 16 16">
                <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702z"/>
                <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z"/>
              </svg>
              <small style="font-size:11px;letter-spacing:0.5px;font-weight:700;color:${iconColor};">${type.toUpperCase()}</small>
            </div>
            <p class="fw-bold mb-0">${position}</p>
          </div>
          <div class="card-info-row ${infoClass} mt-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="${iconColor}" viewBox="0 0 16 16">
              <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z"/>
            </svg>
            <span>${company}</span>
          </div>
          <div class="card-info-row ${infoClass} mt-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="${iconColor}" viewBox="0 0 16 16">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
            </svg>
            <span>${date}</span>
          </div>
          <a href="${linkedin}" target="_blank" class="${btnClass} w-100">Connect on LinkedIn</a>
        </div>
      </div>
    </div>`;
}

// ============================================
// LOAD APPROVED CURRENT STUDENTS — homepage
// limit=3 shows only 3 newest
// ============================================
async function loadApprovedStudents() {
  try {
    const res  = await fetch(`${API}/approved?limit=3`);
    const data = await res.json();
    if (!data.success || !data.students.length) return;

    const grid = document.getElementById('studentsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    data.students.forEach(s => { grid.innerHTML += buildStudentCard(s, false); });

  } catch (err) {
    console.error('Could not load students:', err);
  }
}

// ============================================
// LOAD APPROVED GRADUATES — homepage
// limit=3 shows only 3 newest
// ============================================
async function loadGraduates() {
  try {
    const res  = await fetch(`${API}/graduates?limit=3`);
    const data = await res.json();
    if (!data.success || !data.graduates.length) return;

    const grid = document.getElementById('graduatesGrid');
    if (!grid) return;

    grid.innerHTML = '';
    data.graduates.forEach(g => { grid.innerHTML += buildStudentCard(g, true); });

  } catch (err) {
    console.error('Could not load graduates:', err);
  }
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  loadApprovedStudents();
  loadGraduates();
});