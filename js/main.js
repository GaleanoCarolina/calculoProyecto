document.addEventListener('DOMContentLoaded', () => {
    // Menú móvil
    const hamburger = document.getElementById('hamburger');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    });

    // Observador de animaciones al hacer scroll
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Botón volver arriba
    const backToTop = document.getElementById('backToTop');
    if(backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});