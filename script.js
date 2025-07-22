// Minimal AI Portfolio JavaScript
// Fast, efficient, and focused on performance

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initContactForm();
    
    console.log('AI Portfolio initialized successfully');
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    let isManualNavigation = false;
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Set manual navigation flag
            isManualNavigation = true;
            
            // Update active link IMMEDIATELY on click
            updateActiveNav(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Reset manual navigation flag after scroll completes
                setTimeout(() => {
                    isManualNavigation = false;
                }, 1000);
            }
        });
    });
    
    // Update active nav link on scroll (only if not manually navigating)
    window.addEventListener('scroll', throttle(() => {
        if (!isManualNavigation) {
            updateNavOnScroll();
        }
    }, 100));
    
    // Add navbar background on scroll
    window.addEventListener('scroll', throttle(updateNavbarBackground, 10));
}

function updateActiveNav(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    // Remove all active and switching classes immediately
    navLinks.forEach(link => {
        link.classList.remove('active', 'switching');
    });
    
    // Add active class to the target link only
    const targetLink = document.querySelector(`.nav-link[href="${targetId}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
        targetLink.classList.add('switching');
        
        // Remove switching class after animation completes
        setTimeout(() => {
            targetLink.classList.remove('switching');
        }, 200);
    }
}

function updateNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.pageYOffset + 150;
    let activeSection = null;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = '#' + section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            activeSection = sectionId;
        }
    });
    
    if (activeSection) {
        const currentActive = document.querySelector('.nav-link.active');
        const targetLink = document.querySelector(`[href="${activeSection}"]`);
        
        // Only update if it's different from current active
        if (currentActive !== targetLink) {
            updateActiveNav(activeSection);
        }
    }
}

function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(238, 228, 225, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(238, 228, 225, 0.95)';
        navbar.style.backdropFilter = 'blur(12px)';
    }
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Special handling for stats animation
                if (entry.target.classList.contains('stat')) {
                    animateNumber(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.project-card, .skill-category, .stat, .pillar, .timeline-item'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Animate numbers in stats
function animateNumber(element) {
    const numberElement = element.querySelector('h3');
    if (!numberElement) return;
    
    const text = numberElement.textContent;
    const number = parseInt(text);
    if (isNaN(number)) return;
    
    let currentNumber = 0;
    const increment = number / 30;
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= number) {
            numberElement.textContent = number + '+';
            clearInterval(timer);
        } else {
            numberElement.textContent = Math.floor(currentNumber) + '+';
        }
    }, 50);
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Validate form
            const formData = new FormData(this);
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const subject = formData.get('subject')?.trim();
            const message = formData.get('message')?.trim();
            
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 2000);
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Set styles based on type
    const styles = {
        position: 'fixed',
        top: '100px',
        right: '20px',
        maxWidth: '400px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '500',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(178, 150, 125, 0.2)'
    };
    
    const colors = {
        success: { bg: '#f0fdf4', color: '#059669', border: '#bbf7d0' },
        error: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
        info: { bg: '#f0f9ff', color: '#0284c7', border: '#bae6fd' }
    };
    
    const typeColors = colors[type] || colors.info;
    
    Object.assign(notification.style, {
        ...styles,
        background: typeColors.bg,
        color: typeColors.color,
        border: `1px solid ${typeColors.border}`
    });
    
    document.body.appendChild(notification);
    
    // Show notification
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });
    
    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Utility function for throttling
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add smooth hover effects to cards
function initCardEffects() {
    const cards = document.querySelectorAll('.project-card, .skill-category, .pillar, .stat');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`🚀 AI Portfolio loaded in ${Math.round(loadTime)}ms`);
    
    // Initialize additional effects after load
    setTimeout(() => {
        initCardEffects();
    }, 100);
});

// Console message for developers
console.log(`
    ╭─────────────────────────────────────╮
    │                                     │
    │   🤖 AI Portfolio - Yashraj Dudhe   │
    │                                     │
    │   Built with modern web standards   │
    │   → Minimal & Fast                  │
    │   → AI-Centric Design               │
    │   → Accessible & Responsive         │
    │                                     │
    │   Interested in AI projects?        │
    │   Let's collaborate!                │
    │                                     │
    ╰─────────────────────────────────────╯
`);