// Modern Animated Background
const backgroundCanvas = document.getElementById('backgroundCanvas');
const bgCtx = backgroundCanvas.getContext('2d');

// Set canvas size
function resizeBackgroundCanvas() {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
}
resizeBackgroundCanvas();

// Particles array
const particles = [];
const connections = [];
const shapes = [];

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * backgroundCanvas.width;
        this.y = Math.random() * backgroundCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > backgroundCanvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > backgroundCanvas.height) this.vy *= -1;

        // Keep in bounds
        this.x = Math.max(0, Math.min(backgroundCanvas.width, this.x));
        this.y = Math.max(0, Math.min(backgroundCanvas.height, this.y));
    }

    draw() {
        bgCtx.beginPath();
        bgCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(14, 165, 233, ${this.opacity})`;
        bgCtx.fill();
    }
}

// Floating Shape class
class FloatingShape {
    constructor() {
        this.x = Math.random() * backgroundCanvas.width;
        this.y = Math.random() * backgroundCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 15 + 5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = Math.random() * 0.1 + 0.05;
        this.type = Math.floor(Math.random() * 3); // 0: triangle, 1: square, 2: hexagon
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Wrap around edges
        if (this.x < -this.size) this.x = backgroundCanvas.width + this.size;
        if (this.x > backgroundCanvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = backgroundCanvas.height + this.size;
        if (this.y > backgroundCanvas.height + this.size) this.y = -this.size;
    }

    draw() {
        bgCtx.save();
        bgCtx.translate(this.x, this.y);
        bgCtx.rotate(this.rotation);
        bgCtx.strokeStyle = `rgba(14, 165, 233, ${this.opacity})`;
        bgCtx.lineWidth = 1;

        if (this.type === 0) {
            // Triangle
            bgCtx.beginPath();
            bgCtx.moveTo(0, -this.size);
            bgCtx.lineTo(-this.size * 0.8, this.size * 0.8);
            bgCtx.lineTo(this.size * 0.8, this.size * 0.8);
            bgCtx.closePath();
            bgCtx.stroke();
        } else if (this.type === 1) {
            // Square
            bgCtx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);
        } else {
            // Hexagon
            bgCtx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                const x = Math.cos(angle) * this.size;
                const y = Math.sin(angle) * this.size;
                if (i === 0) bgCtx.moveTo(x, y);
                else bgCtx.lineTo(x, y);
            }
            bgCtx.closePath();
            bgCtx.stroke();
        }
        bgCtx.restore();
    }
}

// Create particles and shapes
function createParticles() {
    const particleCount = Math.floor((backgroundCanvas.width * backgroundCanvas.height) / 15000);
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Create floating shapes
    const shapeCount = Math.floor((backgroundCanvas.width * backgroundCanvas.height) / 50000);
    shapes.length = 0;
    for (let i = 0; i < shapeCount; i++) {
        shapes.push(new FloatingShape());
    }
}
createParticles();

// Draw connections between nearby particles
function drawConnections() {
    const maxDistance = 150;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const opacity = (1 - distance / maxDistance) * 0.1;
                bgCtx.strokeStyle = `rgba(14, 165, 233, ${opacity})`;
                bgCtx.lineWidth = 0.5;
                bgCtx.beginPath();
                bgCtx.moveTo(particles[i].x, particles[i].y);
                bgCtx.lineTo(particles[j].x, particles[j].y);
                bgCtx.stroke();
            }
        }
    }
}

// Animation loop
function animateBackground() {
    // Clear canvas with fade effect
    bgCtx.fillStyle = 'rgba(15, 23, 42, 0.05)';
    bgCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    // Update and draw floating shapes (behind particles)
    shapes.forEach(shape => {
        shape.update();
        shape.draw();
    });

    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    drawConnections();

    requestAnimationFrame(animateBackground);
}

// Start animation
animateBackground();

// Custom Cursor and Magnetic Buttons
const cursor = document.getElementById('cursor');
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';
    cursor.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

// Magnetic effect for buttons
function addMagneticEffect() {
    const magneticElements = document.querySelectorAll('.run-btn, .carousel-btn, .filter-btn, .submit-btn');
    
    magneticElements.forEach(element => {
        element.classList.add('magnetic-btn');
        
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            element.style.transform = '';
        });
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const strength = 0.3;
            element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
    });
}

// Typewriter effect for hero title
function initTypewriter() {
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
        heroTitle.style.width = '0';
        heroTitle.style.overflow = 'hidden';
        heroTitle.style.whiteSpace = 'nowrap';
        heroTitle.style.borderRight = '3px solid #0ea5e9';
        heroTitle.style.animation = 'typing 3.5s steps(40, end) 1s both, blink-caret 0.75s step-end infinite 1s';
    }
}

// Initialize effects
addMagneticEffect();
initTypewriter();

// Handle window resize
window.addEventListener('resize', () => {
    resizeBackgroundCanvas();
    createParticles();
});

// Fade in animations
function revealElements() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealElements);
revealElements(); // Initial check

// Code playground functionality
function runCode() {
    const code = document.getElementById('codeInput').value;
    const output = document.getElementById('codeOutput');
    
    // Create output capture array
    let capturedOutput = [];
    
    // Create custom console object
    const customConsole = {
        log: (...args) => {
            capturedOutput.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
        },
        error: (...args) => {
            capturedOutput.push('ERROR: ' + args.map(arg => String(arg)).join(' '));
        },
        warn: (...args) => {
            capturedOutput.push('WARNING: ' + args.map(arg => String(arg)).join(' '));
        },
        info: (...args) => {
            capturedOutput.push('INFO: ' + args.map(arg => String(arg)).join(' '));
        }
    };
    
    try {
        // Create a function with custom console in scope
        const func = new Function('console', code);
        const result = func(customConsole);
        
        // Display captured output or result
        if (capturedOutput.length > 0) {
            output.textContent = capturedOutput.join('\n');
        } else if (result !== undefined) {
            output.textContent = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
        } else {
            output.textContent = 'Code executed successfully!';
        }
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
    }
}

// Language toggle with targeted Urdu translations
let isUrdu = false;
const translations = {
    en: {
        'heroTitle': 'SAJID MEHMOOD TARIQ',
        'heroSubtitle': '17 • Pakistan • Terminal Developer',
        'heroDescription': "I don't pretend to be perfect. I use AI, I learn from failures, and I'm building the future one command at a time.",
        'whoamiOutput': `Name: Sajid Mehmood Tariq
Age: 17.5 years
Location: Lahore, Pakistan 🇵🇰
Status: BSCS Student @ UET KSK
CGPA: 3.2/4.0
Confession: I use AI and I'm proud of it`,
        'contactCommand': 'echo "Let\'s build something amazing together"',
        'contactOutput': `Ready for collaboration. Available for freelance projects.
Based in Lahore, Pakistan 🇵🇰
Working hours: Flexible (because code doesn't sleep)
Preferred communication: Professional but friendly`,
        'contactFormTitle': 'Send Message',
        'submitBtn': 'Send Message 🚀',
        'footerText': 'Built with ❤️, AI assistance, and pure determination'
    },
    ur: {
        'heroTitle': 'ساجد محمود طارق',
        'heroSubtitle': '17 • پاکستان • ٹرمینل ڈیولپر',
        'heroDescription': 'میں کامل ہونے کا دکھاوا نہیں کرتا۔ میں AI استعمال کرتا ہوں، ناکامیوں سے سیکھتا ہوں، اور ایک وقت میں ایک کمانڈ کے ذریعے مستقبل بنا رہا ہوں۔',
        'whoamiOutput': `نام: ساجد محمود طارق
عمر: 17.5 سال
مقام: لاہور، پاکستان 🇵🇰
حیثیت: یو ای ٹی کے ایس کے میں BSCS کا طالب علم
CGPA: 3.2/4.0
اعتراف: میں AI استعمال کرتا ہوں اور مجھے فخر ہے`,
        'contactCommand': 'echo "آئیے مل کر کچھ شاندار بنائیں"',
        'contactOutput': `تعاون کے لیے تیار۔ فری لانس پروجیکٹس کے لیے دستیاب۔
لاہور، پاکستان 🇵🇰 میں مقیم
کام کے اوقات: لچکدار (کیونکہ کوڈ نہیں سوتا)
ترجیحی رابطہ: پیشہ ورانہ لیکن دوستانہ`,
        'contactFormTitle': 'پیغام بھیجیں',
        'submitBtn': 'پیغام بھیجیں 🚀',
        'footerText': '❤️، AI کی مدد، اور خالص عزم کے ساتھ بنایا گیا'
    }
};

function toggleLanguage() {
    isUrdu = !isUrdu;
    const lang = isUrdu ? 'ur' : 'en';
    const langToggle = document.querySelector('.lang-toggle');
    
    // Update language toggle button
    langToggle.textContent = isUrdu ? 'English' : 'اردو';
    
    // Add/remove Urdu class from body
    if (isUrdu) {
        document.body.classList.add('urdu');
    } else {
        document.body.classList.remove('urdu');
    }
    
    // Update specific elements with translations
    Object.keys(translations[lang]).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                if (element.type === 'submit' || element.tagName === 'BUTTON') {
                    element.textContent = translations[lang][key];
                } else {
                    element.placeholder = translations[lang][key];
                }
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

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
        }
    });
});

// Project filtering
function setupProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Testimonials carousel
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-slide');

function changeTestimonial(direction) {
    testimonials[currentTestimonial].classList.remove('active');
    currentTestimonial += direction;
    
    if (currentTestimonial >= testimonials.length) {
        currentTestimonial = 0;
    } else if (currentTestimonial < 0) {
        currentTestimonial = testimonials.length - 1;
    }
    
    testimonials[currentTestimonial].classList.add('active');
}

// Auto-rotate testimonials
setInterval(() => {
    changeTestimonial(1);
}, 8000);

// GitHub stats fetching with enhanced data
async function fetchGitHubStats() {
    try {
        const response = await fetch('https://api.github.com/users/sajidmehmoodtariq');
        const data = await response.json();
        
        // Update GitHub stats in the UI
        const stats = {
            repos: data.public_repos || '15+',
            followers: data.followers || '10+',
            following: data.following || '25+',
            streakDays: '30+' // This would need a different API for accurate data
        };
        
        // Update stat cards if they exist
        Object.keys(stats).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = stats[key];
            }
        });
    } catch (error) {
        console.log('GitHub API request failed, using default values');
    }
}

// Contact form handling
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Message sent successfully! I\'ll get back to you soon.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Chat functionality
let chatVisible = false;

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatVisible = !chatVisible;
    chatWindow.style.display = chatVisible ? 'flex' : 'none';
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();
    
    if (message) {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.innerHTML = `<div style="margin-bottom: 1rem;"><strong>You:</strong> ${message}</div>`;
        chatMessages.appendChild(userMessage);
        
        // Simulate bot response
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.innerHTML = `<div style="margin-bottom: 1rem;"><strong>Sajid:</strong> Thanks for your message! I'll respond personally soon. For urgent inquiries, please email me directly.</div>`;
            chatMessages.appendChild(botMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
        
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// WhatsApp testimonial widget
function requestTestimonial() {
    const message = "Hi Sajid! I'd like to leave a testimonial for your portfolio. Here's my feedback: ";
    const whatsappUrl = `https://wa.me/923001234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Live status and time zone functionality
function updateTimeAndStatus() {
    const lahoreTime = document.getElementById('lahoreTime');
    const clientTime = document.getElementById('clientTime');
    const availability = document.getElementById('availability');
    
    if (lahoreTime && clientTime && availability) {
        const now = new Date();
        
        // Lahore time (PKT)
        const lahoreTimeStr = now.toLocaleString('en-US', {
            timeZone: 'Asia/Karachi',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Client's local time
        const clientTimeStr = now.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        lahoreTime.textContent = `🇵🇰 Lahore Time: ${lahoreTimeStr}`;
        clientTime.textContent = `🌍 Your Local Time: ${clientTimeStr}`;
        
        // Determine availability based on Lahore time
        const lahoreHour = parseInt(lahoreTimeStr.split(':')[0]);
        const isAvailable = lahoreHour >= 9 && lahoreHour <= 23; // 9 AM to 11 PM PKT
        
        availability.textContent = `⏰ Status: ${isAvailable ? 'Available' : 'Offline'}`;
        availability.style.color = isAvailable ? '#10b981' : '#ef4444';
    }
}

// Update time every second
setInterval(updateTimeAndStatus, 1000);

// Skill progress animation
function animateSkillProgress() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width') || '90%';
                skillBar.style.width = width;
            }
        });
    });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GitHub stats
    fetchGitHubStats();
    
    // Setup project filtering
    setupProjectFiltering();
    
    // Setup contact form
    setupContactForm();
    
    // Animate skill progress bars
    animateSkillProgress();
    
    // Initial time update
    updateTimeAndStatus();
    
    // Initialize first testimonial as active
    if (testimonials.length > 0) {
        testimonials[0].classList.add('active');
    }
    
    console.log('Portfolio initialized successfully! 🚀');
});
