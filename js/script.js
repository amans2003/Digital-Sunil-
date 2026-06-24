// ── Sticky Navbar ──────────────────────────────────────────
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.toggle('sticky', window.scrollY > 50);
    }
    reveal();
});

// ── Mobile Menu ─────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
const overlay   = document.querySelector('.sidebar-overlay');
const closeBtn  = document.querySelector('.close-btn');

function openMenu() {
    navLinks.classList.add('active');
    if (overlay)   overlay.classList.add('active');
    if (hamburger) hamburger.classList.add('hidden');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    navLinks.classList.remove('active');
    if (overlay)   overlay.classList.remove('active');
    if (hamburger) hamburger.classList.remove('hidden');
    document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', openMenu);
if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
if (overlay)   overlay.addEventListener('click', closeMenu);

// Close menu on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) closeMenu();
});

// ── Scroll Reveal ───────────────────────────────────────────
function reveal() {
    document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 90) {
            el.classList.add('active');
        }
    });
}
window.addEventListener('load', reveal);

// ── Active Nav Link ─────────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a:not(.btn)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});

// ── Analytics Helper ────────────────────────────────────────
function trackEvent(name, params) {
    if (typeof gtag === 'function') {
        gtag('event', name, params);
    }
}

// ── Contact Form ─────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const btn         = contactForm.querySelector('button[type="submit"]');
        const msgEl       = document.getElementById('formMessage');
        const formData    = new FormData(contactForm);
        const serviceVal  = formData.get('Service') || 'General';
        const scriptURL   = contactForm.getAttribute('action') || '';

        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending…';
        btn.disabled  = true;

        function showMsg(type, html) {
            msgEl.className = 'form-message ' + type;
            msgEl.innerHTML = html;
            msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            setTimeout(() => { msgEl.style.display = 'none'; }, 6000);
        }

        function resetBtn() {
            btn.innerHTML = originalHTML;
            btn.disabled  = false;
        }

        if (!scriptURL || scriptURL === '#') {
            // Demo: simulated success
            setTimeout(() => {
                showMsg('success', '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent. We\'ll get back to you within 24 hours.');
                trackEvent('form_submission', { event_category: 'Lead', event_label: 'Contact Form (Demo)', service_requested: serviceVal });
                contactForm.reset();
                resetBtn();
            }, 1400);
        } else {
            fetch(scriptURL, { method: 'POST', body: new URLSearchParams(formData), mode: 'no-cors' })
                .then(() => {
                    showMsg('success', '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent. We\'ll get back to you within 24 hours.');
                    trackEvent('form_submission', { event_category: 'Lead', event_label: 'Contact Form', service_requested: serviceVal });
                    contactForm.reset();
                })
                .catch(() => {
                    showMsg('error', '<i class="fas fa-exclamation-circle"></i> Something went wrong. Please email us directly at <strong>info@digitalsunil.com</strong>');
                })
                .finally(resetBtn);
        }
    });
}

// ── CTA Click Tracking ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn, .read-more, .logo, nav a').forEach(el => {
        el.addEventListener('click', () => {
            trackEvent('cta_click', {
                event_category: 'Engagement',
                event_label: el.innerText.trim() || el.getAttribute('aria-label') || 'Link',
                destination_url: el.getAttribute('href') || '#',
                page_path: window.location.pathname
            });
        });
    });
});

