(function() {
  var currentSlide = 0;
  var slides = document.querySelectorAll('.slide');
  var totalSlides = slides.length;
  var gridIndex = document.getElementById('grid-index');
  var gridToggle = document.getElementById('grid-toggle');
  var gridClose = document.getElementById('grid-close');
  var prevBtn = document.getElementById('prev-slide');
  var nextBtn = document.getElementById('next-slide');
  var menuToggle = document.getElementById('menu-toggle');
  var mobileNav = document.getElementById('mobile-navigation');
  var fullscreenBrowser = document.getElementById('fullscreenBrowser');
  var imageDetails = document.querySelectorAll('.image-detail-wrapper');
  var headerWrapper = document.getElementById('headerWrapper');
  var ctrlAll = document.querySelector('.ctrl-button.all');
  var ctrlClose = document.querySelector('.ctrl-button.close');
  var ctrlMenu = document.querySelector('.ctrl-button.menu');

  if (ctrlMenu) {
    ctrlMenu.addEventListener('click', function() {
      mobileNav.classList.toggle('open');
      ctrlMenu.classList.toggle('is-close');
    });
  }

  if (totalSlides === 0) return;

  function showSlide(index) {
    slides.forEach(function(s) { s.classList.remove('active'); });
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;
    slides[currentSlide].classList.add('active');

    var img = slides[currentSlide].querySelector('img');
    if (img && img.getAttribute('data-load') === 'false') {
      img.src = img.getAttribute('data-src');
      img.setAttribute('data-load', 'true');
    }
    if (window.location.pathname.indexOf('/posts/') === 0) {
      var slug = slides[currentSlide].getAttribute('data-slide-url');
      if (slug) {
        history.replaceState(null, '', '/posts/' + slug + '/');
      }
    }
  }

  function prevSlide() { showSlide(currentSlide - 1); }
  function nextSlide() { showSlide(currentSlide + 1); }

  function showUI() {
    if (prevBtn) prevBtn.classList.add('visible');
    if (nextBtn) nextBtn.classList.add('visible');
    for (var i = 0; i < imageDetails.length; i++) {
      imageDetails[i].classList.add('visible');
    }
  }

  function hideUI() {
    if (prevBtn) prevBtn.classList.remove('visible');
    if (nextBtn) nextBtn.classList.remove('visible');
    for (var i = 0; i < imageDetails.length; i++) {
      imageDetails[i].classList.remove('visible');
    }
  }

  function openGrid() {
    gridIndex.classList.add('open');
    document.body.classList.add('grid-open');
    if (headerWrapper) headerWrapper.classList.add('nav-top');
    if (ctrlAll) ctrlAll.style.display = 'none';
    if (ctrlClose) { ctrlClose.style.display = 'flex'; }
    requestAnimationFrame(function() {
      gridIndex.classList.add('slide-in');
    });
  }

  function closeGrid() {
    gridIndex.classList.remove('slide-in');
    document.body.classList.remove('grid-open');
    if (headerWrapper) headerWrapper.classList.remove('nav-top');
    if (ctrlAll) ctrlAll.style.display = 'flex';
    if (ctrlClose) ctrlClose.style.display = 'none';
    setTimeout(function() {
      gridIndex.classList.remove('open');
    }, 1000);
  }

  if (fullscreenBrowser) {
    fullscreenBrowser.addEventListener('mouseenter', showUI);
    fullscreenBrowser.addEventListener('mouseleave', hideUI);
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  if (gridToggle) {
    gridToggle.addEventListener('click', function(e) {
      if (totalSlides > 0) {
        e.preventDefault();
        openGrid();
      }
    });
  }
  if (gridClose) gridClose.addEventListener('click', closeGrid);

  document.addEventListener('keydown', function(e) {
    if (gridIndex && gridIndex.classList.contains('open')) {
      if (e.key === 'Escape') closeGrid();
      return;
    }
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'Escape' && gridIndex) closeGrid();
  });

  document.addEventListener('mouseleave', function() {
    hideUI();
  });

  var touchStartX = 0;
  var touchStartY = 0;

  if (fullscreenBrowser) {
    fullscreenBrowser.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    fullscreenBrowser.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) nextSlide();
        else prevSlide();
      }
    });
  }

  if (gridIndex) {
    gridIndex.addEventListener('click', function(e) {
      var thumb = e.target.closest('.grid-thumb');
      if (thumb) {
        var idx = parseInt(thumb.getAttribute('data-index'));
        closeGrid();
        showSlide(idx);
      }
    });
  }

  var path = window.location.pathname;
  var pathMatch = path.match(/^\/posts\/(.+)\/$/);
  var startIndex = 0;
  if (pathMatch) {
    var targetSlug = pathMatch[1];
    for (var i = 0; i < totalSlides; i++) {
      if (slides[i].getAttribute('data-slide-url') === targetSlug) {
        startIndex = i;
        break;
      }
    }
  }
  showSlide(startIndex);
})();