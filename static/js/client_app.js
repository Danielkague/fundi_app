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

  // Fetch and render client's job requests with real-time updates
  async function fetchClientJobs() {
    const container = document.getElementById('jobs-container');
    if (!container) return;
    
    const res = await fetch('/api/client/jobs/status');
    if (res.ok) {
      const jobs = await res.json();
      if (!jobs.length) {
        container.innerHTML = '<div style="color:#888;text-align:center;">No job requests yet.</div>';
        return;
      }
      
      container.innerHTML = '';
      jobs.forEach(job => {
        const card = document.createElement('div');
        card.className = 'card job-card';
        card.setAttribute('data-job-id', job.id);
        
        const statusClass = `status-${job.status}`;
        const statusText = job.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        let fundiInfo = '';
        if (job.fundi_name) {
          fundiInfo = `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <div><strong>Assigned Fundi:</strong> ${job.fundi_name}</div>
              ${job.fundi_phone ? `<div>Contact: <a href="tel:${job.fundi_phone}" class="contact-link">${job.fundi_phone}</a></div>` : ''}
            </div>
          `;
        } else {
          fundiInfo = `
            <div style="margin-top: 8px; color: #6b7280; font-style: italic;">
              Waiting for fundi to accept...
            </div>
          `;
        }
        
        card.innerHTML = `
          <div><strong>${job.title}</strong></div>
          <div>${job.date}</div>
          <div>${job.location}</div>
          <div>Amount: KES ${job.amount}</div>
          <div>Status: <span class="${statusClass}">${statusText}</span></div>
          ${fundiInfo}
        `;
        container.appendChild(card);
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
    if (!list) return;
    
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

  // Real-time updates - check for job status changes every 30 seconds
  setInterval(fetchClientJobs, 30000);

  // Initial load
  fetchClientJobs();
  fetchFundis();
}); 