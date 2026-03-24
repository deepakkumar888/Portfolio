document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Navbar Scrolled State
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 14, 0.9)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 14, 0.7)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after it becomes visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach(el => observer.observe(el));

    // Active Navigation Link Highlighting
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 200; // offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // CV Upload Handler
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('cv-input');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const cvPreview = document.getElementById('cv-preview');

    if (uploadArea && fileInput) {
        // Drag and drop events
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--accent-1)';
            uploadArea.style.background = 'rgba(0, 242, 254, 0.1)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        });

        // File input change event
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });

        // Click on upload area to open file picker
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        function handleFileSelect(file) {
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            
            if (!validTypes.includes(file.type)) {
                alert('Please upload a PDF, JPG, or PNG file');
                return;
            }

            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert('File size must be less than 10MB');
                return;
            }

            // Create a preview
            const reader = new FileReader();
            reader.onload = (e) => {
                // Update preview
                cvPreview.src = e.target.result;
                
                // Show file info
                fileName.textContent = file.name;
                fileInfo.style.display = 'block';
                
                // Save to localStorage (for demonstration)
                localStorage.setItem('cvFileName', file.name);
                localStorage.setItem('cvData', e.target.result);
                
                // Reset file input
                fileInput.value = '';
                
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #00f2fe; color: #000; padding: 1rem 2rem; border-radius: 8px; z-index: 1000;';
                successMsg.textContent = '✓ CV Updated Successfully!';
                document.body.appendChild(successMsg);
                
                setTimeout(() => {
                    successMsg.remove();
                }, 3000);
            };
            reader.readAsDataURL(file);
        }

        // Load CV from localStorage on page load
        const savedCV = localStorage.getItem('cvData');
        const savedFileName = localStorage.getItem('cvFileName');
        if (savedCV) {
            cvPreview.src = savedCV;
            if (savedFileName) {
                fileName.textContent = savedFileName;
                fileInfo.style.display = 'block';
            }
        }
    }
});

// Global Modal Functions
window.openModal = function(title, text, imageSrc) {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-desc').innerText = text;
    document.getElementById('modal-img').src = imageSrc;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeModal = function(event, force = false) {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    
    if (force || event.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};
