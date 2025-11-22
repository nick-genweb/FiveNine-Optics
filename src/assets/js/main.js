// FiveNine Optics - Main JavaScript

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('is-active');
      navToggle.classList.toggle('is-active');

      // Update aria-expanded
      const isExpanded = navList.classList.contains('is-active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile nav when clicking a link (except dropdown parent)
    const navLinks = navList.querySelectorAll('a');
    navLinks.forEach(link => {
      // Don't close if it's the About link (dropdown parent)
      if (!link.classList.contains('nav-link-about')) {
        link.addEventListener('click', () => {
          navList.classList.remove('is-active');
          navToggle.classList.remove('is-active');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // Mobile dropdown toggle
  const dropdownParent = document.querySelector('.nav-item-with-dropdown');
  const dropdownLink = document.querySelector('.nav-link-about');

  if (dropdownParent && dropdownLink) {
    dropdownLink.addEventListener('click', (e) => {
      // Only prevent default and toggle on mobile
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdownParent.classList.toggle('dropdown-open');
      }
    });
  }

  // Set active state for About link on homepage
  const currentPath = window.location.pathname;
  const aboutLink = document.querySelector('.nav-link-about');

  if (aboutLink && (currentPath === '/' || currentPath === '/index.html')) {
    aboutLink.classList.add('active');
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

  // Initialize Facility Carousel
  if (typeof Swiper !== 'undefined') {
    const facilitySwiper = new Swiper('.facilitySwiper', {
      loop: true,
      loopAdditionalSlides: 2,
      slidesPerView: 'auto',
      spaceBetween: 10,
      centeredSlides: false,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        reverseDirection: false,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      keyboard: {
        enabled: true,
      },
      grabCursor: true,
      autoHeight: false,
      speed: 800,
      slideToClickedSlide: true,
      breakpoints: {
        // Mobile - show 1 slide
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
          loop: true,
        },
        // Tablet and up - show auto slides with 10px spacing
        768: {
          slidesPerView: 'auto',
          spaceBetween: 10,
          loop: true,
        }
      }
    });
  }

  // Team member hover functionality
  const teamMemberPhotos = document.querySelectorAll('.team-member-photo');
  const teamInfoDesktop = document.querySelector('.team-member-info-desktop');

  if (teamMemberPhotos.length > 0 && teamInfoDesktop) {
    const infoName = teamInfoDesktop.querySelector('h3');
    const infoTitle = teamInfoDesktop.querySelector('p');

    teamMemberPhotos.forEach(photo => {
      photo.addEventListener('mouseenter', () => {
        const member = photo.closest('.team-member');
        const name = member.getAttribute('data-name');
        const title = member.getAttribute('data-title');

        if (name && title && infoName && infoTitle) {
          infoName.textContent = name;
          infoTitle.textContent = title;
          teamInfoDesktop.classList.add('visible');
        }
      });

      photo.addEventListener('mouseleave', () => {
        teamInfoDesktop.classList.remove('visible');
      });
    });
  }

  // Team member modal functionality
  const modal = document.getElementById('teamModal');
  const modalImage = document.getElementById('modalImage');
  const modalName = document.getElementById('modalName');
  const modalTitle = document.getElementById('modalTitle');
  const modalBio = document.getElementById('modalBio');
  const modalClose = document.querySelector('.team-modal-close');
  const modalOverlay = document.querySelector('.team-modal-overlay');

  // Team member bio data
  const teamBios = {
    'RAMIN LALEZARI': 'With over 40 years of experience in the optics industry, Ramin brings exceptional expertise in design, manufacturing, and application of advanced optical components. His deep technical knowledge and patient, collaborative approach have helped countless customers solve complex challenges and bring their ideas to life. Known for fostering long-term partnerships built on trust and technical excellence, Ramin is a valued advisor to our clients. He has served as Vice President of Research Electro-Optics (now part of Excelitas Technologies), co-founded Advanced Thin Films, and in 2016 co-founded FiveNine Optics. Ramin holds both a BS and an MS in Electrical Engineering from the University of Colorado Boulder.',
    'ROB PATTERSON': 'With over 30 years in IBS optical coatings, Rob combines deep technical expertise with a relationship-driven approach to business development. His dedication to helping customers from early R&D through product launch has built lasting partnerships and successful outcomes. Rob began his career at Research Electro-Optics, co-founded Advanced Thin Films, and later co-founded FiveNine Optics. He holds a BS in Mechanical Engineering from UC Berkeley and an MS in Engineering Management from the University of Colorado Boulder.',
    'ZACH GERIG': 'With more than 25 years of experience in IBS optical coatings, Zach has built a reputation for tackling some of the industry\'s most formidable challenges. His dedication to continuous improvement has led to the development of advanced tools and processes that push the boundaries of what\'s possible in optical coating performance. A two-time first-place winner in the international OIC Manufacturing Competition, Zach is recognized for his technical excellence and innovation. He holds a BS in Mechanical Engineering with a Minor in Physics from the Colorado School of Mines.',
    'HOWARD CHAMPOUX': 'Howard has been at the forefront of IBS coating engineering for more than 25 years. His expertise spans the full product lifecycle—from interpreting customer requirements to delivering high-performance solutions. With a deep understanding of both the fundamental physics and practical applications of our products, Howard serves as a trusted technical liaison for our most demanding clients. He earned his BS in Metallurgy from the Colorado School of Mines, an MS in Materials Science from Cornell University, and a Graduate Certificate in Optical Science from the University of Arizona.',
    'EVAN PRAST': 'Evan leads Coating, Fabrication, Purchasing, Quality, and Logistics, bringing over 20 years of optics manufacturing experience. He combines deep operational expertise with a passion for building and leading collaborative, high-performing teams. Before joining FiveNine Optics, Evan held engineering and operations roles at L3-Tinsley and Excelitas. He holds a BS in Optical Science and Engineering and an MS in Applied Science Engineering from UC Davis.',
    'ERIK BALTZ': 'Erik brings more than 30 years of IBS coating experience, distinguished by a unique blend of curiosity, tenacity, and good humor. He is highly regarded for his persistence in executing complex coating projects and advancing equipment capabilities, all while maintaining a positive and collaborative spirit. Prior to joining FiveNine Optics, Erik held thin-film engineering and R&D roles at Research Electro-Optics. He earned a BS in Mechanical Engineering from the University of Arkansas and an MS in Engineering Management from the University of Colorado Boulder.'
  };

  // Open modal when clicking on team member photo
  if (teamMemberPhotos.length > 0 && modal) {
    teamMemberPhotos.forEach(photo => {
      photo.addEventListener('click', () => {
        const member = photo.closest('.team-member');
        const name = member.getAttribute('data-name');
        const title = member.getAttribute('data-title');
        const imgSrc = photo.querySelector('img').src;
        const imgAlt = photo.querySelector('img').alt;

        if (name && title) {
          modalName.textContent = name;
          modalTitle.textContent = title;
          modalImage.src = imgSrc;
          modalImage.alt = imgAlt;
          modalBio.textContent = teamBios[name] || 'Bio coming soon.';
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  // Close modal functionality
  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (modalOverlay && modal) {
    modalOverlay.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});
