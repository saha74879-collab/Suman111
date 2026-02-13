// Main Elements
const confettiCanvas = document.getElementById('confetti-canvas');
const musicBtn = document.getElementById('music-control-btn');
const bgMusic = document.getElementById('main-video');

// Intro Screen Elements
const introOverlay = document.getElementById('intro-overlay');
const startBtn = document.getElementById('start-btn');
const mainContainer = document.getElementById('surprise-container');

// Slideshow Elements
const slideshowOverlay = document.getElementById('slideshow-overlay');
const slideshowImg = document.getElementById('slideshow-img');
const closeBtn = document.getElementById('close-slideshow');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Photo Data
const photos = [
    'photo1.jpeg', 'photo2.jpeg', 'photo4.jpeg',
    'photo5.jpeg', 'photo7.jpeg'
];
let currentPhotoIndex = 0;
let slideshowInterval;

// START BUTTON CLICK EVENT
// Countdown Logic
const countdownOverlay = document.getElementById('countdown-overlay');
const targetDate = new Date('February 14, 2026 00:00:00').getTime();

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        if (countdownOverlay) countdownOverlay.style.display = 'none';
        introOverlay.style.display = 'flex'; // Show "Tap to Open"
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (document.getElementById('days')) document.getElementById('days').innerText = String(days).padStart(2, '0');
    if (document.getElementById('hours')) document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    if (document.getElementById('minutes')) document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    if (document.getElementById('seconds')) document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');

    // Update In-Card Countdown
    if (document.getElementById('c-days')) document.getElementById('c-days').innerText = String(days).padStart(2, '0');
    if (document.getElementById('c-hours')) document.getElementById('c-hours').innerText = String(hours).padStart(2, '0');
    if (document.getElementById('c-minutes')) document.getElementById('c-minutes').innerText = String(minutes).padStart(2, '0');
    if (document.getElementById('c-seconds')) document.getElementById('c-seconds').innerText = String(seconds).padStart(2, '0');
}, 1000);

startBtn.addEventListener('click', () => {
    introOverlay.style.opacity = '0';
    setTimeout(() => {
        introOverlay.style.display = 'none';

        mainContainer.style.display = 'block';
        requestAnimationFrame(() => {
            mainContainer.classList.remove('hidden-content');
            mainContainer.classList.add('fade-in-active');
        });

        playMusic();

        // Start Cover Slideshow
        startCoverSlideshow();

        // Start Background Hearts
        startFloatingHearts();

    }, 500);
});

// Cover Image Slideshow Logic
const coverImg = document.getElementById('cover-slideshow-img');
let coverIndex = 0;

function startCoverSlideshow() {
    setInterval(() => {
        coverIndex = (coverIndex + 1) % photos.length;

        // Fade out
        coverImg.classList.add('fade-out-img');

        setTimeout(() => {
            // Change source after fade out
            coverImg.src = photos[coverIndex];
            // Fade in
            coverImg.classList.remove('fade-out-img');
        }, 1000); // 1s matches CSS transition

    }, 5000); // Change every 5 seconds
}

// Photo Gallery Click Events - REMOVED per user request
// document.querySelectorAll('.photo-card').forEach((card, index) => {
//     card.addEventListener('click', () => {
//         openSlideshow(index);
//     });
// });

function openSlideshow(index) {
    currentPhotoIndex = index;
    updateSlideImage(false);
    slideshowOverlay.classList.remove('hidden-overlay');
    startAutoPlay();
}

function closeSlideshow() {
    slideshowOverlay.classList.add('hidden-overlay');
    stopAutoPlay();
}

closeBtn.addEventListener('click', closeSlideshow);

// Navigation
function nextSlide() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    updateSlideImage('right');
    resetAutoPlay();
}

function prevSlide() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    updateSlideImage('left');
    resetAutoPlay();
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

function updateSlideImage(direction) {
    // Reset animation
    slideshowImg.classList.remove('slide-in-right', 'slide-in-left');

    // Trigger Reflow to restart animation next time
    void slideshowImg.offsetWidth;

    slideshowImg.src = photos[currentPhotoIndex];

    if (direction === 'right') {
        slideshowImg.classList.add('slide-in-right');
    } else if (direction === 'left') {
        slideshowImg.classList.add('slide-in-left');
    }
}

// Auto Play Logic
function startAutoPlay() {
    stopAutoPlay(); // clear any existing
    slideshowInterval = setInterval(() => {
        nextSlide();
    }, 3000); // 3 seconds
}

function stopAutoPlay() {
    if (slideshowInterval) clearInterval(slideshowInterval);
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// Close on background click
slideshowOverlay.addEventListener('click', (e) => {
    if (e.target === slideshowOverlay) {
        closeSlideshow();
    }
});

function playMusic() {
    bgMusic.volume = 1.0;
    bgMusic.play().then(() => {
        musicBtn.innerText = "Pause Music ⏸️";
        musicBtn.classList.remove('pulse');
    }).catch(error => {
        console.log("Autoplay prevented:", error);
        musicBtn.classList.add('pulse');
    });
}

bgMusic.addEventListener('play', () => {
    musicBtn.innerText = "Pause Music ⏸️";
    musicBtn.classList.remove('pulse');
});

bgMusic.addEventListener('pause', () => {
    musicBtn.innerText = "Play Music 🎵";
});

musicBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
});

// Floating Hearts Animation
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    heart.style.opacity = Math.random();
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 5000);
}

function startFloatingHearts() {
    setInterval(createHeart, 300);
}

// 3D Tilt Effect for Cover Image
const cardContainer = document.querySelector('.container');
const coverImageSection = document.querySelector('.cover-image');

cardContainer.addEventListener('mousemove', (e) => {
    const rect = cardContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation limits (max 10deg)
    const xPct = x / rect.width;
    const yPct = y / rect.height;

    const xRot = (0.5 - yPct) * 10;
    const yRot = (xPct - 0.5) * 10;

    // Apply transform only to the image section for depth
    coverImageSection.style.transform = `rotate(${3 - (yPct * 6)}deg) rotateY(${yRot}deg) translateZ(20px)`;
    coverImageSection.style.transition = 'none';
});

// Scroll to Section
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollToGallery() {
    scrollToSection('gallery-section');
}

// Update Active Nav State on Scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.full-screen-section');
    const navItems = document.querySelectorAll('.nav-item');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick').includes(current)) {
            item.classList.add('active');
        }
    });
});
