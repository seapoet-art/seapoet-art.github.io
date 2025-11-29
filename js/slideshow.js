/* ==========================================================================
   SLIDESHOW.JS - Poetry Prints Carousel
   ========================================================================== */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    autoplayInterval: 4000, // Time between slides in milliseconds
    transitionDuration: 500, // Fade transition duration
    pauseOnHover: true,
    pauseOnInteraction: 5000, // Resume autoplay after 5 seconds of inactivity
    keyboardNavigation: true
  };

  // State
  let currentSlide = 0;
  let autoplayTimer = null;
  let resumeTimer = null;
  let isPlaying = true;

  // DOM Elements
  const carousel = document.querySelector('.carousel');
  if (!carousel) {
    console.warn('Carousel element not found');
    return;
  }

  const viewport = carousel.querySelector('.carousel__viewport');
  const slides = carousel.querySelectorAll('.carousel__slide');
  const totalSlides = slides.length;

  if (totalSlides === 0) {
    console.warn('No slides found in carousel');
    return;
  }

  // Initialize carousel
  function init() {
    // Create navigation controls
    createNavigationControls();
    
    // Create indicators
    createIndicators();
    
    // Create play/pause button
    createPlayPauseButton();
    
    // Show first slide
    showSlide(0);
    
    // Start autoplay
    startAutoplay();
    
    // Set up event listeners
    setupEventListeners();
    
    // Preload images for smoother transitions
    preloadImages();
    
    console.log('Carousel initialized with', totalSlides, 'slides');
  }

  // Create previous/next buttons
  function createNavigationControls() {
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel__prev';
    prevButton.setAttribute('aria-label', 'Previous slide');
    prevButton.innerHTML = '‹';
    
    const nextButton = document.createElement('button');
    nextButton.className = 'carousel__next';
    nextButton.setAttribute('aria-label', 'Next slide');
    nextButton.innerHTML = '›';
    
    prevButton.addEventListener('click', () => {
      navigateSlide(-1);
      pauseAndResume();
    });
    
    nextButton.addEventListener('click', () => {
      navigateSlide(1);
      pauseAndResume();
    });
    
    carousel.appendChild(prevButton);
    carousel.appendChild(nextButton);
  }

  // Create indicator dots
  function createIndicators() {
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel__indicators';
    indicatorsContainer.setAttribute('role', 'tablist');
    indicatorsContainer.setAttribute('aria-label', 'Slide navigation');
    
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement('button');
      indicator.className = 'carousel__indicator';
      indicator.setAttribute('role', 'tab');
      indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
      indicator.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      
      indicator.addEventListener('click', () => {
        showSlide(i);
        pauseAndResume();
      });
      
      indicatorsContainer.appendChild(indicator);
    }
    
    carousel.appendChild(indicatorsContainer);
  }

  // Create play/pause button
  function createPlayPauseButton() {
    const controlButton = document.createElement('button');
    controlButton.className = 'carousel__control';
    controlButton.setAttribute('aria-label', 'Pause slideshow');
    controlButton.innerHTML = '❚❚'; // Pause icon
    
    controlButton.addEventListener('click', () => {
      if (isPlaying) {
        stopAutoplay();
        controlButton.innerHTML = '▶'; // Play icon
        controlButton.setAttribute('aria-label', 'Play slideshow');
      } else {
        startAutoplay();
        controlButton.innerHTML = '❚❚'; // Pause icon
        controlButton.setAttribute('aria-label', 'Pause slideshow');
      }
      isPlaying = !isPlaying;
    });
    
    carousel.appendChild(controlButton);
  }

  // Show specific slide
  function showSlide(index) {
    // Ensure index is within bounds
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    
    // Update slides
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
      slide.setAttribute('aria-hidden', i !== currentSlide);
    });
    
    // Update indicators
    const indicators = carousel.querySelectorAll('.carousel__indicator');
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === currentSlide);
      indicator.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
    });
    
    // Update URL hash for deep linking (optional)
    const slideId = slides[currentSlide].id;
    if (slideId && history.replaceState) {
      history.replaceState(null, null, '#' + slideId);
    }
    
    // Announce slide change to screen readers
    announceSlideChange();
  }

  // Navigate to next or previous slide
  function navigateSlide(direction) {
    showSlide(currentSlide + direction);
  }

  // Start autoplay
  function startAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
    }
    
    autoplayTimer = setInterval(() => {
      navigateSlide(1);
    }, CONFIG.autoplayInterval);
    
    isPlaying = true;
  }

  // Stop autoplay
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    
    isPlaying = false;
  }

  // Pause and resume after interaction
  function pauseAndResume() {
    stopAutoplay();
    
    // Clear any existing resume timer
    if (resumeTimer) {
      clearTimeout(resumeTimer);
    }
    
    // Resume autoplay after configured delay
    resumeTimer = setTimeout(() => {
      startAutoplay();
      const controlButton = carousel.querySelector('.carousel__control');
      if (controlButton) {
        controlButton.innerHTML = '❚❚';
        controlButton.setAttribute('aria-label', 'Pause slideshow');
      }
    }, CONFIG.pauseOnInteraction);
  }

  // Set up event listeners
  function setupEventListeners() {
    // Pause on hover
    if (CONFIG.pauseOnHover) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', () => {
        if (isPlaying) {
          startAutoplay();
        }
      });
    }
    
    // Keyboard navigation
    if (CONFIG.keyboardNavigation) {
      carousel.addEventListener('keydown', (e) => {
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            navigateSlide(-1);
            pauseAndResume();
            break;
          case 'ArrowRight':
            e.preventDefault();
            navigateSlide(1);
            pauseAndResume();
            break;
          case 'Home':
            e.preventDefault();
            showSlide(0);
            pauseAndResume();
            break;
          case 'End':
            e.preventDefault();
            showSlide(totalSlides - 1);
            pauseAndResume();
            break;
        }
      });
      
      // Make carousel focusable for keyboard navigation
      carousel.setAttribute('tabindex', '0');
    }
    
    // Handle visibility change (pause when tab is hidden)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else if (isPlaying) {
        startAutoplay();
      }
    });
    
    // Swipe support for touch devices
    setupTouchEvents();
    
    // Handle hash changes for deep linking
    window.addEventListener('hashchange', handleHashChange);
    
    // Check for initial hash
    handleHashChange();
  }

  // Touch/swipe support
  function setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const horizontalDistance = touchEndX - touchStartX;
      const verticalDistance = Math.abs(touchEndY - touchStartY);
      
      // Only process horizontal swipes (ignore vertical scrolling)
      if (verticalDistance < swipeThreshold) {
        if (horizontalDistance > swipeThreshold) {
          // Swipe right
          navigateSlide(-1);
          pauseAndResume();
        } else if (horizontalDistance < -swipeThreshold) {
          // Swipe left
          navigateSlide(1);
          pauseAndResume();
        }
      }
    }
  }

  // Handle URL hash changes
  function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const slideIndex = Array.from(slides).findIndex(slide => slide.id === hash);
      if (slideIndex !== -1) {
        showSlide(slideIndex);
      }
    }
  }

  // Preload images for smoother transitions
  function preloadImages() {
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      if (img && !img.complete) {
        const preloadImg = new Image();
        preloadImg.src = img.src;
      }
    });
  }

  // Announce slide changes to screen readers
  function announceSlideChange() {
    const announcement = `Slide ${currentSlide + 1} of ${totalSlides}`;
    
    // Create or update live region for screen readers
    let liveRegion = document.getElementById('carousel-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'carousel-live-region';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      carousel.appendChild(liveRegion);
    }
    
    liveRegion.textContent = announcement;
  }

  // Public API (if needed)
  window.CarouselAPI = {
    next: () => navigateSlide(1),
    prev: () => navigateSlide(-1),
    goto: (index) => showSlide(index),
    play: startAutoplay,
    pause: stopAutoplay,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
