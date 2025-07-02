// static/js/client_app.js - Client Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
  // Handle logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/login';
    };
  }

  // Service request form
  const requestForm = document.getElementById('service-request-form');
  const requestSuccess = document.getElementById('request-success');
  if (requestForm) {
    requestForm.onsubmit = async e => {
      e.preventDefault();
      const service = document.getElementById('request-service').value;
      const date = document.getElementById('request-date').value;
      const location = document.getElementById('request-location').value;
      const amount = document.getElementById('request-amount').value;
      const res = await fetch('/api/client/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, date, location, amount })
      });
      if (res.ok) {
        requestSuccess.classList.remove('hidden');
        requestForm.reset();
        fetchClientJobs();
        setTimeout(() => requestSuccess.classList.add('hidden'), 2000);
      }
    };
  }

  // Fetch and render client's job requests
  async function fetchClientJobs() {
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
          <div style="font-size:0.95rem;color:#888;">
            Fundi: ${job.fundi_name ? job.fundi_name : 'Not assigned'}
            ${job.fundi_phone ? `<br><span style='color:#0ea5e9;'>${job.fundi_phone}</span>` : ''}
          </div>
        `;
        list.appendChild(card);
      });
    }
  }

  // Add: Get client name from a hidden field if present
  const clientNameField = document.getElementById('client-name');
  let clientName = '';
  if (clientNameField) clientName = clientNameField.value;

  // Fetch and render fundis
  const searchFundi = document.getElementById('search-fundi');
  async function fetchFundis(q = '') {
    const list = document.getElementById('fundis-list');
    list.innerHTML = '';
    const res = await fetch('/api/fundis?q=' + encodeURIComponent(q));
    if (res.ok) {
      let fundis = await res.json();
      // Filter out the client from the fundi list by name
      if (clientName) {
        fundis = fundis.filter(fundi => fundi.name !== clientName);
      }
      if (!fundis.length) {
        list.innerHTML = '<div style="color:#888;text-align:center;">No fundis found.</div>';
        return;
      }
      fundis.forEach(fundi => {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
          <div style="font-weight:bold;font-size:1.1rem;">${fundi.name}</div>
          <div style="font-size:0.97rem;color:#444;">Service: ${fundi.service || 'N/A'}</div>
          <div style="font-size:0.97rem;color:#444;">Location: ${fundi.location || 'N/A'}</div>
        `;
        list.appendChild(card);
      });
    }
  }
  if (searchFundi) {
    searchFundi.oninput = e => {
      fetchFundis(e.target.value);
    };
  }

  // Initial load
  fetchClientJobs();
  fetchFundis();
}); 