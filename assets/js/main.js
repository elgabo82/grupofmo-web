class App {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollEffects();
    this.setupNavigation();
    this.setupForm();
    this.setupAnimations();
    this.setupIntersectionObserver();
  }

  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupMenuToggle();
      this.setupScrollToTop();
      this.setupNotifications();
      this.setupSmoothScrolling();
    });

    window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    window.addEventListener('scroll', this.debounce(this.handleScroll.bind(this), 16));
  }

  setupMenuToggle() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.getElementById('menuOverlay');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        menuOverlay?.classList.toggle('active');
      });

      menuOverlay?.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuOverlay.classList.remove('active');
      });

      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.classList.remove('menu-open');
          menuOverlay?.classList.remove('active');
        }
      });
    }
  }

  setupScrollEffects() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const updateActiveNav = () => {
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
        
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const menuOverlay = document.getElementById('menuOverlay');
        
        navToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuOverlay?.classList.remove('active');
      });
    });
  }

  setupForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
          submitBtn.disabled = true;

          const formData = new FormData(form);
          const data = Object.fromEntries(formData);
          
          await this.simulateFormSubmission(data);
          
          this.showNotification('Mensaje enviado con éxito. Te contactaremos pronto.', 'success');
          form.reset();
          
        } catch (error) {
          this.showNotification('Error al enviar el mensaje. Inténtalo nuevamente.', 'error');
        } finally {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      });

      this.setupFormValidation(form);
    }
  }

  setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          this.validateField(input);
        }
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    field.classList.remove('error');
    this.removeFieldError(field);

    if (field.hasAttribute('required') && !value) {
      this.showFieldError(field, 'Este campo es obligatorio');
      isValid = false;
    }

    if (field.type === 'email' && value && !this.isValidEmail(value)) {
      this.showFieldError(field, 'Ingresa un correo electrónico válido');
      isValid = false;
    }

    if (field.type === 'tel' && value && !this.isValidPhone(value)) {
      this.showFieldError(field, 'Ingresa un número de teléfono válido');
      isValid = false;
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorElement);
  }

  removeFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^[+]?[\d\s()-]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
  }

  async simulateFormSubmission(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form data submitted:', data);
        resolve();
      }, 1500);
    });
  }

  setupAnimations() {
    this.setupCounterAnimation();
    this.setupTechGridAnimation();
  }

  setupCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const animateCounter = (counter) => {
      const target = +counter.textContent.replace(/[^0-9]/g, '');
      const increment = target / speed;
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current) + (counter.textContent.includes('%') ? '%' : '+');
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + (counter.textContent.includes('%') ? '%' : '+');
        }
      };

      updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  setupTechGridAnimation() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.2}s`;
    });
  }

  setupIntersectionObserver() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animation = entry.target.dataset.aos || 'fade-up';
          const delay = entry.target.dataset.aosDelay || 0;
          
          entry.target.style.opacity = '0';
          entry.target.style.transform = this.getTransformForAnimation(animation);
          
          setTimeout(() => {
            entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
          }, delay);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  getTransformForAnimation(animation) {
    const transforms = {
      'fade-up': 'translateY(30px)',
      'fade-down': 'translateY(-30px)',
      'fade-left': 'translateX(-30px)',
      'fade-right': 'translateX(30px)',
      'zoom-in': 'scale(0.8)',
      'zoom-out': 'scale(1.2)'
    };
    return transforms[animation] || 'translateY(30px)';
  }

  setupScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');
    
    if (scrollButton) {
      scrollButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });

      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
          scrollButton.classList.add('show');
        } else {
          scrollButton.classList.remove('show');
        }
      });
    }
  }

  setupNotifications() {
    const notification = document.getElementById('notification');
    const closeBtn = notification?.querySelector('.notification-close');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideNotification();
      });
    }

    if (notification) {
      notification.addEventListener('click', (e) => {
        if (e.target === notification) {
          this.hideNotification();
        }
      });
    }
  }

  showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = notification?.querySelector('.notification-message');
    const iconElement = notification?.querySelector('.notification-content i');
    
    if (!notification || !messageElement) return;

    messageElement.textContent = message;
    
    if (iconElement) {
      const iconClasses = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      };
      
      iconElement.className = iconClasses[type] || iconClasses.success;
    }

    notification.classList.add('show');
    
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  hideNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
      notification.classList.remove('show');
    }
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  handleResize() {
    if (window.innerWidth > 768) {
      const navToggle = document.querySelector('.nav-toggle');
      const navMenu = document.querySelector('.nav-menu');
      
      navToggle?.classList.remove('active');
      navMenu?.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  }

  handleScroll() {
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
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
}

class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    this.measurePageLoad();
    this.setupPerformanceObserver();
  }

  measurePageLoad() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart;
        
        console.log('Page Performance:', {
          pageLoadTime: `${pageLoadTime}ms`,
          domContentLoaded: `${domContentLoaded}ms`,
          firstContentfulPaint: this.getFCP()
        });
      }, 0);
    });
  }

  getFCP() {
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    return fcpEntry ? `${Math.round(fcpEntry.startTime)}ms` : 'N/A';
  }

  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure') {
            console.log(`Performance: ${entry.name} - ${entry.duration}ms`);
          }
        });
      });
      
      observer.observe({ entryTypes: ['measure'] });
    }
  }
}

class ThemeManager {
  constructor() {
    this.init();
  }

  init() {
    this.loadTheme();
    this.setupThemeToggle();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  setupThemeToggle() {
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
  new PerformanceMonitor();
  new ThemeManager();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}