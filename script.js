// Utility functions
const Utils = {
    handleError: (error, context) => {
        console.error(`Error in ${context}:`, error);
    },
    
    checkElement: (element, name) => {
        if (!element) {
            console.warn(`${name} not found`);
            return false;
        }
        return true;
    },
    
    getDeviceType: () => {
        const width = window.innerWidth;
        return {
            isMobile: width <= 768,
            isTablet: width <= 1024 && width > 768,
            isDesktop: width > 1024
        };
    },
    
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
};

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
            Utils.handleError(error, 'smooth scrolling');
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


// Initialize all animations with performance optimizations
window.addEventListener('DOMContentLoaded', function() {
    try {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        
        // Initialize contact form
        initContactForm();
        
        // Initialize scroll to top
        initScrollToTop();
        
        // Initialize header logo click
        initHeaderLogoClick();
        
        // Initialize hero slideshow
        initHeroSlideshow();
        
        // Initialize language selector
        LanguageSelector.init();
        
        // Start alternating typewriter animation after a delay - now after LanguageSelector
        setTimeout(() => {
            const typewriterElement = document.getElementById('typewriter');
            if (typewriterElement) {
                // Use LanguageSelector's typewriter with saved language
                const savedLang = localStorage.getItem('selectedLanguage') || 'en';
                LanguageSelector.updateTypewriter(savedLang);
            } else {
                console.warn('Typewriter element not found');
            }
        }, 1200);
        
        // Initialize intersection observer for performance
        initIntersectionObserver();
        
        // Initialize map functionality
        MapManager.init();
        
        // Preload project images to prevent white spaces
        preloadProjectImages();
        
    } catch (error) {
        console.error('Error initializing page scripts:', error);
    }
});

// Intersection Observer for better performance on mobile
function initIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.feature-item, .service-card, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}



// Projects Parallax Effect inspirado no componente React
function initProjectsParallax() {
    const projectsSection = document.querySelector('.projects-section');
    const projectsContent = document.querySelector('.projects-parallax-content');
    const projectsRows = document.querySelectorAll('.projects-row');
        
    if (!Utils.checkElement(projectsSection, 'Projects section') || 
        !Utils.checkElement(projectsContent, 'Projects content')) return;

    let ticking = false;
    let lastScrollY = 0;

    function updateParallax() {
        try {
            const rect = projectsSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Só executa se a seção estiver visível
            if (rect.bottom < 0 || rect.top > viewportHeight) {
                return;
            }

            // Calcula progresso de scroll simples
            const scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - viewportHeight)));
            
            // Detecta tipo de dispositivo
            const { isMobile, isTablet } = Utils.getDeviceType();
            
            // Animação muito simplificada - apenas movimento horizontal e opacity
            if (isMobile) {
                // Mobile: animação mínima
                const translateX = scrollProgress * 150;
                projectsContent.style.opacity = Math.max(0.7, Math.min(1, 0.7 + scrollProgress * 0.3));
                
                projectsRows.forEach((row) => {
                    if (row.classList.contains('projects-row-reverse')) {
                        row.style.transform = `translateX(${translateX - 150}px)`;
                    } else {
                        row.style.transform = `translateX(${-translateX}px)`;
                    }
                });
            } else {
                // Desktop: animação suave mas performática
                const translateX = scrollProgress * 300;
                const translateY = -100 + scrollProgress * 200;
                
                projectsContent.style.transform = `translateY(${translateY}px)`;
                projectsContent.style.opacity = Math.max(0.5, Math.min(1, 0.5 + scrollProgress * 0.5));

                projectsRows.forEach((row) => {
                    if (row.classList.contains('projects-row-reverse')) {
                        row.style.transform = `translateX(${translateX - 300}px)`;
                    } else {
                        row.style.transform = `translateX(${-translateX}px)`;
                    }
                });
            }
        } catch (error) {
            Utils.handleError(error, 'updateParallax');
        }
    }
    
    function onScroll() {
        const currentScrollY = window.scrollY;
        
        // Throttling mais agressivo
        if (Math.abs(currentScrollY - lastScrollY) < 10) return;
        
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
                lastScrollY = currentScrollY;
            });
            ticking = true;
        }
    }

    // Event listener com throttling passivo
    window.addEventListener('scroll', Utils.throttle(onScroll, 16), { passive: true });
    
    // Initial call
    updateParallax();
    
    // Inicializar gerenciamento de imagens
    initProjectImages();
}

// Função para garantir carregamento correto das imagens
function initProjectImages() {
    const projectCards = document.querySelectorAll('.project-parallax-card');
    
    projectCards.forEach((card, index) => {
        const img = card.querySelector('img');
        if (!img) return;
        
        // Adicionar classe de loading
        card.classList.add('image-loading');
        
        // Criar uma nova imagem para verificar se carrega corretamente
        const testImage = new Image();
        
        testImage.onload = function() {
            // Imagem carregou com sucesso
            card.classList.remove('image-loading');
            card.classList.add('image-loaded');
            
            // Garantir que a src original está definida
            if (img.src !== testImage.src) {
                img.src = testImage.src;
            }
        };
        
        testImage.onerror = function() {
            // Erro no carregamento - tentar recarregar após um delay
            console.warn(`Failed to load image: ${img.src}`);
            
            setTimeout(() => {
                // Tentar recarregar a imagem
                if (img.src) {
                    testImage.src = img.src + '?reload=' + Date.now();
                }
            }, 1000 + (index * 200)); // Delay escalonado
        };
        
        // Iniciar o teste de carregamento
        testImage.src = img.src;
        
        // Observador para recarregar imagens quando elas ficam visíveis
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('img');
                    if (img && (!img.complete || img.naturalHeight === 0)) {
                        // Recarregar a imagem se não estiver carregada corretamente
                        const originalSrc = img.src;
                        img.src = '';
                        img.src = originalSrc;
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        observer.observe(card);
    });
}

// Preload project images to prevent blank/white issues
function preloadProjectImages() {
    const projectImages = [
        'img/services/reparo-plataforma.JPG',
        'img/services/reparo-navio.jpg',
        'img/services/resgate.jpg',
        'img/services/inspecoes.jpeg',
        'img/services/hidrojateamento.jpg',
        'img/services/reparo-mergulhador.jpg',
        'img/services/solda.JPG',
        'img/services/limpeza-casco.jpeg',
        'img/services/frota.jpeg',
        'img/services/mergulho-tecnico.jpeg',
        'img/services/reparo-offshore.jpg',
        'img/services/instalações.jpg',
        'img/services/consultoria-naval.jpg',
        'img/services/manutencao-preventiva.jpg',
        'img/services/sede-operacional-2.jpeg'
    ];

    projectImages.forEach((imageSrc, index) => {
        const img = new Image();
        img.onload = function() {
            console.log(`Image loaded: ${imageSrc}`);
        };
        img.onerror = function() {
            console.warn(`Failed to preload image: ${imageSrc}`);
        };
        
        // Delay progressivo para evitar sobrecarga
        setTimeout(() => {
            img.src = imageSrc;
        }, index * 100);
    });
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
    if (!Utils.checkElement(scrollBtn, 'Scroll to top button')) return;

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
        { element: hero, pseudo: 'before' }, // bg.png
        { element: hero, pseudo: 'after' },  // bg-1.jpeg
        { element: heroBg3, pseudo: null }   // bg-2.jpeg
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

// Language Selector
const LanguageSelector = {
    init: function() {
        this.bindEvents();
        this.setInitialLanguage();
    },
    
    bindEvents: function() {
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                this.changeLanguage(lang);
            });
        });
    },
    
    setInitialLanguage: function() {
        // Set English as default active
        const savedLang = localStorage.getItem('selectedLanguage') || 'en';
        this.changeLanguage(savedLang);
    },
    
    changeLanguage: function(lang) {
        // Update active state
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-lang="${lang}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Save language preference
        localStorage.setItem('selectedLanguage', lang);
        
        // Add language class to body for future styling
        document.body.className = document.body.className.replace(/lang-\w+/g, '');
        document.body.classList.add(`lang-${lang}`);
        
        console.log(`Language changed to: ${lang}`);
        
        // Here you would typically load language-specific content
        // For now, just console.log the change
        this.updateContent(lang);
    },
    
    updateContent: function(lang) {
        const translations = {
            en: {
                // Navigation
                about: "ABOUT US",
                services: "SERVICES", 
                projects: "PROJECTS",
                team: "TEAM",
                technology: "TECHNOLOGY",
                contact: "CONTACT",
                
                // Hero Section
                "hero-subtitle": "40+ YEARS OF EXPERIENCE IN PROFESSIONAL DIVING",
                "hero-title-1": "Excellence in",
                "hero-title-2": "Services",
                "hero-cta": "GET TO KNOW US",
                
                // About Section
                "about-subtitle": "ABOUT US",
                "about-title": "Why choose Marinheiro for your maritime adventures?",
                "about-description": "With 44 years of tradition in professional diving, we are pioneers in underwater engineering solutions in Maranhão. Our unique experience positions us as leaders in offshore services with zero accidents.",
                "feature-1-title": "Premium Fleet",
                "feature-1-desc": "Modern and well-maintained boats, equipped with the latest safety technology and comfort amenities.",
                "feature-2-title": "Main Activities",
                "feature-2-desc": "Underwater Inspections, Vessel Salvage and Rescue, and Offshore Services",
                "feature-3-title": "Safety First",
                "feature-3-desc": "Comprehensive safety protocols and equipment to ensure your peace of mind on all journeys.",
                
                // ROV Preview Section
                "rov-preview-subtitle": "ADVANCED TECHNOLOGY",
                "rov-preview-title": "Latest Generation Underwater Drone",
                "rov-preview-description": "We have an underwater drone that performs inspections where divers cannot go. Safe, precise and with crystal clear 4K vision.",
                "rov-highlight-title": "100 meters deep",
                "rov-highlight-desc": "Zero risk for divers + 4K Images",
                "rov-curiosity": "💡 How does this work? Discover the technology that is revolutionizing underwater inspections",
                "rov-cta-btn": "See Technology",
                "rov-status": "OPERATIONAL",
                
                // Services Section
                "services-subtitle": "OUR SERVICES",
                "services-title": "Complete Solutions for the Maritime Sector",
                "services-description": "We offer a wide range of specialized services in professional diving, underwater welding, and offshore solutions with over 40 years of experience.",
                "service-1-title": "Ship Services",
                "service-1-desc": "Hull cleaning, anode replacement, and structural repairs on floating vessels.",
                "service-1-feat-1": "Hull cleaning",
                "service-1-feat-2": "Anode replacement",
                "service-1-feat-3": "Propeller and rudder repairs",
                "service-1-feat-4": "Underwater cutting and welding",
                "service-2-title": "Offshore Services",
                "service-2-desc": "Offshore operations with UAP hydro-jetting and installation of advanced submarine systems.",
                "service-2-feat-1": "UAP Hydro-jetting 40,000 PSI",
                "service-2-feat-2": "Cathodic protection",
                "service-2-feat-3": "Salvage and rescue",
                "service-2-feat-4": "Underwater rigging",
                "service-3-title": "Underwater Inspection",
                "service-3-desc": "Detailed inspection with underwater photography and video for complete structural analysis.",
                "service-3-feat-1": "Underwater visual inspection",
                "service-3-feat-2": "Photography and video",
                "service-3-feat-3": "Sample collection",
                "service-3-feat-4": "Technical reports",
                
                // Projects Section
                "projects-title-1": "Our Maritime",
                "projects-title-2": "Projects",
                "projects-description": "We build innovative solutions for the maritime sector with the latest technologies. We are a team passionate about developing incredible projects.",
                
                // Clients Section
                "clients-subtitle": "OUR CLIENTS",
                "clients-title": "Companies That Trust Our Services",
                "clients-description": "For over 40 years serving the main players in the maritime and offshore sector.",
                
                // Map Section
                "map-subtitle": "WHERE WE OPERATE",
                "map-title": "Our Operations Across Brazil",
                "map-description": "Specialists in underwater services for maritime terminals, port structures and railway systems throughout the national territory.",
                
                // Contact Section
                "contact-subtitle": "GET IN TOUCH",
                "contact-title": "Ready for Your Next Operation?",
                "contact-description": "We are ready to meet your maritime needs. Contact us to request a quote or clarify doubts.",
                "contact-address-label": "Address",
                "contact-phone-label": "Phone",
                "contact-email-label": "Email",
                
                // Typewriter words
                "typewriter-words": ["Offshore", "Naval"],
                
                // Contact Form
                "form-name-label": "Full Name",
                "form-email-label": "Email",
                "form-phone-label": "Phone",
                "form-company-label": "Company",
                "form-service-label": "Service of Interest",
                "form-message-label": "Message",
                "form-select-placeholder": "Select a service",
                "form-option-ships": "Ship Services",
                "form-option-offshore": "Offshore Services",
                "form-option-inspection": "Underwater Inspection",
                "form-option-consulting": "Maritime Consulting",
                "form-option-emergency": "Emergency Service",
                "form-option-others": "Others",
                "form-message-placeholder": "Describe your need or project...",
                "form-submit-button": "Send Message",
                
                // Footer
                "footer-description": "For over 40 years offering specialized solutions in professional diving, offshore services and naval maintenance with excellence and safety.",
                "footer-cert-1": "ISO 9001 Certified",
                "footer-cert-2": "CREA-MA Registration",
                "footer-services-title": "Our Services",
                "footer-contact-title": "Contact",
                "footer-service-1": "Ship Services",
                "footer-service-2": "Offshore Services",
                "footer-service-3": "Underwater Inspection",
                "footer-service-4": "Underwater Welding",
                "footer-service-5": "Maritime Consulting",
                "footer-copyright": "© 2025 O Marinheiro. All rights reserved.",
                "footer-link-about": "About",
                "footer-link-services": "Services",
                "footer-link-projects": "Projects",
                "footer-link-contact": "Contact"
            },
            pt: {
                // Navigation
                about: "SOBRE NÓS",
                services: "SERVIÇOS",
                projects: "PROJETOS", 
                team: "EQUIPE",
                technology: "TECNOLOGIA",
                contact: "CONTATO",
                
                // Hero Section
                "hero-subtitle": "+ 40 ANOS DE EXPERIÊNCIA EM MERGULHO PROFISSIONAL",
                "hero-title-1": "Excelência em",
                "hero-title-2": "Serviços",
                "hero-cta": "VENHA NOS CONHECER",
                
                // About Section
                "about-subtitle": "SOBRE NÓS",
                "about-title": "Por que escolher o Marinheiro para suas aventuras marítimas?",
                "about-description": "Com 44 anos de tradição no mergulho profissional, somos pioneiros em soluções de engenharia subaquática no Maranhão. Nossa experiência única nos posiciona como líderes em serviços offshore com acidente zero.",
                "feature-1-title": "Frota Premium",
                "feature-1-desc": "Barcos modernos e bem conservados, equipados com a mais recente tecnologia de segurança e comodidades de conforto.",
                "feature-2-title": "Principais atividades",
                "feature-2-desc": "Inspeções Submarinas, Salvamento e Resgate de Embarcações e Serviços Offshore",
                "feature-3-title": "Segurança em primeiro lugar",
                "feature-3-desc": "Protocolos e equipamentos de segurança abrangentes para garantir sua tranquilidade em todas as viagens.",
                
                // ROV Preview Section
                "rov-preview-subtitle": "TECNOLOGIA AVANÇADA",
                "rov-preview-title": "Drone Submarino de Última Geração",
                "rov-preview-description": "Temos um drone submarino que realiza inspeções onde mergulhadores não podem ir. Seguro, preciso e com visão 4K cristalina.",
                "rov-highlight-title": "100 metros de profundidade",
                "rov-highlight-desc": "Zero risco para mergulhadores + Imagens em 4K",
                "rov-curiosity": "💡 Como isso funciona? Descubra a tecnologia que está revolucionando inspeções submarinas",
                "rov-cta-btn": "Ver Tecnologia",
                "rov-status": "OPERACIONAL",
                
                // Services Section
                "services-subtitle": "NOSSOS SERVIÇOS",
                "services-title": "Soluções Completas para o Setor Marítimo",
                "services-description": "Oferecemos uma ampla gama de serviços especializados em mergulho profissional, soldas subaquáticas e soluções offshore com mais de 40 anos de experiência.",
                "service-1-title": "Serviços em Navios",
                "service-1-desc": "Limpeza de obras vivas, substituição de anodos e reparos estruturais em embarcações flutuando.",
                "service-1-feat-1": "Limpeza nas obras vivas",
                "service-1-feat-2": "Substituição de anodos",
                "service-1-feat-3": "Reparos no hélice e leme",
                "service-1-feat-4": "Corte e solda subaquática",
                "service-2-title": "Serviços Offshore",
                "service-2-desc": "Operações offshore com hidrojateamento UAP e instalação de sistemas submarinos avançados.",
                "service-2-feat-1": "Hidrojateamento UAP 40.000 PSI",
                "service-2-feat-2": "Proteção catódica",
                "service-2-feat-3": "Salvamento e resgate",
                "service-2-feat-4": "Laçadas submarinas",
                "service-3-title": "Inspeção Submarina",
                "service-3-desc": "Inspeção detalhada com fotografia e vídeo subaquáticos para análise estrutural completa.",
                "service-3-feat-1": "Inspeção visual subaquática",
                "service-3-feat-2": "Fotografia e vídeo",
                "service-3-feat-3": "Coleta de amostras",
                "service-3-feat-4": "Relatórios técnicos",
                
                // Projects Section
                "projects-title-1": "Nossos Projetos",
                "projects-title-2": "Marítimos",
                "projects-description": "Construímos soluções inovadoras para o setor marítimo com as mais recentes tecnologias. Somos uma equipe apaixonada por desenvolver projetos incríveis.",
                
                // Clients Section
                "clients-subtitle": "NOSSOS CLIENTES",
                "clients-title": "Empresas que Confiam em Nossos Serviços",
                "clients-description": "Há mais de 40 anos atendendo os principais players do setor marítimo e offshore.",
                
                // Map Section
                "map-subtitle": "ONDE ATUAMOS",
                "map-title": "Nossas Operações pelo Brasil",
                "map-description": "Especialistas em serviços subaquáticos para terminais marítimos, estruturas portuárias e sistemas ferroviários em todo o território nacional.",
                
                // Contact Section
                "contact-subtitle": "ENTRE EM CONTATO",
                "contact-title": "Pronto para Sua Próxima Operação?",
                "contact-description": "Estamos prontos para atender suas necessidades marítimas. Entre em contato conosco para solicitar um orçamento ou esclarecer dúvidas.",
                "contact-address-label": "Endereço",
                "contact-phone-label": "Telefone",
                "contact-email-label": "E-mail",
                
                // Typewriter words
                "typewriter-words": ["Offshore", "Navais"],
                
                // Contact Form
                "form-name-label": "Nome Completo",
                "form-email-label": "E-mail",
                "form-phone-label": "Telefone",
                "form-company-label": "Empresa",
                "form-service-label": "Serviço de Interesse",
                "form-message-label": "Mensagem",
                "form-select-placeholder": "Selecione um serviço",
                "form-option-ships": "Serviços em Navios",
                "form-option-offshore": "Serviços Offshore",
                "form-option-inspection": "Inspeção Submarina",
                "form-option-consulting": "Consultoria Marítima",
                "form-option-emergency": "Atendimento de Emergência",
                "form-option-others": "Outros",
                "form-message-placeholder": "Descreva sua necessidade ou projeto...",
                "form-submit-button": "Enviar Mensagem",
                
                // Footer
                "footer-description": "Há mais de 40 anos oferecendo soluções especializadas em mergulho profissional, serviços offshore e manutenção naval com excelência e segurança.",
                "footer-cert-1": "Certificado ISO 9001",
                "footer-cert-2": "Registro CREA-MA",
                "footer-services-title": "Nossos Serviços",
                "footer-contact-title": "Contato",
                "footer-service-1": "Serviços em Navios",
                "footer-service-2": "Serviços Offshore",
                "footer-service-3": "Inspeção Submarina",
                "footer-service-4": "Soldas Subaquáticas",
                "footer-service-5": "Consultoria Marítima",
                "footer-copyright": "© 2025 O Marinheiro. Todos os direitos reservados.",
                "footer-link-about": "Sobre",
                "footer-link-services": "Serviços",
                "footer-link-projects": "Projetos",
                "footer-link-contact": "Contato"
            },
            zh: {
                // Navigation
                about: "关于我们",
                services: "服务",
                projects: "项目",
                team: "团队",
                technology: "技术",
                contact: "联系我们",
                
                // Hero Section
                "hero-subtitle": "40多年专业潜水经验",
                "hero-title-1": "卓越的",
                "hero-title-2": "服务",
                "hero-cta": "了解我们",
                
                // About Section
                "about-subtitle": "关于我们",
                "about-title": "为什么选择水手进行您的海事冒险？",
                "about-description": "拥有44年专业潜水传统，我们是马拉尼奥州水下工程解决方案的先驱者。我们独特的经验使我们成为零事故海上服务的领导者。",
                "feature-1-title": "高级船队",
                "feature-1-desc": "现代化且维护良好的船只，配备最新的安全技术和舒适设施。",
                "feature-2-title": "主要活动",
                "feature-2-desc": "水下检查、船舶打捞救援和海上服务",
                "feature-3-title": "安全第一",
                "feature-3-desc": "全面的安全协议和设备，确保您在所有航程中的安心。",
                
                // ROV Preview Section
                "rov-preview-subtitle": "先进技术",
                "rov-preview-title": "最新一代水下无人机",
                "rov-preview-description": "我们拥有一台水下无人机，可以在潜水员无法到达的地方进行检测。安全、精确，具有水晶般清晰的4K视觉。",
                "rov-highlight-title": "100米深度",
                "rov-highlight-desc": "潜水员零风险 + 4K图像",
                "rov-curiosity": "💡 这是如何工作的？探索正在革命化水下检测的技术",
                "rov-cta-btn": "查看技术",
                "rov-status": "运行中",
                
                // Services Section
                "services-subtitle": "我们的服务",
                "services-title": "海事行业完整解决方案",
                "services-description": "我们提供专业潜水、水下焊接和海上解决方案的广泛专业服务，拥有超过40年的经验。",
                "service-1-title": "船舶服务",
                "service-1-desc": "船体清洁、阳极更换和浮动船只结构修理。",
                "service-1-feat-1": "船体清洁",
                "service-1-feat-2": "阳极更换",
                "service-1-feat-3": "螺旋桨和舵修理",
                "service-1-feat-4": "水下切割和焊接",
                "service-2-title": "海上服务",
                "service-2-desc": "UAP高压水射流海上作业和先进潜艇系统安装。",
                "service-2-feat-1": "UAP高压水射流40,000 PSI",
                "service-2-feat-2": "阴极保护",
                "service-2-feat-3": "打捞救援",
                "service-2-feat-4": "水下索具",
                "service-3-title": "水下检查",
                "service-3-desc": "通过水下摄影和视频进行详细检查，进行完整的结构分析。",
                "service-3-feat-1": "水下目视检查",
                "service-3-feat-2": "摄影和视频",
                "service-3-feat-3": "样品采集",
                "service-3-feat-4": "技术报告",
                
                // Projects Section
                "projects-title-1": "我们的海事",
                "projects-title-2": "项目",
                "projects-description": "我们用最新技术为海事行业构建创新解决方案。我们是一支致力于开发令人惊叹项目的团队。",
                
                // Clients Section
                "clients-subtitle": "我们的客户",
                "clients-title": "信任我们服务的公司",
                "clients-description": "40多年来服务海事和海上行业的主要参与者。",
                
                // Map Section
                "map-subtitle": "我们的业务范围",
                "map-title": "我们在巴西的业务",
                "map-description": "专门为海事码头、港口结构和铁路系统提供水下服务，覆盖全国范围。",
                
                // Contact Section
                "contact-subtitle": "联系我们",
                "contact-title": "准备好您的下一次操作了吗？",
                "contact-description": "我们准备好满足您的海事需求。联系我们获取报价或澄清疑问。",
                "contact-address-label": "地址",
                "contact-phone-label": "电话",
                "contact-email-label": "电子邮件",
                
                // Typewriter words
                "typewriter-words": ["海上", "船舶"],
                
                // Contact Form
                "form-name-label": "全名",
                "form-email-label": "电子邮件",
                "form-phone-label": "电话",
                "form-company-label": "公司",
                "form-service-label": "感兴趣的服务",
                "form-message-label": "消息",
                "form-select-placeholder": "选择服务",
                "form-option-ships": "船舶服务",
                "form-option-offshore": "海上服务",
                "form-option-inspection": "水下检查",
                "form-option-consulting": "海事咨询",
                "form-option-emergency": "紧急服务",
                "form-option-others": "其他",
                "form-message-placeholder": "描述您的需求或项目...",
                "form-submit-button": "发送消息",
                
                // Footer
                "footer-description": "40多年来提供专业潜水、海上服务和船舶维护的专业解决方案，追求卓越和安全。",
                "footer-cert-1": "ISO 9001认证",
                "footer-cert-2": "CREA-MA注册",
                "footer-services-title": "我们的服务",
                "footer-contact-title": "联系方式",
                "footer-service-1": "船舶服务",
                "footer-service-2": "海上服务",
                "footer-service-3": "水下检查",
                "footer-service-4": "水下焊接",
                "footer-service-5": "海事咨询",
                "footer-copyright": "© 2025 水手公司。保留所有权利。",
                "footer-link-about": "关于",
                "footer-link-services": "服务",
                "footer-link-projects": "项目",
                "footer-link-contact": "联系"
            }
        };
        
        // Update navigation menu
        const navLinks = document.querySelectorAll('.nav a');
        const currentTranslations = translations[lang];
        
        if (navLinks.length >= 6 && currentTranslations) {
            navLinks[0].textContent = currentTranslations.about;
            navLinks[1].textContent = currentTranslations.services;
            navLinks[2].textContent = currentTranslations.projects;
            navLinks[3].textContent = currentTranslations.team;
            navLinks[4].textContent = currentTranslations.technology;
            navLinks[5].textContent = currentTranslations.contact;
        }
        
        // Update all elements with data-translate attributes
        const translatableElements = document.querySelectorAll('[data-translate]');
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (currentTranslations[key]) {
                element.textContent = currentTranslations[key];
            }
        });
        
        // Update placeholders with data-translate-placeholder attributes
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (currentTranslations[key]) {
                element.placeholder = currentTranslations[key];
            }
        });
        
        // Update typewriter effect with current language
        this.updateTypewriter(lang);
        
        // Update map popup content with current language
        if (typeof MapManager !== 'undefined' && MapManager.updatePopupContent) {
            MapManager.updatePopupContent(lang);
        }
    },
    
    updateTypewriter: function(lang) {
        console.log('Updating typewriter for language:', lang);
        
        const translations = {
            en: { "typewriter-words": ["Offshore", "Naval"] },
            pt: { "typewriter-words": ["Offshore", "Navais"] },
            zh: { "typewriter-words": ["海上", "船舶"] }
        };
        
        const typewriterElement = document.getElementById('typewriter');
        console.log('Typewriter element found:', !!typewriterElement);
        
        if (typewriterElement && translations[lang] && translations[lang]["typewriter-words"]) {
            // Clear current typewriter content
            typewriterElement.textContent = '';
            
            // Stop any existing animation by clearing potential intervals
            if (window.currentTypewriterTimeout) {
                clearTimeout(window.currentTypewriterTimeout);
            }
            
            // Start new typewriter animation with current language words
            const words = translations[lang]["typewriter-words"];
            console.log('Starting typewriter with words:', words);
            this.startTypewriterAnimation(typewriterElement, words);
        } else {
            console.error('Typewriter update failed:', {
                element: !!typewriterElement,
                lang: lang,
                hasTranslation: !!(translations[lang] && translations[lang]["typewriter-words"])
            });
        }
    },
    
    startTypewriterAnimation: function(element, words, typeSpeed = 120, eraseSpeed = 80, pauseTime = 2000) {
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
                    element.textContent = currentWord.substring(0, charIndex - 1);
                    charIndex--;
                    
                    if (charIndex === 0) {
                        isDeleting = false;
                        wordIndex = (wordIndex + 1) % words.length;
                        window.currentTypewriterTimeout = setTimeout(type, typeSpeed);
                        return;
                    }
                    window.currentTypewriterTimeout = setTimeout(type, eraseSpeed);
                } else {
                    element.textContent = currentWord.substring(0, charIndex + 1);
                    charIndex++;
                    
                    if (charIndex === currentWord.length) {
                        isDeleting = true;
                        window.currentTypewriterTimeout = setTimeout(type, pauseTime);
                        return;
                    }
                    window.currentTypewriterTimeout = setTimeout(type, typeSpeed);
                }
            } catch (error) {
                console.error('Error in typewriter animation:', error);
            }
        }
        
        type();
    }
};

// Map functionality
const MapManager = {
    map: null,
    markers: [],
    
    locations: [
        {
            city: 'São Luís',
            state: 'MA',
            lat: -2.5387,
            lng: -44.2825,
            icon: 'fas fa-anchor'
        },
        {
            city: 'Fortaleza',
            state: 'CE',
            lat: -3.7172,
            lng: -38.5434,
            icon: 'fas fa-ship'
        },
        {
            city: 'Marabá',
            state: 'PA',
            lat: -5.3687,
            lng: -49.1177,
            icon: 'fas fa-tools'
        },
        {
            city: 'Parauapebas',
            state: 'PA',
            lat: -6.0677,
            lng: -50.1618,
            icon: 'fas fa-cog'
        },
        {
            city: 'Belém',
            state: 'PA',
            lat: -1.4558,
            lng: -48.5044,
            icon: 'fas fa-water'
        },
        {
            city: 'Barcarena',
            state: 'PA',
            lat: -1.6178,
            lng: -48.6262,
            icon: 'fas fa-anchor'
        },
        {
            city: 'Recife',
            state: 'PE',
            lat: -8.0476,
            lng: -34.8770,
            icon: 'fas fa-ship'
        },
        {
            city: 'Natal',
            state: 'RN',
            lat: -5.7945,
            lng: -35.2110,
            icon: 'fas fa-wrench'
        }
    ],

    init() {
        try {
            const mapElement = document.getElementById('service-map');
            if (!mapElement) {
                console.warn('Map element not found');
                return;
            }

            // Initialize map centered on Brazil
            this.map = L.map('service-map').setView([-5.0, -42.0], 5);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);

            // Add markers for each location
            this.addMarkers();
            
            // Update popup content with current language
            const currentLang = localStorage.getItem('selectedLanguage') || 'en';
            this.updatePopupContent(currentLang);
            
        } catch (error) {
            Utils.handleError(error, 'MapManager.init');
        }
    },

    addMarkers() {
        try {
            this.locations.forEach(location => {
                // Create custom marker icon
                const customIcon = L.divIcon({
                    className: 'custom-marker',
                    html: `<div class="marker-content"><i class="${location.icon}"></i></div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                    popupAnchor: [0, -15]
                });

                // Create marker
                const marker = L.marker([location.lat, location.lng], {
                    icon: customIcon
                }).addTo(this.map);

                // Add popup - will be updated with translations
                marker.bindPopup('', { className: 'map-popup-container' });

                // Store marker reference
                this.markers.push({
                    marker: marker,
                    location: location
                });
            });
        } catch (error) {
            Utils.handleError(error, 'MapManager.addMarkers');
        }
    },


    // Update popup content with current language
    updatePopupContent(lang = 'pt') {
        try {
            this.markers.forEach(markerData => {
                const location = markerData.location;
                
                const popupContent = `
                    <div class="map-popup">
                        <h4>${location.city} - ${location.state}</h4>
                    </div>
                `;
                
                markerData.marker.setPopupContent(popupContent);
            });
        } catch (error) {
            Utils.handleError(error, 'MapManager.updatePopupContent');
        }
    },


    // Resize map when window resizes
    handleResize() {
        try {
            if (this.map) {
                this.map.invalidateSize();
            }
        } catch (error) {
            Utils.handleError(error, 'MapManager.handleResize');
        }
    }
};

// Window resize handler for map
window.addEventListener('resize', Utils.throttle(() => {
    MapManager.handleResize();
}, 250));

