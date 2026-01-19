// PDF Generation Functionality
const downloadBtn = document.getElementById('download-pdf');

downloadBtn.addEventListener('click', generatePDF);

function generatePDF() {
    // Store original styles
    const originalStyles = {
        heroPadding: document.querySelector('.hero').style.paddingTop,
        bodyBg: document.body.style.backgroundColor,
        heroBg: document.querySelector('.hero').style.background
    };
    
    // Apply print styles
    document.querySelector('.hero').style.paddingTop = '50px';
    document.body.style.backgroundColor = 'white';
    document.querySelector('.hero').style.background = 'white';
    
    // Hide elements not needed in PDF
    const elementsToHide = ['.theme-toggle', '.btn-github', '.menu-toggle', '.footer-links', '.social-link'];
    const hiddenElements = [];
    
    elementsToHide.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            if (el.style.display !== 'none') {
                el.dataset.originalDisplay = el.style.display;
                el.style.display = 'none';
                hiddenElements.push(el);
            }
        });
    });
    
    // Configure PDF options
    const element = document.body;
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'my_cv.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        },
        jsPDF: { 
            unit: 'in', 
            format: 'letter', 
            orientation: 'portrait' 
        }
    };
    
    // Show loading state
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    downloadBtn.disabled = true;
    
    // Generate PDF
    html2pdf().set(opt).from(element).save().then(() => {
        // Restore original state
        restoreOriginalState(originalStyles, hiddenElements, originalText);
    }).catch(error => {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Please try again.');
        restoreOriginalState(originalStyles, hiddenElements, originalText);
    });
}

function restoreOriginalState(originalStyles, hiddenElements, originalText) {
    // Restore styles
    document.querySelector('.hero').style.paddingTop = originalStyles.heroPadding;
    document.body.style.backgroundColor = originalStyles.bodyBg;
    document.querySelector('.hero').style.background = originalStyles.heroBg;
    
    // Show hidden elements
    hiddenElements.forEach(el => {
        el.style.display = el.dataset.originalDisplay || '';
        delete el.dataset.originalDisplay;
    });
    
    // Restore button state
    downloadBtn.innerHTML = originalText;
    downloadBtn.disabled = false;
}

// Add print styles for better PDF output
const printStyles = document.createElement('style');
printStyles.textContent = `
    @media print {
        .header {
            position: static !important;
            box-shadow: none !important;
        }
        
        .hero {
            min-height: auto !important;
            padding-top: 0 !important;
        }
        
        .theme-toggle, .btn-github, .menu-toggle {
            display: none !important;
        }
        
        a {
            color: #000 !important;
            text-decoration: none !important;
        }
        
        .btn-outline, .btn-primary, .btn-secondary {
            border: 1px solid #000 !important;
            background: none !important;
            color: #000 !important;
        }
    }
`;
document.head.appendChild(printStyles);