// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Typing Animation
const typed = new Typed('.typing-text', {
    strings: ['Java Developer','Exploring AI/ML', 'Full-Stack Developer', 'Problem Solver'],
    typeSpeed: 60,
    backSpeed: 60,
    backDelay: 1000,
    loop: true
});

// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navbar = document.querySelector('.navbar');

menuBtn.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuBtn.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !navbar.contains(e.target)) {
        navbar.classList.remove('active');
        menuBtn.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            navbar.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    });
});

// Active navigation link based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Initialize EmailJS
(function() {
    emailjs.init("H2YaRaaEVKNFY2PEW"); // You'll need to replace this with your actual EmailJS public key
})();

// Custom Modal Functions
function showModal(message) {
    const modal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.innerHTML = message;
    modal.style.display = 'block';
    
    // Auto-hide modal after 4 seconds
    setTimeout(() => {
        hideModal();
    }, 4000);
}

function hideModal() {
    const modal = document.getElementById('messageModal');
    modal.style.display = 'none';
}

// Form submission handling
const contactForm = document.querySelector('.contact form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!data.name || !data.email || !data.mobile || !data.subject || !data.message) {
        showModal('Please fill in all fields!');
        return false;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('input[type="submit"]');
    const originalText = submitBtn.value;
    submitBtn.value = 'Sending...';
    submitBtn.disabled = true;
    
    // Prepare email template parameters
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
    
    // Send email using EmailJS
    emailjs.send('service_1zs840q', 'template_llbr1jh', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Show "Sending..." for 0.8 seconds, then show success message
            setTimeout(() => {
                showModal(`Message sent successfully! \nThank you for reaching out.`);
                
                // Reset form
                contactForm.reset();
                
                // Store in localStorage for backup
                const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                messages.push({
                    ...data,
                    timestamp: new Date().toISOString(),
                    sent: true
                });
                localStorage.setItem('contactMessages', JSON.stringify(messages));
            }, 800);
            
        }, function(error) {
            console.log('FAILED...', error);
            
            // Show error message immediately
            showModal(`Failed to send message. Please try again or contact me directly at gk.saisatvik@gmail.com\n\nError: ${error.text}`);
            
            // Store in localStorage as failed attempt
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push({
                ...data,
                timestamp: new Date().toISOString(),
                sent: false,
                error: error.text
            });
            localStorage.setItem('contactMessages', JSON.stringify(messages));
        })
        .finally(function() {
            // Reset button state after 0.8 seconds
            setTimeout(() => {
                submitBtn.value = originalText;
                submitBtn.disabled = false;
            }, 800);
        });
    
    return false;
});

// Portfolio item hover effect
const portfolioItems = document.querySelectorAll('.portfolio-box');

portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.querySelector('.portfolio-layer').style.transform = 'translateY(0)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.querySelector('.portfolio-layer').style.transform = 'translateY(100%)';
    });
}); 
