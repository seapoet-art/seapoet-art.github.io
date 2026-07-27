/* ==========================================================================
   POETRY-FILTER.JS - Tag filtering for the poetry prints gallery
   ========================================================================== */

(function() {
  'use strict';

  function init() {
    setupFilterButtons();
    console.log('Poetry filter initialized');
  }

  function setupFilterButtons() {
    const filterBar = document.querySelector('.filter-bar');
    const poems = document.querySelectorAll('.gallery .poem');
    if (!filterBar || !poems.length) return;

    const buttons = filterBar.querySelectorAll('.filter-btn');
    const emptyNote = document.querySelector('.gallery-page .empty-note');
    const resultStatus = document.getElementById('filter-status');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        handleFilterClick(button, buttons, poems, emptyNote, resultStatus);
      });
    });
  }

  function handleFilterClick(activeButton, buttons, poems, emptyNote, resultStatus) {
    const filter = activeButton.dataset.filter;
    let visibleCount = 0;

    poems.forEach(poem => {
      const tags = (poem.dataset.tags || '').split(' ');
      const isMatch = filter === 'all' || tags.includes(filter);
      poem.hidden = !isMatch;
      if (isMatch) visibleCount++;
    });

    buttons.forEach(button => {
      const isActive = button === activeButton;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    if (emptyNote) {
      emptyNote.hidden = visibleCount !== 0;
    }

    if (resultStatus) {
      resultStatus.textContent = visibleCount + (visibleCount === 1 ? ' poem shown' : ' poems shown');
    }

    console.log('Poetry filter applied:', { filter: filter, visibleCount: visibleCount });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
