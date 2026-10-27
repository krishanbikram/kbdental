/**
 * KB Dental — Production JavaScript
 * High performance, zero external libraries
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Mobile Menu Toggle
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      siteNav.classList.toggle('is-open');
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!siteNav.contains(e.target) && !navToggle.contains(e.target) && siteNav.classList.contains('is-open')) {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && siteNav.classList.contains('is-open')) {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  // 2. FAQ Accordion Handling
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function (button) {
    button.addEventListener('click', function () {
      const item = button.closest('.faq-item');
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      
      // Toggle current item
      button.setAttribute('aria-expanded', !isExpanded);
      item.classList.toggle('active');
    });
  });

  // 3. Appointment / Referral Form Handler
  const inquiryForms = document.querySelectorAll('.quick-form');
  inquiryForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const phoneInput = form.querySelector('input[type="tel"]');
      const serviceSelect = form.querySelector('select[name="service"]');
      const locationSelect = form.querySelector('select[name="location"]');
      
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const serviceVal = serviceSelect ? serviceSelect.value : 'General Dental Care';
      const locVal = locationSelect ? locationSelect.value : 'Kathmandu Valley';

      if (!phoneVal || phoneVal.length < 8) {
        alert('Please enter a valid phone number so our local dental coordinator can reach you.');
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Display immediate feedback
      form.innerHTML = `
        <div style="background:#ECFDF5; border:1px solid #059669; border-radius:8px; padding:1.25rem; text-align:center;">
          <h4 style="color:#065F46; margin:0 0 0.5rem 0; font-size:1.1rem;">Inquiry Received!</h4>
          <p style="color:#047857; margin:0 0 1rem 0; font-size:0.9rem;">
            A local dental coordinator is matching your request for <strong>${serviceVal}</strong> in <strong>${locVal}</strong>.
          </p>
          <a href="tel:+9779815885859" class="btn btn-primary" style="display:inline-flex; width:100%; justify-content:center;">
            Call Now for Faster Connection: +977 9815885859
          </a>
        </div>
      `;
    });
  });

  // 4. Click-to-call Telemetry / Confirmation
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'phone_call_click', {
          event_category: 'lead',
          event_label: link.getAttribute('href')
        });
      }
    });
  });
});
