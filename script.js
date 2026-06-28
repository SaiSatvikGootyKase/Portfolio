// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 80
});

// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navbar = document.querySelector('.navbar');

menuBtn.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !navbar.contains(e.target)) {
        navbar.classList.remove('active');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            navbar.classList.remove('active');
        }
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 250) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Animated stat counters
function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;

        el.textContent = decimals > 0
            ? value.toFixed(decimals) + suffix
            : Math.floor(value) + suffix;

        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = decimals > 0
            ? target.toFixed(decimals) + suffix
            : Math.floor(target) + suffix;
    }

    requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

// Certification 3D tilt
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Network canvas — Kafka event stream particles
(function initNetworkCanvas() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let nodes = [];
    let particles = [];
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        initNodes();
    }

    function initNodes() {
        const count = Math.min(30, Math.floor((w * h) / 35000));
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 2 + 1
        }));
    }

    function spawnParticle() {
        if (nodes.length < 2) return;
        const from = nodes[Math.floor(Math.random() * nodes.length)];
        const to = nodes[Math.floor(Math.random() * nodes.length)];
        if (from === to) return;
        particles.push({
            x: from.x, y: from.y,
            tx: to.x, ty: to.y,
            progress: 0,
            speed: 0.005 + Math.random() * 0.01,
            color: Math.random() > 0.5 ? '#00e5cc' : '#f0883e'
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > w) n.vx *= -1;
            if (n.y < 0 || n.y > h) n.vy *= -1;
        });

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(0, 229, 204, ${0.08 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        nodes.forEach(n => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 229, 204, 0.4)';
            ctx.fill();
        });

        if (Math.random() < 0.03) spawnParticle();

        particles = particles.filter(p => {
            p.progress += p.speed;
            if (p.progress >= 1) return false;
            const x = p.x + (p.tx - p.x) * p.progress;
            const y = p.y + (p.ty - p.y) * p.progress;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            return true;
        });

        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
})();

// EmailJS
(function() {
    emailjs.init("H2YaRaaEVKNFY2PEW");
})();

function showModal(message) {
    const modal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    const progressFill = modal.querySelector('.progress-fill');

    modalMessage.innerHTML = message.replace(/\n/g, '<br>');
    progressFill.style.animation = 'none';
    progressFill.offsetHeight;
    progressFill.style.animation = 'progressGrow 4s linear forwards';
    modal.style.display = 'block';

    setTimeout(hideModal, 4000);
}

function hideModal() {
    document.getElementById('messageModal').style.display = 'none';
}

// Contact form
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        if (!data.name || !data.email || !data.mobile || !data.subject || !data.message) {
            showModal('Please fill in all fields!');
            return;
        }

        const submitBtn = contactForm.querySelector('input[type="submit"]');
        const originalText = submitBtn.value;
        submitBtn.value = 'Sending...';
        submitBtn.disabled = true;

        const templateParams = {
            to_email: 'gk.saisatvik@gmail.com',
            from_name: data.name,
            from_email: data.email,
            from_mobile: data.mobile,
            subject: data.subject,
            message: data.message,
            reply_to: data.email,
            timestamp: new Date().toLocaleString()
        };

        emailjs.send('service_1zs840q', 'template_llbr1jh', templateParams)
            .then(() => {
                setTimeout(() => {
                    showModal('Message sent successfully!<br>Thank you for reaching out.');
                    contactForm.reset();
                }, 800);
            })
            .catch((error) => {
                showModal(`Failed to send message. Please try again or contact me directly at gk.saisatvik@gmail.com<br><br>Error: ${error.text || 'Unknown error'}`);
            })
            .finally(() => {
                setTimeout(() => {
                    submitBtn.value = originalText;
                    submitBtn.disabled = false;
                }, 800);
            });
    });
}
