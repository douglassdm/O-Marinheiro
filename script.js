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
        
        // Initialize hero slideshow
        initHeroSlideshow();
        
        // Start alternating typewriter animation after a delay
        setTimeout(() => {
            const typewriterElement = document.getElementById('typewriter');
            if (typewriterElement) {
                alternatingTypeWriter(typewriterElement, ['Offshore', 'Navais'], 120, 80, 2000);
            } else {
                console.warn('Typewriter element not found');
            }
        }, 1200);
        
        
    } catch (error) {
        console.error('Error initializing page scripts:', error);
    }
});



// Projects Parallax Effect inspirado no componente React
function initProjectsParallax() {
    const projectsSection = document.querySelector('.projects-section');
    const projectsContent = document.querySelector('.projects-parallax-content');
    const projectsRows = document.querySelectorAll('.projects-row');
        
    if (!projectsSection || !projectsContent) {
        console.warn('Projects parallax elements not found');
        return;
    }

    // Valores target para animação suave (inspirado no useSpring)
    let currentValues = {
        translateX: 0,
        translateXReverse: 0,
        rotateX: 15,
        rotateZ: 20,
        translateY: -700,
        opacity: 0.2
    };

    let targetValues = { ...currentValues };
    let isAnimating = false;

    // Função de interpolação suave (similar ao useSpring)
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Função para animar valores suavemente
    function animateToTarget() {
        if (!isAnimating) return;

        // Ajusta fator de suavização baseado no dispositivo
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        
        let factor = 0.1; // Desktop: suave
        if (isMobile) {
            factor = 0.2; // Mobile: mais direto para melhor performance
        } else if (isTablet) {
            factor = 0.15; // Tablet: meio termo
        }
        
        let needsUpdate = false;

        // Interpola cada valor
        Object.keys(currentValues).forEach(key => {
            const current = currentValues[key];
            const target = targetValues[key];
            const diff = Math.abs(target - current);
            
            if (diff > 0.1) {
                currentValues[key] = lerp(current, target, factor);
                needsUpdate = true;
            } else {
                currentValues[key] = target;
            }
        });

        // Aplica as transformações interpoladas
        projectsContent.style.transform = `
            rotateX(${currentValues.rotateX}deg) 
            rotateZ(${currentValues.rotateZ}deg) 
            translateY(${currentValues.translateY}px)
        `;
        projectsContent.style.opacity = currentValues.opacity;

        // Aplica movimento horizontal suave
        projectsRows.forEach((row, index) => {
            if (row.classList.contains('projects-row-reverse')) {
                row.style.transform = `translateX(${currentValues.translateX - 500}px)`;
            } else {
                row.style.transform = `translateX(${currentValues.translateXReverse}px)`;
            }
        });

        if (needsUpdate) {
            requestAnimationFrame(animateToTarget);
        } else {
            isAnimating = false;
        }
    }

    function updateParallax() {
        try {
            const rect = projectsSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Só executa se a seção estiver visível
            if (rect.bottom < 0 || rect.top > viewportHeight) {
                return;
            }

            // Calcula progresso (similar ao useTransform do React)
            const scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - viewportHeight)));
            
            // Detecta dispositivos móveis para reduzir efeitos
            const isMobile = window.innerWidth <= 768;
            const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
            
            if (isMobile) {
                // Versão simplificada para mobile - apenas movimento horizontal e opacity
                targetValues.translateX = scrollProgress * 300; // Reduzido drasticamente
                targetValues.translateXReverse = scrollProgress * -300;
                targetValues.rotateX = 0; // Remove rotações
                targetValues.rotateZ = 0;
                targetValues.translateY = -200 + scrollProgress * 400; // Movimento vertical reduzido
                targetValues.opacity = Math.max(0.5, Math.min(1, 0.5 + scrollProgress * 2));
            } else if (isTablet) {
                // Versão intermediária para tablet
                targetValues.translateX = scrollProgress * 600;
                targetValues.translateXReverse = scrollProgress * -600;
                targetValues.rotateX = Math.max(0, 8 - scrollProgress * 40); // Rotações reduzidas
                targetValues.rotateZ = Math.max(0, 10 - scrollProgress * 50);
                targetValues.translateY = -400 + scrollProgress * 800;
                targetValues.opacity = Math.max(0.3, Math.min(1, 0.3 + scrollProgress * 3));
            } else {
                // Versão completa para desktop
                targetValues.translateX = scrollProgress * 1000;
                targetValues.translateXReverse = scrollProgress * -1000;
                targetValues.rotateX = Math.max(0, 15 - scrollProgress * 75);
                targetValues.rotateZ = Math.max(0, 20 - scrollProgress * 100);
                targetValues.translateY = -700 + scrollProgress * 1200;
                targetValues.opacity = Math.max(0.2, Math.min(1, 0.2 + scrollProgress * 4));
            }

            // Inicia animação suave se não estiver rodando
            if (!isAnimating) {
                isAnimating = true;
                animateToTarget();
            }
        } catch (error) {
            console.error('Error in parallax update:', error);
        }
    }

    // Throttle otimizado com diferentes sensibilidades por dispositivo
    let lastScrollY = 0;
    let ticking = false;
    
    function onScroll() {
        const currentScrollY = window.scrollY;
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        
        // Ajusta sensibilidade baseado no dispositivo
        let threshold = 2; // Desktop
        if (isMobile) {
            threshold = 8; // Mobile: menos updates para melhor performance
        } else if (isTablet) {
            threshold = 5; // Tablet: meio termo
        }
        
        // Só atualiza se houve movimento significativo
        if (Math.abs(currentScrollY - lastScrollY) < threshold) return;
        
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
                lastScrollY = currentScrollY;
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

// Hero Slideshow functionality
function initHeroSlideshow() {
    const hero = document.querySelector('.hero');
    const heroBg3 = document.querySelector('.hero-bg-3');
    
    if (!hero || !heroBg3) {
        console.warn('Hero slideshow elements not found');
        return;
    }

    // Array to keep track of background elements
    const backgrounds = [
        { element: hero, pseudo: 'before' }, // bg1.jpg
        { element: hero, pseudo: 'after' },  // bg2.jpg
        { element: heroBg3, pseudo: null }   // bg3.jpg
    ];
    
    let currentIndex = 0;
    
    // Function to show specific background
    function showBackground(index) {
        // Hide all backgrounds by removing active class
        hero.classList.remove('bg-1-active', 'bg-2-active', 'bg-3-active');
        heroBg3.classList.remove('active');
        
        // Show the selected background
        switch(index) {
            case 0:
                hero.classList.add('bg-1-active');
                break;
            case 1:
                hero.classList.add('bg-2-active');
                break;
            case 2:
                hero.classList.add('bg-3-active');
                heroBg3.classList.add('active');
                break;
        }
    }
    
    // Function to go to next background
    function nextBackground() {
        currentIndex = (currentIndex + 1) % backgrounds.length;
        showBackground(currentIndex);
    }
    
    // Show first background initially
    showBackground(0);
    
    // Start slideshow - change every 5 seconds
    setInterval(nextBackground, 5000);
}

