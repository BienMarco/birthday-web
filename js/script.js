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
            
            // Hide splash screen and show main content (slideshow is already running)
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
                
                // Ensure home section is visible (slideshow is already running)
                const homeSection = document.getElementById('home');
                if (homeSection) {
                    homeSection.style.display = '';
                    homeSection.classList.remove('hide');
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
        // Slideshow is already running from startHiddenSlideshow()
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
        
        // Note: Slideshow is initialized once and managed globally
        // No need to reinitialize when navigating to home
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
    
    // Global slideshow manager to prevent multiple instances
    let globalSlideshowInterval = null;
    let slideshowInitialized = false;
    
    // Function to reset slideshow (useful for debugging or manual reset)
    function resetSlideshow() {
        if (globalSlideshowInterval) {
            clearInterval(globalSlideshowInterval);
            globalSlideshowInterval = null;
        }
        slideshowInitialized = false;
    }
    
    // Start slideshow immediately when page loads (hidden behind splash screen)
    function startHiddenSlideshow() {
        const images = [
            'assets/images/1.jpg',
            'assets/images/15.jpg',
            'assets/images/16.jpg',
            'assets/images/17.jpg',
            'assets/images/18.jpg',
            'assets/images/19.jpg',
            'assets/images/4.jpg',
            'assets/images/21.jpg',
            'assets/images/22.jpg'
        ];
        
        let current = 0;
        const slideshow = document.querySelector('.hero-slideshow');
        if (!slideshow) return;
        
        // Set first image immediately
        slideshow.style.backgroundImage = `url('${images[0]}')`;
        
        function showNext() {
            const nextIndex = (current + 1) % images.length;
            const nextImg = new Image();
            nextImg.onload = function() {
                slideshow.style.backgroundImage = `url('${images[nextIndex]}')`;
                current = nextIndex;
            };
            nextImg.onerror = function() {
                slideshow.style.backgroundImage = `url('${images[nextIndex]}')`;
                current = nextIndex;
            };
            nextImg.src = images[nextIndex];
        }
        
        // Start slideshow immediately
        globalSlideshowInterval = setInterval(showNext, 3000);
        slideshowInitialized = true;
    }
    
    // Start slideshow immediately when page loads
    startHiddenSlideshow();
    
    // Initialize gallery function with preloaded images
    function initializeGalleryWithImages(images) {
        // Prevent multiple initializations
        if (slideshowInitialized) {
            return;
        }
        
        let current = 0;
        const slideshow = document.querySelector('.hero-slideshow');
        if (!slideshow) return;
        
        // Clear any existing global interval
        if (globalSlideshowInterval) {
            clearInterval(globalSlideshowInterval);
            globalSlideshowInterval = null;
        }
        
        // Set first image immediately since images are preloaded
        slideshow.style.backgroundImage = `url('${images[0]}')`;
        
        function showNext() {
            // Ensure smooth transition by preloading next image
            const nextIndex = (current + 1) % images.length;
            const nextImg = new Image();
            nextImg.onload = function() {
                // Only change background when next image is loaded
                slideshow.style.backgroundImage = `url('${images[nextIndex]}')`;
                current = nextIndex;
            };
            nextImg.onerror = function() {
                // If next image fails, still advance to next
                slideshow.style.backgroundImage = `url('${images[nextIndex]}')`;
                current = nextIndex;
            };
            nextImg.src = images[nextIndex];
        }
        
        function startSlideshow() {
            slideshowInitialized = true;
            
            // Clear any existing global interval
            if (globalSlideshowInterval) {
                clearInterval(globalSlideshowInterval);
            }
            
            // Start slideshow with consistent timing
            globalSlideshowInterval = setInterval(showNext, 3000);
        }
        
        // Start slideshow immediately since images are already loaded
        startSlideshow();
    }
    
    // Initialize gallery function (for direct page access)
    function initializeGallery() {
        // Prevent multiple initializations
        if (slideshowInitialized) {
            return;
        }
        
        // Hero slideshow background
        const images = [
            'assets/images/1.jpg',
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
        
        // Clear any existing global interval
        if (globalSlideshowInterval) {
            clearInterval(globalSlideshowInterval);
            globalSlideshowInterval = null;
        }
        
        // Set first image immediately to prevent any background showing
        slideshow.style.backgroundImage = `url('${images[0]}')`;
        
        // Track loaded images
        let loadedImages = 0;
        const totalImages = images.length;
        let slideshowStarted = false;
        
        // Preload hero images starting with the first one
        images.forEach((src, index) => { 
            const img = new Image(); 
            img.onload = function() {
                loadedImages++;
                // Ensure first image is displayed as soon as it loads
                if (index === 0) {
                    slideshow.style.backgroundImage = `url('${src}')`;
                }
                // Start slideshow when all images are loaded
                if (loadedImages === totalImages && !slideshowStarted) {
                    startSlideshow();
                }
            };
            img.onerror = function() {
                console.warn(`Failed to load image: ${src}`);
                loadedImages++;
                // If the first image fails, try the next one immediately
                if (index === 0 && images.length > 1) {
                    slideshow.style.backgroundImage = `url('${images[1]}')`;
                }
                // Start slideshow even if some images failed
                if (loadedImages === totalImages && !slideshowStarted) {
                    startSlideshow();
                }
            };
            // Start loading the image
            img.src = src; 
        });
        
        function showNext() {
            slideshow.style.backgroundImage = `url('${images[current]}')`;
            current = (current + 1) % images.length;
        }
        
        function startSlideshow() {
            if (slideshowStarted) return;
            slideshowStarted = true;
            slideshowInitialized = true;
            
            // Clear any existing global interval
            if (globalSlideshowInterval) {
                clearInterval(globalSlideshowInterval);
            }
            
            // Start slideshow with consistent timing
            globalSlideshowInterval = setInterval(showNext, 3000);
        }
        
        // Fallback: start slideshow after 1 second even if images haven't loaded
        setTimeout(() => {
            if (!slideshowStarted) {
                startSlideshow();
            }
        }, 1000);
    }
    
    // Handle hash changes for direct navigation
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash || '#home';
        showSection(hash.substring(1));
    });
});