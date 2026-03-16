/**
 * Script Portofolio Alfauzan Adhim
 * Dibangun menggunakan Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Memuat seluruh pecahan modul HTML menggunakan Fetch API
    const includes = document.querySelectorAll('[data-include]');
    const fetchPromises = Array.from(includes).map(el => {
        const file = el.getAttribute('data-include');
        return fetch(file)
            .then(res => {
                if (!res.ok) throw new Error(`[Gagal Memuat] ${file}`);
                return res.text();
            })
            .then(data => {
                el.outerHTML = data;
            });
    });

    // 2. Mengeksekusi JS Portofolio hanya setelah DOM masuk sepenuhnya
    Promise.all(fetchPromises)
        .then(() => {
            console.log("Seluruh Modul Antarmuka berhasil di-fetch.");
            initPortfolio();
        })
        .catch(err => console.error("Error modular fetch:", err));
});

function initPortfolio() {
    /* =========================================================================
       Navbar Scroll Effect & Active Highlight
       ========================================================================= */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item, .mobile-links a');

    window.addEventListener('scroll', () => {
        // Sticky Navbar Effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Highlight
        let currentId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Adjust threshold for detection
            if (window.scrollY >= sectionTop - 250) {
                currentId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(currentId)) {
                item.classList.add('active');
            }
        });
    });

    /* =========================================================================
       Mobile Hamburger Menu
       ========================================================================= */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        // Prevent body scroll when menu is open
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close mobile menu when link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    /* =========================================================================
       Typing Animation (Hero Section)
       ========================================================================= */
    const typingText = document.getElementById('typingText');
    const phrases = ['Web Developer Junior', 'Admin dashboard', 'Videografer', 'Photografer'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        // Pause at end of word
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    
    // Mulai animasi typing setelah jeda awal
    setTimeout(type, 1500);

    /* =========================================================================
       Portfolio Project Filtering
       ========================================================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                // If filter is 'all', show all cards
                if (filterValue === 'all') {
                    card.classList.remove('hide');
                } else {
                    // Check if card category matches the filter
                    if (card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                    }
                }
            });
        });
    });

    // Navbar Dropdown Filter Logic
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const filterValue = item.getAttribute('data-nav-filter');
            
            // Temukan tombol filter utama di bagian projects dan klik secara terprogram
            const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterValue}"]`);
            if (targetBtn) {
                targetBtn.click();
            }

            // Jika sedang di mobile menu, tutup menu utama setelah item diklik
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Mobile Dropdown Toggle
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const menu = toggle.nextElementSibling;
            if (menu && menu.classList.contains('mobile-dropdown-menu')) {
                menu.classList.toggle('active');
            }
        });
    });

    /* =========================================================================
       Intersection Observer (Scroll Reveal & Progress Bar)
       ========================================================================= */
    const revealElements = document.querySelectorAll('.reveal');
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add active class to reveal elements
                entry.target.classList.add('active');
                
                // If the element has a progress bar inside, animate it
                const bar = entry.target.querySelector('.progress-bar');
                if(bar) {
                    // Set timeout just to slightly delay the progress animation for visual appeal
                    setTimeout(() => {
                        bar.style.width = bar.getAttribute('data-width');
                    }, 300);
                }

                // Opsional: Unobserve setelah elemen muncul jika tidak ingin animasi berulang saat scroll balik
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    /* =========================================================================
       Button Ripple Effect
       ========================================================================= */
    const rippleButtons = document.querySelectorAll('.ripple');
    
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Get click coordinates inside button
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Create ripple span
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-element');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            // Calculate width/height for full coverage
            const diameter = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.transform = 'translate(-50%, -50%) scale(0)';

            this.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    /* =========================================================================
       Form Validation Simple
       ========================================================================= */
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const inputs = contactForm.querySelectorAll('.form-input');
            
            inputs.forEach(input => {
                const group = input.parentElement;
                
                // Reset error state
                group.classList.remove('error');
                
                if (!input.value.trim()) {
                    group.classList.add('error');
                    isValid = false;
                } else if (input.type === 'email') {
                    // Validasi khusus email
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        group.classList.add('error');
                        isValid = false;
                    }
                }
            });

            if (isValid) {
                // Jika validasi sukses (simulasi kirim form)
                const btn = contactForm.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                
                btn.innerHTML = '<i class="ph-bold ph-spinner ph-spin"></i> Mengirim...';
                btn.disabled = true;

                setTimeout(() => {
                    alert('Terima kasih! Pesan Anda telah berhasil dikirim.');
                    contactForm.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1500);
            }
        });
    }

    /* =========================================================================
       Back to Top Button
       ========================================================================= */
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* =========================================================================
       Smooth Scrolling for Anchor Links
       ========================================================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Hanya cegah default jika bukan link kosong #
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}
