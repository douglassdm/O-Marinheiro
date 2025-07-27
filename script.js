// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        try {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.warn(`Target element not found: ${href}`);
            }
        } catch (error) {
            console.error('Error during smooth scrolling:', error);
        }
    });
});

// Button click animations
document.querySelectorAll('button, .book-now-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        try {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple && ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        } catch (error) {
            console.error('Error during ripple animation:', error);
        }
    });
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Typewriter effect with alternating words
function alternatingTypeWriter(element, words, typeSpeed = 100, eraseSpeed = 50, pauseTime = 2000) {
    if (!element || !words || words.length === 0) {
        console.error('Invalid parameters for typewriter effect');
        return;
    }
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        try {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                // Erasing characters
                element.innerHTML = currentWord.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    setTimeout(type, 500); // Small pause before typing next word
                    return;
                }
                setTimeout(type, eraseSpeed);
            } else {
                // Typing characters
                element.innerHTML = currentWord.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentWord.length) {
                    isDeleting = true;
                    setTimeout(type, pauseTime); // Pause before erasing
                    return;
                }
                setTimeout(type, typeSpeed);
            }
        } catch (error) {
            console.error('Error in typewriter animation:', error);
        }
    }
    
    type();
}

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNav = document.getElementById('main-nav');

if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', (e) => {
        try {
            e.stopPropagation();
            mobileNav.classList.toggle('active');
            const isActive = mobileNav.classList.contains('active');
            
            // Update ARIA attributes
            mobileMenuToggle.setAttribute('aria-expanded', isActive);
            
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                if (isActive) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                    mobileMenuToggle.setAttribute('aria-label', 'Fechar menu de navegação');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    mobileMenuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
                }
            }
        } catch (error) {
            console.error('Error toggling mobile menu:', error);
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        try {
            if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
                
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        } catch (error) {
            console.error('Error closing mobile menu:', error);
        }
    });
} else {
    console.warn('Mobile menu elements not found');
}

// Create global tooltip
let globalTooltip = null;

// Initialize all animations
window.addEventListener('DOMContentLoaded', function() {
    try {        
        // Initialize parallax
        initProjectsParallax();
        
        // Initialize contact form
        initContactForm();
        
        // Initialize scroll to top
        initScrollToTop();
        
        // Initialize header logo click
        initHeaderLogoClick();
        
        // Start alternating typewriter animation after a delay
        setTimeout(() => {
            const typewriterElement = document.getElementById('typewriter');
            if (typewriterElement) {
                alternatingTypeWriter(typewriterElement, ['Offshore', 'Navais'], 120, 80, 2000);
            } else {
                console.warn('Typewriter element not found');
            }
        }, 1200);
        
        // Initialize tooltips
        initTooltips();
        
    } catch (error) {
        console.error('Error initializing page scripts:', error);
    }
});

// Tooltip initialization function
function initTooltips() {            
    // Create global tooltip element
    globalTooltip = document.createElement('div');
    globalTooltip.style.cssText = `
        position: fixed;
        background: #000;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 12px;
        z-index: 99999;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        border: 1px solid rgba(255,255,255,0.1);
        box-shadow: 0 10px 40px rgba(0,0,0,0.4);
    `;
    document.body.appendChild(globalTooltip);
    
    const teamAvatars = document.querySelectorAll('.team-avatar');
    
    teamAvatars.forEach((avatar, index) => {
        const tooltip = avatar.querySelector('.tooltip');
        
        if (tooltip) {
            const nameElement = tooltip.querySelector('.tooltip-name');
            const designationElement = tooltip.querySelector('.tooltip-designation');
            
            if (nameElement && designationElement) {
                const name = nameElement.textContent;
                const designation = designationElement.textContent;
                
                avatar.addEventListener('mouseenter', (e) => {
                    globalTooltip.innerHTML = `<div style="font-weight: bold;">${name}</div><div style="opacity: 0.8; font-size: 11px;">${designation}</div>`;
                    globalTooltip.style.opacity = '1';
                    updateTooltipPosition(e);
                });
                
                avatar.addEventListener('mouseleave', () => {
                    globalTooltip.style.opacity = '0';
                });
                
                avatar.addEventListener('mousemove', updateTooltipPosition);
            }
        }
    });
};

function updateTooltipPosition(e) {
    if (globalTooltip) {
        globalTooltip.style.left = (e.clientX + 10) + 'px';
        globalTooltip.style.top = (e.clientY - 50) + 'px';
    }
}

// Projects Parallax Effect
function initProjectsParallax() {
    const projectsSection = document.querySelector('.projects-section');
    const projectsContent = document.querySelector('.projects-parallax-content');
    const projectsRows = document.querySelectorAll('.projects-row');
        
    if (!projectsSection || !projectsContent) {
        console.warn('Projects parallax elements not found');
        return;
    }

    function updateParallax() {
        try {
            const rect = projectsSection.getBoundingClientRect();
            const scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
            
            // Calculate transforms
            const translateX = scrollProgress * 1000;
            const translateXReverse = scrollProgress * -1000;
            const rotateX = Math.max(0, 15 - scrollProgress * 75);
            const opacity = Math.max(0.2, Math.min(1, 0.2 + scrollProgress * 4));
            const rotateZ = Math.max(0, 20 - scrollProgress * 100);
            const translateY = -700 + scrollProgress * 1200;

            // Apply transforms to content container
            projectsContent.style.transform = `
                rotateX(${rotateX}deg) 
                rotateZ(${rotateZ}deg) 
                translateY(${translateY}px)
            `;
            projectsContent.style.opacity = opacity;

            // Apply horizontal movement to rows
            projectsRows.forEach((row, index) => {
                if (row.classList.contains('projects-row-reverse')) {
                    row.style.transform = `translateX(${translateX - 500}px)`;
                } else {
                    row.style.transform = `translateX(${translateXReverse}px)`;
                }
            });
        } catch (error) {
            console.error('Error in parallax update:', error);
        }
    }

    // Throttled scroll handler
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial call
    updateParallax();
}

// WhatsApp form submission
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const phone = formData.get('phone') || '';
        const company = formData.get('company') || '';
        const service = formData.get('service') || '';
        const message = formData.get('message') || '';
        
        // Create WhatsApp message
        let whatsappMessage = `*Nova Solicitação de Contato - O Marinheiro*\n\n`;
        whatsappMessage += `*Nome:* ${name}\n`;
        whatsappMessage += `*E-mail:* ${email}\n`;
        
        if (phone) {
            whatsappMessage += `*Telefone:* ${phone}\n`;
        }
        
        if (company) {
            whatsappMessage += `*Empresa:* ${company}\n`;
        }
        
        if (service) {
            const serviceLabels = {
                'servicos-navios': 'Serviços em Navios',
                'servicos-offshore': 'Serviços Offshore',
                'inspecao-submarina': 'Inspeção Submarina',
                'consultoria': 'Consultoria Marítima',
                'emergencia': 'Atendimento de Emergência',
                'outros': 'Outros'
            };
            whatsappMessage += `*Serviço de Interesse:* ${serviceLabels[service] || service}\n`;
        }
        
        whatsappMessage += `\n*Mensagem:*\n${message}`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        
        // WhatsApp number (replace with the actual number)
        const whatsappNumber = '5599984995294'; // Format: country code + number without +
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Reset form
        contactForm.reset();
    });
}

// Scroll to Top functionality
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) {
        console.warn('Scroll to top button not found');
        return;
    }

    let isScrolling = false;

    // Show/hide button based on scroll position
    function toggleScrollButton() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollPosition > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }

    // Smooth scroll to top
    function scrollToTop(e) {
        e.preventDefault();
        
        if (isScrolling) return;
        isScrolling = true;
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Reset flag after scroll completes
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }

    // Throttled scroll handler for better performance
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                toggleScrollButton();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Event listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    scrollBtn.addEventListener('click', scrollToTop);

    // Initial check
    toggleScrollButton();
    
}

// Header Logo Click to Top
function initHeaderLogoClick() {
    const headerLogo = document.getElementById('headerLogo');
    if (!headerLogo) {
        console.warn('Header logo not found');
        return;
    }

    headerLogo.addEventListener('click', function(e) {
        e.preventDefault();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add hover effect
    headerLogo.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });

    headerLogo.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
}

