import { SceneManager } from './scene/sceneManager.js';
import { companiesData } from './data/projectsData.js';

class UrbanSpireApp {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.sceneManager = null;
    this.currentSlide = 0;
    this.totalSlides = 3;
    this.sliderTimer = null;
    this.init();
  }

  init() {
    // 1. Initialize 3D Scene in the Studio Frame
    if (this.canvas) {
      this.sceneManager = new SceneManager(this.canvas);
      this.sceneManager.setMode('marine'); // Start on iconic marine pontoon
    }

    // 2. Initialize Header & Fullscreen Menu
    this.initHeaderAndMenu();

    // 3. Initialize Hero Showcase Slider (ECC Video Style)
    this.initHeroSlider();

    // 4. Initialize Expertise Horizontal Accordion
    this.initExpertiseAccordion();

    // 5. Initialize Sectors Vertical Slats Accordion
    this.initSectorsAccordion();

    // 6. Initialize 3D Studio Controls
    this.initStudioControls();

    // 7. Initialize Projects Portfolio & Lightbox Modals (6 Projects)
    this.initPortfolioAndLightbox();

    // 8. Initialize Smart Contact & RFQ Form with Spam Protection
    this.initContactForm();
  }

  initHeaderAndMenu() {
    const header = document.getElementById('site-header');
    const navToggle = document.getElementById('nav-toggle-btn');
    const navIcon = document.getElementById('nav-icon4');
    const fullMenu = document.getElementById('fullscreen-menu');
    const closeBtn = document.getElementById('fsnm-close-btn');
    const fsnmLinks = document.querySelectorAll('.fsnm-link');

    // Sticky header shadow on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        if (header) header.classList.add('scrolled');
      } else {
        if (header) header.classList.remove('scrolled');
      }
    });

    const closeMenu = () => {
      if (navIcon) navIcon.classList.remove('open');
      if (fullMenu) fullMenu.classList.remove('active');
      if (header) header.classList.remove('menu-open');
      document.body.classList.remove('no-scroll');
    };

    const toggleMenu = () => {
      if (!navIcon || !fullMenu) return;
      const isOpen = navIcon.classList.toggle('open');
      fullMenu.classList.toggle('active', isOpen);
      if (header) header.classList.toggle('menu-open', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    };

    // Toggle fullscreen menu
    if (navToggle) {
      navToggle.addEventListener('click', toggleMenu);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    fsnmLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        closeMenu();
        const targetHref = link.getAttribute('href');
        if (targetHref && targetHref.startsWith('#')) {
          const targetEl = document.querySelector(targetHref);
          if (targetEl) {
            e.preventDefault();
            setTimeout(() => {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }, 120);
          }
        }
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fullMenu && fullMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    const logoHome = document.getElementById('logo-home-btn');
    if (logoHome) {
      logoHome.addEventListener('click', () => {
        closeMenu();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const headerRfq = document.getElementById('header-rfq-btn');
    if (headerRfq) {
      headerRfq.addEventListener('click', () => {
        closeMenu();
        const contactSec = document.getElementById('contact');
        if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  initHeroSlider() {
    const slides = document.querySelectorAll('.showcase-project');
    const currNum = document.getElementById('slide-curr-num');
    const prevBtn = document.getElementById('slider-prev-btn');
    const nextBtn = document.getElementById('slider-next-btn');

    if (!slides.length) return;

    const showSlide = (index) => {
      slides.forEach((s, idx) => {
        s.classList.toggle('active', idx === index);
        const vid = s.querySelector('video');
        if (vid) {
          if (idx === index) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        }
      });
      if (currNum) {
        currNum.textContent = `0${index + 1}`;
      }
      this.currentSlide = index;
    };

    const nextSlide = () => {
      const next = (this.currentSlide + 1) % this.totalSlides;
      showSlide(next);
    };

    const prevSlide = () => {
      const prev = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
      showSlide(prev);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        this.resetSliderTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        this.resetSliderTimer();
      });
    }

    // Auto rotate every 8 seconds
    this.resetSliderTimer = () => {
      if (this.sliderTimer) clearInterval(this.sliderTimer);
      this.sliderTimer = setInterval(nextSlide, 8000);
    };

    this.resetSliderTimer();
  }

  initExpertiseAccordion() {
    const items = document.querySelectorAll('.feature-menu-item');
    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });

      item.addEventListener('click', (e) => {
        const wasActive = item.classList.contains('active');
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const tab = item.getAttribute('data-tab');
        if (this.sceneManager) {
          this.sceneManager.setMode(tab);
          this.syncStudioUI(tab);
        }

        const clickedBtn = e.target.closest('.feature-btn');
        if (clickedBtn || (window.innerWidth > 992 && wasActive)) {
          const studioSec = document.getElementById('studio3d');
          if (studioSec) {
            studioSec.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  initSectorsAccordion() {
    const slats = document.querySelectorAll('.custom-case-item');
    slats.forEach(slat => {
      slat.addEventListener('mouseenter', () => {
        slats.forEach(s => s.classList.remove('active'));
        slat.classList.add('active');
      });

      slat.addEventListener('click', () => {
        slats.forEach(s => s.classList.remove('active'));
        slat.classList.add('active');
      });
    });
  }

  initStudioControls() {
    const modeTabs = document.querySelectorAll('.studio-tab-btn');
    const titleEl = document.getElementById('studio-scene-title');
    const descEl = document.getElementById('studio-scene-desc');
    const coordsEl = document.getElementById('studio-telemetry-coords');
    const explodeControls = document.getElementById('pontoon-explode-controls');

    const sceneDescriptions = {
      construction: {
        title: "01. UrbanSpire Construction (Pune Civil)",
        desc: "Procedural 18-storey architectural skyscraper with live crane mechanics, Nagara-style stone temple shikhara, and government administrative housing.",
        coords: "18.52° N, 73.85° E (PNQ)",
        showExplode: false
      },
      marine: {
        title: "02. UrbanSpire Marine (Mumbai Pontoon)",
        desc: "Unsinkable Virgin Closed-Cell EPS Core encased in M60 sulfate-resistant concrete. Engineered for tidal swells up to 6.2 meters with 50+ year service life.",
        coords: "18.92° N, 72.83° E (BOM)",
        showExplode: true
      },
      global: {
        title: "03. UrbanSpire Global (Dubai Trade Hub)",
        desc: "Interactive 3D celestial globe with flight and shipping trajectories linking Indian fabrication yards to Dubai Business Bay headquarters.",
        coords: "25.20° N, 55.27° E (DXB)",
        showExplode: false
      }
    };

    modeTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        modeTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (this.sceneManager) {
          this.sceneManager.setMode(mode);
        }

        const data = sceneDescriptions[mode];
        if (data) {
          if (titleEl) titleEl.textContent = data.title;
          if (descEl) descEl.textContent = data.desc;
          if (coordsEl) coordsEl.textContent = data.coords;
          if (explodeControls) {
            explodeControls.style.display = data.showExplode ? 'flex' : 'none';
          }
        }
      });
    });

    // Pontoon Exploded View Buttons
    const btnSolid = document.getElementById('btn-studio-solid');
    const btnExploded = document.getElementById('btn-studio-exploded');

    if (btnSolid && btnExploded) {
      btnSolid.addEventListener('click', () => {
        btnSolid.classList.add('active');
        btnExploded.classList.remove('active');
        if (this.sceneManager) this.sceneManager.setPontoonExploded(false);
      });

      btnExploded.addEventListener('click', () => {
        btnExploded.classList.add('active');
        btnSolid.classList.remove('active');
        if (this.sceneManager) this.sceneManager.setPontoonExploded(true);
      });
    }
  }

  syncStudioUI(mode) {
    const modeTabs = document.querySelectorAll('.studio-tab-btn');
    modeTabs.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });
    const clickEvent = new Event('click');
    const activeBtn = Array.from(modeTabs).find(b => b.getAttribute('data-mode') === mode);
    if (activeBtn) activeBtn.dispatchEvent(clickEvent);
  }

  initPortfolioAndLightbox() {
    const grid = document.getElementById('projects-grid-list');
    const filterPills = document.querySelectorAll('.filter-pill');
    const lightbox = document.getElementById('project-lightbox');
    const closeBtn = document.getElementById('lightbox-close-btn');

    const lbImg = document.getElementById('lightbox-img');
    const lbTag = document.getElementById('lightbox-tag');
    const lbTitle = document.getElementById('lightbox-title');
    const lbLoc = document.getElementById('lightbox-loc');
    const lbScope = document.getElementById('lightbox-scope');
    const lbDesc = document.getElementById('lightbox-desc');

    if (!grid) return;

    // Collect 6 Featured Projects exactly as per Business Package quotation
    const featuredProjects = [
      {
        id: "p1",
        title: "The Zenith Spire & Commercial Complex",
        category: "Commercial High-Rise",
        filterCat: "civil",
        location: "Kharadi, Pune, Maharashtra",
        scope: "34 Storeys • Grade-A Commercial Tower • Seismic Zone IV",
        specs: "1.2 Million Sq. Ft. built-up area executed with post-tensioned slabs, high-tensile rebar, and intelligent BMS integration.",
        year: "2024",
        image: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "p2",
        title: "Shri Someshwar Grand Temple Complex",
        category: "Sacred Stone Architecture",
        filterCat: "temple",
        location: "Dehu-Alandi Spiritual Corridor, Pune",
        scope: "Monolithic Basalt Stone • 85-Ft Shikhara • Mandapa",
        specs: "Precision interlocking dry-stone heritage engineering, column-free 1,000 capacity prayer hall, and seismically anchored foundations.",
        year: "2023",
        image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "p3",
        title: "Maharashtra State Officer Quarters Enclave",
        category: "Government Civil Housing",
        filterCat: "govt",
        location: "Shivaji Nagar, Pune",
        scope: "12 Towers • 480 Residential Units • PWD Tender",
        specs: "Turnkey government tender delivery with dedicated internal roads, sewage treatment plants, solar grid, and security checkpoints.",
        year: "2023",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "p4",
        title: "Apollo Bunder Marine Passenger Catamaran Terminal",
        category: "Heavy Sea-Level Concrete Pontoon",
        filterCat: "marine",
        location: "Gateway of India Harbor, Mumbai",
        scope: "75m Floating Concrete Pontoon • 4 Catamaran Berths",
        specs: "Unsinkable virgin closed-cell EPS core encased in M60 sulfate-resistant concrete, hydraulic mooring dampers, and automated gangways.",
        year: "2024",
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "p5",
        title: "Vidyapeeth Integrated Academy Campus",
        category: "Institutional & Educational",
        filterCat: "civil",
        location: "Kothrud, Pune",
        scope: "45-Acre Masterplan • 6 Academic Blocks • Olympic Arena",
        specs: "Vibration-isolated physics laboratories, precast 1,800-seat acoustic auditorium, and rainwater harvesting civil network.",
        year: "2024",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "p6",
        title: "GCC Maritime Equipment & Crane Mobilization",
        category: "International Megaproject Procurement",
        filterCat: "dubai",
        location: "Dubai Maritime City / Jebel Ali, UAE",
        scope: "Heavy Plant Fleet • 4x 350-Ton Crawler Cranes",
        specs: "Cross-border equipment leasing and certified operators mobilization for offshore foundation drilling in Dubai waters.",
        year: "2024",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80"
      }
    ];

    const openLightbox = (project) => {
      if (!lightbox) return;
      lbImg.src = project.image;
      lbTag.textContent = project.category;
      lbTitle.textContent = project.title;
      lbLoc.textContent = `${project.location} • Completed ${project.year}`;
      lbScope.textContent = project.scope;
      lbDesc.textContent = project.specs;
      lightbox.classList.add('open');
      document.body.classList.add('no-scroll');
    };

    const closeLightbox = () => {
      if (!lightbox) return;
      lightbox.classList.remove('open');
      document.body.classList.remove('no-scroll');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    const renderProjects = (filter) => {
      const filtered = filter === 'all'
        ? featuredProjects
        : featuredProjects.filter(p => p.filterCat === filter);

      grid.innerHTML = filtered.map(p => `
        <div class="grid-project-item" data-id="${p.id}">
          <img src="${p.image}" alt="${p.title}" class="grid-project-img" loading="lazy" />
          <div class="grid-project-overlay">
            <span class="grid-project-tag">${p.category} • ${p.year}</span>
            <h4 class="grid-project-title">${p.title}</h4>
            <div class="grid-project-loc">${p.location}</div>
            <div class="grid-project-hover-meta">
              <b>${p.scope}</b><br />
              <span style="color: var(--eccAccent); font-weight: 600;">Click to view full lightbox specifications →</span>
            </div>
          </div>
        </div>
      `).join('');

      grid.querySelectorAll('.grid-project-item').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-id');
          const proj = featuredProjects.find(p => p.id === id);
          if (proj) openLightbox(proj);
        });
      });
    };

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filter = pill.getAttribute('data-filter');
        renderProjects(filter);
      });
    });

    // Initial render
    renderProjects('all');
  }

  initContactForm() {
    const form = document.getElementById('contact-enquiry-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check honeypot spam field
      const honeypot = form.querySelector('input[name="honeypot_check"]');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Spam submission detected and blocked.');
        return;
      }

      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const phone = document.getElementById('contact-phone').value;
      const company = document.getElementById('contact-company-select').value;
      const msg = document.getElementById('contact-message').value;

      // Simulated instant email alert notification (as per Business Package quote)
      alert(`✅ Project Enquiry Received!\n\nThank you, ${name}. Your proposal for ${company.toUpperCase()} has been forwarded to our commercial desk.\n\nA confirmation alert has been generated, and our project manager will contact you at ${phone} / ${email} within 24 hours.`);

      // Optional direct WhatsApp follow-up redirect
      const waUrl = `https://wa.me/918180948075?text=${encodeURIComponent(`New Website RFQ from ${name} (${email}, ${phone}): ${msg}`)}`;
      window.open(waUrl, '_blank');

      form.reset();
    });
  }
}

// Bootstrap on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new UrbanSpireApp();
});
