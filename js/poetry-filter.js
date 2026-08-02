/* ==========================================================================
   POETRY-FILTER.JS - Tag filtering + pagination for the poetry prints gallery
   ========================================================================== */

(function() {
  'use strict';

  var PAGE_SIZE = 10;
  var currentFilter = 'all';
  var currentPage = 1;

  function init() {
    setupGallery();
    console.log('Poetry filter initialized');
  }

  function setupGallery() {
    var filterBar = document.querySelector('.filter-bar');
    var poems = Array.prototype.slice.call(document.querySelectorAll('.gallery .poem'));
    if (!filterBar || !poems.length) return;

    var buttons = Array.prototype.slice.call(filterBar.querySelectorAll('.filter-btn'));
    var emptyNote = document.querySelector('.gallery-page .empty-note');
    var resultStatus = document.getElementById('filter-status');
    var pagination = document.querySelector('.pagination');
    var prevButton = document.getElementById('prev-page');
    var nextButton = document.getElementById('next-page');
    var pageIndicator = document.getElementById('page-indicator');

    function matchesFilter(poem) {
      var tags = (poem.dataset.tags || '').split(' ');
      return currentFilter === 'all' || tags.indexOf(currentFilter) !== -1;
    }

    function render() {
      var filtered = poems.filter(matchesFilter);
      var totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;
      if (currentPage < 1) currentPage = 1;

      var start = (currentPage - 1) * PAGE_SIZE;
      var end = start + PAGE_SIZE;
      var pageSlice = filtered.slice(start, end);

      poems.forEach(function(poem) {
        poem.hidden = pageSlice.indexOf(poem) === -1;
      });

      if (emptyNote) {
        emptyNote.hidden = filtered.length !== 0;
      }

      if (pagination) {
        pagination.hidden = filtered.length === 0;
      }

      if (prevButton) prevButton.disabled = currentPage <= 1;
      if (nextButton) nextButton.disabled = currentPage >= totalPages;
      if (pageIndicator) pageIndicator.textContent = 'Page ' + currentPage + ' of ' + totalPages;

      if (resultStatus) {
        var rangeStart = filtered.length === 0 ? 0 : start + 1;
        var rangeEnd = Math.min(end, filtered.length);
        resultStatus.textContent = filtered.length === 0
          ? 'No poems shown'
          : 'Showing ' + rangeStart + '–' + rangeEnd + ' of ' + filtered.length + ' poems';
      }

      console.log('Poetry filter applied:', { filter: currentFilter, page: currentPage, totalPages: totalPages, matched: filtered.length });
    }

    buttons.forEach(function(button) {
      button.addEventListener('click', function() {
        currentFilter = button.dataset.filter;
        currentPage = 1;

        buttons.forEach(function(b) {
          var isActive = b === button;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', String(isActive));
        });

        render();
      });
    });

    if (prevButton) {
      prevButton.addEventListener('click', function() {
        currentPage -= 1;
        render();
        scrollToTop();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function() {
        currentPage += 1;
        render();
        scrollToTop();
      });
    }

    render();
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
