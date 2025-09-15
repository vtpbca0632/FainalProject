

// Get dishes from localStorage service
let dishes = localStorageService.getAllDishes();

let cart = [];
let favorites = [];

document.addEventListener('DOMContentLoaded', () => {
  populateCategory();
  loadDishes();
  updateCartUI();
  loadFavoritesFromStorage(); // Load favorites from localStorage
  document.getElementById('favBtn').addEventListener('click', viewFavorites);
});

function populateCategory() {
  const cf = document.getElementById('catFilter');
  const categories = localStorageService.getAllCategories();
  cf.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => cf.append(new Option(cat, cat)));
  cf.addEventListener('change', loadDishes);
}

document.querySelector('.toggle-mode').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
  document.querySelector('.toggle-mode').textContent =
    document.body.classList.contains('dark') ? '☀️' : '🌙';
});

document.getElementById('searchInput').addEventListener('input', loadDishes);

function loadDishes() {
  const cont = document.getElementById('dish-container');
  cont.innerHTML = '';
  const term = document.getElementById('searchInput').value.toLowerCase();
  const cat = document.getElementById('catFilter').value;
  dishes
    .filter(d => d.name.toLowerCase().includes(term) && (cat === '' || d.category === cat))
    .forEach((dish, i) => {
      const col = document.createElement('div');
      // Responsive grid classes: 1 column on mobile, 2 on tablet, 3 on desktop, 4 on large screens
      col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-3';
      col.innerHTML = `
        <div class="position-relative card dish-card h-100 shadow-sm">
          <span class="badge badge-cat">${dish.category}</span>
          <img src="${dish.img}" class="card-img-top" alt="${dish.name}" loading="lazy">
          <div class="card-body d-flex flex-column">
            <h6 class="card-title mb-2">${dish.name}</h6>
            <p class="card-text text-primary fw-bold mb-3">₹${dish.price}</p>
            <div class="d-grid gap-2 mt-auto">
              <button class="btn btn-primary btn-sm" onclick="addToCart(${i})">
                <i class="fas fa-plus"></i> Add to Order
              </button>
              <button class="btn btn-outline-danger btn-sm" onclick="addToFavorite(${i})">
                <i class="fas fa-heart"></i> Add to Favorite
              </button>
            </div>
          </div>
        </div>
      `;
      cont.append(col);
    });
}

function addToCart(i) {
  const nameEl = document.getElementById('customerName');
  const tableEl = document.getElementById('tableNo');
  if (!nameEl.value.trim()) { alert('Please enter your name before adding an order.'); nameEl.focus(); return; }
  if (!tableEl.value.trim()) { alert('Please enter your table number before adding an order.'); tableEl.focus(); return; }
  const it = dishes[i];
  const existing = cart.find(c => c.name === it.name);
  if (existing) { 
    existing.qty++; 
    showPopup(`✅ ${it.name} quantity increased to ${existing.qty}!`);
  } else { 
    cart.push({ ...it, qty: 1 }); 
    showPopup(`✅ ${it.name} added to your order!`);
  }
  updateCartUI();
}

function updateCartUI() {
  const iv = document.getElementById('cart-items');
  iv.innerHTML = '';
  let total = 0;
  cart.forEach(i => {
    total += i.qty * i.price;
    const r = document.createElement('div');
    r.className = 'd-flex justify-content-between mb-1';
    r.innerHTML = `<small>${i.name} x${i.qty}</small><small>₹${i.price * i.qty}</small>`;
    iv.append(r);
  });
  document.getElementById('cart-total').textContent = total;
  document.getElementById('orderCount').textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

function placeOrder() {
  if (!cart.length) return alert('Cart is empty!');
  
  const orderData = {
    cart: cart,
    customer: document.getElementById('customerName').value || 'Anonymous',
    table: document.getElementById('tableNo').value || 'Takeaway',
    time: new Date().toLocaleString()
  };
  
  localStorageService.addOrder(orderData);
  alert('✅ Order placed!'); 
  cart = []; 
  updateCartUI();
}

function printReceipt() {
  if (!cart.length) return;
  
  const w = window.open('', '_blank');
  const customerName = document.getElementById('customerName').value || 'Anonymous';
  const tableNo = document.getElementById('tableNo').value || 'Takeaway';
  const currentTime = new Date();
  const orderId = generateOrderId();
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  
  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Restaurant Receipt</title>
      <style>
        @media print {
          body { margin: 0; padding: 20px; }
          .no-print { display: none; }
        }
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          background: #f8f9fa;
          color: #333;
        }
        .receipt-container {
          max-width: 400px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .receipt-header {
          background: linear-gradient(135deg, #000000, #333333);
          color: white;
          padding: 20px;
          text-align: center;
        }
        .restaurant-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .restaurant-tagline {
          font-size: 12px;
          opacity: 0.9;
          margin-bottom: 10px;
        }
        .receipt-info {
          padding: 20px;
          border-bottom: 2px dashed #e9ecef;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .info-label {
          font-weight: bold;
          color: #666;
        }
        .order-items {
          padding: 20px;
          border-bottom: 2px dashed #e9ecef;
        }
        .item-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #f1f1f1;
        }
        .item-name {
          flex: 2;
          font-weight: 500;
        }
        .item-qty {
          flex: 1;
          text-align: center;
          color: #666;
        }
        .item-price {
          flex: 1;
          text-align: right;
          font-weight: 500;
        }
        .total-section {
          padding: 20px;
          background: #f8f9fa;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .grand-total {
          font-size: 20px;
          color: #000;
          border-top: 2px solid #000;
          padding-top: 10px;
        }
        .receipt-footer {
          padding: 20px;
          text-align: center;
          background: #f8f9fa;
          border-top: 2px dashed #e9ecef;
        }
        .footer-text {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        .print-btn {
          background: #000;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin: 20px auto;
          display: block;
          font-size: 14px;
        }
        .print-btn:hover {
          background: #333;
        }
        .divider {
          border-top: 1px solid #e9ecef;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="receipt-header">
          <div class="restaurant-name">🍽️Food King🍽️ 👑</div>
          <div class="restaurant-tagline">Authentic Indian Cuisine</div>
          <div style="font-size: 12px; margin-top: 10px;">📍 123 Food King, Surat</div>
          <div style="font-size: 12px;">📞 +91 98765 43210</div>
        </div>
        
        <div class="receipt-info">
          <div class="info-row">
            <span class="info-label">Order ID:</span>
            <span>#${orderId}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Customer:</span>
            <span>${customerName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Table:</span>
            <span>${tableNo}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Date:</span>
            <span>${currentTime.toLocaleDateString()}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Time:</span>
            <span>${currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
        
        <div class="order-items">
          <div style="font-weight: bold; margin-bottom: 15px; text-align: center; color: #333;">
            ORDER DETAILS
          </div>
          ${cart.map(item => `
            <div class="item-row">
              <div class="item-name">${item.name}</div>
              <div class="item-qty">x${item.qty}</div>
              <div class="item-price">₹${item.price * item.qty}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${total}</span>
          </div>
          <div class="total-row">
            <span>GST (5%):</span>
            <span>₹${(total * 0.05).toFixed(2)}</span>
          </div>
          <div class="divider"></div>
          <div class="total-row grand-total">
            <span>Total Amount:</span>
            <span>₹${(total * 1.05).toFixed(2)}</span>
          </div>
        </div>
        
        <div class="receipt-footer">
          <div class="footer-text">Thank you for dining with us!</div>
          <div class="footer-text">Please visit again</div>
          <div class="footer-text" style="margin-top: 15px; font-weight: bold;">
            🍽️ Food king Restaurant 🍽️
          </div>
          <div class="footer-text" style="font-size: 10px; margin-top: 10px;">
            This is a computer generated receipt
          </div>
        </div>
      </div>
      
      <button class="print-btn no-print" onclick="window.print()">🖨️ Print Receipt</button>
    </body>
    </html>
  `);
  
  w.document.close();
}

// Generate unique order ID
function generateOrderId() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SG${timestamp.slice(-6)}${random}`;
}

function addToFavorite(i) { 
  const it = dishes[i]; 
  const result = localStorageService.addToFavorites(it);
  
  if (result) {
    favorites = localStorageService.getAllFavorites();
    showToast('Added to favorites!', 'success');
  } else {
    showToast('Already in favorites!', 'info');
  }
  updateFavUI(); 
}

function updateFavUI() { 
  document.getElementById('favCount').textContent = favorites.length;
  
  // Also update navbar count if it exists
  const navFavCount = document.getElementById('navFavCount');
  if (navFavCount) {
    navFavCount.textContent = favorites.length;
  }
}

function viewFavorites() { 
  // Redirect to favorites page instead of showing alert
  window.location.href = 'favorites.html';
}

// Load favorites from localStorage on page load
function loadFavoritesFromStorage() {
  favorites = localStorageService.getAllFavorites();
  updateFavUI();
}

// Show toast notification
function showToast(message, type = 'info') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  
  // Add to page
  const toastContainer = document.querySelector('.toast-container') || createToastContainer();
  toastContainer.appendChild(toast);
  
  // Show toast
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
  
  // Auto remove after showing
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}

// Create toast container if it doesn't exist
function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container position-fixed top-0 end-0 p-3';
  container.style.zIndex = '1055';
  document.body.appendChild(container);
  return container;
}

// Show popup message when adding to cart
function showPopup(message) {
  // Create popup element
  const popup = document.createElement('div');
  popup.className = 'popup-message';
  popup.innerHTML = `
    <div class="popup-content">
      <span class="popup-text">${message}</span>
      <button class="popup-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(popup);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (popup.parentNode) {
      popup.parentNode.removeChild(popup);
    }
  }, 3000);
}
