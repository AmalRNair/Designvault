/*--------------------------------------------------------------
GET STARTED MODAL FUNCTIONALITY
------------------------------------------------------------*/

$(document).ready(function() {
    
    // Initialize modal functionality
    const modal = $('#getStartedModal');
    const form = $('#getStartedForm');
    const submitBtn = $('.submit-btn');
    
    // Handle form submission
    form.on('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.addClass('loading');
        
        // Get form data
        const formData = {
            fullName: $('#fullName').val().trim(),
            email: $('#email').val().trim(),
            whatsappNumber: $('#whatsappNumber').val().trim(),
            clientType: $('#clientType').val()
        };

        // Validate required fields
        if (!formData.fullName || !formData.email || !formData.whatsappNumber || !formData.clientType) {
            showError('Please fill in all required fields.');
            submitBtn.removeClass('loading');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showError('Please enter a valid email address.');
            submitBtn.removeClass('loading');
            return;
        }

        // Phone validation for WhatsApp number
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(formData.whatsappNumber)) {
            showError('Please enter a valid WhatsApp number.');
            submitBtn.removeClass('loading');
            return;
        }

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Send data to Google Sheets
            sendToGoogleSheets(formData);
        }, 1000);
    });

    // Show error message
    function showError(message) {
        // Remove any existing alerts
        $('.alert').remove();
        
        // Add error alert
        const errorAlert = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        form.prepend(errorAlert);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            $('.alert').fadeOut();
        }, 5000);
    }

    // Show success message and replace form content
    function showSuccess() {
        const successHTML = `
            <div class="form-success">
                <div class="success-icon">
                    <i class="fas fa-check"></i>
                </div>
                <h3>Welcome to the Waitlist!</h3>
                <p>You're now on our exclusive waitlist! We'll notify you as soon as Designvault launches.</p>
                <p><strong>What's next?</strong><br>
                We'll keep you updated on our progress and send you early access when we're ready to launch!</p>
            </div>
        `;
        
        $('.modal-body').html(successHTML);
        
        // Auto-close modal after 5 seconds
        setTimeout(() => {
            modal.modal('hide');
        }, 5000);
    }

    // Reset form when modal is hidden
    modal.on('hidden.bs.modal', function() {
        // Reset form
        form[0].reset();
        
        // Remove any alerts
        $('.alert').remove();
        
        // Remove loading state
        submitBtn.removeClass('loading');
        
        // If success view is shown, restore original form
        if ($('.form-success').length) {
            location.reload(); // Simple way to restore form - you can make this more elegant
        }
    });

    // Send form data to Google Sheets
    function sendToGoogleSheets(data) {
        // Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwdOMTEg8UOQoP9dbyww8xxWshL8OswsH5vnXQU9_FlL2QY7KZqsHbah_2GMnKWg1de/exec';
        
        // Create FormData to avoid CORS preflight issues
        const formData = new FormData();
        formData.append('fullName', data.fullName);
        formData.append('email', data.email);
        formData.append('whatsappNumber', data.whatsappNumber);
        formData.append('clientType', data.clientType);
        
        fetch(scriptURL, {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            console.log('Success:', result);
            
            // Remove loading state
            submitBtn.removeClass('loading');
            
            try {
                const jsonResult = JSON.parse(result);
                if (jsonResult.status === 'success') {
                    showSuccess();
                } else {
                    showError('Something went wrong. Please try again.');
                }
            } catch (e) {
                // If response is not JSON, assume success
                showSuccess();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Remove loading state
            submitBtn.removeClass('loading');
            
            // Show error message
            showError('Network error. Please check your connection and try again.');
        });
    }

    // Optional: Send form data to your backend (deprecated - replaced with Google Sheets)
    function sendFormData(data) {
        // This function is now deprecated in favor of sendToGoogleSheets
        // Keep it for reference if you need additional backend integration
        /*
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Something went wrong. Please try again.');
        });
        */
    }

    // Add smooth scrolling and focus management
    modal.on('shown.bs.modal', function() {
        $('#fullName').focus();
    });

    // Phone number formatting for WhatsApp field
    $('#whatsappNumber').on('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        }
        this.value = value;
    });

    // Remove the message character count functionality since we removed the message field

});
