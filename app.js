// ============================================================================
// Toko Selaras - Vanilla JS (HTML + CSS + JS) Etalase & Katalog Toko
// Zero-build, runs directly in browser / VS Code Live Server
// ============================================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  updateDoc 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// 1. Firebase Configuration
const firebaseConfig = {
  projectId: "intelligent-ensign-jpz3c",
  appId: "1:797197886280:web:4f42a3c12f84a55297c97d",
  apiKey: "AIzaSyBTI6uJ12MilR4Q2bm6F9tEeWN7yQCXkbg",
  authDomain: "intelligent-ensign-jpz3c.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-etalasekukatalog-488f23d5-c07e-4eaf-bcb2-c5780cc7edaf",
  storageBucket: "intelligent-ensign-jpz3c.firebasestorage.app",
  messagingSenderId: "797197886280"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// 2. Default Initial State
const DEFAULT_PROFILE = {
  name: 'Toko Selaras',
  tagline: 'Jelajahi etalase barang berkualitas langsung dari toko kami. Cek ketersediaan stok secara real-time dan pesan langsung via WhatsApp dengan mudah.',
  whatsapp: '6281234567890',
  location: 'Bandung & Jakarta, Indonesia',
  workingHours: '09.00 - 18.00 WIB',
  announcement: 'Bisa pesan langsung via WhatsApp · Gratis ongkir untuk pembelian di atas Rp 300.000',
  bankInfo: 'BCA: 873-091-2341 a.n Toko Selaras',
  adminPin: '1234'
};

const SAMPLE_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Kopi Arabika Spesialti Gayo 250g',
    category: 'Kopi & Minuman',
    price: 95000,
    originalPrice: 110000,
    stock: 24,
    sku: 'KOP-GYO-250',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
    description: 'Biji kopi arabika pilihan dari dataran tinggi Aceh Gayo. Dipanggang profil medium roast dengan citarasa blueberry manis, aroma melati, dan aftertaste madu yang bersih. Cocok untuk manual brew Maupun V60.',
    isFeatured: true,
    unit: 'pouch 250g'
  },
  {
    id: 'prod-2',
    name: 'Cangkir Keramik Handmade Speckled 220ml',
    category: 'Keramik & Dapur',
    price: 135000,
    originalPrice: 150000,
    stock: 12,
    sku: 'CRM-SPK-220',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    description: 'Cangkir keramik buatan tangan perajin lokal dengan glasir matte bertekstur bintik alami (speckled). Nyaman digenggam, tahan panas microwave dan aman untuk mesin cuci piring (food-grade).',
    isFeatured: true,
    unit: 'pcs'
  },
  {
    id: 'prod-3',
    name: 'Kemeja Linen Santai Lengan Panjang - Sage Olive',
    category: 'Pakaian & Gaya Hidup',
    price: 285000,
    originalPrice: 320000,
    stock: 18,
    sku: 'FSH-LNN-OLV',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    description: 'Kemeja potongan santai relaxed-fit dari 100% serat linen alami yang adem dan breathable di iklim tropis. Jahitan presisi ganda dengan kancing batok kelapa alami yang ramah lingkungan.',
    isFeatured: true,
    unit: 'pcs'
  },
  {
    id: 'prod-4',
    name: 'Lilin Kedelai Aromaterapi Cedarwood & Amber',
    category: 'Dekorasi & Rumah',
    price: 119000,
    originalPrice: 140000,
    stock: 8,
    sku: 'DEC-CND-AMB',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    description: 'Lilin aromaterapi 100% natural soy wax dengan essential oil cedarwood, amber hangat, dan sentuhan vanilla. Sumbu katun bebas timbal, menghasilkan nyala bersih tahan hingga 40 jam.',
    isFeatured: true,
    unit: 'jar 200g'
  },
  {
    id: 'prod-5',
    name: 'Dompet Kartu Kulit Nabati Pull-Up Tan',
    category: 'Aksesoris & Gadget',
    price: 175000,
    originalPrice: 195000,
    stock: 15,
    sku: 'ACC-WLT-TAN',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    description: 'Cardholder kulit sapi samak nabati premium (vegetable tanned leather) warna natural tan. Menampung hingga 8 kartu dan uang kertas lipat. Menghasilkan patina cantik seiring pemakaian.',
    isFeatured: false,
    unit: 'pcs'
  },
  {
    id: 'prod-6',
    name: 'Teko Leher Angsa Stainless Gooseneck 600ml',
    category: 'Keramik & Dapur',
    price: 210000,
    originalPrice: 240000,
    stock: 6,
    sku: 'KOP-KT-600',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    description: 'Kettle pour-over dengan cerat leher angsa presisi untuk kontrol aliran air manual brew yang stabil dan konsisten. Dilengkapi pegangan kayu ergonomis tahan panas.',
    isFeatured: false,
    unit: 'unit'
  }
];

// 3. Application State
let state = {
  products: [...SAMPLE_PRODUCTS],
  profile: { ...DEFAULT_PROFILE },
  selectedCategory: 'Semua',
  searchQuery: '',
  onlyInStock: false,
  sortBy: 'featured',
  cart: JSON.parse(localStorage.getItem('vanilla_cart') || '[]'),
  isAdminVerified: sessionStorage.getItem('vanilla_admin_auth') === 'true',
  activeAdminTab: 'list',
  currentDetailProduct: null,
  detailQuantity: 1,
  pendingCompressedImage: '',
  logoClickCount: 0,
  logoClickTimer: null
};

// 4. Utility Functions
const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num || 0);
};

const refreshIcons = () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
};

const showToast = (message, duration = 3000) => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;
  toastText.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, duration);
};

// 5. Image Compression Utility
const compressImageFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const maxWidth = 1000;
        const maxHeight = 1000;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.78);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

// 6. Firestore Real-time Listeners
function initFirestoreSync() {
  // Listen for products
  const productsCol = collection(db, 'products');
  onSnapshot(productsCol, (snapshot) => {
    if (!snapshot.empty) {
      const fetched = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        fetched.push({
          id: docSnap.id,
          name: d.name || '',
          category: d.category || 'Lainnya',
          price: Number(d.price) || 0,
          originalPrice: d.originalPrice ? Number(d.originalPrice) : undefined,
          stock: Number(d.stock) || 0,
          sku: d.sku || docSnap.id,
          imageUrl: d.imageUrl || '',
          description: d.description || '',
          isFeatured: Boolean(d.isFeatured),
          unit: d.unit || 'pcs'
        });
      });
      state.products = fetched;
    }
    renderAll();
  }, (err) => {
    console.warn('Firestore products snapshot notice:', err);
  });

  // Listen for store profile
  const profileDoc = doc(db, 'store', 'profile');
  onSnapshot(profileDoc, (docSnap) => {
    if (docSnap.exists()) {
      state.profile = { ...DEFAULT_PROFILE, ...docSnap.data() };
      applyStoreProfile();
    }
  }, (err) => {
    console.warn('Firestore store profile notice:', err);
  });
}

// 7. Update UI based on Store Profile
function applyStoreProfile() {
  const p = state.profile;
  const brandName = document.getElementById('brand-name');
  const brandInitial = document.getElementById('brand-initial');
  const storeTagline = document.getElementById('store-tagline');
  const announcementText = document.getElementById('announcement-text');
  const heroLocation = document.getElementById('hero-location');
  const heroHours = document.getElementById('hero-hours');
  const footerInitial = document.getElementById('footer-initial');
  const footerName = document.getElementById('footer-name');
  const footerTagline = document.getElementById('footer-tagline');
  const footerLocation = document.getElementById('footer-location');
  const footerHours = document.getElementById('footer-hours');
  const footerWa = document.getElementById('footer-wa');
  const footerBank = document.getElementById('footer-bank');
  const footerCopyrightName = document.getElementById('footer-copyright-name');

  const initial = (p.name || 'T').charAt(0).toUpperCase();

  if (brandName) brandName.textContent = p.name;
  if (brandInitial) brandInitial.textContent = initial;
  if (storeTagline) storeTagline.textContent = p.tagline;
  if (announcementText) announcementText.textContent = p.announcement;
  if (heroLocation) heroLocation.textContent = p.location;
  if (heroHours) heroHours.textContent = p.workingHours;
  if (footerInitial) footerInitial.textContent = initial;
  if (footerName) footerName.textContent = p.name;
  if (footerTagline) footerTagline.textContent = p.tagline;
  if (footerLocation) footerLocation.textContent = p.location;
  if (footerHours) footerHours.textContent = p.workingHours;
  if (footerWa) footerWa.textContent = `WA: +${p.whatsapp}`;
  if (footerBank) footerBank.textContent = p.bankInfo;
  if (footerCopyrightName) footerCopyrightName.textContent = p.name;

  document.title = `${p.name} - Etalase Produk Resmi`;
}

// 8. Categories List
function getCategories() {
  const categories = ['Semua'];
  state.products.forEach(p => {
    if (p.category && !categories.includes(p.category)) {
      categories.push(p.category);
    }
  });
  return categories;
}

// 9. Product Filtering & Sorting
function getFilteredProducts() {
  let list = [...state.products];

  // Category filter
  if (state.selectedCategory !== 'Semua') {
    list = list.filter(p => p.category === state.selectedCategory);
  }

  // Search filter
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Stock filter
  if (state.onlyInStock) {
    list = list.filter(p => p.stock > 0);
  }

  // Sort
  if (state.sortBy === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name, 'id'));
  } else {
    // Featured first
    list.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }

  return list;
}

// 10. Render Product Card Template
function createProductCardHTML(p) {
  const isOutOfStock = p.stock <= 0;
  const isLowStock = p.stock > 0 && p.stock <= 5;
  const hasDiscount = p.originalPrice && p.originalPrice > p.price;

  return `
    <article class="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        <!-- Card Image -->
        <div class="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer" onclick="window.app.openDetailModal('${p.id}')">
          <img
            src="${p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}"
            alt="${p.name}"
            loading="lazy"
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          >

          <!-- Badges -->
          <div class="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            ${p.isFeatured ? `
              <span class="inline-flex items-center gap-1 bg-amber-500 text-stone-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-xs">
                Unggulan
              </span>
            ` : ''}
            ${hasDiscount ? `
              <span class="inline-flex items-center bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs">
                Hemat ${formatRupiah(p.originalPrice - p.price)}
              </span>
            ` : ''}
          </div>

          <!-- Stock Pill -->
          <div class="absolute bottom-2.5 right-2.5">
            ${isOutOfStock ? `
              <span class="bg-stone-900/90 text-stone-200 text-[11px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                Habis
              </span>
            ` : isLowStock ? `
              <span class="bg-amber-600/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                Sisa ${p.stock}
              </span>
            ` : `
              <span class="bg-emerald-700/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                Tersedia (${p.stock})
              </span>
            `}
          </div>
        </div>

        <!-- Card Content -->
        <div class="p-4 space-y-2">
          <div class="flex items-center justify-between text-xs text-stone-400">
            <span class="font-medium text-stone-500 uppercase tracking-wider text-[10px]">${p.category || 'Barang'}</span>
            <span class="font-mono text-[10px]">${p.sku || ''}</span>
          </div>

          <h3 
            class="font-bold text-sm text-stone-900 line-clamp-2 hover:text-amber-800 transition-colors cursor-pointer"
            onclick="window.app.openDetailModal('${p.id}')"
          >
            ${p.name}
          </h3>

          <div class="flex items-baseline gap-2 pt-1">
            <span class="text-base font-extrabold text-stone-900 tabular-nums">
              ${formatRupiah(p.price)}
            </span>
            ${hasDiscount ? `
              <span class="text-xs text-stone-400 line-through tabular-nums">
                ${formatRupiah(p.originalPrice)}
              </span>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          onclick="window.app.openDetailModal('${p.id}')"
          class="w-full py-2 px-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer text-center"
        >
          Lihat Rincian
        </button>
        <button
          onclick="window.app.addToCart('${p.id}', 1)"
          ${isOutOfStock ? 'disabled' : ''}
          class="w-full py-2 px-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            isOutOfStock 
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
              : 'bg-stone-900 hover:bg-stone-800 text-white'
          }"
        >
          <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
          <span>${isOutOfStock ? 'Habis' : '+ Keranjang'}</span>
        </button>
      </div>
    </article>
  `;
}

// 11. Render All Components
function renderAll() {
  renderFeaturedGrid();
  renderCategoryBar();
  renderCatalogGrid();
  renderCart();
  renderAdminProducts();
  refreshIcons();
}

function renderFeaturedGrid() {
  const container = document.getElementById('featured-grid');
  if (!container) return;

  const featured = state.products.filter(p => p.isFeatured).slice(0, 4);
  if (featured.length === 0) {
    container.innerHTML = `<p class="col-span-full text-xs text-stone-400 py-4 text-center">Belum ada barang bertanda unggulan.</p>`;
    return;
  }

  container.innerHTML = featured.map(createProductCardHTML).join('');
}

function renderCategoryBar() {
  const bar = document.getElementById('category-bar');
  if (!bar) return;

  const categories = getCategories();
  bar.innerHTML = categories.map(cat => {
    const isActive = state.selectedCategory === cat;
    return `
      <button
        onclick="window.app.setCategory('${cat}')"
        class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
          isActive 
            ? 'bg-stone-900 text-white shadow-xs' 
            : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300/80'
        }"
      >
        ${cat}
      </button>
    `;
  }).join('');
}

function renderCatalogGrid() {
  const grid = document.getElementById('catalog-grid');
  const emptyState = document.getElementById('empty-state');
  const countText = document.getElementById('product-count-text');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  if (!grid) return;

  const filtered = getFilteredProducts();

  if (countText) {
    countText.textContent = `Menampilkan ${filtered.length} dari ${state.products.length} barang`;
  }

  if (clearSearchBtn) {
    if (state.searchQuery.trim()) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
  } else {
    if (emptyState) emptyState.classList.add('hidden');
    grid.innerHTML = filtered.map(createProductCardHTML).join('');
  }
}

// 12. Cart Functionality
function addToCart(productId, qty = 1) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  if (product.stock <= 0) {
    showToast('Stok barang habis!');
    return;
  }

  const existingIndex = state.cart.findIndex(item => item.product.id === productId);

  if (existingIndex > -1) {
    const currentQty = state.cart[existingIndex].quantity;
    const newQty = currentQty + qty;
    if (newQty > product.stock) {
      showToast(`Maksimal pesanan sesuai stok: ${product.stock}`);
      state.cart[existingIndex].quantity = product.stock;
    } else {
      state.cart[existingIndex].quantity = newQty;
      showToast(`+${qty} ${product.name} dimasukkan ke keranjang`);
    }
  } else {
    state.cart.push({
      product: product,
      quantity: Math.min(qty, product.stock)
    });
    showToast(`${product.name} dimasukkan ke keranjang`);
  }

  saveCart();
  renderCart();
  refreshIcons();
}

function updateCartQuantity(productId, delta) {
  const index = state.cart.findIndex(i => i.product.id === productId);
  if (index === -1) return;

  const item = state.cart[index];
  const prod = state.products.find(p => p.id === productId) || item.product;
  const newQty = item.quantity + delta;

  if (newQty <= 0) {
    state.cart.splice(index, 1);
  } else if (newQty > prod.stock) {
    showToast(`Stok hanya tersisa ${prod.stock}`);
    item.quantity = prod.stock;
  } else {
    item.quantity = newQty;
  }

  saveCart();
  renderCart();
  refreshIcons();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.product.id !== productId);
  saveCart();
  renderCart();
  refreshIcons();
}

function saveCart() {
  localStorage.setItem('vanilla_cart', JSON.stringify(state.cart));
}

function renderCart() {
  const badge = document.getElementById('cart-badge');
  const title = document.getElementById('cart-title');
  const container = document.getElementById('cart-items-container');
  const totalPriceEl = document.getElementById('cart-total-price');

  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (badge) badge.textContent = totalItems;
  if (title) title.textContent = `Keranjang Belanja (${totalItems})`;
  if (totalPriceEl) totalPriceEl.textContent = formatRupiah(totalPrice);

  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center space-y-3">
        <div class="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
          <i data-lucide="shopping-bag" class="w-6 h-6"></i>
        </div>
        <p class="text-xs text-stone-500">Keranjang belanja Anda masih kosong.</p>
        <button onclick="window.app.closeCart()" class="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium cursor-pointer">
          Mulai Belanja
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = state.cart.map(item => {
    const p = item.product;
    return `
      <div class="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
        <img
          src="${p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80'}"
          alt="${p.name}"
          class="w-16 h-16 rounded-lg object-cover bg-stone-200 shrink-0"
        >
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-bold text-stone-900 truncate">${p.name}</h4>
          <p class="text-xs text-stone-600 tabular-nums">${formatRupiah(p.price)}</p>
          
          <div class="flex items-center gap-2 mt-2">
            <div class="flex items-center border border-stone-300 rounded bg-white overflow-hidden">
              <button onclick="window.app.updateCartQuantity('${p.id}', -1)" class="px-2 py-0.5 text-stone-600 hover:bg-stone-100 font-bold text-xs">-</button>
              <span class="px-2.5 py-0.5 text-xs font-semibold text-stone-900 min-w-6 text-center tabular-nums">${item.quantity}</span>
              <button onclick="window.app.updateCartQuantity('${p.id}', 1)" class="px-2 py-0.5 text-stone-600 hover:bg-stone-100 font-bold text-xs">+</button>
            </div>
            <button onclick="window.app.removeFromCart('${p.id}')" class="text-[11px] text-rose-600 hover:underline cursor-pointer ml-auto">
              Hapus
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 13. WhatsApp Checkout Formatter
function checkoutViaWhatsApp() {
  if (state.cart.length === 0) {
    showToast('Keranjang masih kosong!');
    return;
  }

  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  const addressInput = document.getElementById('cust-address');
  const paymentSelect = document.getElementById('cust-payment');

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const address = addressInput ? addressInput.value.trim() : '';
  const payment = paymentSelect ? paymentSelect.value : 'Transfer Bank';

  if (!name || !phone || !address) {
    showToast('Harap lengkapi Nama, No. WhatsApp, dan Alamat!');
    return;
  }

  const totalPrice = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  let msg = `*PESANAN BARU DARI ETALASE TOKO*\n`;
  msg += `Halo ${state.profile.name}, saya ingin memesan barang berikut:\n\n`;

  state.cart.forEach((item, index) => {
    msg += `${index + 1}. *${item.product.name}*\n`;
    msg += `   Jumlah: ${item.quantity} ${item.product.unit || 'pcs'}\n`;
    msg += `   Harga: ${formatRupiah(item.product.price)} x ${item.quantity} = ${formatRupiah(item.product.price * item.quantity)}\n\n`;
  });

  msg += `---------------------------------\n`;
  msg += `*TOTAL PESANAN: ${formatRupiah(totalPrice)}*\n`;
  msg += `---------------------------------\n\n`;
  msg += `*DATA PEMESAN:*\n`;
  msg += `Nama: ${name}\n`;
  msg += `No. WhatsApp: ${phone}\n`;
  msg += `Alamat Pengiriman: ${address}\n`;
  msg += `Metode Pembayaran: ${payment}\n\n`;
  msg += `Mohon konfirmasi ketersediaan stok & total ongkos kirim. Terima kasih!`;

  const waNumber = state.profile.whatsapp.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// 14. Detail Modal (PDP)
function openDetailModal(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  state.currentDetailProduct = product;
  state.detailQuantity = 1;

  const modal = document.getElementById('detail-modal');
  const img = document.getElementById('modal-img');
  const sku = document.getElementById('modal-sku');
  const category = document.getElementById('modal-category');
  const stock = document.getElementById('modal-stock');
  const title = document.getElementById('modal-title');
  const price = document.getElementById('modal-price');
  const unit = document.getElementById('modal-unit');
  const desc = document.getElementById('modal-desc');
  const qtyDisplay = document.getElementById('detail-qty-display');

  if (img) img.src = product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
  if (sku) sku.textContent = `SKU: ${product.sku || product.id}`;
  if (category) category.textContent = product.category || 'Barang';
  if (stock) {
    if (product.stock <= 0) {
      stock.textContent = 'Stok Habis';
      stock.className = 'font-semibold text-rose-600';
    } else {
      stock.textContent = `Stok Tersedia: ${product.stock} ${product.unit || 'pcs'}`;
      stock.className = 'font-semibold text-emerald-700';
    }
  }
  if (title) title.textContent = product.name;
  if (price) price.textContent = formatRupiah(product.price);
  if (unit) unit.textContent = `/ ${product.unit || 'pcs'}`;
  if (desc) desc.textContent = product.description || 'Tidak ada deskripsi rinci untuk barang ini.';
  if (qtyDisplay) qtyDisplay.textContent = '1';

  if (modal) modal.classList.remove('hidden');
  refreshIcons();
}

function closeDetailModal() {
  const modal = document.getElementById('detail-modal');
  if (modal) modal.classList.add('hidden');
}

// 15. Admin Management
function checkAdminAuth() {
  const activeBtn = document.getElementById('admin-active-btn');
  const floatingBar = document.getElementById('floating-admin-bar');
  const loginScreen = document.getElementById('admin-login-screen');
  const contentScreen = document.getElementById('admin-content-screen');
  const lockBtn = document.getElementById('admin-lock-btn');
  const badgeStatus = document.getElementById('admin-badge-status');

  if (state.isAdminVerified) {
    if (activeBtn) activeBtn.classList.remove('hidden');
    if (floatingBar) floatingBar.classList.remove('hidden');
    if (loginScreen) loginScreen.classList.add('hidden');
    if (contentScreen) contentScreen.classList.remove('hidden');
    if (lockBtn) lockBtn.classList.remove('hidden');
    if (badgeStatus) {
      badgeStatus.innerHTML = `<i data-lucide="unlock" class="w-3 h-3 text-emerald-600"></i> Terbuka`;
      badgeStatus.className = 'text-[11px] bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded flex items-center gap-1';
    }
  } else {
    if (activeBtn) activeBtn.classList.add('hidden');
    if (floatingBar) floatingBar.classList.add('hidden');
    if (loginScreen) loginScreen.classList.remove('hidden');
    if (contentScreen) contentScreen.classList.add('hidden');
    if (lockBtn) lockBtn.classList.add('hidden');
    if (badgeStatus) {
      badgeStatus.innerHTML = `<i data-lucide="lock" class="w-3 h-3"></i> Terkunci PIN`;
      badgeStatus.className = 'text-[11px] bg-stone-200 text-stone-700 font-semibold px-2 py-0.5 rounded flex items-center gap-1';
    }
  }
  refreshIcons();
}

function openAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.remove('hidden');
  checkAdminAuth();
}

function closeAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.add('hidden');
}

function setAdminTab(tabName) {
  state.activeAdminTab = tabName;
  const tabList = document.getElementById('tab-btn-list');
  const tabAdd = document.getElementById('tab-btn-add');
  const tabSettings = document.getElementById('tab-btn-settings');
  const paneList = document.getElementById('tab-pane-list');
  const formProd = document.getElementById('product-form');
  const formSettings = document.getElementById('settings-form');

  [tabList, tabAdd, tabSettings].forEach(btn => {
    if (btn) {
      btn.className = 'tab-btn py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 border-transparent text-stone-600 hover:text-stone-900 cursor-pointer';
    }
  });

  if (paneList) paneList.classList.add('hidden');
  if (formProd) formProd.classList.add('hidden');
  if (formSettings) formSettings.classList.add('hidden');

  if (tabName === 'list') {
    if (tabList) tabList.className = 'tab-btn active py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 border-stone-900 text-stone-900 bg-white cursor-pointer';
    if (paneList) paneList.classList.remove('hidden');
    renderAdminProducts();
  } else if (tabName === 'add') {
    if (tabAdd) tabAdd.className = 'tab-btn active py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 border-stone-900 text-stone-900 bg-white cursor-pointer';
    if (formProd) formProd.classList.remove('hidden');
  } else if (tabName === 'settings') {
    if (tabSettings) tabSettings.className = 'tab-btn active py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 border-stone-900 text-stone-900 bg-white cursor-pointer';
    if (formSettings) formSettings.classList.remove('hidden');
    populateSettingsForm();
  }

  refreshIcons();
}

function renderAdminProducts() {
  const container = document.getElementById('admin-product-table');
  if (!container) return;

  if (state.products.length === 0) {
    container.innerHTML = `<div class="p-6 text-center text-xs text-stone-400">Belum ada barang di etalase toko.</div>`;
    return;
  }

  container.innerHTML = state.products.map(p => {
    return `
      <div class="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-stone-50 transition-colors">
        <div class="flex items-center gap-3 min-w-0">
          <img src="${p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'}" alt="${p.name}" class="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0">
          <div class="min-w-0">
            <h4 class="text-xs font-bold text-stone-900 truncate">${p.name}</h4>
            <div class="flex items-center gap-2 text-[11px] text-stone-500">
              <span class="font-mono">${p.sku || p.id}</span>
              <span>·</span>
              <span class="font-bold text-stone-800">${formatRupiah(p.price)}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
          <!-- Quick stock adjuster -->
          <div class="flex items-center border border-stone-300 rounded bg-white overflow-hidden text-xs">
            <button onclick="window.app.quickAdjustStock('${p.id}', -1)" class="px-2 py-1 text-stone-600 hover:bg-stone-100 font-bold">-</button>
            <span class="px-2.5 py-1 font-semibold text-stone-900 min-w-8 text-center tabular-nums">${p.stock}</span>
            <button onclick="window.app.quickAdjustStock('${p.id}', 1)" class="px-2 py-1 text-stone-600 hover:bg-stone-100 font-bold">+</button>
          </div>

          <div class="flex items-center gap-1.5">
            <button onclick="window.app.startEditProduct('${p.id}')" class="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded cursor-pointer" title="Edit Barang">
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </button>
            <button onclick="window.app.deleteProduct('${p.id}')" class="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer" title="Hapus Barang">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 16. Stock & Product Mutation
async function quickAdjustStock(productId, delta) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  const newStock = Math.max(0, (prod.stock || 0) + delta);
  prod.stock = newStock;
  renderAll();

  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, { stock: newStock });
  } catch (err) {
    console.error('Failed to update stock in Firestore:', err);
  }
}

async function deleteProduct(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  if (!confirm(`Hapus barang "${prod.name}" dari etalase toko?`)) return;

  state.products = state.products.filter(p => p.id !== productId);
  renderAll();

  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
    showToast('Barang berhasil dihapus');
  } catch (err) {
    console.error('Failed to delete product from Firestore:', err);
    showToast('Gagal menghapus dari database');
  }
}

function startEditProduct(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  state.editingProductId = productId;
  state.pendingCompressedImage = prod.imageUrl || '';

  const formHeading = document.getElementById('form-heading');
  const editIdInput = document.getElementById('edit-prod-id');
  const nameInput = document.getElementById('form-name');
  const catInput = document.getElementById('form-category');
  const skuInput = document.getElementById('form-sku');
  const priceInput = document.getElementById('form-price');
  const stockInput = document.getElementById('form-stock');
  const descInput = document.getElementById('form-desc');
  const imgPreview = document.getElementById('form-img-preview');
  const submitBtn = document.getElementById('form-submit-btn');

  if (formHeading) formHeading.textContent = `Edit Barang: ${prod.name}`;
  if (editIdInput) editIdInput.value = prod.id;
  if (nameInput) nameInput.value = prod.name;
  if (catInput) catInput.value = prod.category || 'Kopi & Minuman';
  if (skuInput) skuInput.value = prod.sku || '';
  if (priceInput) priceInput.value = prod.price || 50000;
  if (stockInput) stockInput.value = prod.stock || 0;
  if (descInput) descInput.value = prod.description || '';
  if (imgPreview) imgPreview.src = prod.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';
  if (submitBtn) submitBtn.textContent = 'Simpan Perubahan';

  setAdminTab('add');
}

function resetProductForm() {
  state.editingProductId = null;
  state.pendingCompressedImage = '';

  const formHeading = document.getElementById('form-heading');
  const editIdInput = document.getElementById('edit-prod-id');
  const form = document.getElementById('product-form');
  const imgPreview = document.getElementById('form-img-preview');
  const submitBtn = document.getElementById('form-submit-btn');

  if (formHeading) formHeading.textContent = 'Tambah Barang Baru';
  if (editIdInput) editIdInput.value = '';
  if (form) form.reset();
  if (imgPreview) imgPreview.src = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80';
  if (submitBtn) submitBtn.textContent = 'Terbitkan ke Etalase';
}

async function handleProductFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('form-name').value.trim();
  const category = document.getElementById('form-category').value;
  const sku = document.getElementById('form-sku').value.trim();
  const price = Number(document.getElementById('form-price').value) || 0;
  const stock = Number(document.getElementById('form-stock').value) || 0;
  const description = document.getElementById('form-desc').value.trim();
  const editId = document.getElementById('edit-prod-id').value;

  const defaultImg = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
  const imageUrl = state.pendingCompressedImage || defaultImg;

  const newDocId = editId || `prod-${Date.now()}`;
  const productData = {
    id: newDocId,
    name,
    category,
    sku: sku || newDocId,
    price,
    stock,
    description,
    imageUrl,
    isFeatured: true,
    unit: 'pcs'
  };

  try {
    const docRef = doc(db, 'products', newDocId);
    await setDoc(docRef, productData, { merge: true });

    // Update local state
    const existingIndex = state.products.findIndex(p => p.id === newDocId);
    if (existingIndex > -1) {
      state.products[existingIndex] = productData;
    } else {
      state.products.unshift(productData);
    }

    resetProductForm();
    setAdminTab('list');
    renderAll();
    showToast(editId ? 'Perubahan barang berhasil disimpan!' : 'Barang baru berhasil ditambahkan!');
  } catch (err) {
    console.error('Error saving product to Firestore:', err);
    showToast('Gagal menyimpan ke database Firestore');
  }
}

// 17. Settings Management
function populateSettingsForm() {
  const p = state.profile;
  const pinInput = document.getElementById('setting-pin');
  const nameInput = document.getElementById('setting-name');
  const waInput = document.getElementById('setting-wa');
  const locInput = document.getElementById('setting-location');
  const bankInput = document.getElementById('setting-bank');

  if (pinInput) pinInput.value = p.adminPin || '1234';
  if (nameInput) nameInput.value = p.name || '';
  if (waInput) waInput.value = p.whatsapp || '';
  if (locInput) locInput.value = p.location || '';
  if (bankInput) bankInput.value = p.bankInfo || '';
}

async function handleSettingsSubmit(e) {
  e.preventDefault();

  const newProfile = {
    ...state.profile,
    adminPin: document.getElementById('setting-pin').value.trim() || '1234',
    name: document.getElementById('setting-name').value.trim() || 'Toko Selaras',
    whatsapp: document.getElementById('setting-wa').value.trim() || '6281234567890',
    location: document.getElementById('setting-location').value.trim() || 'Bandung & Jakarta, Indonesia',
    bankInfo: document.getElementById('setting-bank').value.trim() || 'BCA: 873-091-2341 a.n Toko Selaras'
  };

  state.profile = newProfile;
  applyStoreProfile();

  try {
    const profileDoc = doc(db, 'store', 'profile');
    await setDoc(profileDoc, newProfile, { merge: true });
    showToast('Pengaturan toko berhasil diperbarui!');
  } catch (err) {
    console.error('Failed to update store settings in Firestore:', err);
    showToast('Gagal menyimpan pengaturan ke database');
  }
}

// 18. Setup Event Listeners
function setupEvents() {
  // Brand Secret Trigger: 3 clicks within 1.5 seconds opens Admin PIN modal
  const brandBtn = document.getElementById('brand-btn');
  if (brandBtn) {
    brandBtn.addEventListener('click', (e) => {
      e.preventDefault();
      state.logoClickCount++;
      if (state.logoClickTimer) clearTimeout(state.logoClickTimer);

      if (state.logoClickCount >= 3) {
        state.logoClickCount = 0;
        openAdminModal();
      } else {
        state.logoClickTimer = setTimeout(() => {
          state.logoClickCount = 0;
        }, 1500);
      }
    });
  }

  // Footer secret trigger: click © symbol
  const footerSecretBtn = document.getElementById('footer-secret-btn');
  if (footerSecretBtn) {
    footerSecretBtn.addEventListener('click', () => {
      openAdminModal();
    });
  }

  // Open Cart
  const openCartBtn = document.getElementById('open-cart-btn');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const closeCartBtn = document.getElementById('close-cart-btn');
  if (openCartBtn && cartDrawerOverlay) {
    openCartBtn.addEventListener('click', () => {
      cartDrawerOverlay.classList.remove('hidden');
    });
  }
  if (closeCartBtn && cartDrawerOverlay) {
    closeCartBtn.addEventListener('click', () => {
      cartDrawerOverlay.classList.add('hidden');
    });
  }
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) {
        cartDrawerOverlay.classList.add('hidden');
      }
    });
  }

  // Search input and button
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderCatalogGrid();
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        state.searchQuery = searchInput.value;
        renderCatalogGrid();
      }
    });
  }
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      state.searchQuery = searchInput.value;
      renderCatalogGrid();
    });
  }
  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      renderCatalogGrid();
    });
  }
  if (resetFilterBtn && searchInput) {
    resetFilterBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      state.selectedCategory = 'Semua';
      state.onlyInStock = false;
      const instockCheck = document.getElementById('instock-checkbox');
      if (instockCheck) instockCheck.checked = false;
      renderAll();
    });
  }

  // Stock filter checkbox
  const instockCheckbox = document.getElementById('instock-checkbox');
  if (instockCheckbox) {
    instockCheckbox.addEventListener('change', (e) => {
      state.onlyInStock = e.target.checked;
      renderCatalogGrid();
    });
  }

  // Sort select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderCatalogGrid();
    });
  }

  // Detail Modal Events
  const detailModal = document.getElementById('detail-modal');
  const closeDetailBtn = document.getElementById('close-detail-btn');
  const qtyMinus = document.getElementById('detail-qty-minus');
  const qtyPlus = document.getElementById('detail-qty-plus');
  const qtyDisplay = document.getElementById('detail-qty-display');
  const modalAddCartBtn = document.getElementById('modal-add-cart-btn');
  const modalDirectWaBtn = document.getElementById('modal-direct-wa-btn');

  if (closeDetailBtn && detailModal) {
    closeDetailBtn.addEventListener('click', () => {
      detailModal.classList.add('hidden');
    });
  }
  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) {
        detailModal.classList.add('hidden');
      }
    });
  }
  if (qtyMinus && qtyDisplay) {
    qtyMinus.addEventListener('click', () => {
      if (state.detailQuantity > 1) {
        state.detailQuantity--;
        qtyDisplay.textContent = state.detailQuantity;
      }
    });
  }
  if (qtyPlus && qtyDisplay) {
    qtyPlus.addEventListener('click', () => {
      if (state.currentDetailProduct && state.detailQuantity < state.currentDetailProduct.stock) {
        state.detailQuantity++;
        qtyDisplay.textContent = state.detailQuantity;
      } else {
        showToast('Jumlah mencapai batas stok!');
      }
    });
  }
  if (modalAddCartBtn) {
    modalAddCartBtn.addEventListener('click', () => {
      if (state.currentDetailProduct) {
        addToCart(state.currentDetailProduct.id, state.detailQuantity);
        closeDetailModal();
      }
    });
  }
  if (modalDirectWaBtn) {
    modalDirectWaBtn.addEventListener('click', () => {
      if (state.currentDetailProduct) {
        const p = state.currentDetailProduct;
        let msg = `Halo ${state.profile.name}, saya berminat memesan produk ini:\n\n`;
        msg += `*${p.name}*\n`;
        msg += `Jumlah: ${state.detailQuantity} ${p.unit || 'pcs'}\n`;
        msg += `Harga: ${formatRupiah(p.price)} x ${state.detailQuantity} = ${formatRupiah(p.price * state.detailQuantity)}\n\n`;
        msg += `Apakah stok masih tersedia dan berapa ongkir ke alamat saya? Terima kasih.`;

        const waNumber = state.profile.whatsapp.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      }
    });
  }

  // Checkout button in Cart
  const checkoutWaBtn = document.getElementById('checkout-wa-btn');
  if (checkoutWaBtn) {
    checkoutWaBtn.addEventListener('click', () => {
      checkoutViaWhatsApp();
    });
  }

  // Admin Modal & PIN Form
  const adminActiveBtn = document.getElementById('admin-active-btn');
  const floatingOpenAdminBtn = document.getElementById('floating-open-admin-btn');
  const floatingLogoutBtn = document.getElementById('floating-logout-btn');
  const adminLockBtn = document.getElementById('admin-lock-btn');
  const closeAdminBtn = document.getElementById('close-admin-btn');
  const pinForm = document.getElementById('pin-form');
  const pinInput = document.getElementById('pin-input');
  const pinError = document.getElementById('pin-error');

  if (adminActiveBtn) adminActiveBtn.addEventListener('click', openAdminModal);
  if (floatingOpenAdminBtn) floatingOpenAdminBtn.addEventListener('click', openAdminModal);
  if (closeAdminBtn) closeAdminBtn.addEventListener('click', closeAdminModal);

  const performLogout = () => {
    state.isAdminVerified = false;
    sessionStorage.removeItem('vanilla_admin_auth');
    checkAdminAuth();
    showToast('Akses pemilik toko telah dikunci');
  };

  if (adminLockBtn) adminLockBtn.addEventListener('click', performLogout);
  if (floatingLogoutBtn) floatingLogoutBtn.addEventListener('click', performLogout);

  if (pinForm && pinInput) {
    pinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPin = pinInput.value.trim();
      const actualPin = state.profile.adminPin || '1234';

      if (enteredPin === actualPin) {
        state.isAdminVerified = true;
        sessionStorage.setItem('vanilla_admin_auth', 'true');
        pinInput.value = '';
        if (pinError) pinError.classList.add('hidden');
        checkAdminAuth();
        setAdminTab('list');
        showToast('Kunci terbuka! Selamat datang di panel toko.');
      } else {
        if (pinError) pinError.classList.remove('hidden');
        pinInput.select();
      }
    });
  }

  // Admin Tabs Navigation
  const tabList = document.getElementById('tab-btn-list');
  const tabAdd = document.getElementById('tab-btn-add');
  const tabSettings = document.getElementById('tab-btn-settings');

  if (tabList) tabList.addEventListener('click', () => setAdminTab('list'));
  if (tabAdd) tabAdd.addEventListener('click', () => {
    resetProductForm();
    setAdminTab('add');
  });
  if (tabSettings) tabSettings.addEventListener('click', () => setAdminTab('settings'));

  // Product Add / Edit Form
  const productForm = document.getElementById('product-form');
  const formCancelBtn = document.getElementById('form-cancel-btn');
  const formUploadBtn = document.getElementById('form-upload-btn');
  const formFileInput = document.getElementById('form-file-input');
  const formImgPreview = document.getElementById('form-img-preview');

  if (productForm) productForm.addEventListener('submit', handleProductFormSubmit);
  if (formCancelBtn) {
    formCancelBtn.addEventListener('click', () => {
      resetProductForm();
      setAdminTab('list');
    });
  }
  if (formUploadBtn && formFileInput) {
    formUploadBtn.addEventListener('click', () => {
      formFileInput.click();
    });
  }
  if (formFileInput && formImgPreview) {
    formFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          showToast('Mengompres foto produk...');
          const compressed = await compressImageFile(file);
          state.pendingCompressedImage = compressed;
          formImgPreview.src = compressed;
          showToast('Foto siap diterbitkan!');
        } catch (err) {
          console.error('Error compressing image:', err);
          showToast('Gagal memproses gambar');
        }
      }
    });
  }

  // Settings Form
  const settingsForm = document.getElementById('settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', handleSettingsSubmit);
  }

  // URL Parameter check: ?admin=true
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === 'true') {
    openAdminModal();
  }

  // Current year in footer
  const currentYear = document.getElementById('current-year');
  if (currentYear) currentYear.textContent = new Date().getFullYear();
}

// 19. Global Exports for inline onclick handlers
window.app = {
  openDetailModal,
  closeDetailModal,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  closeCart: () => {
    const el = document.getElementById('cart-drawer-overlay');
    if (el) el.classList.add('hidden');
  },
  setCategory: (cat) => {
    state.selectedCategory = cat;
    renderCategoryBar();
    renderCatalogGrid();
  },
  quickAdjustStock,
  startEditProduct,
  deleteProduct
};

// 20. Initialization
document.addEventListener('DOMContentLoaded', () => {
  applyStoreProfile();
  renderAll();
  setupEvents();
  initFirestoreSync();
});
