/**
 * JobFoodie - Vanilla JavaScript Application
 * Features:
 * - Smart multi-token search engine (handles e.g. "java backend developer for fresher")
 * - Fresher mode and personalized candidate profile management
 * - Multi-theme switcher dropdown (Light, Dark Navy, Ocean Blue, Emerald Mint, Cyber Violet)
 * - Browser Geolocation detection and reverse-geocoding
 * - Job bookmarking with localStorage persistence
 * - Job application modal and mobile responsive navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const searchForm = document.getElementById('jobSearchForm');
  const keywordInput = document.getElementById('keywordInput');
  const locationInput = document.getElementById('locationInput');
  const searchTags = document.querySelectorAll('.search-tag');
  const categoryCards = document.querySelectorAll('.category-card');
  const filterPills = document.querySelectorAll('.filter-pill');
  const resetSearchBtn = document.getElementById('resetSearchBtn');

  const jobsGrid = document.getElementById('jobsGrid');
  const jobCards = Array.from(document.querySelectorAll('.job-card'));
  const noResultsState = document.getElementById('noResults');

  // Fresher Banner Elements
  const fresherModeBanner = document.getElementById('fresherModeBanner');
  const resetFresherBannerBtn = document.getElementById('resetFresherBannerBtn');

  // Candidate Profile & Status Elements
  const userStatusContainer = document.getElementById('userStatusContainer');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const userRoleTag = document.getElementById('userRoleTag');
  const userRoleIcon = document.getElementById('userRoleIcon');
  const logoutBtn = document.getElementById('logoutBtn');

  // Login Modal elements
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const loginModalCloseBtn = document.getElementById('loginModalCloseBtn');
  const loginModalCancelBtn = document.getElementById('loginModalCancelBtn');
  const candidateLoginForm = document.getElementById('candidateLoginForm');
  const candidateNameInput = document.getElementById('candidateNameInput');
  const candidateEmailInput = document.getElementById('candidateEmailInput');
  const fresherOptionCard = document.getElementById('fresherOptionCard');
  const experiencedOptionCard = document.getElementById('experiencedOptionCard');
  const targetJobInput = document.getElementById('targetJobInput');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');

  // Apply Modal elements
  const applyModal = document.getElementById('applyModal');
  const modalJobTitle = document.getElementById('modalJobTitle');
  const modalCompany = document.getElementById('modalCompany');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const quickApplyForm = document.getElementById('quickApplyForm');

  // Header / Actions
  const postJobBtn = document.getElementById('postJobBtn');
  const footerPostJob = document.getElementById('footerPostJob');
  const toastContainer = document.getElementById('toastContainer');

  // Theme Dropdown elements
  const themeDropdownBtn = document.getElementById('themeDropdownBtn');
  const mobileThemeDropdownBtn = document.getElementById('mobileThemeDropdownBtn');
  const themeDropdownMenu = document.getElementById('themeDropdownMenu');
  const themeSelectItems = document.querySelectorAll('.theme-select-item');

  // Location detect button
  const locateBtn = document.getElementById('locateBtn');

  // Active filter state
  const state = {
    keyword: '',
    location: '',
    filterType: 'all', // 'all', 'fresher', 'Full-time', 'Remote'
    category: ''
  };

  // Saved bookmark IDs
  const savedBookmarks = new Set(
    JSON.parse(localStorage.getItem('jobfoodie_bookmarks') || '[]')
  );

  // Initialize bookmark states on job cards
  jobCards.forEach(card => {
    const jobId = card.dataset.id;
    const bookmarkBtn = card.querySelector('.bookmark-btn');
    if (bookmarkBtn && savedBookmarks.has(jobId)) {
      bookmarkBtn.classList.add('saved');
      bookmarkBtn.setAttribute('title', 'Remove bookmark');
    }
  });

  // --------------------------------------------------------------------------
  // 1. Toast Notification Utility
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✓' : 'ℹ';
    
    toast.innerHTML = `<span><strong>${icon}</strong> ${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Menu Navigation
  // --------------------------------------------------------------------------
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Multi-Theme Selection System (Light, Dark, Ocean, Emerald, Cyber)
  // --------------------------------------------------------------------------
  const themeColors = {
    light: '#2563eb',
    dark: '#3b82f6',
    ocean: '#06b6d4',
    emerald: '#10b981',
    cyber: '#8b5cf6'
  };

  const updateThemeIndicators = (theme) => {
    const color = themeColors[theme] || '#2563eb';
    document.querySelectorAll('.theme-color-indicator').forEach(ind => {
      ind.style.backgroundColor = color;
      ind.style.boxShadow = `0 0 0 2px ${color}33`;
    });

    themeSelectItems.forEach(item => {
      item.classList.toggle('active', item.dataset.theme === theme);
    });
  };

  const getSavedTheme = () => {
    const stored = localStorage.getItem('jobfoodie_theme');
    if (stored) return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme, notify = false) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jobfoodie_theme', theme);
    updateThemeIndicators(theme);
    if (notify) {
      const names = {
        light: 'Light Slate',
        dark: 'Dark Navy',
        ocean: 'Ocean Blue',
        emerald: 'Emerald Mint',
        cyber: 'Cyber Violet'
      };
      showToast(`Switched to ${names[theme] || theme} theme`, 'info');
    }
  };

  // Set initial theme
  applyTheme(getSavedTheme(), false);

  // Toggle Theme Dropdown Menu
  const toggleThemeMenu = (e) => {
    e.stopPropagation();
    if (themeDropdownMenu) {
      const isOpen = themeDropdownMenu.classList.toggle('open');
      if (themeDropdownBtn) themeDropdownBtn.setAttribute('aria-expanded', isOpen);
    }
  };

  if (themeDropdownBtn) themeDropdownBtn.addEventListener('click', toggleThemeMenu);
  if (mobileThemeDropdownBtn) mobileThemeDropdownBtn.addEventListener('click', toggleThemeMenu);

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (themeDropdownMenu && !themeDropdownMenu.contains(e.target)) {
      themeDropdownMenu.classList.remove('open');
      if (themeDropdownBtn) themeDropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Theme option clicks
  themeSelectItems.forEach(item => {
    item.addEventListener('click', () => {
      const selectedTheme = item.dataset.theme;
      applyTheme(selectedTheme, true);
      if (themeDropdownMenu) themeDropdownMenu.classList.remove('open');
    });
  });

  // --------------------------------------------------------------------------
  // 4. Smart Multi-Token Search & Filter Engine
  // --------------------------------------------------------------------------
  function applyFilters() {
    let visibleCount = 0;
    const rawKw = state.keyword.trim().toLowerCase();
    const loc = state.location.trim().toLowerCase();
    const filterType = state.filterType;
    const cat = state.category.trim().toLowerCase();

    // Tokenize search query omitting filler words:
    // e.g. "java backend developer for fresher" -> ["java", "backend", "developer", "fresher"]
    const stopWords = new Set(['for', 'in', 'at', 'a', 'an', 'the', 'and', 'with', 'to', 'of', 'on', 'is']);
    const tokens = rawKw
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0 && !stopWords.has(w));

    jobCards.forEach(card => {
      const title = (card.dataset.title || '').toLowerCase();
      const company = (card.dataset.company || '').toLowerCase();
      const location = (card.dataset.location || '').toLowerCase();
      const category = (card.dataset.category || '').toLowerCase();
      const type = card.dataset.type || '';
      const mode = (card.dataset.mode || '').toLowerCase();
      const level = (card.dataset.level || '').toLowerCase();
      const experience = (card.dataset.experience || '').toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase();

      // Combined search corpus for this card
      const haystack = `${title} ${company} ${location} ${category} ${level} ${experience} ${tags}`;

      // Check tokens match: every token in user's query must match card's haystack
      let matchesKeyword = true;
      if (tokens.length > 0) {
        matchesKeyword = tokens.every(token => {
          if (token === 'fresher' || token === 'freshers') {
            return level === 'fresher' || haystack.includes('fresher') || haystack.includes('0-1') || haystack.includes('entry level') || haystack.includes('graduate');
          }
          if (token === 'backend') {
            return haystack.includes('backend') || haystack.includes('full stack') || haystack.includes('spring') || haystack.includes('node');
          }
          return haystack.includes(token);
        });
      }

      // Check location
      const matchesLocation = !loc || location.includes(loc);

      // Check pill filter (All, Fresher, Full-time, Remote)
      let matchesType = true;
      if (filterType === 'fresher') {
        matchesType = level === 'fresher' || haystack.includes('fresher') || haystack.includes('0-1');
      } else if (filterType === 'Full-time') {
        matchesType = type === 'Full-time';
      } else if (filterType === 'Remote') {
        matchesType = mode.includes('remote') || location.includes('remote');
      }

      // Check category card selection
      const matchesCategory = !cat || category === cat;

      if (matchesKeyword && matchesLocation && matchesType && matchesCategory) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Toggle Empty State
    if (noResultsState) {
      noResultsState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Handle Search Input (Live typing)
  if (keywordInput) {
    keywordInput.addEventListener('input', (e) => {
      state.keyword = e.target.value;
      applyFilters();
    });
  }

  if (locationInput) {
    locationInput.addEventListener('input', (e) => {
      state.location = e.target.value;
      applyFilters();
    });
  }

  // Handle Search Form Submit
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFilters();
      const featuredSection = document.getElementById('featured-jobs');
      if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Handle Popular Search Tags
  searchTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const filterValue = tag.dataset.filter;
      if (filterValue === 'Fresher') {
        activateFresherFilter();
      } else {
        if (keywordInput) keywordInput.value = filterValue;
        state.keyword = filterValue;
        applyFilters();
        showToast(`Filtered by "${filterValue}"`, 'info');
      }

      const featuredSection = document.getElementById('featured-jobs');
      if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Handle Category Card Clicks
  categoryCards.forEach(card => {
    const handleCategorySelect = () => {
      const selectedCategory = card.dataset.category;
      if (state.category === selectedCategory) {
        state.category = '';
        card.style.borderColor = '';
        showToast('Category filter cleared', 'info');
      } else {
        state.category = selectedCategory;
        categoryCards.forEach(c => c.style.borderColor = '');
        card.style.borderColor = 'var(--blue-primary)';
        showToast(`Showing ${selectedCategory} roles`, 'info');
      }

      applyFilters();
      const featuredSection = document.getElementById('featured-jobs');
      if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
      }
    };

    card.addEventListener('click', handleCategorySelect);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCategorySelect();
      }
    });
  });

  // Activate Fresher Filter Helper
  function activateFresherFilter() {
    filterPills.forEach(p => p.classList.remove('active'));
    const fresherPill = document.querySelector('.filter-fresher-pill');
    if (fresherPill) fresherPill.classList.add('active');
    state.filterType = 'fresher';
    if (fresherModeBanner) fresherModeBanner.style.display = 'flex';
    applyFilters();
    showToast('🎓 Showing curated Entry-Level & Fresher opportunities', 'info');
  }

  // Handle Filter Pills (All Roles, Fresher, Full-time, Remote)
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.filterType = pill.dataset.type;

      if (state.filterType === 'fresher') {
        if (fresherModeBanner) fresherModeBanner.style.display = 'flex';
      } else {
        if (fresherModeBanner && !isUserFresherLoggedIn()) {
          fresherModeBanner.style.display = 'none';
        }
      }

      applyFilters();
    });
  });

  // Reset Fresher Banner Button
  if (resetFresherBannerBtn) {
    resetFresherBannerBtn.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.toggle('active', p.dataset.type === 'all');
      });
      state.filterType = 'all';
      if (fresherModeBanner) fresherModeBanner.style.display = 'none';
      applyFilters();
      showToast('Showing all experience levels', 'info');
    });
  }

  // Reset All Filters
  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      state.keyword = '';
      state.location = '';
      state.filterType = 'all';
      state.category = '';

      if (keywordInput) keywordInput.value = '';
      if (locationInput) locationInput.value = '';
      categoryCards.forEach(c => c.style.borderColor = '');
      filterPills.forEach(p => {
        p.classList.toggle('active', p.dataset.type === 'all');
      });
      if (fresherModeBanner) fresherModeBanner.style.display = 'none';

      applyFilters();
      showToast('All filters reset', 'info');
    });
  }

  // --------------------------------------------------------------------------
  // 5. Candidate Login Modal & Fresher Profile Management
  // --------------------------------------------------------------------------
  function isUserFresherLoggedIn() {
    const profile = JSON.parse(localStorage.getItem('jobfoodie_user_profile') || 'null');
    return profile && profile.level === 'fresher';
  }

  function renderUserProfile() {
    const profile = JSON.parse(localStorage.getItem('jobfoodie_user_profile') || 'null');
    if (profile) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userStatusContainer) userStatusContainer.style.display = 'inline-flex';
      if (userNameDisplay) userNameDisplay.textContent = profile.name.split(' ')[0] || 'Candidate';
      if (userRoleTag) userRoleTag.textContent = profile.level === 'fresher' ? 'Fresher' : 'Pro';
      if (userRoleIcon) userRoleIcon.textContent = profile.level === 'fresher' ? '🎓' : '💼';

      if (profile.level === 'fresher') {
        if (fresherModeBanner) fresherModeBanner.style.display = 'flex';
      }
    } else {
      if (loginBtn) loginBtn.style.display = 'inline-flex';
      if (userStatusContainer) userStatusContainer.style.display = 'none';
      if (fresherModeBanner) fresherModeBanner.style.display = 'none';
    }
  }

  // Open & Close Login Modal
  function openLoginModal() {
    if (!loginModal) return;
    loginModal.classList.add('active');
    loginModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (candidateNameInput) candidateNameInput.focus();
  }

  function closeLoginModal() {
    if (!loginModal) return;
    loginModal.classList.remove('active');
    loginModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (loginBtn) loginBtn.addEventListener('click', openLoginModal);
  if (loginModalCloseBtn) loginModalCloseBtn.addEventListener('click', closeLoginModal);
  if (loginModalCancelBtn) loginModalCancelBtn.addEventListener('click', closeLoginModal);

  if (loginModal) {
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) closeLoginModal();
    });
  }

  // Handle Experience Selection Card clicks
  if (fresherOptionCard && experiencedOptionCard) {
    fresherOptionCard.addEventListener('click', () => {
      fresherOptionCard.classList.add('active');
      experiencedOptionCard.classList.remove('active');
      const radio = fresherOptionCard.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      if (loginSubmitBtn) loginSubmitBtn.textContent = 'Sign In as Fresher 🎓';
    });

    experiencedOptionCard.addEventListener('click', () => {
      experiencedOptionCard.classList.add('active');
      fresherOptionCard.classList.remove('active');
      const radio = experiencedOptionCard.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      if (loginSubmitBtn) loginSubmitBtn.textContent = 'Sign In as Experienced Pro 💼';
    });
  }

  // Handle Login Form Submission
  if (candidateLoginForm) {
    candidateLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = candidateNameInput ? candidateNameInput.value.trim() : 'Candidate';
      const email = candidateEmailInput ? candidateEmailInput.value.trim() : '';
      const levelRadio = candidateLoginForm.querySelector('input[name="candidateLevel"]:checked');
      const level = levelRadio ? levelRadio.value : 'fresher';
      const targetRole = targetJobInput ? targetJobInput.value.trim() : '';

      const profile = { name, email, level, targetRole };
      localStorage.setItem('jobfoodie_user_profile', JSON.stringify(profile));

      renderUserProfile();
      closeLoginModal();

      if (level === 'fresher') {
        activateFresherFilter();
        if (targetRole && keywordInput) {
          keywordInput.value = targetRole;
          state.keyword = targetRole;
          applyFilters();
        }
        showToast(`🎓 Welcome, ${name}! Fresher Accelerator activated for "${targetRole || 'Software Roles'}".`, 'success');
      } else {
        showToast(`💼 Welcome back, ${name}! Logged in as Experienced Professional.`, 'success');
      }
    });
  }

  // Handle User Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('jobfoodie_user_profile');
      renderUserProfile();
      state.filterType = 'all';
      filterPills.forEach(p => p.classList.toggle('active', p.dataset.type === 'all'));
      applyFilters();
      showToast('Logged out successfully', 'info');
    });
  }

  // Initialize saved user state
  renderUserProfile();

  // --------------------------------------------------------------------------
  // 6. Interactive Bookmark Toggle
  // --------------------------------------------------------------------------
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.job-card');
      const jobId = card.dataset.id;
      const jobTitle = card.dataset.title;

      if (savedBookmarks.has(jobId)) {
        savedBookmarks.delete(jobId);
        btn.classList.remove('saved');
        btn.setAttribute('title', 'Bookmark job');
        showToast(`Removed "${jobTitle}" from saved jobs`, 'info');
      } else {
        savedBookmarks.add(jobId);
        btn.classList.add('saved');
        btn.setAttribute('title', 'Remove bookmark');
        showToast(`Saved "${jobTitle}" to your bookmarks`, 'success');
      }

      localStorage.setItem('jobfoodie_bookmarks', JSON.stringify(Array.from(savedBookmarks)));
    });
  });

  // --------------------------------------------------------------------------
  // 7. Quick Apply Modal Interactivity
  // --------------------------------------------------------------------------
  function openApplyModal(title, company) {
    if (!applyModal) return;
    modalJobTitle.textContent = title;
    modalCompany.textContent = company;
    applyModal.classList.add('active');
    applyModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Autofill applicant details if user is logged in
    const profile = JSON.parse(localStorage.getItem('jobfoodie_user_profile') || 'null');
    if (profile) {
      const nameInput = document.getElementById('applicantName');
      const emailInput = document.getElementById('applicantEmail');
      if (nameInput && !nameInput.value) nameInput.value = profile.name;
      if (emailInput && !emailInput.value) emailInput.value = profile.email;
    }

    const firstInput = document.getElementById('applicantName');
    if (firstInput) firstInput.focus();
  }

  function closeApplyModal() {
    if (!applyModal) return;
    applyModal.classList.remove('active');
    applyModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (quickApplyForm) quickApplyForm.reset();
  }

  document.querySelectorAll('.btn-apply').forEach(button => {
    button.addEventListener('click', () => {
      const jobTitle = button.dataset.job || 'Position';
      const company = button.dataset.company || 'Company';
      openApplyModal(jobTitle, company);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeApplyModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeApplyModal);

  if (applyModal) {
    applyModal.addEventListener('click', (e) => {
      if (e.target === applyModal) closeApplyModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (applyModal.classList.contains('active')) closeApplyModal();
        if (loginModal && loginModal.classList.contains('active')) closeLoginModal();
      }
    });
  }

  if (quickApplyForm) {
    quickApplyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const applicantName = document.getElementById('applicantName').value;
      closeApplyModal();
      showToast(`Application submitted! Good luck, ${applicantName}.`, 'success');
    });
  }

  // --------------------------------------------------------------------------
  // 8. Employer Actions (Post a Job)
  // --------------------------------------------------------------------------
  const triggerPostJob = (e) => {
    e.preventDefault();
    showToast('Employer job posting portal is ready for company onboarding.', 'info');
  };

  if (postJobBtn) postJobBtn.addEventListener('click', triggerPostJob);
  if (footerPostJob) footerPostJob.addEventListener('click', triggerPostJob);

  // --------------------------------------------------------------------------
  // 9. Location Detection (GPS Geolocation)
  // --------------------------------------------------------------------------
  if (locateBtn) {
    locateBtn.addEventListener('click', () => {
      if (!('geolocation' in navigator)) {
        showToast('Geolocation is not supported by your browser.', 'info');
        return;
      }

      const locateLabel = locateBtn.querySelector('.locate-label');
      const originalText = locateLabel ? locateLabel.textContent : 'Detect';

      locateBtn.classList.add('loading');
      if (locateLabel) locateLabel.textContent = 'Locating...';
      showToast('Requesting browser location access...', 'info');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
              { headers: { 'Accept': 'application/json' } }
            );

            if (response.ok) {
              const data = await response.json();
              const addr = data.address || {};
              const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
              const stateName = addr.state || addr.country || '';
              const formattedLocation = city && stateName ? `${city}, ${stateName}` : (city || stateName || `${lat.toFixed(2)}, ${lon.toFixed(2)}`);

              if (locationInput) locationInput.value = formattedLocation;
              state.location = formattedLocation;
              applyFilters();
              showToast(`📍 Location detected: ${formattedLocation}`, 'success');
            } else {
              throw new Error('Nominatim response not ok');
            }
          } catch (err) {
            const coordStr = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
            if (locationInput) locationInput.value = coordStr;
            state.location = coordStr;
            applyFilters();
            showToast(`📍 Location coordinates: ${coordStr}`, 'success');
          } finally {
            locateBtn.classList.remove('loading');
            if (locateLabel) locateLabel.textContent = originalText;
          }
        },
        (error) => {
          locateBtn.classList.remove('loading');
          if (locateLabel) locateLabel.textContent = originalText;

          switch (error.code) {
            case error.PERMISSION_DENIED:
              showToast('Location permission denied. Click the lock/settings icon in your browser URL bar to allow location.', 'info');
              break;
            case error.POSITION_UNAVAILABLE:
              showToast('Location information is unavailable on your device.', 'info');
              break;
            case error.TIMEOUT:
              showToast('Location request timed out. Please try again or enter city manually.', 'info');
              break;
            default:
              showToast(`Location error: ${error.message}`, 'info');
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }
});
