import { companiesData } from './data/projectsData.js';

class UrbanSpireApp {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 3;
    this.sliderTimer = null;
    this.init();
  }

  init() {
    // 1. Initialize Header & Fullscreen Menu
    this.initHeaderAndMenu();

    // 2. Initialize Hero Showcase Slider (ECC Video Style)
    this.initHeroSlider();

    // 3. Initialize Expertise Horizontal Accordion
    this.initExpertiseAccordion();

    // 4. Initialize Sectors Vertical Slats Accordion
    this.initSectorsAccordion();

    // 5. Initialize Interactive Video Showcase Reel (Engineering in Motion)
    this.initVideoStories();

    // 6. Initialize Projects Portfolio & Lightbox Modals (6 Projects)
    this.initPortfolioAndLightbox();

    // 7. Initialize Smart Contact & RFQ Form with Spam Protection
    this.initContactForm();

    // 8. Initialize High Performance Lazy Video Loading (IntersectionObserver)
    this.initLazyVideos();
  }

  initLazyVideos() {
    const lazyVideos = document.querySelectorAll('video[data-lazy-video]');
    if (!lazyVideos.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const video = entry.target;
            const sources = video.querySelectorAll('source[data-src]');
            sources.forEach(source => {
              source.src = source.getAttribute('data-src');
              source.removeAttribute('data-src');
            });
            video.load();
            video.play().catch(() => {});
            obs.unobserve(video);
          }
        });
      }, { rootMargin: '300px 0px' });

      lazyVideos.forEach(v => observer.observe(v));
    } else {
      lazyVideos.forEach(video => {
        const sources = video.querySelectorAll('source[data-src]');
        sources.forEach(source => {
          source.src = source.getAttribute('data-src');
          source.removeAttribute('data-src');
        });
        video.load();
        video.play().catch(() => {});
      });
    }

    // Ensure all videos have muted and playsinline properties set for seamless autoplay
    document.querySelectorAll('video').forEach(vid => {
      vid.muted = true;
      vid.defaultMuted = true;
      vid.playsInline = true;
    });
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

    const playVideo = (vid) => {
      if (!vid) return;
      vid.muted = true;
      vid.defaultMuted = true;
      vid.playsInline = true;
      const p = vid.play();
      if (p !== undefined) {
        p.catch(() => {
          // If browser restricts un-interacted autoplay, unlock on first touch/click/scroll
          const unlock = () => {
            vid.muted = true;
            vid.play().catch(() => {});
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
            window.removeEventListener('scroll', unlock);
          };
          window.addEventListener('click', unlock, { once: true });
          window.addEventListener('touchstart', unlock, { once: true });
          window.addEventListener('scroll', unlock, { once: true });
        });
      }
    };

    const showSlide = (index) => {
      slides.forEach((s, idx) => {
        s.classList.toggle('active', idx === index);
        const vid = s.querySelector('video');
        if (vid) {
          if (idx === index) {
            playVideo(vid);
          } else {
            vid.pause();
          }
        }
      });
      if (currNum) {
        currNum.textContent = `0${index + 1}`;
      }
      this.currentSlide = index;

      // Pre-warm the next slide's video for instant zero-latency transition
      const nextVid = slides[(index + 1) % this.totalSlides]?.querySelector('video');
      if (nextVid) {
        nextVid.preload = 'auto';
      }
    };

    // Immediately trigger slide 0 video playback
    showSlide(0);

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

  initVideoStories() {
    const tabs = document.querySelectorAll('#stories-tabs .story-tab-btn');
    const video = document.getElementById('story-main-video');
    const videoSource = document.getElementById('story-video-source');
    const telemetryText = document.getElementById('story-telemetry-text');
    const badge = document.getElementById('story-badge');
    const title = document.getElementById('story-title');
    const challenge = document.getElementById('story-challenge');
    const solution = document.getElementById('story-solution');
    const metric1 = document.getElementById('story-metric-1');
    const metric1Lbl = document.getElementById('story-metric-1-lbl');
    const metric2 = document.getElementById('story-metric-2');
    const metric2Lbl = document.getElementById('story-metric-2-lbl');
    const metric3 = document.getElementById('story-metric-3');
    const metric3Lbl = document.getElementById('story-metric-3-lbl');
    const link = document.getElementById('story-link');

    const toggleSoundBtn = document.getElementById('story-toggle-sound');
    const soundIcon = document.getElementById('sound-icon');
    const soundLabel = document.getElementById('sound-label');

    const togglePlayBtn = document.getElementById('story-toggle-play');
    const playIcon = document.getElementById('play-icon');
    const playLabel = document.getElementById('play-label');

    if (!tabs.length || !video) return;

    const storiesData = {
      civil: {
        video: './videos/construction.mp4',
        poster: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1600&q=80',
        telemetry: 'Kharadi Core • 18.52° N, 73.85° E',
        badge: 'URBANSPIRE CONSTRUCTION • PUNE',
        title: 'The Zenith Spire: 34-Storey Core Execution & Seismic Zone IV',
        challenge: 'Executing a continuous 72-hour massive raft concrete pour in a dense commercial corridor with zero cold joints and post-tensioned slab tolerances.',
        solution: 'Integrated M60 silica fume mix design with automated core hydration temperature sensors, seismic shear walls, and BIM Level-3 coordinated MEP risers.',
        m1: '1.2M', m1Lbl: 'Sq. Ft. Built Core',
        m2: '72 Hrs', m2Lbl: 'Continuous Raft Pour',
        m3: 'Zone IV', m3Lbl: 'Seismic Standards',
        href: '/services.html#construction'
      },
      marine: {
        video: './videos/marine.mp4',
        poster: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1600&q=80',
        telemetry: 'Mumbai Harbor • 18.92° N, 72.83° E',
        badge: 'URBANSPIRE MARINE • MUMBAI BERTH',
        title: 'Gateway Terminal: Sea-Level Heavy Concrete Pontoon Deployment',
        challenge: 'Naval harbor deployment in high-frequency passenger catamaran corridors subject to 6-meter tidal variations and severe Arabian Sea monsoon waves.',
        solution: 'Heavy sea-level concrete pontoon featuring an unsinkable Virgin Closed-Cell EPS Core encased in M60 sulfate-resistant concrete with hydraulic mooring dampers.',
        m1: '140+', m1Lbl: 'Pontoons Deployed',
        m2: '4.5 kN/m²', m2Lbl: 'Payload Capacity',
        m3: '50+ Yrs', m3Lbl: 'Design Service Life',
        href: '/services.html#marine'
      },
      temple: {
        video: './videos/construction.mp4',
        poster: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
        telemetry: 'Dehu-Alandi Belt • 18.67° N, 73.78° E',
        badge: 'URBANSPIRE HERITAGE • SACRED ARCHITECTURE',
        title: 'Shri Someshwar Temple: Monolithic Dry-Stone Shikhara Engineering',
        challenge: 'Constructing an 85-foot monolithic basalt stone shikhara and a 1,000-person column-free prayer hall without central pillars or modern cement joints.',
        solution: 'Precision hand-chiselled dry basalt interlocking blocks utilizing gravity-locked mortise joints paired with deep micro-pile seismic isolation.',
        m1: '85 Ft', m1Lbl: 'Basalt Shikhara',
        m2: '1,000', m2Lbl: 'Column-Free Capacity',
        m3: '100%', m3Lbl: 'Dry Stone Interlock',
        href: '/projects.html'
      },
      global: {
        video: './videos/dubai.mp4',
        poster: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
        telemetry: 'Jebel Ali / Business Bay • 25.20° N, 55.27° E',
        badge: 'URBANSPIRE GLOBAL SERVICES • DUBAI',
        title: 'GCC Maritime Mobilization: 350-Ton Crawler Cranes & Offshore Rigs',
        challenge: 'Accelerated cross-border deployment of high-capacity rotary piling rigs and specialized microsilica cements for critical port expansion contracts.',
        solution: 'Turnkey fleet chartering, direct customs transit corridors, and specialized technical due diligence for international joint-venture EPC projects.',
        m1: '$120M+', m1Lbl: 'Procurement Volume',
        m2: '4x 350T', m2Lbl: 'Crawler Cranes',
        m3: 'Tier-1', m3Lbl: 'Logistics Network',
        href: '/services.html#global'
      }
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.getAttribute('data-story');
        const data = storiesData[key];
        if (!data) return;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Smooth switch video
        video.style.opacity = '0.3';
        setTimeout(() => {
          if (videoSource) videoSource.src = data.video;
          video.poster = data.poster;
          video.load();
          video.play().catch(() => {});
          video.style.opacity = '1';
        }, 200);

        // Update story details
        if (telemetryText) telemetryText.textContent = data.telemetry;
        if (badge) badge.textContent = data.badge;
        if (title) title.textContent = data.title;
        if (challenge) challenge.textContent = data.challenge;
        if (solution) solution.textContent = data.solution;
        if (metric1) metric1.textContent = data.m1;
        if (metric1Lbl) metric1Lbl.textContent = data.m1Lbl;
        if (metric2) metric2.textContent = data.m2;
        if (metric2Lbl) metric2Lbl.textContent = data.m2Lbl;
        if (metric3) metric3.textContent = data.m3;
        if (metric3Lbl) metric3Lbl.textContent = data.m3Lbl;
        if (link) link.href = data.href;
      });
    });

    // Sound toggle
    if (toggleSoundBtn) {
      toggleSoundBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        if (soundIcon) soundIcon.textContent = video.muted ? '🔇' : '🔊';
        if (soundLabel) soundLabel.textContent = video.muted ? 'Unmute' : 'Mute';
      });
    }

    // Play / Pause toggle
    if (togglePlayBtn) {
      togglePlayBtn.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          if (playIcon) playIcon.textContent = '⏸';
          if (playLabel) playLabel.textContent = 'Pause';
        } else {
          video.pause();
          if (playIcon) playIcon.textContent = '▶';
          if (playLabel) playLabel.textContent = 'Play';
        }
      });
    }
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
