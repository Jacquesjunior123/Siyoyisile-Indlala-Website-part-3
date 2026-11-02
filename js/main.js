document.addEventListener("DOMContentLoaded", () => {
    initInteractiveAccordions();
    initServiceSearch();
    initLightboxGallery();
    initInteractiveMap();
    initEnquiryAJAX();
    initContactValidation();
});

function initInteractiveAccordions() {
    const accordions = document.querySelectorAll(".accordion-header");

    accordions.forEach(header => {
        header.addEventListener("click", () => {
            const panel = header.nextElementSibling;
            const isActive = header.classList.toggle("active");

            if (isActive) {
                panel.style.maxHeight = panel.scrollHeight + "px";
                panel.style.padding = "15px";
                header.setAttribute("aria-expanded", "true");
            } else {
                panel.style.maxHeight = null;
                panel.style.padding = "0 15px";
                header.setAttribute("aria-expanded", "false");
            }
        });
    });
}

function initServiceSearch() {
    const searchInput = document.getElementById("farm-service-search");
    const serviceItems = document.querySelectorAll(".service-card");

    if (!searchInput || serviceItems.length === 0) return;

    searchInput.addEventListener("input", event => {
        const searchString = event.target.value.toLowerCase().trim();

        serviceItems.forEach(item => {
            const matches = item.textContent.toLowerCase().includes(searchString);
            item.style.display = matches ? "block" : "none";
            item.style.opacity = matches ? "1" : "0";
            item.style.transform = matches ? "scale(1)" : "scale(0.95)";
        });
    });
}

function initLightboxGallery() {
    const galleryImages = document.querySelectorAll(".farm-gallery img");

    if (galleryImages.length === 0) return;

    const overlay = document.createElement("div");
    overlay.id = "gallery-lightbox";
    overlay.style.cssText = "position:fixed;inset:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:none;justify-content:center;align-items:center;z-index:99999;cursor:zoom-out;";

    const expandedImg = document.createElement("img");
    expandedImg.style.cssText = "max-width:90%;max-height:85%;border:4px solid #fff;border-radius:4px;box-shadow:0 4px 20px rgba(0,0,0,0.5);";

    overlay.appendChild(expandedImg);
    document.body.appendChild(overlay);

    galleryImages.forEach(img => {
        img.style.cursor = "zoom-in";

        img.addEventListener("click", () => {
            expandedImg.src = img.src;
            expandedImg.alt = img.alt;
            overlay.style.display = "flex";
        });
    });

    overlay.addEventListener("click", () => {
        overlay.style.display = "none";
        expandedImg.src = "";
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            overlay.style.display = "none";
            expandedImg.src = "";
        }
    });
}

function initInteractiveMap() {
    const mapElement = document.getElementById("farm-location-map");

    if (!mapElement || typeof L === "undefined") return;

    const farmCoords = [-26.2891, 27.8115];
    const mapInstance = L.map(mapElement).setView(farmCoords, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);

    L.marker(farmCoords).addTo(mapInstance)
        .bindPopup("<b>Siyoyisile Indlala Community Farm</b><br>Faranani Primary School grounds.")
        .openPopup();
}

function initEnquiryAJAX() {
    
    const enquiryForm = document.getElementById("enquiryForm");
    const responseBox = document.getElementById("enquiry-response-box");

    if (!enquiryForm || !responseBox) return;

    responseBox.setAttribute("role", "status");
    responseBox.setAttribute("aria-live", "polite");

    enquiryForm.addEventListener("submit", event => {
        event.preventDefault();

        enquiryForm.querySelectorAll(".form-error").forEach(error => error.remove());

        const nameField = document.getElementById("enquiryName");
        const emailField = document.getElementById("enquiryEmail");
        const phoneField = document.getElementById("phone");
        const typeField = document.getElementById("enquiryType");
        const messageField = document.getElementById("enquiryMessage");

        const fields = [nameField, emailField, phoneField, typeField, messageField];

        fields.forEach(field => {
            if (field) {
                field.style.border = "";
                field.removeAttribute("aria-invalid");
            }
        });

        responseBox.textContent = "";
        responseBox.style.color = "";

        let isValid = true;

        if (!nameField || nameField.value.trim().length < 3) {
            showInlineError(nameField, "Please enter a name with at least 3 characters.");
            isValid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailField || !emailPattern.test(emailField.value.trim())) {
            showInlineError(emailField, "Please enter a valid email address.");
            isValid = false;
        }

        
        const phonePattern = /^(\+27|0)[0-9]{9}$/;
        if (!phoneField || !phonePattern.test(phoneField.value.replace(/\s+/g, ''))) {
            showInlineError(phoneField, "Please enter a valid South African phone number (e.g., 0639527739).");
            isValid = false;
        }

        if (!typeField || !typeField.value) {
            showInlineError(typeField, "Please select an enquiry category.");
            isValid = false;
        }

        if (!messageField || messageField.value.trim().length < 10) {
            showInlineError(messageField, "Please enter details with at least 10 characters.");
            isValid = false;
        }

        if (!isValid) {
            responseBox.textContent = "Please correct the highlighted validation errors and try again.";
            responseBox.style.color = "#c62828";
            return;
        }

        
        responseBox.textContent = "Processing dynamic content pipeline, validating availability...";
        responseBox.style.color = "#1565c0";

        setTimeout(() => {
            let dynamicDataText = "";
            const selectedType = typeField.value;

            switch (selectedType) {
                case "volunteering":
                    dynamicDataText = "Thank you for volunteering! Induction orientations occur every Saturday morning at Faranani Primary School. Cost: R0 (Fully Subsidized).";
                    break;
                case "products":
                    dynamicDataText = "Bulk order processing request registered. Price matrix logs: Variable wholesale tier rates apply. Our logistics deck will call you within 24 hours.";
                    break;
                case "training":
                    dynamicDataText = "Workshop position reserved. Training modules are free of charge. Course enrollment confirmation details sent directly to your email inbox.";
                    break;
                case "partnership":
                    dynamicDataText = "Corporate request routed to executive director Greg Mkhize. He will contact you on your verified number shortly.";
                    break;
                default:
                    dynamicDataText = "Form successfully transmitted asynchronously. We will process your response guidelines within 48 hours.";
            }

            responseBox.textContent = dynamicDataText;
            responseBox.style.color = "#2e7d32";
            enquiryForm.reset();
        }, 1500);
    });
}

function initContactValidation() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    contactForm.addEventListener("submit", event => {
        event.preventDefault();
        contactForm.querySelectorAll(".form-error").forEach(error => error.remove());

        const nameField = document.getElementById("name");
        const emailField = document.getElementById("email");
        const subjectField = document.getElementById("subject");
        const messageField = document.getElementById("message");

        const fields = [nameField, emailField, subjectField, messageField];
        fields.forEach(field => {
            if (field) {
                field.style.border = "";
                field.removeAttribute("aria-invalid");
            }
        });

        let isValid = true;

        if (!nameField || nameField.value.trim().length < 3) {
            showInlineError(nameField, "Full name must be at least 3 characters.");
            isValid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailField || !emailPattern.test(emailField.value.trim())) {
            showInlineError(emailField, "A valid email address is required.");
            isValid = false;
        }

        if (!subjectField || subjectField.value.trim().length === 0) {
            showInlineError(subjectField, "Subject field matter cannot be blank.");
            isValid = false;
        }

        if (!messageField || messageField.value.trim().length < 15) {
            showInlineError(messageField, "Please type a descriptive message (at least 15 characters).");
            isValid = false;
        }

        
                if (isValid) {
            const recipient = "info@siyoyisileindlala.org.za";
            const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subjectField.value)}&body=${encodeURIComponent("Sender Name: " + nameField.value + "\nSender Email: " + emailField.value + "\n\n" + messageField.value)}`;
            
            window.location.href = mailtoUrl;
            contactForm.reset();
        }
    });
}

function showInlineError(inputElement, message) {
    if (!inputElement) return;
    inputElement.style.border = "2px solid #c62828";
    inputElement.setAttribute("aria-invalid", "true");
    
    const errorLabel = document.createElement("p");
    errorLabel.className = "form-error";
    errorLabel.style.cssText = "color:#c62828;font-size:0.85rem;margin:4px 0 0;font-weight:500;";
    errorLabel.textContent = message;
    
    inputElement.parentNode.appendChild(errorLabel);
}
