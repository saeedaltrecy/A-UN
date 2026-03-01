document.addEventListener('DOMContentLoaded', () => {
    // SEARCH OVERLAY ANIMATIONS
    const searchBtnDesktop = document.getElementById('search-btn-desktop');
    const searchBtnMobile = document.getElementById('search-btn-mobile');
    const searchOverlay = document.getElementById('search-overlay');
    const searchBackdrop = document.getElementById('search-backdrop');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const searchInput = searchOverlay?.querySelector('.search-field');

    function openSearch() {
        if (!searchOverlay) return;
        
        searchOverlay.classList.add('active');
        searchBackdrop?.classList.add('active');
        document.body.style.overflow = 'hidden';

        gsap.to(searchOverlay, {
            y: 0,
            duration: 0.5,
            ease: 'power4.out'
        });

        gsap.fromTo('.search-input-group', 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, delay: 0.2, ease: 'power2.out' }
        );

        setTimeout(() => searchInput?.focus(), 500);
    }

    function closeSearch() {
        if (!searchOverlay) return;
        
        searchBackdrop?.classList.remove('active');
        gsap.to(searchOverlay, {
            y: '-100%',
            duration: 0.4,
            ease: 'power4.in',
            onComplete: () => {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    searchBtnDesktop?.addEventListener('click', openSearch);
    searchBtnMobile?.addEventListener('click', openSearch);
    searchCloseBtn?.addEventListener('click', closeSearch);
    searchBackdrop?.addEventListener('click', closeSearch);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay?.classList.contains('active')) {
            closeSearch();
        }
    });


    // MOBILE MENU WITH GSAP ANIMATIONS
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');

    function openMobileMenu() {
        document.body.style.overflow = 'hidden';
        
        gsap.to(mobileOverlay, {
            opacity: 1,
            visibility: 'visible',
            duration: 0.3,
            ease: 'power2.out'
        });

        gsap.to(mobileMenu, {
            right: 0,
            duration: 0.4,
            ease: 'power3.out'
        });

        const triggers = mobileMenu.querySelectorAll('.mobile-dropdown-trigger');
        gsap.fromTo(triggers, 
            {
                opacity: 0,
                x: 30
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.4,
                stagger: 0.05,
                delay: 0.2,
                ease: 'power2.out'
            }
        );

        const footer = mobileMenu.querySelector('.mobile-drawer-footer');
        gsap.fromTo(footer,
            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                delay: 0.4,
                ease: 'power2.out'
            }
        );
    }

    function closeMobileMenu() {
        gsap.to(mobileMenu, {
            right: '-100%',
            duration: 0.3,
            ease: 'power2.in'
        });

        gsap.to(mobileOverlay, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                mobileOverlay.style.visibility = 'hidden';
                document.body.style.overflow = '';
            }
        });

        mobileDropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.mobile-dropdown-trigger');
            const content = dropdown.querySelector('.mobile-dropdown-content');
            trigger?.classList.remove('active');
            content?.classList.remove('open');
        });
    }

    mobileMenuBtn?.addEventListener('click', openMobileMenu);
    mobileCloseBtn?.addEventListener('click', closeMobileMenu);
    mobileOverlay?.addEventListener('click', closeMobileMenu);


    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            const drawerWidth = mobileMenu ? mobileMenu.offsetWidth : 320;
            gsap.set(mobileMenu, { right: -drawerWidth });
            gsap.set(mobileOverlay, { opacity: 0, visibility: 'hidden' });
            document.body.style.overflow = '';
        }
    });

    // DESKTOP MEGA DROPDOWN
    const dropdownWrappers = document.querySelectorAll('.nav-dropdown-wrapper');

    dropdownWrappers.forEach(wrapper => {
        const trigger = wrapper.querySelector('.nav-dropdown-trigger');
        const dropdown = wrapper.querySelector('.mega-dropdown');
        const links = dropdown?.querySelectorAll('.mega-dropdown-link');

        if (!trigger || !dropdown) return;

        wrapper.addEventListener('mouseenter', () => {
            dropdownWrappers.forEach(otherWrapper => {
                if (otherWrapper !== wrapper) {
                    const otherDropdown = otherWrapper.querySelector('.mega-dropdown');
                    const otherTrigger = otherWrapper.querySelector('.nav-dropdown-trigger');
                    if (otherDropdown) {
                        otherDropdown.classList.remove('active');
                        gsap.set(otherDropdown, { opacity: 0, y: -8 });
                    }
                    if (otherTrigger) {
                        otherTrigger.classList.remove('active');
                        const arrow = otherTrigger.querySelector('i');
                        if (arrow) {
                            gsap.set(arrow, { y: 0, scale: 1 });
                        }
                    }
                }
            });

            dropdown.classList.add('active');
            trigger.classList.add('active');

            gsap.killTweensOf(dropdown);
            gsap.to(dropdown, {
                opacity: 1,
                y: 0,
                duration: 0.25,
                ease: 'power2.out',
            });

            if (links) {
                gsap.fromTo(links,
                    {
                        opacity: 0,
                        x: 15
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.3,
                        stagger: 0.03,
                        delay: 0.1,
                        ease: 'power2.out'
                    }
                );
            }

            const arrow = trigger.querySelector('i');
            if (arrow) {
                gsap.to(arrow, {
                    y: -2,
                    scale: 1.2,
                    duration: 0.25,
                    ease: 'back.out(2)',
                });
            }
        });

        wrapper.addEventListener('mouseleave', () => {
            dropdown.classList.remove('active');
            trigger.classList.remove('active');

            gsap.killTweensOf(dropdown);
            gsap.to(dropdown, {
                opacity: 0,
                y: -8,
                duration: 0.15,
                ease: 'power2.in',
            });

            const arrow = trigger.querySelector('i');
            if (arrow) {
                gsap.to(arrow, {
                    y: 0,
                    scale: 1,
                    duration: 0.15,
                    ease: 'power2.out',
                });
            }
        });
    });

    // HERO SLIDER (SWIPER + GSAP FULL STRIP SLIDE)
    function animateHeroContent(activeSlide) {
        const wrapper = activeSlide.querySelector('.hero-content-wrapper');
        const title = activeSlide.querySelector('.hero-title');
        const desc = activeSlide.querySelector('.hero-desc');

        gsap.set(wrapper, { x: '100%', opacity: 0 });
        gsap.set(title, { x: 50, opacity: 0 });
        gsap.set(desc, { x: 30, opacity: 0 });

        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.4 }});
        
        tl.to(wrapper, {
            x: '0%',
            opacity: 1,
            delay: 0.1
        })
        .to(title, {
            x: 0,
            opacity: 1,
            duration: 1.2
        }, '-=1.0')
        .to(desc, {
            x: 0,
            opacity: 1,
            duration: 1
        }, '-=0.9');
    }

    const heroSwiper = new Swiper('.heroSwiper', {
        loop: true,
        speed: 1200,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        on: {
            init: function() {
                animateHeroContent(this.slides[this.activeIndex]);
            },
            slideChangeTransitionStart: function() {
                animateHeroContent(this.slides[this.activeIndex]);
            }
        }
    });

    // NEWS SLIDER INITIALIZATION & SYNC
    const sidebarCards = document.querySelectorAll('.news-sidebar-card');
    
    const newsSwiper = new Swiper('.newsSwiper', {
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.news-slider-pagination',
            clickable: true,
        },
        effect: 'slide',
        grabCursor: true,
        on: {
            slideChange: function() {
                const realIndex = this.realIndex;
                sidebarCards.forEach((card, index) => {
                    if (index === realIndex) {
                        card.classList.add('active');
                    } else {
                        card.classList.remove('active');
                    }
                });
            }
        }
    });

    sidebarCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            newsSwiper.slideToLoop(index);
        });
    });
});

// Partners Swiper
document.addEventListener('DOMContentLoaded', () => {
    const partnersSwiper = new Swiper('.partnersSwiper', {
        effect: 'slide',
        slidesPerView: 2,
        spaceBetween: 20,
        loop: true,
        speed: 800,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        navigation: {
            nextEl: '.partners-nav-next',
            prevEl: '.partners-nav-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            768: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 6,
                spaceBetween: 40,
            },
        },
    });

    // Features Swiper
    const textDirection = document.documentElement.dir || 'ltr';

    const featuresSwiper = new Swiper('.featuresSwiper', {
        dir: textDirection,
        effect: 'slide',
        loop: true,
        speed: 800, // Make transition smoother
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
        slidesPerView: 1,
        spaceBetween: 20,
        slidesPerGroup: 1,
        watchOverflow: true,
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 24,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 32,
            },
            1280: {
                slidesPerView: 4,
                spaceBetween: 32,
            },
        },
    });

    // Colleges Swiper (كلياتنا)
    const collegesSwiper = new Swiper('.collegesSwiper', {
        dir: textDirection,
        effect: 'slide',
        loop: true,
        speed: 900,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: '.colleges-section .colleges-next',
            prevEl: '.colleges-section .colleges-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 24,
            },
            1400: {
                slidesPerView: 3,
                spaceBetween: 28,
            },
        },
    });

    // Cadre Swiper (New Section)
    const cadreSwiper = new Swiper('.cadreSwiper', {
        dir: textDirection,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        slidesPerView: 1.2,
        spaceBetween: 20,
        pagination: {
            el: '.cadre-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2.2,
                spaceBetween: 30,
            },
            1200: {
                slidesPerView: 2, 
                spaceBetween: 40,
            },
        },
        on: {
            slideChange: function () {
                const activeIndex = this.activeIndex;
                const currentSlide = this.slides[activeIndex];
                
                if (!currentSlide) return;

                const name = currentSlide.getAttribute('data-name');
                const role = currentSlide.getAttribute('data-role');
                const desc = currentSlide.getAttribute('data-desc');

                const textContainer = document.querySelector('.cadre-text-column');
                if (!textContainer) return;
                
                textContainer.style.opacity = '0';
                textContainer.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    const nameEl = document.getElementById('cadre-name');
                    const roleEl = document.getElementById('cadre-role');
                    const descEl = document.getElementById('cadre-desc');

                    if (name && nameEl) nameEl.textContent = name;
                    if (role && roleEl) roleEl.textContent = role;
                    if (desc && descEl) descEl.textContent = desc;
                    
                    textContainer.style.opacity = '1';
                    textContainer.style.transform = 'translateY(0)';
                }, 300);
            }
        }
    });

    const textCol = document.querySelector('.cadre-text-column');
    if(textCol) {
        textCol.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
});

// Footer Mini Map (Leaflet + GSAP)
document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('footer-mini-map');
    if (!mapElement || typeof L === 'undefined') return;

    if (mapElement._leaflet_id) return;

    const map = L.map('footer-mini-map', {
        center: [14.530875, 49.123796],
        zoom: 15,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const pulseIcon = L.divIcon({
        className: 'univ-pin-marker', 
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fd823b" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 100%; height: 100%; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#ffffff"></circle></svg><div class="pin-pulse"></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });

    L.marker([14.530875, 49.123796], { icon: pulseIcon }).addTo(map);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.from(".map-container-wrapper", {
            scrollTrigger: {
                trigger: ".main-footer",
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    }
});

// Stats Counter Animation
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats-counter-section');
    if (!statsSection) return;

    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const text = counter.innerText.replace(/,/g, '');
                const count = +text;
                
                // If count is not a number, initialize to 0
                const currentCount = isNaN(count) ? 0 : count;

                const inc = target / speed;

                if (currentCount < target) {
                    counter.innerText = Math.ceil(currentCount + inc).toLocaleString();
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            updateCount();
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(statsSection);
});


// AOS Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        const isMobile = window.innerWidth < 768;

        // إزالة تأثيرات AOS من سكشن المميزات والشركاء في شاشات الجوال كما طلب المستخدم
        if (isMobile) {
            const noAosSections = document.querySelectorAll(
                '.features-section, .features-section [data-aos], .partners-section, .partners-section [data-aos]'
            );
            noAosSections.forEach(el => el.removeAttribute('data-aos'));
        }

        AOS.init({
            disable: false, 
            startEvent: 'DOMContentLoaded', 
            initClassName: 'aos-init', 
            animatedClassName: 'aos-animate', 
            useClassNames: false, 
            disableMutationObserver: false, 
            debounceDelay: 20, 
            throttleDelay: 20, 
            
          
            offset: 0, 
            
            delay: 0, 
            
             
            duration: isMobile ? 400 : 800,  
            
            // الـ easing الانسيابي الممتاز
            easing: isMobile ? 'ease-in-out' : 'ease-out-expo', 
            
            once: true, 
            mirror: false, 
            anchorPlacement: 'top-bottom', 
        });

        // Recalculate heights when fonts and images are fully loaded
        window.addEventListener('load', () => {
            AOS.refresh();
        });

        // Refresh AOS on resize, handling mobile orientation changes safely
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                AOS.refresh();
            }, 250);
        });

        // Fix for some mobile browsers specifically (safari/chrome mobile scroll glitches)
        document.addEventListener('touchmove', () => {
            AOS.refresh({ offset: 0 });
        }, { passive: true });
    }
});

// Vision/Mission Tab Switcher
function switchTab(tabId) {
    const visionBtn = document.getElementById('tab-vision');
    const missionBtn = document.getElementById('tab-mission');
    const visionContent = document.getElementById('content-vision');
    const missionContent = document.getElementById('content-mission');

    // Return if elements don't exist
    if (!visionBtn || !missionBtn || !visionContent || !missionContent) return;

    if (tabId === 'vision') {
        visionBtn.classList.remove('vm-tab-inactive');
        visionBtn.classList.add('vm-tab-active');
        missionBtn.classList.remove('vm-tab-active');
        missionBtn.classList.add('vm-tab-inactive');
        missionContent.classList.add('hidden'); 
        visionContent.classList.remove('hidden');
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(visionContent, {opacity: 0, x: 20}, {opacity: 1, x: 0, duration: 0.5, ease: "power2.out"});
        }
    } else {
        missionBtn.classList.remove('vm-tab-inactive');
        missionBtn.classList.add('vm-tab-active');
        visionBtn.classList.remove('vm-tab-active');
        visionBtn.classList.add('vm-tab-inactive');
        visionContent.classList.add('hidden');
        missionContent.classList.remove('hidden');
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(missionContent, {opacity: 0, x: 20}, {opacity: 1, x: 0, duration: 0.5, ease: "power2.out"});
        }
    }
}

// Custom News Swiper Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.customNewsSwiper')) {
        new Swiper('.customNewsSwiper', {
            loop: true,
            spaceBetween: 30,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.custom-news-pagination',
                clickable: true,
            },
            // navigation: {
            //     nextEl: '.custom-news-next',
            //     prevEl: '.custom-news-prev',
            // },
        });
    }
});

