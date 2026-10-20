// Local form demonstration. Entries never leave this page.
(() => {
  'use strict';

  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const status = form.querySelector('[data-form-status]');
  const fields = form.querySelector('[data-form-fields]');
  if (!status || !fields) return;

  const showStatus = (message, valid = false) => {
    status.textContent = message;
    status.classList.toggle('is-ok', valid);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    showStatus('Demo complete. Nothing was sent or saved.', true);
  });

  form.addEventListener('reset', () => {
    showStatus('Demo only. Use sample details to try the form.');
  });

  // Keep native submission unavailable if this script fails to initialize.
  fields.disabled = false;
  showStatus('Demo only. Use sample details to try the form.');
})();
