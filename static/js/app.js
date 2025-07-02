// app.js - Handles API calls and navigation for Fundi Dashboard
// Expand with job management, profile, and earnings logic

// Example: Fetch jobs for dashboard
async function fetchJobs() {
    const res = await fetch('/api/jobs');
    if (res.ok) {
        const jobs = await res.json();
        // Render jobs to DOM (implement as needed)
        console.log(jobs);
    }
}

// Call fetchJobs on page load (if needed)
// fetchJobs(); 

// --- Auth & Profile Logic ---
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const authContainer = document.getElementById('auth-container');
const profileSection = document.getElementById('profile-section');
const dashboardSection = document.getElementById('dashboard-section');
const logoutBtn = document.getElementById('logout-btn');

function showSection(section) {
  authContainer.classList.add('hidden');
  profileSection.classList.add('hidden');
  dashboardSection.classList.add('hidden');
  section.classList.remove('hidden');
}

showRegister?.addEventListener('click', e => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
});
showLogin?.addEventListener('click', e => {
  e.preventDefault();
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
});

// --- Login Page Logic ---
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.classList.add('hidden');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password, role })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('loggedIn', 'true');
      window.location.href = data.redirect || '/dashboard';
    } else {
      errorDiv.textContent = data.error || 'Login failed';
      errorDiv.classList.remove('hidden');
    }
  });
}

// --- Register Page Logic ---
if (registerForm) {
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    const errorDiv = document.getElementById('register-error');
    errorDiv.classList.add('hidden');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, password, role })
    });
    const data = await res.json();
    if (res.ok) {
      // Auto-login after register
      const loginRes = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, role })
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = loginData.redirect || '/dashboard';
      } else {
        errorDiv.textContent = 'Registration succeeded, but login failed. Please log in manually.';
        errorDiv.classList.remove('hidden');
      }
    } else {
      errorDiv.textContent = data.error || 'Registration failed';
      errorDiv.classList.remove('hidden');
    }
  });
}

// --- Dashboard Page Logic ---
const dashboardUsername = document.getElementById('dashboard-username');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    localStorage.removeItem('loggedIn');
    window.location.href = '/login';
  });
}

if (window.location.pathname === '/dashboard') {
  fetchEarningsAndRender();
  fetchJobsAndRender();
  fetchDashboardProfile();
  fetchPotentialJobs();
  fetchActiveJob();
}

async function fetchProfile() {
  const res = await fetch('/api/profile');
  if (res.status === 401) {
    localStorage.removeItem('loggedIn');
    showSection(authContainer);
    return;
  }
  if (res.ok) {
    const data = await res.json();
    document.getElementById('profile-name').value = data.name || '';
    document.getElementById('profile-phone').value = data.phone || '';
    document.getElementById('profile-email').value = data.email || '';
    document.getElementById('profile-location').value = data.location || '';
    document.getElementById('profile-service').value = data.service || '';
  }
}

document.getElementById('profile-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('profile-name').value;
  const email = document.getElementById('profile-email').value;
  const location = document.getElementById('profile-location').value;
  const service = document.getElementById('profile-service').value;
  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, location, service })
  });
  const msgDiv = document.getElementById('profile-success');
  if (res.ok) {
    msgDiv.textContent = 'Profile updated!';
    msgDiv.classList.remove('hidden');
    setTimeout(() => msgDiv.classList.add('hidden'), 2000);
  }
});

// On page load, show correct section
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('loggedIn') === 'true') {
    showSection(profileSection);
    fetchProfile();
  } else {
    showSection(authContainer);
  }
});

let pendingJobCount = 0;

// Profile Edit Modal logic
const profileModal = document.getElementById('profile-modal');
const editProfileLink = document.getElementById('edit-profile-link');
const closeProfileModal = document.getElementById('close-profile-modal');
const profileEditForm = document.getElementById('profile-edit-form');
const profileEditSuccess = document.getElementById('profile-edit-success');

if (editProfileLink) {
  editProfileLink.onclick = e => {
    e.preventDefault();
    profileModal.classList.remove('hidden');
    // Pre-fill form with current profile data
    fetch('/api/profile').then(res => res.json()).then(data => {
      document.getElementById('edit-name').value = data.name || '';
      document.getElementById('edit-service').value = data.service || '';
      document.getElementById('edit-location').value = data.location || '';
      document.getElementById('edit-email').value = data.email || '';
    });
  };
}
if (closeProfileModal) {
  closeProfileModal.onclick = () => {
    profileModal.classList.add('hidden');
    profileEditSuccess.classList.add('hidden');
  };
}
if (profileEditForm) {
  profileEditForm.onsubmit = async e => {
    e.preventDefault();
    const name = document.getElementById('edit-name').value;
    const service = document.getElementById('edit-service').value;
    const location = document.getElementById('edit-location').value;
    const email = document.getElementById('edit-email').value;
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, service, location, email })
    });
    if (res.ok) {
      profileEditSuccess.classList.remove('hidden');
      setTimeout(() => {
        profileEditSuccess.classList.add('hidden');
        profileModal.classList.add('hidden');
        fetchDashboardProfile();
      }, 1200);
    }
  };
}

// Job Filters logic
const jobFilterButtons = document.querySelectorAll('.job-filter');
let currentJobFilter = 'all';
if (jobFilterButtons.length) {
  jobFilterButtons.forEach(btn => {
    btn.onclick = () => {
      currentJobFilter = btn.getAttribute('data-status');
      jobFilterButtons.forEach(b => b.classList.remove('btn-primary'));
      btn.classList.add('btn-primary');
      fetchJobsAndRender();
    };
  });
}

// Visual Earnings Bar logic
async function fetchEarningsAndRender() {
  const res = await fetch('/api/earnings');
  if (res.ok) {
    const data = await res.json();
    document.getElementById('earnings-today').textContent = `Ksh ${data.today}`;
    document.getElementById('earnings-week').textContent = `Ksh ${data.week}`;
    document.getElementById('earnings-total').textContent = `Ksh ${data.total}`;
    // Visual bar
    const max = Math.max(data.today, data.week, data.total, 1);
    document.getElementById('earnings-bar-today').style.width = `${(data.today/max)*100/3}%`;
    document.getElementById('earnings-bar-week').style.width = `${(data.week/max)*100/3}%`;
    document.getElementById('earnings-bar-total').style.width = `${(data.total/max)*100/3}%`;
  }
}

// Potential Jobs logic
async function fetchPotentialJobs() {
  const res = await fetch('/api/potential-jobs');
  const list = document.getElementById('potential-jobs-list');
  list.innerHTML = '';
  if (res.ok) {
    const jobs = await res.json();
    if (!jobs.length) {
      list.innerHTML = '<div style="color:#888;text-align:center;">No potential jobs at the moment.</div>';
      return;
    }
    jobs.forEach(job => {
      const card = document.createElement('div');
      card.className = 'job-card';
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-weight:bold;font-size:1.1rem;">${job.title}</span>
          <span style="font-size:0.85rem;padding:2px 8px;border-radius:8px;background:#fef9c3;color:#b45309;">Potential</span>
        </div>
        <div style="font-size:0.97rem;color:#444;margin-bottom:2px;">👤 ${job.customer}</div>
        <div style="font-size:0.97rem;color:#444;margin-bottom:2px;">📅 ${job.date}</div>
        <div style="font-size:0.97rem;color:#444;margin-bottom:2px;">📍 ${job.location}</div>
        <div style="font-size:1rem;color:#22c55e;font-weight:bold;margin-bottom:6px;">Ksh ${job.amount}</div>
        <button class="btn btn-success" onclick="acceptPotentialJob(${job.id})">Accept Job</button>
      `;
      list.appendChild(card);
    });
  }
}
window.acceptPotentialJob = async function(jobId) {
  await fetch(`/api/jobs/${jobId}/accept`, { method: 'POST' });
  fetchPotentialJobs();
  fetchJobsAndRender();
  fetchActiveJob();
};

// Update fetchJobsAndRender to filter jobs
async function fetchJobsAndRender() {
  const res = await fetch('/api/jobs');
  if (res.status === 401) {
    localStorage.removeItem('loggedIn');
    showSection(authContainer);
    return;
  }
  const jobsList = document.getElementById('jobs-list');
  jobsList.innerHTML = '';
  pendingJobCount = 0;
  if (res.ok) {
    let jobs = await res.json();
    if (currentJobFilter !== 'all') {
      jobs = jobs.filter(j => j.status === currentJobFilter);
    }
    // Show reminder if there are pending jobs
    if (jobs.some(j => j.status === 'pending')) {
      const reminder = document.createElement('div');
      reminder.className = 'empty-state';
      reminder.innerHTML = '<h3>Pending Jobs</h3><p>You have jobs waiting for your action. Accept or decline them below.</p>';
      jobsList.appendChild(reminder);
    }
    if (jobs.length === 0) {
      jobsList.innerHTML = '<div class="text-center" style="color:#888;">No jobs for this filter.</div>';
      updateJobNotification(0);
      return;
    }
    jobs.forEach(job => {
      if (job.status === 'pending') pendingJobCount++;
      const card = document.createElement('div');
      card.className = 'job-card';
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-weight:bold;font-size:1.1rem;">${job.title}</span>
          <span style="font-size:0.85rem;padding:2px 8px;border-radius:8px;${statusColor(job.status)}">${job.status.replace('_', ' ').toUpperCase()}</span>
        </div>
        <div style="font-size:0.97rem;color:#444;margin-bottom:2px;">👤 ${job.customer}</div>
        <div style="font-size:0.97rem;color:#444;margin-bottom:2px;">📅 ${job.date}</div>
        <div style="font-size:0.97rem;color:#444;margin-bottom:2px;">📍 ${job.location}</div>
        <div style="font-size:1rem;color:#22c55e;font-weight:bold;margin-bottom:6px;">Ksh ${job.amount}</div>
        <div style="display:flex;gap:8px;">
          ${renderJobActions(job)}
        </div>
      `;
      jobsList.appendChild(card);
      // Attach event listeners for actions
      if (job.status === 'pending') {
        card.querySelector('.accept-btn').onclick = () => handleJobAction(job.id, 'accept');
        card.querySelector('.decline-btn').onclick = () => handleJobAction(job.id, 'decline');
      } else if (job.status === 'in_progress') {
        card.querySelector('.complete-btn').onclick = () => handleJobAction(job.id, 'complete');
      } else if (job.status === 'completed') {
        card.querySelector('.pay-btn').onclick = () => handlePay(job.id);
      }
    });
    updateJobNotification(pendingJobCount);
  } else {
    jobsList.innerHTML = '<div class="text-center" style="color:#d00;">Failed to load jobs.</div>';
    updateJobNotification(0);
  }
}

// On dashboard load, fetch potential jobs
if (window.location.pathname === '/dashboard') {
  fetchPotentialJobs();
}

function statusColor(status) {
  switch (status) {
    case 'in_progress': return 'background:#dbeafe;color:#2563eb;';
    case 'scheduled': return 'background:#ede9fe;color:#7c3aed;';
    case 'pending': return 'background:#fef9c3;color:#b45309;';
    case 'completed': return 'background:#dcfce7;color:#15803d;';
    case 'declined': return 'background:#f3f4f6;color:#6b7280;';
    case 'paid': return 'background:#f0fdf4;color:#22c55e;';
    default: return 'background:#f1f5f9;color:#334155;';
  }
}

function renderJobActions(job) {
  if (job.status === 'pending') {
    return `
      <button class="accept-btn btn btn-success">Accept</button>
      <button class="decline-btn btn btn-secondary">Decline</button>
    `;
  } else if (job.status === 'in_progress') {
    return `<button class="complete-btn btn btn-primary">Complete</button>`;
  } else if (job.status === 'completed') {
    return `<button class="pay-btn btn btn-warning">Mark as Paid</button>`;
  } else {
    return '';
  }
}

async function handleJobAction(jobId, action) {
  let endpoint = '';
  if (action === 'accept') endpoint = `/api/jobs/${jobId}/accept`;
  if (action === 'decline') endpoint = `/api/jobs/${jobId}/decline`;
  if (action === 'complete') endpoint = `/api/jobs/${jobId}/complete`;
  if (!endpoint) return;
  const res = await fetch(endpoint, { method: 'POST' });
  if (res.ok) {
    fetchJobsAndRender();
    fetchEarningsAndRender();
  }
}

async function handlePay(jobId) {
  const res = await fetch('/api/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job_id: jobId })
  });
  if (res.ok) {
    alert('Payment successful! (mocked)');
    fetchJobsAndRender();
    fetchEarningsAndRender();
  } else {
    const data = await res.json();
    alert(data.error || 'Payment failed');
  }
}

async function fetchDashboardProfile() {
  const res = await fetch('/api/profile');
  if (res.ok) {
    const data = await res.json();
    // Set name
    const usernameEl = document.getElementById('dashboard-username');
    if (usernameEl) usernameEl.textContent = data.name || 'Fundi';
    // Set service
    const serviceEl = document.getElementById('profile-service');
    if (serviceEl) serviceEl.textContent = data.service || 'Service';
    // Set location
    const locationEl = document.getElementById('profile-location');
    if (locationEl) locationEl.textContent = data.location || 'Location';
    // Set initial
    const initialEl = document.getElementById('profile-initial');
    if (initialEl && data.name) initialEl.textContent = data.name.charAt(0).toUpperCase();
  }
}

// Fetch and render the fundi's active job
async function fetchActiveJob() {
  const res = await fetch('/api/fundi/active-job');
  const container = document.querySelector('.container');
  if (res.ok) {
    const data = await res.json();
    // Remove any existing active job card
    const oldActive = document.getElementById('active-job-card');
    if (oldActive) oldActive.remove();
    if (data.active_job) {
      const card = document.createElement('section');
      card.className = 'card';
      card.id = 'active-job-card';
      card.innerHTML = `
        <h2 class="card-title">Active Job Reminder</h2>
        <div style="font-size:1.1rem;font-weight:600;color:#0ea5e9;margin-bottom:8px;">${data.active_job.title}</div>
        <div style="color:#64748b;">Client: <strong>${data.active_job.customer}</strong></div>
        <div style="color:#64748b;">Date: ${data.active_job.date}</div>
        <div style="color:#64748b;">Location: ${data.active_job.location}</div>
        <div style="color:#22c55e;font-weight:bold;">Ksh ${data.active_job.amount}</div>
        <div style="margin-top:10px;color:#f59e0b;font-weight:600;">Don't forget to complete this job!</div>
      `;
      container.prepend(card);
    }
  }
}

// For client dashboard: show fundi name in job list
if (window.location.pathname === '/client-dashboard') {
  // Patch fetchClientJobs to show fundi name
  const origFetchClientJobs = window.fetchClientJobs;
  window.fetchClientJobs = async function() {
    const list = document.getElementById('client-jobs-list');
    list.innerHTML = '';
    const res = await fetch('/api/client/jobs');
    if (res.ok) {
      const jobs = await res.json();
      if (!jobs.length) {
        list.innerHTML = '<div style="color:#888;text-align:center;">No job requests yet.</div>';
        return;
      }
      jobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="font-weight:bold;font-size:1.1rem;">${job.title}</span>
            <span style="font-size:0.85rem;padding:2px 8px;border-radius:8px;">${job.status.replace('_', ' ').toUpperCase()}</span>
          </div>
          <div style="font-size:0.97rem;color:#444;margin-bottom:2px;">📅 ${job.date}</div>
          <div style="font-size:0.97rem;color:#444;margin-bottom:2px;">📍 ${job.location}</div>
          <div style="font-size:1rem;color:#22c55e;font-weight:bold;margin-bottom:6px;">Ksh ${job.amount}</div>
          <div style="font-size:0.95rem;color:#888;">Fundi: ${job.fundi_name ? job.fundi_name : 'Not assigned'}</div>
        `;
        list.appendChild(card);
      });
    }
  }
} 