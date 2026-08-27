/*
  NAUTERA - Contact Form Validation & State Machine
*/

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  autoFillDropdownFromUrl();
});

/* Automatically select the requirement type based on URL parameters */
function autoFillDropdownFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type');
  const selectEl = document.getElementById('requirement-type');

  if (!selectEl || !typeParam) return;

  // Map values
  if (typeParam === 'b2b') {
    selectEl.value = 'b2b-offer';
  } else if (typeParam === 'family') {
    selectEl.value = 'retail-inquiry';
  } else if (typeParam === 'grower') {
    selectEl.value = 'academy-partner';
  } else if (typeParam === 'career') {
    selectEl.value = 'academy-partner'; // Fallback mapping for careers
  }
}

/* Form Validation & State Handlers */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const loadingOverlay = document.getElementById('form-loading-overlay');
  const successOverlay = document.getElementById('form-success-overlay');
  const resetBtn = document.getElementById('btn-success-reset');

  if (!form || !loadingOverlay || !successOverlay || !resetBtn) return;

  // Inputs
  const firstName = document.getElementById('first-name');
  const lastName = document.getElementById('last-name');
  const email = document.getElementById('email');
  const whatsapp = document.getElementById('whatsapp');
  const reqType = document.getElementById('requirement-type');
  const message = document.getElementById('message');
  const consentCheck = document.getElementById('consent-check');

  // Input helper to clear error when typing
  const inputs = [firstName, lastName, email, whatsapp, reqType, message, consentCheck];
  inputs.forEach(input => {
    if (!input) return;
    
    const eventType = input.tagName === 'SELECT' ? 'change' : (input.type === 'checkbox' ? 'change' : 'input');
    input.addEventListener(eventType, () => {
      validateField(input);
    });
    
    // Validate on blur too
    if (input.tagName !== 'SELECT' && input.type !== 'checkbox') {
      input.addEventListener('blur', () => {
        validateField(input);
      });
    }
  });

  // Main validator function
  function validateField(field) {
    const parent = field.closest('.form-group') || field.closest('#consent-wrapper')?.nextElementSibling;
    const isConsent = field.type === 'checkbox';
    const errorTarget = isConsent ? document.getElementById('consent-error-msg')?.parentElement : parent;
    
    let isValid = true;
    
    if (field.hasAttribute('required')) {
      if (isConsent) {
        isValid = field.checked;
      } else if (field.value.trim() === '') {
        isValid = false;
      } else if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(field.value.trim());
      } else if (field.id === 'whatsapp') {
        // Strip non-numbers for checking length
        const numeric = field.value.replace(/\D/g, '');
        // Standard WhatsApp length 10-15 digits
        isValid = numeric.length >= 10 && numeric.length <= 15;
      }
    }

    if (!isValid) {
      errorTarget?.classList.add('has-error');
    } else {
      errorTarget?.classList.remove('has-error');
    }

    return isValid;
  }

  // Validate entire form on submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    inputs.forEach(input => {
      if (input) {
        const isFieldValid = validateField(input);
        if (!isFieldValid) {
          isFormValid = false;
        }
      }
    });

    if (isFormValid) {
      loadingOverlay.classList.add('active');

      const formData = new FormData(form);
      const encodedData = new URLSearchParams(formData).toString();

      fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html'
        },
        body: encodedData
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Netlify Forms returned HTTP ${response.status}`);
          }

          loadingOverlay.classList.remove('active');
          successOverlay.classList.add('active');
          form.reset();
        })
        .catch(error => {
          console.error('Contact form error:', error);
          loadingOverlay.classList.remove('active');
          alert('Pesan belum berhasil dikirim. Pastikan Netlify Forms sudah aktif pada site ini, lalu deploy ulang website.');
        });
    } else {
      // Scroll to the first error element for accessibility
      const firstError = document.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // Handle new message reset button
  resetBtn.addEventListener('click', () => {
    successOverlay.classList.remove('active');
  });
}
