// Accessibility Toolbar Logic (Premium Version)
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const toggleBtn = document.getElementById('accessibility-toggle');
    const panel = document.getElementById('accessibility-panel');
    const readingGuide = document.getElementById('reading-guide');
    
    // Buttons
    const buttons = {
        fontUp: document.getElementById('acc-font-up'),
        fontDown: document.getElementById('acc-font-down'),
        cursor: document.getElementById('acc-cursor'),
        grayscale: document.getElementById('acc-grayscale'),
        contrast: document.getElementById('acc-contrast'),
        negative: document.getElementById('acc-negative'),
        lightBg: document.getElementById('acc-light-bg'),
        links: document.getElementById('acc-links'),
        guide: document.getElementById('acc-reading-guide'),
        reset: document.getElementById('acc-reset')
    };

    // State
    let state = {
        fontSize: 100,
        cursor: false,
        grayscale: false,
        contrast: false,
        negative: false,
        lightBg: false,
        links: false,
        guide: false
    };

    // Load State from LocalStorage
    function loadState() {
        const savedState = localStorage.getItem('accessibilityState');
        if (savedState) {
            state = JSON.parse(savedState);
            applyState();
        }
    }

    // Save State to LocalStorage
    function saveState() {
        localStorage.setItem('accessibilityState', JSON.stringify(state));
    }

    // Apply State to DOM
    function applyState() {
        // Font Size
        document.documentElement.style.fontSize = state.fontSize === 100 ? '' : `${state.fontSize}%`;

        // Classes map
        const classMap = {
            cursor: { el: document.body, cls: 'big-cursor' },
            grayscale: { el: document.body, cls: 'grayscale-mode' },
            contrast: { el: document.body, cls: 'high-contrast' },
            negative: { el: document.documentElement, cls: 'negative-contrast' },
            lightBg: { el: document.body, cls: 'light-background' },
            links: { el: document.body, cls: 'highlight-links' }
        };

        // Apply classes and button states
        for (const [key, config] of Object.entries(classMap)) {
            if (state[key]) {
                config.el.classList.add(config.cls);
                buttons[key]?.classList.add('active');
            } else {
                config.el.classList.remove(config.cls);
                buttons[key]?.classList.remove('active');
            }
        }

        // Reading Guide
        if (state.guide) {
            readingGuide.style.display = 'block';
            buttons.guide?.classList.add('active');
            document.addEventListener('mousemove', moveReadingGuide);
        } else {
            readingGuide.style.display = 'none';
            buttons.guide?.classList.remove('active');
            document.removeEventListener('mousemove', moveReadingGuide);
        }
    }

    // Reading Guide Movement
    function moveReadingGuide(e) {
        readingGuide.style.top = `${e.clientY - 15}px`; // Center guide on cursor
    }

    // Event Listeners
    if (!toggleBtn || !panel) return;

    // Toggle Panel
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('visible');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggleBtn.contains(e.target) && !panel.contains(e.target)) {
             panel.classList.remove('visible');
        }
    });
    
    panel.addEventListener('click', (e) => e.stopPropagation());

    // Font Size Handlers
    buttons.fontUp?.addEventListener('click', () => {
        if (state.fontSize < 130) {
            state.fontSize += 5;
            applyState();
            saveState();
        }
    });

    buttons.fontDown?.addEventListener('click', () => {
        if (state.fontSize > 80) {
            state.fontSize -= 5;
            applyState();
            saveState();
        }
    });

    // Feature Toggles Factory
    function setupToggle(key) {
        buttons[key]?.addEventListener('click', () => {
            state[key] = !state[key];
            
            // Exclusive modes logic (optional, but good for UX)
            if (key === 'contrast' && state.contrast) state.negative = false;
            if (key === 'negative' && state.negative) state.contrast = false;
            
            applyState();
            saveState();
        });
    }

    ['cursor', 'grayscale', 'contrast', 'negative', 'lightBg', 'links', 'guide'].forEach(setupToggle);

    // Reset Handler
    buttons.reset?.addEventListener('click', () => {
        state = {
            fontSize: 100,
            cursor: false,
            grayscale: false,
            contrast: false,
            negative: false,
            lightBg: false,
            links: false,
            guide: false
        };
        applyState();
        saveState();
    });

    // Initialize
    loadState();
});
