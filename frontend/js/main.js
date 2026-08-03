// ===========================
// ENDLESS EXPLORER - MAIN JS
// FIXED: Popup + Slideshow Timing
// ===========================

// ---------- THEME TOGGLE ----------
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

(function loadTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

// ---------- CONFIG ----------
const API_BASE = 'http://localhost:5000/api';
const WHATSAPP_NUMBER = '919876543210';
const PHONE_NUMBER = '+919876543210';

// ---------- NAVBAR ----------
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navLinks?.classList.remove('active');
  });
});

const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});

// ---------- HERO SLIDESHOW (FIXED TIMING) ----------
class HeroSlideshow {
  constructor() {
    this.slides = document.querySelectorAll('.hero-bg-slide');
    this.indicators = document.getElementById('heroIndicators');
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 6000; // 6 seconds - proper timing
    this.isTransitioning = false; // Prevent multiple simultaneous changes

    if (this.slides.length === 0) {
      console.warn('No hero slides found');
      return;
    }

    this.init();
  }

  init() {
    // Random first image on page load
    this.currentIndex = Math.floor(Math.random() * this.slides.length);
    this.showSlide(this.currentIndex);
    this.createIndicators();
    this.startAutoPlay();
    this.setupHoverPause();
    // ❌ Removed scroll trigger - it was causing fast image changes
  }

  createIndicators() {
    if (!this.indicators) return;
    this.indicators.innerHTML = '';

    this.slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = 'indicator-dot';
      if (index === this.currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(index));
      this.indicators.appendChild(dot);
    });
  }

  showSlide(index) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.slides.forEach(slide => slide.classList.remove('active'));
    this.slides[index].classList.add('active');

    if (this.indicators) {
      const dots = this.indicators.querySelectorAll('.indicator-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    this.currentIndex = index;

    // Unlock after transition completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, 1500);
  }

  nextSlide() {
    const next = (this.currentIndex + 1) % this.slides.length;
    this.showSlide(next);
  }

  goToSlide(index) {
    this.showSlide(index);
    this.resetAutoPlay();
  }

  startAutoPlay() {
    this.stopAutoPlay(); // Clear any existing interval first
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  setupHoverPause() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mouseenter', () => this.stopAutoPlay());
    hero.addEventListener('mouseleave', () => this.startAutoPlay());
  }
}

// ---------- PARTICLES ----------
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 6 + 4) + 's';
    particle.style.animationDelay = (Math.random() * 4) + 's';
    particle.style.width = (Math.random() * 4 + 2) + 'px';
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
}

// ---------- COUNTER ANIMATION ----------
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };
    update();
  });
}

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);

// ---------- SCROLL ANIMATIONS ----------
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .gallery-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'all 0.6s ease';
  scrollObserver.observe(el);
});

// ---------- LOAD PACKAGES ----------
async function loadPackages() {
  const grid = document.getElementById('packagesGrid');
  const spinner = document.getElementById('loadingSpinner');
  const noPackages = document.getElementById('noPackages');

  const search = document.getElementById('searchInput')?.value || '';
  const category = document.getElementById('categoryFilter')?.value || 'all';
  const sort = document.getElementById('sortFilter')?.value || 'latest';

  grid.innerHTML = '';
  spinner.style.display = 'block';
  noPackages.style.display = 'none';

  try {
    const res = await fetch(
      `${API_BASE}/packages?search=${search}&category=${category}&sort=${sort}`
    );
    const packages = await res.json();

    spinner.style.display = 'none';

    if (packages.length === 0) {
      showDemoPackages(grid);
      return;
    }

    packages.forEach((pkg, index) => {
      const card = createPackageCard(pkg);
      card.style.animationDelay = `${index * 0.1}s`;
      grid.appendChild(card);
    });

    document.querySelectorAll('.package-card').forEach(el => {
      scrollObserver.observe(el);
    });
  } catch (err) {
    spinner.style.display = 'none';
    showDemoPackages(grid);
  }
}

function createPackageCard(pkg) {
  const card = document.createElement('div');
  card.className = 'package-card';
  card.onclick = () => openPackageModal(pkg);

  const image = pkg.images && pkg.images[0]
    ? (pkg.images[0].startsWith('http') ? pkg.images[0] : pkg.images[0])
    : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600';

  const stars = '★'.repeat(Math.floor(pkg.rating || 4)) + '☆'.repeat(5 - Math.floor(pkg.rating || 4));

  card.innerHTML = `
    <div class="card-image">
      <img src="${image}" alt="${pkg.title}" loading="lazy">
      <span class="card-badge">${pkg.category || 'Adventure'}</span>
      ${pkg.featured ? '<span class="card-featured">🔥 Trending</span>' : ''}
      <div class="card-price-tag">
        <span class="price">₹${(pkg.price || 0).toLocaleString()}</span>
        ${pkg.originalPrice ? `<span class="original-price">₹${pkg.originalPrice.toLocaleString()}</span>` : ''}
        <br><small>/person</small>
      </div>
    </div>
    <div class="card-content">
      <div class="card-destination">
        <i class="fas fa-map-marker-alt"></i> ${pkg.destination || 'India'}
      </div>
      <h3 class="card-title">${pkg.title}</h3>
      <div class="card-meta">
        <span class="meta-item"><i class="fas fa-clock"></i> ${pkg.duration || 'N/A'}</span>
        <span class="meta-item"><i class="fas fa-users"></i> ${pkg.groupSize || 'Flexible'}</span>
        <span class="meta-item"><i class="fas fa-signal"></i> ${pkg.difficulty || 'Easy'}</span>
      </div>
      <div class="card-rating">
        <span class="stars">${stars}</span>
        <span class="rating-text">${pkg.rating || 4.5} (${pkg.reviewCount || 0} reviews)</span>
      </div>
      <div class="card-footer">
        <button class="btn btn-enquire" onclick="event.stopPropagation(); openEnquiryPopup('${pkg.title}')">
          <i class="fas fa-paper-plane"></i> Enquire
        </button>
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'm interested in ${encodeURIComponent(pkg.title)} package" 
           target="_blank" class="btn btn-whatsapp" onclick="event.stopPropagation()">
          <i class="fab fa-whatsapp"></i> WhatsApp
        </a>
      </div>
    </div>
  `;

  return card;
}

function showDemoPackages(grid) {
  const demoPackages = [
    {
      title: 'Goa Beach Paradise', destination: 'Goa',
      description: 'Experience vibrant beaches, stunning sunsets, and exciting nightlife of Goa.',
      price: 8999, originalPrice: 12999, duration: '4 Days 3 Nights',
      groupSize: '2-15 People', difficulty: 'Easy', category: 'Beach',
      rating: 4.8, reviewCount: 124, featured: true,
      images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600'],
      highlights: ['Baga Beach', 'Dudhsagar Falls', 'Water Sports'],
      itinerary: [
        { day: 1, title: 'Arrival & North Goa', details: 'Hotel check-in, Baga Beach' },
        { day: 2, title: 'Adventure Day', details: 'Water sports, Anjuna Market' },
        { day: 3, title: 'South Goa', details: 'Dudhsagar Falls, Palolem Beach' },
        { day: 4, title: 'Departure', details: 'Old Goa Churches, departure' }
      ],
      inclusions: ['3-Star Hotel', 'Breakfast & Dinner', 'AC Transport', 'Sightseeing'],
      exclusions: ['Flights', 'Lunch', 'Water Sports Charges']
    },
    {
      title: 'Manali Snow Adventure', destination: 'Manali',
      description: 'Breathtaking mountain views and snow-capped peaks of Himachal.',
      price: 11999, originalPrice: 16999, duration: '5 Days 4 Nights',
      groupSize: '4-20 People', difficulty: 'Moderate', category: 'Mountain',
      rating: 4.7, reviewCount: 98, featured: true,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'],
      highlights: ['Rohtang Pass', 'Solang Valley', 'Old Manali'],
      itinerary: [
        { day: 1, title: 'Delhi to Manali', details: 'Overnight Volvo bus' },
        { day: 2, title: 'Manali Local', details: 'Hadimba Temple, Mall Road' },
        { day: 3, title: 'Solang Valley', details: 'Adventure sports' },
        { day: 4, title: 'Rohtang Pass', details: 'Snow point visit' },
        { day: 5, title: 'Departure', details: 'Return to Delhi' }
      ],
      inclusions: ['3-Star Hotel', 'All Meals', 'Volvo Bus', 'Sightseeing'],
      exclusions: ['Adventure Activities', 'Personal Expenses']
    },
    {
      title: 'Kashmir Heaven on Earth', destination: 'Kashmir',
      description: 'Dal Lake houseboats, Mughal gardens, and stunning valleys.',
      price: 15999, originalPrice: 21999, duration: '6 Days 5 Nights',
      groupSize: '2-12 People', difficulty: 'Easy', category: 'Heritage',
      rating: 4.9, reviewCount: 156, featured: true,
      images: ['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=600'],
      highlights: ['Dal Lake Houseboat', 'Gulmarg Gondola', 'Pahalgam Valley'],
      itinerary: [
        { day: 1, title: 'Arrival Srinagar', details: 'Dal Lake Shikara ride' },
        { day: 2, title: 'Mughal Gardens', details: 'Nishat & Shalimar Bagh' },
        { day: 3, title: 'Gulmarg', details: 'Gondola ride, snow activities' },
        { day: 4, title: 'Pahalgam', details: 'Betaab Valley, Aru Valley' },
        { day: 5, title: 'Sonmarg', details: 'Thajiwas Glacier' },
        { day: 6, title: 'Departure', details: 'Airport drop' }
      ],
      inclusions: ['Houseboat + Hotel', 'All Meals', 'Private Cab', 'Sightseeing'],
      exclusions: ['Flights', 'Gondola Tickets', 'Shopping']
    },
    {
      title: 'Kerala Backwaters Bliss', destination: 'Kerala',
      description: 'Houseboat cruises through backwaters and tea gardens.',
      price: 13999, originalPrice: 18999, duration: '5 Days 4 Nights',
      groupSize: '2-10 People', difficulty: 'Easy', category: 'Honeymoon',
      rating: 4.8, reviewCount: 87, featured: false,
      images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600'],
      highlights: ['Alleppey Houseboat', 'Munnar Tea Gardens', 'Kovalam Beach'],
      itinerary: [
        { day: 1, title: 'Arrival Kochi', details: 'Fort Kochi walk' },
        { day: 2, title: 'Munnar', details: 'Tea plantations' },
        { day: 3, title: 'To Alleppey', details: 'Houseboat check-in' },
        { day: 4, title: 'Backwater Cruise', details: 'Full day cruise' },
        { day: 5, title: 'Departure', details: 'Airport drop' }
      ],
      inclusions: ['Hotels + Houseboat', 'Breakfast & Dinner', 'Private Car'],
      exclusions: ['Flights', 'Lunch', 'Entry Tickets']
    },
    {
      title: 'Rajasthan Royal Heritage', destination: 'Rajasthan',
      description: 'Explore majestic forts and desert safaris.',
      price: 12499, originalPrice: 17499, duration: '6 Days 5 Nights',
      groupSize: '4-20 People', difficulty: 'Easy', category: 'Heritage',
      rating: 4.6, reviewCount: 73, featured: false,
      images: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600'],
      highlights: ['Hawa Mahal', 'Mehrangarh Fort', 'Desert Safari'],
      itinerary: [
        { day: 1, title: 'Jaipur', details: 'Pink City tour' },
        { day: 2, title: 'Jaipur Forts', details: 'Amber Fort' },
        { day: 3, title: 'Jodhpur', details: 'Blue City' },
        { day: 4, title: 'Jaisalmer', details: 'Golden Fort' },
        { day: 5, title: 'Desert Safari', details: 'Camel safari' },
        { day: 6, title: 'Departure', details: 'Return' }
      ],
      inclusions: ['Heritage Hotels', 'All Meals', 'AC Transport'],
      exclusions: ['Flights', 'Camel Ride', 'Tips']
    },
    {
      title: 'Andaman Island Escape', destination: 'Andaman',
      description: 'Crystal clear waters and pristine beaches.',
      price: 18999, originalPrice: 24999, duration: '5 Days 4 Nights',
      groupSize: '2-8 People', difficulty: 'Easy', category: 'Beach',
      rating: 4.9, reviewCount: 64, featured: false,
      images: ['https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600'],
      highlights: ['Radhanagar Beach', 'Scuba Diving', 'Cellular Jail'],
      itinerary: [
        { day: 1, title: 'Port Blair', details: 'Cellular Jail' },
        { day: 2, title: 'Havelock', details: 'Ferry, Radhanagar Beach' },
        { day: 3, title: 'Water Activities', details: 'Scuba diving' },
        { day: 4, title: 'Neil Island', details: 'Natural bridge' },
        { day: 5, title: 'Departure', details: 'Return' }
      ],
      inclusions: ['Beach Resort', 'Breakfast & Dinner', 'Ferry Tickets'],
      exclusions: ['Flights', 'Scuba Diving', 'Water Sports']
    }
  ];

  demoPackages.forEach((pkg, index) => {
    const card = createPackageCard(pkg);
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    grid.appendChild(card);

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100);
  });
}

// ---------- PACKAGE DETAIL MODAL ----------
function openPackageModal(pkg) {
  const modal = document.getElementById('packageModal');
  const content = document.getElementById('modalContent');

  const image = pkg.images && pkg.images[0]
    ? (pkg.images[0].startsWith('http') ? pkg.images[0] : pkg.images[0])
    : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600';

  let itineraryHTML = '';
  if (pkg.itinerary && pkg.itinerary.length > 0) {
    itineraryHTML = `
      <h4 class="modal-section-title"><i class="fas fa-route"></i> Day-wise Itinerary</h4>
      ${pkg.itinerary.map(item => `
        <div class="itinerary-item">
          <div class="itinerary-day">Day ${item.day}</div>
          <div class="itinerary-title">${item.title}</div>
          <div class="itinerary-details">${item.details}</div>
        </div>
      `).join('')}
    `;
  }

  let inclusionsHTML = '';
  if (pkg.inclusions && pkg.inclusions.length > 0) {
    inclusionsHTML = `
      <h4 class="modal-section-title"><i class="fas fa-check-circle"></i> Inclusions</h4>
      <ul class="modal-list">
        ${pkg.inclusions.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
      </ul>
    `;
  }

  let exclusionsHTML = '';
  if (pkg.exclusions && pkg.exclusions.length > 0) {
    exclusionsHTML = `
      <h4 class="modal-section-title"><i class="fas fa-times-circle"></i> Exclusions</h4>
      <ul class="modal-list">
        ${pkg.exclusions.map(item => `<li><i class="fas fa-times"></i> ${item}</li>`).join('')}
      </ul>
    `;
  }

  let highlightsHTML = '';
  if (pkg.highlights && pkg.highlights.length > 0) {
    highlightsHTML = `
      <h4 class="modal-section-title"><i class="fas fa-star"></i> Highlights</h4>
      <ul class="modal-list">
        ${pkg.highlights.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
      </ul>
    `;
  }

  content.innerHTML = `
    <img src="${image}" alt="${pkg.title}" class="modal-image">
    <div class="modal-body">
      <div class="modal-dest"><i class="fas fa-map-marker-alt"></i> ${pkg.destination || 'India'}</div>
      <h2>${pkg.title}</h2>
      <div class="modal-meta">
        <span class="meta-item"><i class="fas fa-clock"></i> ${pkg.duration || 'N/A'}</span>
        <span class="meta-item"><i class="fas fa-users"></i> ${pkg.groupSize || 'Flexible'}</span>
        <span class="meta-item"><i class="fas fa-signal"></i> ${pkg.difficulty || 'Easy'}</span>
        <span class="meta-item"><i class="fas fa-star" style="color:#ffc107"></i> ${pkg.rating || 4.5}/5</span>
      </div>
      <div class="modal-price-box">
        <span class="modal-price">₹${(pkg.price || 0).toLocaleString()}</span>
        ${pkg.originalPrice ? `<span class="modal-original-price">₹${pkg.originalPrice.toLocaleString()}</span>` : ''}
        <span class="modal-per-person">/per person</span>
      </div>
      <p class="modal-description">${pkg.description || ''}</p>
      ${highlightsHTML}
      ${itineraryHTML}
      ${inclusionsHTML}
      ${exclusionsHTML}
      <div class="modal-actions">
        <button class="btn btn-primary" onclick="openEnquiryPopup('${pkg.title}')">
          <i class="fas fa-paper-plane"></i> Enquire Now
        </button>
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'm interested in *${encodeURIComponent(pkg.title)}* package (₹${pkg.price}/person)." 
           target="_blank" class="btn btn-outline" style="background:#25D366; color:white; border-color:#25D366;">
          <i class="fab fa-whatsapp"></i> WhatsApp
        </a>
        <a href="tel:${PHONE_NUMBER}" class="btn btn-outline">
          <i class="fas fa-phone-alt"></i> Call
        </a>
      </div>
    </div>
  `;

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('packageModal').classList.remove('show');
  document.body.style.overflow = 'auto';
}

// ---------- POPUP SYSTEM (FIXED) ----------
let popupShown = false;
let popupTimerActive = false;

function startPopupTimer() {
  // Check if user already submitted (last 24 hours)
  const submitted = localStorage.getItem('endlessExplorerLead');
  const submittedTime = localStorage.getItem('endlessExplorerLeadTime');
  
  if (submitted === 'true' && submittedTime) {
    const hoursSince = (Date.now() - parseInt(submittedTime)) / (1000 * 60 * 60);
    // If less than 24 hours since submit, don't show popup
    if (hoursSince < 24) {
      console.log('Popup already submitted recently. Will show again after 24 hours.');
      return;
    } else {
      // Reset after 24 hours
      localStorage.removeItem('endlessExplorerLead');
      localStorage.removeItem('endlessExplorerLeadTime');
    }
  }

  if (popupTimerActive) return;
  popupTimerActive = true;

  console.log('Popup timer started. Will show in 10 seconds...');
  
  setTimeout(() => {
    if (!popupShown) {
      showPopup();
    }
  }, 10000); // 10 seconds
}

function showPopup() {
  const popup = document.getElementById('leadPopup');
  const modal = document.getElementById('packageModal');

  // Don't show if package modal is open
  if (modal && modal.classList.contains('show')) {
    console.log('Package modal open, retrying in 15 seconds...');
    setTimeout(showPopup, 15000);
    return;
  }

  if (!popup) {
    console.error('Popup element not found!');
    return;
  }

  popup.classList.add('show');
  popupShown = true;
  document.body.style.overflow = 'hidden';
  console.log('Popup shown!');
}

function closePopup() {
  const popup = document.getElementById('leadPopup');
  popup.classList.remove('show');
  document.body.style.overflow = 'auto';
  popupShown = false;

  // Show again after 60 sec if not submitted
  const submitted = localStorage.getItem('endlessExplorerLead');
  if (submitted !== 'true') {
    setTimeout(() => {
      if (!popupShown) showPopup();
    }, 60000);
  }
}

function openEnquiryPopup(packageName) {
  const popup = document.getElementById('leadPopup');
  const msgField = document.getElementById('popupMsg');

  if (packageName && msgField) {
    msgField.value = `Interested in: ${packageName}`;
  }

  closeModal();
  popup.classList.add('show');
  popupShown = true;
  document.body.style.overflow = 'hidden';
}

async function submitPopupLead(event) {
  event.preventDefault();

  const submitBtn = event.target.querySelector('.popup-submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  const data = {
    name: document.getElementById('popupName').value,
    phone: document.getElementById('popupPhone').value,
    message: document.getElementById('popupMsg').value,
    source: 'popup',
    page: window.location.pathname
  };

  try {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      localStorage.setItem('endlessExplorerLead', 'true');
      localStorage.setItem('endlessExplorerLeadTime', Date.now().toString());
      showSuccessMessage();
    }
  } catch (err) {
    localStorage.setItem('endlessExplorerLead', 'true');
    localStorage.setItem('endlessExplorerLeadTime', Date.now().toString());
    showSuccessMessage();
  }

  submitBtn.innerHTML = originalText;
  submitBtn.disabled = false;
}

function showSuccessMessage() {
  const popup = document.getElementById('leadPopup');
  const card = popup.querySelector('.popup-card');

  card.innerHTML = `
    <div style="text-align: center; padding: 40px 20px;">
      <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
      <h3 style="color: var(--text); font-size: 24px; margin-bottom: 10px;">Thank You!</h3>
      <p style="color: var(--text-light); margin-bottom: 24px;">
        Endless Explorer ki team aapko <strong style="color: var(--primary);">30 minutes</strong> mein call karegi!
      </p>
      <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hi! Maine abhi enquiry ki hai." 
         target="_blank" class="btn btn-primary" style="background: #25D366; display: inline-flex;">
        <i class="fab fa-whatsapp"></i> WhatsApp pe baat karein
      </a>
      <br><br>
      <button onclick="closePopup()" class="btn btn-outline" style="display: inline-flex;">
        Close
      </button>
    </div>
  `;
}

// ---------- CONTACT FORM ----------
async function submitContact(event) {
  event.preventDefault();

  const data = {
    name: document.getElementById('contactName').value,
    phone: document.getElementById('contactPhone').value,
    email: document.getElementById('contactEmail').value,
    message: document.getElementById('contactMsg').value,
    source: 'contact-form',
    page: 'contact-section'
  };

  try {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert('✅ Enquiry sent! We will contact you soon.');
      document.getElementById('contactForm').reset();
    }
  } catch (err) {
    alert('📞 Network issue! Please WhatsApp or Call us directly.');
  }
}

// ---------- CLOSE MODALS ----------
document.getElementById('leadPopup')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closePopup();
});

document.getElementById('packageModal')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePopup();
    closeModal();
  }
});

// ---------- INIT ----------
window.addEventListener('DOMContentLoaded', () => {
  new HeroSlideshow();
  createParticles();
  loadPackages();
  startPopupTimer();
});