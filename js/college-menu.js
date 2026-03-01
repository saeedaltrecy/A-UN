// College Menu – Opens from trigger position with GSAP animation
document.addEventListener('DOMContentLoaded', () => {
    const trigger        = document.getElementById('college-menu-trigger');
    const menu           = document.getElementById('college-side-menu');
    const closeBtn       = document.getElementById('college-menu-close');
    const overlay        = document.getElementById('college-menu-overlay');
    const accordions     = document.querySelectorAll('#college-side-menu .college-accordion-trigger');
    let isOpen           = false;

    // Position menu vertically aligned with the trigger button
    function alignMenuToTrigger() {
        if (!trigger || !menu) return;
        const rect     = trigger.getBoundingClientRect();
        const menuH    = menu.offsetHeight;
        const viewH    = window.innerHeight;

        // Center of the trigger on the screen
        const triggerCenterY = rect.top + rect.height / 2;

        // Clamp so menu doesn't overflow outside the viewport
        let topPos = triggerCenterY - menuH / 2;
        topPos = Math.max(10, Math.min(topPos, viewH - menuH - 10));

        menu.style.top       = topPos + 'px';
        menu.style.transform = 'none'; // remove any translateY
    }

    function openMenu() {
        if (!menu || isOpen) return;
        isOpen = true;

        // Make visible before animating
        menu.style.visibility = 'visible';
        menu.style.display    = 'flex';

        alignMenuToTrigger();

        // GSAP animation – slide from trigger's left edge
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(menu,
                { x: -menu.offsetWidth, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
            );
            if (overlay) {
                gsap.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out',
                    onStart: () => { overlay.style.visibility = 'visible'; overlay.style.opacity = 0; }
                });
            }
            if (trigger) {
                gsap.to(trigger, { x: -trigger.offsetWidth, duration: 0.3, ease: 'power2.out' });
            }
        } else {
            menu.style.left = '0';
            if (overlay) { overlay.style.opacity = 1; overlay.style.visibility = 'visible'; }
        }

        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!menu || !isOpen) return;
        isOpen = false;

        if (typeof gsap !== 'undefined') {
            gsap.to(menu, { x: -menu.offsetWidth, opacity: 0, duration: 0.35, ease: 'power3.in',
                onComplete: () => {
                    menu.style.display    = 'none';
                    menu.style.visibility = 'hidden';
                    // reset x so next open starts fresh
                    gsap.set(menu, { x: 0 });
                }
            });
            if (overlay) {
                gsap.to(overlay, { opacity: 0, duration: 0.25,
                    onComplete: () => { overlay.style.visibility = 'hidden'; }
                });
            }
            if (trigger) {
                gsap.to(trigger, { x: 0, duration: 0.3, ease: 'power2.out' });
            }
        } else {
            menu.style.display    = 'none';
            menu.style.visibility = 'hidden';
            if (overlay) { overlay.style.opacity = 0; overlay.style.visibility = 'hidden'; }
        }

        document.body.style.overflow = '';

        // Reset accordions after animation
        setTimeout(() => {
            accordions.forEach(acc => {
                acc.classList.remove('active');
                const content = acc.nextElementSibling;
                if (content) {
                    content.classList.remove('open');
                    content.style.maxHeight = '0';
                }
            });
        }, 350);
    }

    // Initialize: hide menu off-screen
    if (menu) {
        gsap && gsap.set(menu, { x: 0, opacity: 1 });
        menu.style.display    = 'none';
        menu.style.visibility = 'hidden';
        // Remove CSS-driven left slide; we'll control it via GSAP x
        menu.style.left = '0';
    }

    if (trigger)  trigger.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay)  overlay.addEventListener('click', closeMenu);

    // Recalculate on resize
    window.addEventListener('resize', () => { if (isOpen) alignMenuToTrigger(); });

    // Accordion Logic
    accordions.forEach(accordion => {
        accordion.addEventListener('click', function(e) {
            e.preventDefault();
            accordions.forEach(acc => {
                if (acc !== this) {
                    acc.classList.remove('active');
                    const c = acc.nextElementSibling;
                    if (c) { c.classList.remove('open'); c.style.maxHeight = '0'; }
                }
            });
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content) {
                if (content.classList.contains('open')) {
                    content.classList.remove('open');
                    content.style.maxHeight = '0';
                } else {
                    content.classList.add('open');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });

    // ── Highlight current page link & pre-expand its accordion ──
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('#college-side-menu .college-side-link').forEach(link => {
        const linkFile = link.getAttribute('href')?.split('/').pop();
        if (linkFile && linkFile === currentFile) {
            link.classList.add('side-link-active');

            // Pre-expand accordion that contains the active link
            const parentContent = link.closest('.college-accordion-content');
            if (parentContent) {
                // Measure true height by removing maxHeight temporarily
                parentContent.style.maxHeight = 'none';
                const fullHeight = parentContent.scrollHeight;
                // Set it immediately without transition (no animation needed on load)
                parentContent.style.transition = 'none';
                parentContent.classList.add('open');
                parentContent.style.maxHeight = fullHeight + 'px';
                // Re-enable transition after a frame
                requestAnimationFrame(() => {
                    parentContent.style.transition = '';
                });

                const accTrigger = parentContent.previousElementSibling;
                if (accTrigger) accTrigger.classList.add('active');
            }
        }
    });
});

// ── Programs Accordion (each card opens independently) ──
document.addEventListener('DOMContentLoaded', () => {
    ['accordion-bachelor', 'accordion-postgrad', 'accordion-study-plan'].forEach(cardClass => {
        const card = document.querySelector('.' + cardClass);
        if (!card) return;
        const trigger = card.querySelector('.college-accordion-trigger');
        const content = card.querySelector('.college-accordion-content');
        if (!trigger || !content) return;

        trigger.addEventListener('click', function(e) {
            e.stopPropagation();

            if (content.classList.contains('open')) {
                content.classList.remove('open');
                content.style.maxHeight = '0';
                trigger.classList.remove('active');
            } else {
                content.style.transition = 'none';
                content.style.maxHeight = 'none';
                const fullHeight = content.scrollHeight;
                content.style.maxHeight = '0';
                requestAnimationFrame(() => {
                    content.style.transition = '';
                    content.classList.add('open');
                    content.style.maxHeight = fullHeight + 'px';
                });
                trigger.classList.add('active');
            }
        });
    });
});

// ── Staff Bio Toggle ──
function toggleBio(btn) {
    const card = btn.closest('.staff-card');
    const bio  = card.querySelector('.staff-bio');
    if (!bio) return;
    bio.classList.toggle('hidden');
    btn.innerHTML = bio.classList.contains('hidden')
        ? '<i class="fi fi-rr-file-user"></i> السيرة الذاتية'
        : '<i class="fi fi-rr-cross-small"></i> إغلاق';
}

// ── GSAP accordion for Course Description Level cards ──
function toggleLevel(btn) {
    const body   = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');

    btn.classList.toggle('open', !isOpen);

    // Animate the arrow icon
    gsap.to(btn.querySelector('.cd-lh-arrow'), {
        rotation : isOpen ? 0 : 180,
        duration : 0.35,
        ease     : 'power2.inOut',
        overwrite: true
    });

    if (isOpen) {
        gsap.to(body, {
            height  : 0,
            opacity : 0,
            duration: 0.4,
            ease    : 'power3.inOut',
            overwrite: true
        });
    } else {
        // Measure natural height first
        gsap.set(body, { height: 'auto', opacity: 1 });
        const fullH = body.offsetHeight;
        gsap.fromTo(body,
            { height: 0, opacity: 0 },
            {
                height  : fullH,
                opacity : 1,
                duration: 0.5,
                ease    : 'power3.out',
                overwrite: true,
                onComplete: () => gsap.set(body, { height: 'auto' })
            }
        );
        // Stagger-animate inner rows
        const rows = body.querySelectorAll('.cd-semester, .cd-table tbody tr');
        gsap.fromTo(rows,
            { y: 12, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out', delay: 0.15 }
        );
    }
}

// ── GSAP toggle for course description row ──
function toggleCourseRow(btn) {
    const row    = btn.closest('tr').nextElementSibling;
    const isOpen = btn.classList.contains('open');

    btn.classList.toggle('open', !isOpen);
    btn.querySelector('span').textContent = isOpen ? 'عرض التوصيف' : 'إخفاء التوصيف';

    if (isOpen) {
        gsap.to(row.querySelectorAll('td'), {
            autoAlpha: 0, y: -6,
            duration : 0.25,
            ease     : 'power2.in',
            onComplete: () => { row.classList.remove('visible'); }
        });
    } else {
        row.classList.add('visible');
        gsap.fromTo(row.querySelectorAll('td'),
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }
        );
    }
}
