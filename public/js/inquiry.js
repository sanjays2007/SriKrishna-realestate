/**
 * Handles the "Request a Callback" / contact form submission,
 * posting to POST /api/inquiries on the backend.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('inquiry-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');

  function showStatus(message, isError) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('hidden', 'text-red-400', 'text-green-400');
    statusEl.classList.add(isError ? 'text-red-400' : 'text-green-400');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      city: formData.get('city') || null,
      message: formData.get('message') || null,
      propertyId: form.dataset.propertyId || null,
    };

    try {
      await apiFetch('/inquiries', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      showStatus("Thank you — we've received your request and will be in touch shortly.", false);
      form.reset();
    } catch (err) {
      showStatus(err.message || 'Something went wrong. Please try again.', true);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
});

/**
 * Handles the newsletter signup box on home.html, posting to
 * POST /api/newsletter on the backend.
 */
document.addEventListener('DOMContentLoaded', () => {
  const newsletterForm = document.getElementById('newsletter-form');
  if (!newsletterForm) return;

  const statusEl = document.getElementById('newsletter-status');

  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[name="email"]');

    try {
      await apiFetch('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email: emailInput.value }),
      });
      statusEl.textContent = "You're subscribed — thank you!";
      statusEl.classList.remove('hidden', 'text-red-400');
      statusEl.classList.add('text-green-400');
      newsletterForm.reset();
    } catch (err) {
      statusEl.textContent = err.message || 'Could not subscribe. Please try again.';
      statusEl.classList.remove('hidden', 'text-green-400');
      statusEl.classList.add('text-red-400');
    }
  });
});
