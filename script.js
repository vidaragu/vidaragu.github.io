document.addEventListener('DOMContentLoaded', function() {
    // Add Inter font
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);

    // Dark mode functionality
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            this.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            this.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    // Ripple effect for buttons
    document.querySelectorAll('.cta-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size/2;
            const y = e.clientY - rect.top - size/2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // "Ver más" functionality
    const verMasBtn = document.getElementById('ver-mas');
    const hiddenProducts = document.querySelectorAll('.product-card.hidden');
    let productsShown = 15; // Initially showing 15 products
    
    verMasBtn.addEventListener('click', function() {
        // Show next 15 products
        for (let i = productsShown; i < productsShown + 15 && i < hiddenProducts.length; i++) {
            hiddenProducts[i].classList.remove('hidden');
        }
        
        productsShown += 15;
        
        // Hide button when all products are shown
        if (productsShown >= 50) {
            verMasBtn.style.display = 'none';
        }
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe product cards and trust items
    document.querySelectorAll('.product-card, .trust-item').forEach(item => {
        observer.observe(item);
    });

    // Lazy load images
    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.srcset = img.dataset.srcset || '';
                img.classList.remove('lazy');
                lazyLoadObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        // Show skeleton while loading
        const skeleton = document.createElement('div');
        skeleton.classList.add('skeleton');
        img.parentNode.insertBefore(skeleton, img);
        img.style.display = 'none';
        
        lazyLoadObserver.observe(img);
        
        img.onload = function() {
            skeleton.remove();
            img.style.display = 'block';
        };
    });

    // Add schema markup for products (dynamically)
    const products = document.querySelectorAll('.product-card');
    products.forEach((product, index) => {
        const name = product.querySelector('h3').textContent;
        const description = product.querySelector('p').textContent;
        const image = product.querySelector('img').src;
        
        // Create and append schema markup for each product
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": name,
            "description": description,
            "image": image,
            "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "price": "999",
                "priceCurrency": "USD"
            }
        });
        
        document.head.appendChild(schemaScript);
    });

    // Ad functionality
    const topAd = document.getElementById('top-ad');
    const sideAd = document.getElementById('side-ad');
    const hideAdsToggle = document.getElementById('hide-ads-toggle');
    const sideAdTab = document.querySelector('.side-ad-tab');
    const sideAdClose = document.querySelector('.side-ad-close');
    const topAdClose = document.querySelector('.ad-close');
    const overlay = document.createElement('div');
    overlay.classList.add('side-ad-overlay');
    document.body.appendChild(overlay);

    // Check localStorage for ad preferences
    const hideAllAds = localStorage.getItem('hideAllAds') === 'true';
    const hideTopAd = localStorage.getItem('hideTopAd') === 'true';
    const hideSideAd = localStorage.getItem('hideSideAd') === 'true';

    // Initialize ad visibility - don't render at all if hideAllAds is true
    if (hideAllAds) {
        if (topAd) topAd.remove();
        if (sideAd) sideAd.remove();
        if (overlay) overlay.remove();
        if (hideAdsToggle) hideAdsToggle.textContent = 'Publicidad oculta (borrar caché para reactivar)';
    } else {
        // Initialize side ad state
        if (hideSideAd && sideAd) {
            sideAd.classList.add('collapsed');
        }
        
        // Initialize top ad state
        if (hideTopAd && topAd) {
            topAd.classList.add('hidden');
        }
    }

    // Top ad close functionality
    if (topAdClose) {
        topAdClose.addEventListener('click', () => {
            topAd.classList.add('hidden');
            localStorage.setItem('hideTopAd', 'true');
        });
    }

    // Side ad functionality
    if (sideAdTab) {
        sideAdTab.addEventListener('click', () => {
            sideAd.classList.toggle('collapsed');
        });
    }

    if (sideAdClose) {
        sideAdClose.addEventListener('click', () => {
            sideAd.classList.add('collapsed');
            localStorage.setItem('hideSideAd', 'true');
        });
    }

    // Mobile overlay close
    overlay.addEventListener('click', () => {
        sideAd.classList.add('collapsed');
    });

    // Global hide ads toggle
    if (hideAdsToggle) {
        hideAdsToggle.addEventListener('click', () => {
            localStorage.setItem('hideAllAds', 'true');
            if (topAd) topAd.remove();
            if (sideAd) sideAd.remove();
            if (overlay) overlay.remove();
            
            // Update button text
            hideAdsToggle.textContent = 'Publicidad oculta (borrar caché para reactivar)';
            
            // Show toast notification
            const toast = document.createElement('div');
            toast.classList.add('toast', 'show');
            toast.textContent = 'Publicidad oculta. Podés reactivarla borrando caché';
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        });
    }

    // Scroll to Top functionality
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Custom cursor for desktop
    if (window.matchMedia('(min-width: 1024px)').matches) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        document.querySelectorAll('a, button, .product-card').forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });
            item.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });
    }

    //JS - Control del menú
function toggleMenu() {
  const btn = document.querySelector('.btn-hamburguesa');
  const menu = document.getElementById('menuMobile');
  const overlay = document.querySelector('.menu-overlay');
  const body = document.body;
 
  const estaAbierto = menu.classList.contains('abierto');
 
  btn.classList.toggle('activo');
  menu.classList.toggle('abierto');
  overlay.classList.toggle('activo');
  body.classList.toggle('menu-abierto');
 
  // Accesibilidad
  btn.setAttribute('aria-expanded', !estaAbierto);
}

// Cerrar con tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const menu = document.getElementById('menuMobile');
    if (menu.classList.contains('abierto')) {
      toggleMenu();
    }
  }
});
});