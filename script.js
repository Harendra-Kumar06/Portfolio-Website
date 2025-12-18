// --- Background Animation ---
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Star {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.5;
    }
    update() {
        this.y -= this.speed;
        if (this.y < 0) this.reset();
    }
    draw() {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 150; i++) stars.push(new Star());

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    requestAnimationFrame(animate);
}
animate();

// --- Typing Effect ---
const typingText = document.querySelector('.typing-text');
const words = ["Competitive Programmer", "Problem Solver"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? 50 : 150);
    }
}
type();

// --- Theme Toggle ---
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.body.setAttribute('data-theme', savedTheme);

// --- Scroll Reveal Animation ---
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => observer.observe(section));

// --- Counter Animation for Stats ---
const stats = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            if (target) {
                let count = 0;
                const updateCount = () => {
                    const speed = target / 100;
                    if (count < target) {
                        count += speed;
                        entry.target.innerText = Math.ceil(count);
                        setTimeout(updateCount, 20);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                updateCount();
            }
        }
    });
}, observerOptions);

stats.forEach(stat => statObserver.observe(stat));

// --- Mobile Menu Toggle ---
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.width = '100%';
    navLinks.style.background = 'var(--bg-card)';
    navLinks.style.padding = '2rem';
});

// automatic rating update
async function updateRatings() {
    // 1. Fetch Codeforces Data
    try {
        const response = await fetch('https://codeforces.com/api/user.info?handles=Harendra_Kumar');
        const data = await response.json();
        if (data.status === "OK") {
            const user = data.result[0];
            document.getElementById('cf-current').innerText = user.rating;
            document.getElementById('cf-max').innerText = user.maxRating;
            document.getElementById('cf-rank').innerText = user.rank.charAt(0).toUpperCase() + user.rank.slice(1);
        }
    } catch (error) {
        console.log("CF Error:", error);
        document.getElementById('cf-current').innerText = "1195"; // Fallback if API fails
    }

    // 2. Fetch LeetCode Data (Using a community API)
    try {
        const response = await fetch('https://alfa-leetcode-api.onrender.com/harendra-kumar/contest');
        const data = await response.json();
        if (data && data.contestRating) {
            document.getElementById('lc-current').innerText = Math.floor(data.contestRating);
            document.getElementById('lc-max').innerText = Math.floor(data.contestRating); // Max rating usually needs a different endpoint or calculation
            document.getElementById('lc-rank').innerText = data.badge || "Knight";
        }
    } catch (error) {
        console.log("LC Error:", error);
        document.getElementById('lc-current').innerText = "1688"; // Fallback
    }
}

// Run the function when the page loads
window.addEventListener('DOMContentLoaded', updateRatings);