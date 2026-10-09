// ==========================================================================
// PORTFOLIO DYNAMIC SCRIPTS & DASHBOARD CUSTOMIZER
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. Dynamic Typing Effect
    initTypingEffect();

    // 2. Scroll Animations & Header Updates
    initScrollAnimations();

    // 3. Mobile Navigation Toggle
    initMobileMenu();

    // 4. Customizer Panel System (LocalStorage Engine)
    initCustomizer();
});

/* ==========================================================================
   1. DYNAMIC TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
    const textTarget = document.getElementById('typed-text');
    if (!textTarget) return;

    const phrases = [
        "B.Tech Computer Science Student",
        "Aspiring AI & Software Developer",
        "Dedicated Problem Solver & Innovator"
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textTarget.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            textTarget.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }

        // Handle full word typed
        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000; // Pause at end of phrase
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing loop
    setTimeout(type, 1000);
}

/* ==========================================================================
   2. SCROLL ANIMATIONS & ACTIVE NAV
   ========================================================================== */
function initScrollAnimations() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const fadeElements = document.querySelectorAll('.fade-in');
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    // Sticky Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Highlight active navigation section
        let currentSection = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 160;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Intersection Observer for scroll triggers
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                
                // If it's a skill card container entering view, animate the bar fills
                if (entry.target.classList.contains('skills-section')) {
                    skillBars.forEach(bar => {
                        const progress = bar.getAttribute('data-progress');
                        bar.style.width = progress;
                    });
                }
            }
        });
    }, {
        threshold: 0.15
    });

    // Add scroll observer targets
    fadeElements.forEach(el => scrollObserver.observe(el));
    
    // Add section observer for skill bars specifically
    const skillsSection = document.getElementById('skills');
    if (skillsSection) scrollObserver.observe(skillsSection);

    // Initial check for elements already in view
    setTimeout(() => {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('appear');
            }
        });
    }, 200);
}

/* ==========================================================================
   3. MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            const isOpened = navMenu.classList.contains('active');
            icon.setAttribute('data-lucide', isOpened ? 'x' : 'menu');
            lucide.createIcons();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    });
}

/* ==========================================================================
   4. PORTFOLIO CUSTOMIZER (LOCAL STORAGE CONTROLLER)
   ========================================================================== */
function initCustomizer() {
    const modal = document.getElementById('customizer-modal');
    const openBtn = document.getElementById('btn-open-customizer');
    const closeBtn = document.getElementById('btn-close-customizer');
    const saveBtn = document.getElementById('btn-save-customizer');
    const resetBtn = document.getElementById('btn-reset-customizer');
    
    // Tab inputs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Field inputs
    const photoInput = document.getElementById('custom-photo');
    const resumeInput = document.getElementById('custom-resume');
    const emailInput = document.getElementById('custom-email');
    const phoneInput = document.getElementById('custom-phone');
    const linkedinInput = document.getElementById('custom-linkedin');
    const githubInput = document.getElementById('custom-github');
    
    // Previews & Labels
    const modalPhotoPreview = document.getElementById('modal-photo-preview');
    const resumeFileName = document.getElementById('resume-file-name');
    const lblResume = document.getElementById('lbl-custom-resume');

    // Certification inputs
    const certTitle = document.getElementById('cert-title');
    const certIssuer = document.getElementById('cert-issuer');
    const certDesc = document.getElementById('cert-desc');
    const btnAddCert = document.getElementById('btn-add-cert');
    const modalCertsList = document.getElementById('modal-certs-list');

    // Temporary variables for uploaded data
    let uploadedPhotoBase64 = null;
    let uploadedResumeBase64 = null;
    let customCerts = [];

    // Default Placeholder Details
    const defaultData = {
        email: 'sreeshma.u.cse@gmail.com',
        phone: '+91 94002 81303',
        linkedin: 'sreeshma-u-jce28',
        github: 'Sreeshma-U'
    };

    // Open/Close Modal
    if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
            loadCurrentSettingsIntoForm();
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        // Click outside modal content to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Modal Tabs Swapping
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Handle Photo Upload
    if (photoInput) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    showToast('Photo must be smaller than 2MB', 'error');
                    photoInput.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(evt) {
                    uploadedPhotoBase64 = evt.target.result;
                    // Update preview in modal
                    modalPhotoPreview.innerHTML = `<img src="${uploadedPhotoBase64}" alt="Preview">`;
                    showToast('Photo selected!', 'info');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Handle Resume PDF Upload
    if (resumeInput) {
        resumeInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 3 * 1024 * 1024) {
                    showToast('Resume must be smaller than 3MB', 'error');
                    resumeInput.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(evt) {
                    uploadedResumeBase64 = evt.target.result;
                    resumeFileName.textContent = file.name;
                    lblResume.textContent = "Change PDF File";
                    showToast('Resume PDF selected!', 'info');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Load Existing LocalStorage settings (Runs on page load)
    applySavedSettings();

    function applySavedSettings() {
        // Load contact details
        const emailVal = localStorage.getItem('sreeshma_email') || defaultData.email;
        const phoneVal = localStorage.getItem('sreeshma_phone') || defaultData.phone;
        const linkedinVal = localStorage.getItem('sreeshma_linkedin') || defaultData.linkedin;
        const githubVal = localStorage.getItem('sreeshma_github') || defaultData.github;

        // Apply Email details
        updateTextContent('contact-email-text', emailVal);
        updateLinkHref('link-email', `mailto:${emailVal}`);
        updateLinkHref('footer-email', `mailto:${emailVal}`);

        // Apply LinkedIn details
        updateTextContent('contact-linkedin-text', `linkedin.com/in/${linkedinVal}`);
        updateLinkHref('link-linkedin', `https://linkedin.com/in/${linkedinVal}`);
        updateLinkHref('footer-linkedin', `https://linkedin.com/in/${linkedinVal}`);

        // Apply GitHub details
        updateTextContent('contact-github-text', `github.com/${githubVal}`);
        updateLinkHref('link-github', `https://github.com/${githubVal}`);
        updateLinkHref('footer-github', `https://github.com/${githubVal}`);

        // Apply Phone details
        updateTextContent('contact-phone-text', phoneVal);

        // Apply Profile Image
        const savedPhoto = localStorage.getItem('sreeshma_profile_pic');
        const heroPicContainer = document.getElementById('profile-pic-display-hero');
        const aboutPicContainer = document.getElementById('profile-pic-display-about');

        if (savedPhoto) {
            uploadedPhotoBase64 = savedPhoto;
            if (heroPicContainer) {
                heroPicContainer.innerHTML = `<img src="${savedPhoto}" alt="Sreeshma U Profile">`;
            }
            if (aboutPicContainer) {
                aboutPicContainer.innerHTML = `<img src="${savedPhoto}" alt="Sreeshma U Profile">`;
            }
        } else {
            // Restore defaults
            if (heroPicContainer) {
                heroPicContainer.innerHTML = `
                    <svg viewBox="0 0 100 100" class="default-avatar-svg" id="default-avatar">
                        <defs>
                            <linearGradient id="avatar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#0a192f" />
                                <stop offset="50%" stop-color="#0052d4" />
                                <stop offset="100%" stop-color="#4364f7" />
                            </linearGradient>
                            <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#00c6ff" />
                                <stop offset="100%" stop-color="#0072ff" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="48" fill="url(#avatar-grad)" stroke="url(#glow-grad)" stroke-width="1.5"/>
                        <text x="50" y="55" font-family="'Space Grotesk', sans-serif" font-size="22" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1">SU</text>
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.5"/>
                        <circle cx="25" cy="25" r="2" fill="#00c6ff" />
                        <circle cx="75" cy="25" r="3" fill="#ffffff" opacity="0.7"/>
                        <circle cx="70" cy="75" r="2" fill="#00c6ff" />
                        <circle cx="30" cy="70" r="1.5" fill="#ffffff" />
                    </svg>`;
            }
            if (aboutPicContainer) {
                aboutPicContainer.innerHTML = `<div class="about-default-avatar">SU</div>`;
            }
        }

        // Apply Resume PDF to buttons
        const savedResume = localStorage.getItem('sreeshma_resume_pdf');
        const resumeBtn = document.getElementById('btn-download-resume');
        if (resumeBtn) {
            if (savedResume) {
                uploadedResumeBase64 = savedResume;
                resumeBtn.setAttribute('href', savedResume);
                resumeBtn.style.opacity = '1';
                resumeBtn.style.pointerEvents = 'auto';
            } else {
                // Point to a placeholder or disable
                resumeBtn.setAttribute('href', '#');
                resumeBtn.addEventListener('click', handlePlaceholderResumeClick);
            }
        }

        // Load custom certifications
        const savedCerts = localStorage.getItem('sreeshma_certs');
        if (savedCerts) {
            customCerts = JSON.parse(savedCerts);
        } else {
            customCerts = [];
        }
        renderCertifications();
    }

    function handlePlaceholderResumeClick(e) {
        const hasResume = localStorage.getItem('sreeshma_resume_pdf');
        if (!hasResume) {
            e.preventDefault();
            showToast('Please upload your Resume PDF using the Customize panel first!', 'info');
        }
    }

    function loadCurrentSettingsIntoForm() {
        emailInput.value = localStorage.getItem('sreeshma_email') || defaultData.email;
        phoneInput.value = localStorage.getItem('sreeshma_phone') || defaultData.phone;
        linkedinInput.value = localStorage.getItem('sreeshma_linkedin') || defaultData.linkedin;
        githubInput.value = localStorage.getItem('sreeshma_github') || defaultData.github;

        const savedPhoto = localStorage.getItem('sreeshma_profile_pic');
        if (savedPhoto) {
            modalPhotoPreview.innerHTML = `<img src="${savedPhoto}" alt="Current Pic">`;
        } else {
            modalPhotoPreview.innerHTML = 'SU';
        }

        const savedResume = localStorage.getItem('sreeshma_resume_pdf');
        if (savedResume) {
            resumeFileName.textContent = "Resume uploaded (PDF)";
            lblResume.textContent = "Change PDF File";
        } else {
            resumeFileName.textContent = "No file selected";
            lblResume.textContent = "Choose PDF File";
        }

        renderModalCertsList();
    }

    // Save Settings
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Save contact details
            localStorage.setItem('sreeshma_email', emailInput.value.trim() || defaultData.email);
            localStorage.setItem('sreeshma_phone', phoneInput.value.trim() || defaultData.phone);
            localStorage.setItem('sreeshma_linkedin', linkedinInput.value.trim() || defaultData.linkedin);
            localStorage.setItem('sreeshma_github', githubInput.value.trim() || defaultData.github);

            // Save Photo if uploaded
            if (uploadedPhotoBase64) {
                localStorage.setItem('sreeshma_profile_pic', uploadedPhotoBase64);
            }

            // Save Resume if uploaded
            if (uploadedResumeBase64) {
                localStorage.setItem('sreeshma_resume_pdf', uploadedResumeBase64);
                // Remove placeholder handler
                const resumeBtn = document.getElementById('btn-download-resume');
                if (resumeBtn) {
                    resumeBtn.removeEventListener('click', handlePlaceholderResumeClick);
                }
            }

            // Save Certifications
            localStorage.setItem('sreeshma_certs', JSON.stringify(customCerts));

            // Refresh DOM
            applySavedSettings();
            modal.classList.remove('active');
            showToast('Portfolio settings saved successfully!', 'success');
        });
    }

    // Reset Defaults
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all portfolio customization to defaults?')) {
                localStorage.removeItem('sreeshma_email');
                localStorage.removeItem('sreeshma_phone');
                localStorage.removeItem('sreeshma_linkedin');
                localStorage.removeItem('sreeshma_github');
                localStorage.removeItem('sreeshma_profile_pic');
                localStorage.removeItem('sreeshma_resume_pdf');
                localStorage.removeItem('sreeshma_certs');
                
                uploadedPhotoBase64 = null;
                uploadedResumeBase64 = null;
                customCerts = [];

                applySavedSettings();
                loadCurrentSettingsIntoForm();
                modal.classList.remove('active');
                showToast('Reset back to portfolio defaults.', 'info');
            }
        });
    }

    // Add Certification Logic
    if (btnAddCert) {
        btnAddCert.addEventListener('click', () => {
            const title = certTitle.value.trim();
            const issuer = certIssuer.value.trim();
            const desc = certDesc.value.trim();

            if (!title || !issuer) {
                showToast('Title and Issuer are required.', 'error');
                return;
            }

            const newCert = {
                id: Date.now(),
                title: title,
                issuer: issuer,
                desc: desc
            };

            customCerts.push(newCert);
            
            // Clear inputs
            certTitle.value = '';
            certIssuer.value = '';
            certDesc.value = '';

            renderModalCertsList();
            showToast('Certificate added! (Remember to click Save Changes)', 'info');
        });
    }

    // Render certifications in the modal lists
    function renderModalCertsList() {
        if (!modalCertsList) return;
        
        if (customCerts.length === 0) {
            modalCertsList.innerHTML = '<p class="empty-text">No custom certifications added yet.</p>';
            return;
        }

        modalCertsList.innerHTML = '';
        customCerts.forEach(cert => {
            const item = document.createElement('div');
            item.className = 'modal-cert-item';
            item.innerHTML = `
                <div class="modal-cert-item-info">
                    <h5>${cert.title}</h5>
                    <p>${cert.issuer}</p>
                </div>
                <button type="button" class="custom-cert-remove" data-id="${cert.id}">
                    <i data-lucide="trash-2"></i> Remove
                </button>
            `;
            modalCertsList.appendChild(item);
        });

        // Bind remove button handlers
        modalCertsList.querySelectorAll('.custom-cert-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.getAttribute('data-id'));
                customCerts = customCerts.filter(c => c.id !== id);
                renderModalCertsList();
            });
        });
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Render certifications in the main portfolio webpage view
    function renderCertifications() {
        const grid = document.getElementById('certifications-display-grid');
        if (!grid) return;

        // Clear and add defaults first (already defined in HTML, but we keep them clean)
        grid.innerHTML = `
            <!-- Default Certificate 1 -->
            <div class="cert-card glass-panel">
                <div class="cert-badge"><i data-lucide="award"></i></div>
                <div class="cert-details">
                    <h3>Elements of AI</h3>
                    <p class="cert-issuer">MinnaLearn & University of Helsinki</p>
                    <p class="cert-desc">Introductory course covering machine learning, neural networks, philosophy of AI, and problem-solving concepts.</p>
                </div>
            </div>
            
            <!-- Default Certificate 2 -->
            <div class="cert-card glass-panel">
                <div class="cert-badge"><i data-lucide="award"></i></div>
                <div class="cert-details">
                    <h3>AI for All</h3>
                    <p class="cert-issuer">Government of India & Intel</p>
                    <p class="cert-desc">National awareness initiative focusing on basic concepts, ethical considerations, and domestic uses of artificial intelligence.</p>
                </div>
            </div>
        `;

        // Render custom certs
        customCerts.forEach(cert => {
            const card = document.createElement('div');
            card.className = 'cert-card glass-panel';
            card.innerHTML = `
                <div class="cert-badge"><i data-lucide="award"></i></div>
                <div class="cert-details">
                    <h3>${cert.title}</h3>
                    <p class="cert-issuer">${cert.issuer}</p>
                    ${cert.desc ? `<p class="cert-desc">${cert.desc}</p>` : ''}
                </div>
            `;
            grid.appendChild(card);
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Helper functions to update content safely
    function updateTextContent(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function updateLinkHref(id, href) {
        const el = document.getElementById(id);
        if (el) {
            el.setAttribute('href', href);
        }
    }
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Choose icon based on type
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-triangle';

    toast.innerHTML = `
        <i data-lucide="${iconName}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Trigger Slide-in
    setTimeout(() => {
        toast.classList.add('active');
    }, 50);

    // Slide-out and remove
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => {
            toast.remove();
        }, 350);
    }, 4000);
}
// Language Switcher
const languageToggle = document.getElementById('language-toggle');

let currentLanguage = 'en';

const translations = {
    en: {
        home: 'Home',
        about: 'About',
        education: 'Education',
        skill: 'Skill',
        project: 'Project',
        achievement: 'Achievement',
        volunteer: 'Volunteer',
        contact: 'Contact'
    },

    ml: {
    home: 'തുടക്കം',
    about: 'എന്നെക്കുറിച്ച്',
    education: 'വിദ്യാഭ്യാസം',
    skill: 'കഴിവുകൾ',
    skills: 'കഴിവുകൾ',
    project: 'പ്രോജക്റ്റുകൾ',
    projects: 'പ്രോജക്റ്റുകൾ',
    achievement: 'നേട്ടങ്ങൾ',
    achievements: 'നേട്ടങ്ങൾ',
    volunteer: 'സേവനം',
    volunteering: 'സേവനം',
    contact: 'കൂട്ടുചേരാം'
}
};

if (languageToggle) {
    const navLinks = document.querySelectorAll('.nav-link');

    // Save original English names
    navLinks.forEach(function (link) {
        link.dataset.originalText = link.textContent.trim();
    });

    languageToggle.addEventListener('click', function () {
        currentLanguage = currentLanguage === 'en' ? 'ml' : 'en';

        navLinks.forEach(function (link) {
            const originalText = link.dataset.originalText;
            const key = originalText.toLowerCase();

            link.textContent =
                translations[currentLanguage][key] || originalText;
        });

        languageToggle.textContent =
            currentLanguage === 'en' ? 'ML' : 'EN';
    });
}