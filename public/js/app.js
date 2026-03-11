// Navbar Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when link is clicked
    document.querySelectorAll('.navbar-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Hero Slider
const heroSlides = document.querySelectorAll('.hero-slide');
const heroPrev = document.getElementById('heroPrev');
const heroNext = document.getElementById('heroNext');
const indicators = document.querySelectorAll('.indicator');

let currentSlide = 0;
let slideTimer;

function showSlide(n) {
    heroSlides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));

    heroSlides[n].classList.add('active');
    indicators[n].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % heroSlides.length;
    showSlide(currentSlide);
    resetSlideTimer();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    showSlide(currentSlide);
    resetSlideTimer();
}

function startSlideTimer() {
    slideTimer = setInterval(nextSlide, 5000);
}

function resetSlideTimer() {
    clearInterval(slideTimer);
    startSlideTimer();
}

if (heroPrev && heroNext) {
    heroPrev.addEventListener('click', prevSlide);
    heroNext.addEventListener('click', nextSlide);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            resetSlideTimer();
        });
    });

    startSlideTimer();
}

// Contact Form Validation
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const form = contactForm;
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const agreeInput = document.getElementById('agree');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Real-time validation
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    phoneInput.addEventListener('blur', validatePhone);
    subjectInput.addEventListener('change', validateSubject);
    messageInput.addEventListener('blur', validateMessage);
    agreeInput.addEventListener('change', validateAgree);

    function validateName() {
        const value = nameInput.value.trim();
        const error = document.getElementById('nameError');

        if (!value) {
            nameInput.classList.add('error');
            error.textContent = 'Name is required';
            return false;
        }
        if (value.length < 2) {
            nameInput.classList.add('error');
            error.textContent = 'Name must be at least 2 characters';
            return false;
        }

        nameInput.classList.remove('error');
        error.textContent = '';
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        const error = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) {
            emailInput.classList.add('error');
            error.textContent = 'Email is required';
            return false;
        }
        if (!emailRegex.test(value)) {
            emailInput.classList.add('error');
            error.textContent = 'Please enter a valid email';
            return false;
        }

        emailInput.classList.remove('error');
        error.textContent = '';
        return true;
    }

    function validatePhone() {
        const value = phoneInput.value.trim();
        const error = document.getElementById('phoneError');

        if (value && !/^\+?[0-9\s\-()]{7,}$/.test(value)) {
            phoneInput.classList.add('error');
            error.textContent = 'Please enter a valid phone number';
            return false;
        }

        phoneInput.classList.remove('error');
        error.textContent = '';
        return true;
    }

    function validateSubject() {
        const value = subjectInput.value;
        const error = document.getElementById('subjectError');

        if (!value) {
            subjectInput.classList.add('error');
            error.textContent = 'Please select a subject';
            return false;
        }

        subjectInput.classList.remove('error');
        error.textContent = '';
        return true;
    }

    function validateMessage() {
        const value = messageInput.value.trim();
        const error = document.getElementById('messageError');

        if (!value) {
            messageInput.classList.add('error');
            error.textContent = 'Message is required';
            return false;
        }
        if (value.length < 10) {
            messageInput.classList.add('error');
            error.textContent = 'Message must be at least 10 characters';
            return false;
        }

        messageInput.classList.remove('error');
        error.textContent = '';
        return true;
    }

    function validateAgree() {
        const error = document.getElementById('agreeError');

        if (!agreeInput.checked) {
            error.textContent = 'You must agree to the privacy policy';
            return false;
        }

        error.textContent = '';
        return true;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();
        const isAgreeValid = validateAgree();

        if (!isNameValid || !isEmailValid || !isPhoneValid || !isSubjectValid || !isMessageValid || !isAgreeValid) {
            return;
        }

        // Submit form
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').style.display = 'none';
        submitBtn.querySelector('.btn-loading').style.display = 'inline-flex';

        try {
            // Simulate form submission (in production, this would send to a server)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            successMessage.style.display = 'flex';
            errorMessage.style.display = 'none';

            // Reset form
            form.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);

        } catch (error) {
            errorMessage.style.display = 'flex';
            successMessage.style.display = 'none';
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').style.display = 'inline';
            submitBtn.querySelector('.btn-loading').style.display = 'none';
        }
    });
}

// FAQ Toggle
const faqQuestions = document.querySelectorAll('.faq-question');

if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = answer.classList.contains('open');

            // Close all answers
            document.querySelectorAll('.faq-answer').forEach(a => {
                a.classList.remove('open');
            });
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
            });

            // Open clicked answer if it was closed
            if (!isOpen) {
                answer.classList.add('open');
                question.classList.add('active');
            }
        });
    });
}

// Set active navigation link based on current page
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

setActiveNav();

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Add to cart button functionality (demo)
document.querySelectorAll('.btn-icon').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.product-card');
        const productName = card.querySelector('h3').textContent;

        // Show feedback
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.color = 'var(--teal)';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.color = '';
        }, 1500);

        // In a real app, this would add to cart
        console.log(`Added ${productName} to cart`);
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Print current year in footer
document.querySelectorAll('.footer-bottom p').forEach(p => {
    const text = p.textContent;
    if (text.includes('2024')) {
        const currentYear = new Date().getFullYear();
        p.textContent = text.replace('2024', currentYear);
    }
});

console.log('JSEdumart website initialized successfully');
