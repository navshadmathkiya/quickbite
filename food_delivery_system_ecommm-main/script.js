// ==================== GLOBAL VARIABLES ====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Product Data - Mapping images to products
const products = [
    // Vegetables
    { id: 1, name: 'Fresh Tomatoes', category: 'vegetables', price: 30, originalPrice: 45, image: 'images/tomato.jpg', unit: 'kg', badge: 'Fresh' },
    { id: 2, name: 'Green Capsicum', category: 'vegetables', price: 40, originalPrice: 60, image: 'images/vatana.jpg', unit: 'kg', badge: '30% Off' },
    { id: 3, name: 'Fresh Onions', category: 'vegetables', price: 25, originalPrice: 35, image: 'images/onion.jpg', unit: 'kg', badge: 'Popular' },
    { id: 4, name: 'Potatoes', category: 'vegetables', price: 20, originalPrice: 30, image: 'images/poteto.jpg', unit: 'kg', badge: 'Best Price' },
    { id: 5, name: 'Fresh Cauliflower', category: 'vegetables', price: 35, originalPrice: 50, image: 'images/fulavar.jpg', unit: 'piece', badge: 'Fresh' },
    { id: 6, name: 'Green Chillies', category: 'vegetables', price: 50, originalPrice: 70, image: 'images/mirch.jpg', unit: 'kg', badge: 'Hot Deal' },
    { id: 7, name: 'Carrots', category: 'vegetables', price: 40, originalPrice: 55, image: 'images/gajar.jpg', unit: 'kg', badge: 'Organic' },
    { id: 8, name: 'Brinjal (Eggplant)', category: 'vegetables', price: 30, originalPrice: 45, image: 'images/bhindi.jpg', unit: 'kg', badge: 'Fresh' },
    { id: 9, name: 'Cabbage', category: 'vegetables', price: 25, originalPrice: 40, image: 'images/kobij.jpg', unit: 'piece', badge: '35% Off' },
    { id: 10, name: 'Capsicum', category: 'vegetables', price: 60, originalPrice: 90, image: 'images/sori.jpg', unit: 'kg', badge: 'Premium' },
    
    // Leafy Greens
    { id: 11, name: 'Fresh Spinach', category: 'leafy', price: 20, originalPrice: 30, image: 'images/karela.jpg', unit: 'bunch', badge: 'Fresh' },
    { id: 12, name: 'Coriander Leaves', category: 'leafy', price: 15, originalPrice: 25, image: 'images/lasan.jpg', unit: 'bunch', badge: 'Fresh' },
    { id: 13, name: 'Mint Leaves', category: 'leafy', price: 15, originalPrice: 25, image: 'images/lahsun.jpg', unit: 'bunch', badge: 'Aromatic' },
    { id: 14, name: 'Fenugreek Leaves', category: 'leafy', price: 18, originalPrice: 28, image: 'images/makai.jpg', unit: 'bunch', badge: 'Fresh' },
    
    // Fruits
    { id: 15, name: 'Fresh Bananas', category: 'fruits', price: 40, originalPrice: 60, image: 'images/banana.jpg', unit: 'dozen', badge: 'Sweet' },
    { id: 16, name: 'Apples', category: 'fruits', price: 120, originalPrice: 150, image: 'images/apple.jpg', unit: 'kg', badge: 'Imported' },
    { id: 17, name: 'Oranges', category: 'fruits', price: 60, originalPrice: 80, image: 'images/orange.jpg', unit: 'kg', badge: 'Juicy' }
];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    updateCartCount();
});

function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Mobile menu
    setupMobileMenu();
    
    // WhatsApp link
    setupWhatsAppLink();
    
    // Page-specific initialization
    if (currentPage === 'products.html') {
        loadProducts();
        setupCategoryFilter();
    } else if (currentPage === 'cart.html') {
        loadCart();
    } else if (currentPage === 'checkout.html') {
        loadCheckoutSummary();
        setupCheckoutForm();
    } else if (currentPage === 'contact.html') {
        setupContactForm();
    }
    
    // Set minimum date for delivery
    const deliveryDateInput = document.getElementById('deliveryDate');
    if (deliveryDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        deliveryDateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

// ==================== MOBILE MENU ====================
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}

// ==================== WHATSAPP INTEGRATION ====================
function setupWhatsAppLink() {
    const whatsappLinks = document.querySelectorAll('#whatsappLink, .whatsapp-btn');
    const phoneNumber = '919005000'; // Replace with actual number
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const message = encodeURIComponent('Hello! I want to order fresh vegetables from FreshMarket.');
            window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        });
    });
}

// ==================== PRODUCTS PAGE ====================
function loadProducts(filterCategory = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    const filteredProducts = filterCategory === 'all' 
        ? products 
        : products.filter(p => p.category === filterCategory);
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <span class="product-badge">${product.badge}</span>
        </div>
        <div class="product-info">
            <div class="product-category">${getCategoryName(product.category)}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
                <span class="price">₹${product.price}</span>
                <span class="original-price">₹${product.originalPrice}</span>
                <span style="font-size: 14px; color: var(--text-light);">/${product.unit}</span>
            </div>
            <div class="product-actions">
                <div class="quantity-selector">
                    <button class="quantity-btn" onclick="decreaseQuantity(${product.id})">-</button>
                    <input type="number" class="quantity-input" id="qty-${product.id}" value="1" min="1" max="50">
                    <button class="quantity-btn" onclick="increaseQuantity(${product.id})">+</button>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    return card;
}

function getCategoryName(category) {
    const names = {
        'vegetables': 'Vegetables',
        'fruits': 'Fruits',
        'leafy': 'Leafy Greens'
    };
    return names[category] || category;
}

function setupCategoryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            loadProducts(category);
        });
    });
}

function increaseQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    if (input) {
        input.value = Math.min(parseInt(input.value) + 1, 50);
    }
}

function decreaseQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    if (input) {
        input.value = Math.max(parseInt(input.value) - 1, 1);
    }
}

// ==================== CART FUNCTIONALITY ====================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantityInput = document.getElementById(`qty-${productId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    showToast(`${product.name} added to cart! 🎉`);
    
    // Reset quantity input
    if (quantityInput) {
        quantityInput.value = 1;
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    loadCart();
    showToast('Item removed from cart');
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, Math.min(50, parseInt(newQuantity)));
        saveCart();
        loadCart();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// ==================== CART PAGE ====================
function loadCart() {
    const cartContainer = document.getElementById('cartContainer');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    cartContainer.style.display = 'grid';
    
    const subtotal = getCartTotal();
    const deliveryCharge = 40;
    const total = subtotal + deliveryCharge;
    
    cartContainer.innerHTML = `
        <div class="cart-items">
            <h3 style="margin-bottom: 20px;">Shopping Cart (${cart.length} items)</h3>
            ${cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <div class="cart-item-price">₹${item.price} / ${item.unit}</div>
                        <div class="cart-item-actions">
                            <div class="quantity-selector">
                                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" 
                                    onchange="updateCartQuantity(${item.id}, this.value)" min="1" max="50">
                                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 20px; font-weight: bold; color: var(--primary-color);">
                            ₹${item.price * item.quantity}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="cart-summary">
            <h3 style="margin-bottom: 20px;">Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${subtotal}</span>
            </div>
            <div class="summary-row">
                <span>Delivery Charges:</span>
                <span>₹${deliveryCharge}</span>
            </div>
            <div class="summary-row">
                <strong>Total Amount:</strong>
                <strong style="color: var(--primary-color);">₹${total}</strong>
            </div>
            <a href="checkout.html" class="btn btn-primary" style="width: 100%; text-align: center; margin-top: 20px;">
                Proceed to Checkout
            </a>
            <a href="products.html" class="btn btn-secondary" style="width: 100%; text-align: center; margin-top: 10px;">
                Continue Shopping
            </a>
        </div>
    `;
}

// ==================== CHECKOUT PAGE ====================
function loadCheckoutSummary() {
    const summaryItems = document.getElementById('summaryItems');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryDelivery = document.getElementById('summaryDelivery');
    const summaryTotal = document.getElementById('summaryTotal');
    
    if (!summaryItems) return;
    
    if (cart.length === 0) {
        window.location.href = 'products.html';
        return;
    }
    
    const subtotal = getCartTotal();
    const deliveryCharge = 40;
    const total = subtotal + deliveryCharge;
    
    summaryItems.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color);">
            <div>
                <div style="font-weight: 500;">${item.name}</div>
                <div style="font-size: 14px; color: var(--text-light);">Qty: ${item.quantity} × ₹${item.price}</div>
            </div>
            <div style="font-weight: 600;">₹${item.price * item.quantity}</div>
        </div>
    `).join('');
    
    summarySubtotal.textContent = `₹${subtotal}`;
    summaryDelivery.textContent = `₹${deliveryCharge}`;
    summaryTotal.textContent = `₹${total}`;
}

function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (!checkoutForm) return;
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(checkoutForm);
        const orderData = {
            personalInfo: {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone')
            },
            deliveryAddress: {
                address: formData.get('address'),
                area: formData.get('area'),
                city: formData.get('city'),
                pincode: formData.get('pincode'),
                landmark: formData.get('landmark')
            },
            deliveryTime: {
                date: formData.get('deliveryDate'),
                timeSlot: formData.get('deliveryTime')
            },
            paymentMethod: formData.get('paymentMethod'),
            specialNotes: formData.get('notes'),
            items: cart,
            total: getCartTotal() + 40,
            orderDate: new Date().toISOString()
        };
        
        // Create WhatsApp message
        const message = createOrderMessage(orderData);
        
        // Send to WhatsApp
        const phoneNumber = '919005000';
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();
        
        // Show success message
        showToast('Order placed successfully! Redirecting to WhatsApp...');
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 2000);
    });
}

function createOrderMessage(orderData) {
    let message = '🛒 *NEW ORDER - FRESHMARKET*\n\n';
    
    message += '👤 *Customer Details:*\n';
    message += `Name: ${orderData.personalInfo.fullName}\n`;
    message += `Phone: ${orderData.personalInfo.phone}\n`;
    if (orderData.personalInfo.email) {
        message += `Email: ${orderData.personalInfo.email}\n`;
    }
    
    message += '\n📍 *Delivery Address:*\n';
    message += `${orderData.deliveryAddress.address}\n`;
    message += `${orderData.deliveryAddress.area}, ${orderData.deliveryAddress.city}\n`;
    message += `Pincode: ${orderData.deliveryAddress.pincode}\n`;
    if (orderData.deliveryAddress.landmark) {
        message += `Landmark: ${orderData.deliveryAddress.landmark}\n`;
    }
    
    message += '\n🕐 *Delivery Schedule:*\n';
    message += `Date: ${orderData.deliveryTime.date}\n`;
    message += `Time: ${orderData.deliveryTime.timeSlot}\n`;
    
    message += '\n🛍️ *Order Items:*\n';
    orderData.items.forEach(item => {
        message += `• ${item.name} - ${item.quantity} ${item.unit} × ₹${item.price} = ₹${item.price * item.quantity}\n`;
    });
    
    const subtotal = orderData.total - 40;
    message += `\n💰 *Payment Summary:*\n`;
    message += `Subtotal: ₹${subtotal}\n`;
    message += `Delivery: ₹40\n`;
    message += `*Total: ₹${orderData.total}*\n`;
    message += `Payment: ${orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}\n`;
    
    if (orderData.specialNotes) {
        message += `\n📝 *Special Instructions:*\n${orderData.specialNotes}\n`;
    }
    
    return message;
}

// ==================== CONTACT FORM ====================
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const message = `
🌿 *CONTACT INQUIRY - FRESHMARKET*

Name: ${formData.get('name')}
Email: ${formData.get('email')}
Phone: ${formData.get('phone')}
Subject: ${formData.get('subject')}

Message:
${formData.get('message')}
        `;
        
        const phoneNumber = '919005000';
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
        
        contactForm.reset();
        showToast('Message sent! We will contact you soon.');
    });
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ==================== SMOOTH SCROLLING ====================
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

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});
