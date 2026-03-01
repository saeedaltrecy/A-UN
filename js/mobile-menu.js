document.addEventListener('DOMContentLoaded', () => {
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');

    mobileDropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.mobile-dropdown-trigger');
        const content = dropdown.querySelector('.mobile-dropdown-content');

        if (trigger && content) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                
                const isOpen = trigger.classList.contains('active');

                mobileDropdowns.forEach(other => {
                    if (other !== dropdown) {
                        const otherTrigger = other.querySelector('.mobile-dropdown-trigger');
                        const otherContent = other.querySelector('.mobile-dropdown-content');
                        
                        if (otherTrigger?.classList.contains('active')) {
                            otherTrigger.classList.remove('active');
                            otherContent.classList.remove('open');
                            
                            gsap.to(otherContent, {
                                height: 0,
                                opacity: 0,
                                duration: 0.3,
                                ease: 'power2.inOut',
                                onComplete: () => {
                                    otherContent.style.display = 'none';
                                }
                            });
                        }
                    }
                });

                if (isOpen) {
                    trigger.classList.remove('active');
                    content.classList.remove('open');
                    
                    gsap.to(content, {
                        height: 0,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            content.style.display = 'none';
                        }
                    });
                } else {
                    trigger.classList.add('active');
                    content.classList.add('open');
                    
                    content.style.display = 'block';
                    content.style.height = 'auto'; 
                    
                    const naturalHeight = content.scrollHeight;
                    
                    gsap.fromTo(content, 
                        { height: 0, opacity: 0 },
                        { 
                            height: naturalHeight, 
                            opacity: 1, 
                            duration: 0.4, 
                            ease: 'power2.out',
                            onComplete: () => {
                                content.style.height = 'auto'; 
                            }
                        }
                    );

                    const links = content.querySelectorAll('a');
                    if (links.length > 0) {
                        gsap.fromTo(links,
                            { x: 10, opacity: 0 },
                            { 
                                x: 0, 
                                opacity: 1, 
                                duration: 0.3, 
                                stagger: 0.05, 
                                delay: 0.1 
                            }
                        );
                    }
                }
            });
        }
    });
});
