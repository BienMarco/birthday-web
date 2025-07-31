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
    
    // Preload all gallery images for better mobile performance
    function preloadGalleryImages() {
        const galleryImages = [
            'assets/images/4.jpg',
            'assets/images/8.jpg',
            'assets/images/10.jpg',
            'assets/images/12.jpg',
            'assets/images/15.jpg',
            'assets/images/16.jpg',
            'assets/images/17.jpg',
            'assets/images/18.jpg',
            'assets/images/BG1.jpg',
            'assets/images/BG2.jpg',
            'assets/images/BG3.jpg',
            'assets/images/BG4.jpg',
            'assets/images/BG5.jpg',
            'assets/images/BG6.jpg',
            'assets/images/BG7.jpg',
            'assets/images/BG8.jpg',
            'assets/images/BG9.jpg',
            'assets/images/BG10.jpg',
            'assets/images/BG11.jpg',
            'assets/images/BG12.jpg',
            'assets/images/BG13.jpg',
            'assets/images/BG14.jpg',
            'assets/images/BG15.jpg',
            'assets/images/BG16.jpg',
            'assets/images/attire-boy.jpg',
            'assets/images/dress.jpg',
            'assets/images/venue.png',
            'assets/images/entourage.jpg',
            'assets/images/Invitation card.jpg'
        ];
        
        galleryImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // Start preloading images immediately
    preloadGalleryImages();
    
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
                
                // Initialize gallery after splash screen
                initializeGallery();
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
        // Initialize gallery immediately
        initializeGallery();
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
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
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
        
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Improved SPA navigation for sections
    function showSection(sectionId) {
        const sections = document.querySelectorAll('.spa-section');
        const targetSection = document.getElementById(sectionId);
        
        if (!targetSection) return;
        
        // Show target section immediately
        targetSection.style.display = '';
        targetSection.classList.remove('hide');
        
        // Hide other sections with minimal delay
        sections.forEach(sec => {
            if (sec.id !== sectionId) {
                sec.classList.add('hide');
                // Reduced delay for better mobile performance
                setTimeout(() => {
                    if (sec.classList.contains('hide')) {
                        sec.style.display = 'none';
                    }
                }, 200);
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
        
        // Scroll to top for mobile
        if (window.innerWidth <= 768) {
            window.scrollTo(0, 0);
        }
        
        // Force layout recalculation for gallery
        if (sectionId === 'gallery') {
            setTimeout(() => {
                const gallerySection = document.querySelector('.gallery-section');
                if (gallerySection) {
                    void gallerySection.offsetHeight;
                }
            }, 100);
        }
    }
    
    // Navigation click handlers
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const hash = this.getAttribute('href');
            if (hash.startsWith('#')) {
                e.preventDefault();
                const sectionId = hash.substring(1);
                showSection(sectionId);
                window.location.hash = hash;
            }
        });
    });
    
    // On load, show correct section
    let hash = window.location.hash || '#home';
    showSection(hash.substring(1));
    
    // Initialize gallery function
    function initializeGallery() {
        // Hero slideshow background
        const images = [
            'assets/images/15.jpg',
            'assets/images/16.jpg',
            'assets/images/17.jpg',
            'assets/images/18.jpg',
            'assets/images/19.jpg',
            'assets/images/20.jpg',
            'assets/images/21.jpg',
            'assets/images/22.jpg'
        ];
        let current = 0;
        const slideshow = document.querySelector('.hero-slideshow');
        if (!slideshow) return;
        
        // Preload hero images
        images.forEach(src => { 
            const img = new Image(); 
            img.src = src; 
        });
        
        function showNext() {
            slideshow.style.backgroundImage = `url('${images[current]}')`;
            current = (current + 1) % images.length;
        }
        
        showNext();
        setInterval(showNext, 3000);
    }
    
    // Handle hash changes for direct navigation
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash || '#home';
        showSection(hash.substring(1));
    });
});