document.addEventListener('DOMContentLoaded', function() {
    // Splash Screen
    const splashScreen = document.querySelector('.splash-screen');
    const enterButton = document.getElementById('enterSite');
    const mainContent = document.getElementById('main-content');
    
    // Music controls
    const audio = document.getElementById('weddingAudio');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    let musicStarted = false;
    
    // Set initial volume
    if (audio) audio.volume = 0.5;
    // Hide music button initially
    if (musicToggle) musicToggle.style.display = 'none';
    
    // Only initialize splash screen if elements exist
    if (splashScreen && enterButton && mainContent) {
        // Show splash screen initially
        document.body.style.overflow = 'hidden';
        
        // Enter button click handler
        enterButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            this.appendChild(ripple);
            
            // Position ripple at click location
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Hide splash screen and show main content
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                mainContent.classList.remove('hidden');
                
                // Enable scrolling and ensure proper layout
                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
                
                // Show the music control button
                if (musicToggle) musicToggle.style.display = 'flex';
                // Try to play audio
                if (audio) {
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            musicIcon.textContent = '⏸';
                            musicStarted = true;
                        }).catch(error => {
                            musicIcon.textContent = '▶';
                            musicStarted = false;
                            console.log("Audio playback was blocked:", error);
                        });
                    }
                }
                
                // Special handling for gallery page
                if (window.location.pathname.includes('gallery.html')) {
                    const gallerySection = document.querySelector('.gallery-section');
                    if (gallerySection) {
                        // Force layout recalculation
                        void gallerySection.offsetHeight;
                        // Ensure scrolling container is properly sized
                        gallerySection.style.minHeight = 'calc(100vh - 200px)';
                    }
                }
            }, 1000);
        });
    } else {
        // If no splash screen (direct page access), ensure scrolling is enabled
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        // Show music button if not on splash
        if (musicToggle) musicToggle.style.display = 'flex';
        // Try to auto-play audio
        if (audio) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicIcon.textContent = '⏸';
                    musicStarted = true;
                }).catch(error => {
                    musicIcon.textContent = '▶';
                    musicStarted = false;
                    console.log("Audio playback was blocked:", error);
                });
            }
        }
        // Special handling for direct gallery access
        if (window.location.pathname.includes('gallery.html')) {
            const gallerySection = document.querySelector('.gallery-section');
            if (gallerySection) {
                gallerySection.style.minHeight = 'calc(100vh - 200px)';
            }
        }
    }
    
    // Music play/pause toggle
    if (musicToggle && audio && musicIcon) {
        musicToggle.addEventListener('click', function() {
            if (!musicStarted) return; // Only allow toggle if music has started
            if (audio.paused) {
                audio.play().then(() => {
                    musicIcon.textContent = '⏸';
                });
            } else {
                audio.pause();
                musicIcon.textContent = '▶';
            }
        });
    }
    
    // Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.main-nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Countdown Timer
    const weddingDate = new Date('April 29, 2026 15:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // SPA navigation for sections
    function showSection(sectionId) {
        document.querySelectorAll('.spa-section').forEach(sec => {
            if (sec.id === sectionId) {
                sec.style.display = '';
                // Force reflow for transition
                void sec.offsetWidth;
                sec.classList.remove('hide');
            } else {
                sec.classList.add('hide');
                setTimeout(() => {
                    sec.style.display = 'none';
                }, 500); // Match CSS transition duration
            }
        });
        // Update nav active class
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    function showSectionWithScale(sectionId) {
        const sections = document.querySelectorAll('.spa-section');
        let currentSection = null;
        sections.forEach(sec => {
            if (!sec.classList.contains('hide')) {
                currentSection = sec;
            }
        });
        const nextSection = document.getElementById(sectionId);
        if (currentSection && currentSection !== nextSection) {
            currentSection.classList.remove('scale-in');
            currentSection.classList.add('scale-out');
            setTimeout(() => {
                currentSection.classList.add('hide');
                currentSection.classList.remove('scale-out');
                if (nextSection) {
                    nextSection.classList.remove('hide');
                    nextSection.classList.add('scale-in');
                    setTimeout(() => {
                        nextSection.classList.remove('scale-in');
                        window.scrollTo(0, 0);
                    }, 400);
                }
            }, 400);
        } else if (nextSection) {
            nextSection.classList.remove('hide');
            nextSection.classList.add('scale-in');
            setTimeout(() => {
                nextSection.classList.remove('scale-in');
                window.scrollTo(0, 0);
            }, 400);
        }
        // Update nav active class
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const hash = this.getAttribute('href');
            if (hash.startsWith('#')) {
                e.preventDefault();
                showSection(hash.substring(1));
                window.location.hash = hash;
            }
        });
    });
    // On load, show correct section
    let hash = window.location.hash || '#home';
    showSection(hash.substring(1));
    
    // Hero slideshow background
    (function() {
        const images = [
            'assets/images/3.jpg',
            'assets/images/4.jpg',
            'assets/images/5.jpg',
            'assets/images/6.jpg',
            'assets/images/7.jpg',
            'assets/images/8.jpg',
            'assets/images/9.jpg',
            'assets/images/10.jpg',
            'assets/images/11.jpg'
        ];
        let current = 0;
        const slideshow = document.querySelector('.hero-slideshow');
        if (!slideshow) return;
        // Preload images
        images.forEach(src => { const img = new Image(); img.src = src; });
        function showNext() {
            slideshow.style.backgroundImage = `url('${images[current]}')`;
            current = (current + 1) % images.length;
        }
        showNext();
        setInterval(showNext, 3000);
    })();
});