/* ==========================================================================
   MAIN.JS - General Site Functionality
   ========================================================================== */

(function() {
  'use strict';

  // Initialize everything when DOM is ready
  function init() {
    handleLoadingOverlay();
    setupSmoothScrolling();
    setupExternalLinks();
    setupLazyLoading();
    setupAnalytics();
    console.log('Site initialized');
  }

  // Handle loading overlay
  function handleLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) return;

    // Hide loading overlay when page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        
        // Remove from DOM after transition
        setTimeout(() => {
          loadingOverlay.remove();
        }, 500);
      }, 300); // Small delay for better UX
    });

    // Fallback: hide after 3 seconds even if page hasn't fully loaded
    setTimeout(() => {
      if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
        loadingOverlay.classList.add('hidden');
      }
    }, 3000);
  }

  // Setup smooth scrolling for anchor links
  function setupSmoothScrolling() {
    // Handle clicks on anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for carousel navigation
        if (href.startsWith('#carousel__slide')) {
          return;
        }
        
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          const headerOffset = 20;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, href);
          }
          
          // Focus the target element for accessibility
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  // Setup external links to open in new tab with security
  function setupExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    
    links.forEach(link => {
      // Check if it's an external link
      if (!link.href.includes(window.location.hostname)) {
        // Add target="_blank" if not already present
        if (!link.hasAttribute('target')) {
          link.setAttribute('target', '_blank');
        }
        
        // Add rel="noopener noreferrer" for security
        const currentRel = link.getAttribute('rel') || '';
        if (!currentRel.includes('noopener')) {
          link.setAttribute('rel', currentRel + ' noopener noreferrer');
        }
        
        // Add visual indicator (optional)
        if (!link.querySelector('.external-link-icon')) {
          const icon = document.createElement('span');
          icon.className = 'external-link-icon';
          icon.setAttribute('aria-hidden', 'true');
          icon.innerHTML = ' ↗';
          link.appendChild(icon);
        }
      }
    });
  }

  // Setup lazy loading for images
  function setupLazyLoading() {
    // Check if browser supports Intersection Observer
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Load the image
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            // Load srcset if present
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            
            // Remove loading class
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
            
            // Stop observing this image
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px', // Start loading 50px before image enters viewport
        threshold: 0.01
      });

      // Observe all images with lazy loading
      document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers that don't support Intersection Observer
      document.querySelectorAll('img[data-src]').forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
    }
  }

  // Setup analytics tracking (optional - customize as needed)
  function setupAnalytics() {
    // Track button clicks
    document.querySelectorAll('.button').forEach(button => {
      button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        const buttonHref = this.getAttribute('href');
        
        // Log to console (replace with actual analytics call)
        console.log('Button clicked:', {
          text: buttonText,
          href: buttonHref,
          timestamp: new Date().toISOString()
        });
        
        // Example: Google Analytics event (uncomment if using GA)
        // if (typeof gtag !== 'undefined') {
        //   gtag('event', 'button_click', {
        //     'event_category': 'engagement',
        //     'event_label': buttonText,
        //     'value': buttonHref
        //   });
        // }
      });
    });

    // Track PDF downloads
    document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
      link.addEventListener('click', function() {
        const pdfUrl = this.getAttribute('href');
        
        console.log('PDF download:', {
          url: pdfUrl,
          timestamp: new Date().toISOString()
        });
        
        // Example: Google Analytics event
        // if (typeof gtag !== 'undefined') {
        //   gtag('event', 'file_download', {
        //     'event_category': 'downloads',
        //     'event_label': pdfUrl
        //   });
        // }
      });
    });
  }

  // Utility: Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Utility: Debounce function for performance
  function debounce(func, wait) {
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

  // Utility: Throttle function for performance
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Handle scroll events (throttled for performance)
  const handleScroll = throttle(() => {
    // Add scroll-based animations or effects here if needed
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Example: Add class to body when scrolled
    if (scrollTop > 100) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Handle resize events (debounced for performance)
  const handleResize = debounce(() => {
    // Add resize-based logic here if needed
    console.log('Window resized:', {
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, 250);

  window.addEventListener('resize', handleResize);

  // Print page function (can be called from button)
  window.printPage = function() {
    window.print();
  };

  // Share functionality (if needed)
  window.shareContent = function(title, text, url) {
    if (navigator.share) {
      navigator.share({
        title: title || document.title,
        text: text || 'Check out this book!',
        url: url || window.location.href
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = url || window.location.href;
      
      // Copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl)
          .then(() => alert('Link copied to clipboard!'))
          .catch(err => console.error('Could not copy text: ', err));
      }
    }
  };

  // Performance monitoring (optional)
  if ('PerformanceObserver' in window) {
    try {
      // Monitor long tasks
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', {
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime
            });
          }
        }
      });
      
      perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
      // PerformanceObserver not fully supported
      console.log('Performance monitoring not available');
    }
  }

  // Log page load performance
  window.addEventListener('load', () => {
    if (window.performance && window.performance.timing) {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;
      
      console.log('Performance metrics:', {
        pageLoadTime: pageLoadTime + 'ms',
        connectTime: connectTime + 'ms',
        renderTime: renderTime + 'ms'
      });
    }
  });

  // Error handling
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Send to error tracking service if configured
  });

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export utilities to window if needed elsewhere
  window.SiteUtils = {
    debounce,
    throttle,
    isInViewport,
    printPage: window.printPage,
    shareContent: window.shareContent
  };

})();
