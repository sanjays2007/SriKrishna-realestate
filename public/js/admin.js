/**
 * Admin dashboard logic: auth guard, tab switching, properties CRUD,
 * and inquiries list. Talks to the backend via apiFetch (see api.js).
 */
(function () {
  // ---- Auth guard ----
  if (!getAdminToken()) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('logout-btn').addEventListener('click', () => {
    clearAdminToken();
    window.location.href = 'login.html';
  });

  function handleAuthError(err) {
    if (String(err.message).toLowerCase().includes('token') ||
        String(err.message).toLowerCase().includes('unauthorized') ||
        String(err.message).toLowerCase().includes('forbidden')) {
      clearAdminToken();
      window.location.href = 'login.html';
      return true;
    }
    return false;
  }

  // ---- Tabs ----
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => {
        b.classList.remove('border-brand-gold', 'text-brand-dark');
        b.classList.add('border-transparent', 'text-gray-400');
      });
      btn.classList.add('border-brand-gold', 'text-brand-dark');
      btn.classList.remove('border-transparent', 'text-gray-400');

      document.getElementById('tab-properties').classList.toggle('hidden', btn.dataset.tab !== 'properties');
      document.getElementById('tab-inquiries').classList.toggle('hidden', btn.dataset.tab !== 'inquiries');

      if (btn.dataset.tab === 'inquiries') loadInquiries();
    });
  });

  // ---- Properties table ----
  const propertiesTableBody = document.getElementById('properties-table-body');
  let propertiesCache = [];

  async function loadProperties() {
    propertiesTableBody.innerHTML = `<tr><td colspan="7" class="px-5 py-6 text-center text-gray-400">Loading…</td></tr>`;
    try {
      const res = await apiFetch('/properties?limit=100', {}, true);
      propertiesCache = res.data || [];
      renderPropertiesTable();
    } catch (err) {
      if (handleAuthError(err)) return;
      propertiesTableBody.innerHTML = `<tr><td colspan="7" class="px-5 py-6 text-center text-red-500">${err.message}</td></tr>`;
    }
  }

  function renderPropertiesTable() {
    if (propertiesCache.length === 0) {
      propertiesTableBody.innerHTML = `<tr><td colspan="7" class="px-5 py-6 text-center text-gray-400">No properties yet. Add your first listing.</td></tr>`;
      return;
    }
    propertiesTableBody.innerHTML = propertiesCache.map((p) => `
      <tr>
        <td class="px-5 py-3 font-medium">${p.title}</td>
        <td class="px-5 py-3">${p.city}</td>
        <td class="px-5 py-3 capitalize">${p.category}</td>
        <td class="px-5 py-3 capitalize">${p.status}</td>
        <td class="px-5 py-3">${p.price_label}</td>
        <td class="px-5 py-3">${p.featured ? '<i class="fa-solid fa-star text-brand-gold"></i>' : ''}</td>
        <td class="px-5 py-3 text-right whitespace-nowrap">
          <button class="edit-btn text-gray-500 hover:text-brand-dark mr-3" data-id="${p.id}"><i class="fa-solid fa-pen"></i></button>
          <button class="delete-btn text-gray-500 hover:text-red-500" data-id="${p.id}"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`).join('');

    propertiesTableBody.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => openModal(propertiesCache.find((p) => String(p.id) === btn.dataset.id)));
    });
    propertiesTableBody.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', () => deleteProperty(btn.dataset.id));
    });
  }

  async function deleteProperty(id) {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    try {
      await apiFetch(`/properties/${id}`, { method: 'DELETE' }, true);
      loadProperties();
    } catch (err) {
      if (handleAuthError(err)) return;
      alert(err.message);
    }
  }

  // ---- Modal (add/edit) ----
  const modal = document.getElementById('property-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalError = document.getElementById('modal-error');
  const form = document.getElementById('property-form');

  function openModal(property) {
    form.reset();
    modalError.classList.add('hidden');
    if (property) {
      modalTitle.textContent = 'Edit Property';
      Object.entries(property).forEach(([key, value]) => {
        const field = form.elements[key];
        if (!field) return;
        if (field.type === 'checkbox') {
          field.checked = Boolean(value);
        } else {
          field.value = value;
        }
      });
    } else {
      modalTitle.textContent = 'Add Property';
      form.elements['id'].value = '';
    }
    modal.classList.remove('hidden');
  }

  function closeModal() {
    modal.classList.add('hidden');
  }

  document.getElementById('add-property-btn').addEventListener('click', () => openModal(null));
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    modalError.classList.add('hidden');

    const formData = new FormData(form);
    const id = formData.get('id');
    const payload = {
      title: formData.get('title'),
      city: formData.get('city'),
      area: formData.get('area'),
      category: formData.get('category'),
      status: formData.get('status'),
      price_label: formData.get('price_label'),
      spec_label: formData.get('spec_label'),
      spec_icon: formData.get('spec_icon') || 'fa-house',
      area_label: formData.get('area_label'),
      image_url: formData.get('image_url'),
      description: formData.get('description'),
      featured: form.elements['featured'].checked,
    };

    try {
      if (id) {
        await apiFetch(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, true);
      } else {
        await apiFetch('/properties', { method: 'POST', body: JSON.stringify(payload) }, true);
      }
      closeModal();
      loadProperties();
    } catch (err) {
      if (handleAuthError(err)) return;
      modalError.textContent = err.message;
      modalError.classList.remove('hidden');
    }
  });

  // ---- Inquiries table ----
  const inquiriesTableBody = document.getElementById('inquiries-table-body');
  let inquiriesLoaded = false;

  async function loadInquiries() {
    if (inquiriesLoaded) return; // simple cache; tab click won't refetch every time
    inquiriesTableBody.innerHTML = `<tr><td colspan="7" class="px-5 py-6 text-center text-gray-400">Loading…</td></tr>`;
    try {
      const res = await apiFetch('/inquiries?limit=200', {}, true);
      const items = res.data || [];
      inquiriesLoaded = true;

      if (items.length === 0) {
        inquiriesTableBody.innerHTML = `<tr><td colspan="7" class="px-5 py-6 text-center text-gray-400">No inquiries yet.</td></tr>`;
        return;
      }

      inquiriesTableBody.innerHTML = items.map((i) => `
        <tr>
          <td class="px-5 py-3 font-medium">${i.name}</td>
          <td class="px-5 py-3">${i.phone}</td>
          <td class="px-5 py-3">${i.email}</td>
          <td class="px-5 py-3">${i.city || '—'}</td>
          <td class="px-5 py-3 max-w-xs truncate" title="${(i.message || '').replace(/"/g, '&quot;')}">${i.message || '—'}</td>
          <td class="px-5 py-3 whitespace-nowrap">${new Date(i.created_at).toLocaleString()}</td>
          <td class="px-5 py-3">
            <select class="status-select border border-gray-300 rounded px-2 py-1 text-xs" data-id="${i.id}">
              <option value="new" ${i.status === 'new' ? 'selected' : ''}>New</option>
              <option value="contacted" ${i.status === 'contacted' ? 'selected' : ''}>Contacted</option>
              <option value="closed" ${i.status === 'closed' ? 'selected' : ''}>Closed</option>
            </select>
          </td>
        </tr>`).join('');

      inquiriesTableBody.querySelectorAll('.status-select').forEach((sel) => {
        sel.addEventListener('change', async () => {
          try {
            await apiFetch(`/inquiries/${sel.dataset.id}`, {
              method: 'PATCH',
              body: JSON.stringify({ status: sel.value }),
            }, true);
          } catch (err) {
            if (handleAuthError(err)) return;
            alert(err.message);
          }
        });
      });
    } catch (err) {
      if (handleAuthError(err)) return;
      inquiriesTableBody.innerHTML = `<tr><td colspan="7" class="px-5 py-6 text-center text-red-500">${err.message}</td></tr>`;
    }
  }

  loadProperties();
})();
