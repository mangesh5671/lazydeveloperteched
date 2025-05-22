// Toggle mobile menu
const hamburger = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Detect current page and highlight it (works on Netlify + localhost)
const currentPath = window.location.pathname.replace(/\/$/, ''); // remove trailing slash

document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPath = new URL(link.href).pathname.replace(/\.html$/, '').replace(/\/$/, '');
    if (currentPath === linkPath) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// Handle scroll effect
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

