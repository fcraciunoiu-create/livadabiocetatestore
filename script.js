/* =============================================================================
   Livada Bio Cetate — logică comună pentru magazin (index.html) și coș (cart.html)
   Vanilla JS, fără dependențe. Coșul este păstrat în localStorage.
   ========================================================================== */
(function () {
  'use strict';

  /* -------------------------------- Constante ------------------------------- */
  /* O singură cheie de coș, identică în index.html și cart.html. */
  var CART_KEY = 'livadaCart';
  var CART_MIRROR_KEY = 'livadaCart:mirror';
  var LEGACY_CART_KEYS = ['livadaBioCart:v1', 'livadaBioCart', 'livada-cart', 'livadaCart:v1', 'cart'];
  var WHATSAPP_NUMBER = '40787340162';
  var MAX_QTY = 50;

  var CATEGORY_LABELS = {
    fructe: 'Fructe proaspete',
    sucuri: 'Sucuri & nectare'
  };

  /* --------------------------------- Produse -------------------------------- */
  /* 10 produse, exact inventarul livezii. `image` poate fi înlocuit oricând cu
     fotografia reală a produsului; dacă lipsește sau nu se încarcă, cardul
     afișează ilustrația SVG cu gradient. */
  var PRODUCTS = [
    {
      id: 'mere-fuji-1kg',
      name: 'Mere Fuji',
      unit: '1 kg',
      price: 4,
      category: 'fructe',
      desc: 'Crocante, suculente și dulci.',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
      alt: 'Mere Fuji roșii, proaspăt culese',
      art: 'apple',
      gradient: ['#a51f1c', '#e07a55']
    },
    {
      id: 'mere-golden-1kg',
      name: 'Mere Golden Delicios',
      unit: '1 kg',
      price: 4,
      category: 'fructe',
      desc: 'Aurii, aromate, cu pulpă fină.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Golden_Delicious_apples.jpg/960px-Golden_Delicious_apples.jpg',
      alt: 'Mere Golden Delicios, întregi și tăiate',
      art: 'apple',
      gradient: ['#b39c3c', '#e6d68f']
    },
    {
      id: 'mere-red-1kg',
      name: 'Mere Red Delicios',
      unit: '1 kg',
      price: 4,
      category: 'fructe',
      desc: 'Coajă rubinie, gust delicat.',
      image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=800&q=80',
      alt: 'Măr Red Delicios întreg',
      art: 'apple',
      gradient: ['#8a1c1c', '#c2410c']
    },
    {
      id: 'caise-1kg',
      name: 'Caise',
      unit: '1 kg',
      price: 10,
      category: 'fructe',
      desc: 'Culese coapte, parfumate.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Apricot_whole444.jpg/960px-Apricot_whole444.jpg',
      alt: 'Caisă proaspătă',
      art: 'stone',
      gradient: ['#d97a1c', '#f2bb5c']
    },
    {
      id: 'nectarine-1kg',
      name: 'Nectarine',
      unit: '1 kg',
      price: 5,
      category: 'fructe',
      desc: 'Piele netedă, dulceață intensă.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Nectarines_1.jpg/960px-Nectarines_1.jpg',
      alt: 'Nectarine întregi și tăiate',
      art: 'stone',
      gradient: ['#bf4a26', '#e89a63']
    },
    {
      id: 'piersici-1kg',
      name: 'Piersici',
      unit: '1 kg',
      price: 5,
      category: 'fructe',
      desc: 'Zemoase, cu aromă de vară.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Peach_fruit_3.jpg/960px-Peach_fruit_3.jpg',
      alt: 'Piersici proaspete pe masă de lemn',
      art: 'stone',
      gradient: ['#cf5a4b', '#f0a893']
    },
    {
      id: 'nectar-piersici-300ml',
      name: 'Nectar de piersici',
      unit: '300 ml',
      price: 12,
      category: 'sucuri',
      desc: 'Sticla mică, perfectă la pachet.',
      image: null,
      alt: 'Sticlă de nectar de piersici, 300 ml',
      art: 'bottle',
      bottleLabel: '300 ml',
      bottleSub: 'Nectar',
      bottleSize: 'small',
      gradient: ['#b96f1d', '#e8a44f']
    },
    {
      id: 'nectar-piersici-1l',
      name: 'Nectar de piersici',
      unit: '1 L',
      price: 30,
      category: 'sucuri',
      desc: 'Sticla de 1 L, pentru toată familia.',
      image: null,
      alt: 'Sticlă de nectar de piersici, 1 litru',
      art: 'bottle',
      bottleLabel: '1 L',
      bottleSub: 'Nectar',
      bottleSize: 'large',
      gradient: ['#b0611a', '#e09a45']
    },
    {
      id: 'suc-mere-2l',
      name: 'Suc natural de mere',
      unit: '2 L',
      price: 25,
      category: 'sucuri',
      desc: 'Presat din mere din livada noastră.',
      image: null,
      alt: 'Sticlă de suc natural de mere, 2 litri',
      art: 'bottle',
      bottleLabel: '2 L',
      bottleSub: 'Suc',
      bottleSize: 'large',
      gradient: ['#8f7a17', '#cbb242']
    },
    {
      id: 'suc-mere-3l',
      name: 'Suc natural de mere',
      unit: '3 L',
      price: 35,
      category: 'sucuri',
      desc: 'Formatul mare, ideal pentru familie.',
      image: null,
      alt: 'Sticlă de suc natural de mere, 3 litri',
      art: 'bottle',
      bottleLabel: '3 L',
      bottleSub: 'Suc',
      bottleSize: 'xlarge',
      gradient: ['#7d6a12', '#bfa52f']
    }
  ];

  /* ------------------------------ Ilustrații SVG ----------------------------- */
  /* Placeholdere desenate inline (fără cereri de rețea), folosite când produsul
     nu are fotografie sau când fotografia nu poate fi încărcată. */
  var APPLE_SVG =
    '<svg viewBox="0 0 100 100" fill="none" class="h-full w-full" aria-hidden="true">' +
    '<path d="M50 31c-8-13-31-11-31 12 0 20 11 38 25 38 2 0 4-.6 6-1.7 2 1.1 4 1.7 6 1.7 14 0 25-18 25-38 0-23-23-25-31-12Z" fill="currentColor"/>' +
    '<path d="M50 31c-.5-7 2-13 9-17" stroke="#4b7d3f" stroke-width="4.5" stroke-linecap="round"/>' +
    '<path d="M57 16c7-5.5 14.5-3.5 17.5.5-3.5 6.5-11.5 8-17.5-.5Z" fill="#4b7d3f"/>' +
    '</svg>';

  var STONE_SVG =
    '<svg viewBox="0 0 100 100" fill="none" class="h-full w-full" aria-hidden="true">' +
    '<circle cx="50" cy="58" r="30" fill="currentColor"/>' +
    '<path d="M50 30c-7 11-7 34 0 50" stroke="rgba(255,255,255,.45)" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M50 30c-.5-6 1.5-11 8-14.5" stroke="#4b7d3f" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M57 16c6.5-5 13.5-3 16.5 1-3 6-10.5 7.5-16.5-1Z" fill="#4b7d3f"/>' +
    '</svg>';

  function bottleSvg(label, sub) {
    return (
      '<svg viewBox="0 0 120 168" fill="none" class="h-full w-full" aria-hidden="true">' +
      '<rect x="50" y="6" width="20" height="13" rx="4" fill="#3f3a2f"/>' +
      '<path d="M54 19h12v12c13 5 19 17 19 32v75a15 15 0 0 1-15 15H50a15 15 0 0 1-15-15V63c0-15 6-27 19-32V19Z" fill="currentColor"/>' +
      '<path d="M52 44c-7 7-9 15-9 24" stroke="rgba(255,255,255,.5)" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="37" y="82" width="46" height="54" rx="7" fill="#fffdf7"/>' +
      '<text x="60" y="104" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="16" font-weight="700" fill="#3f3a2f">' + label + '</text>' +
      '<rect x="46" y="112" width="28" height="3" rx="1.5" fill="#3f3a2f" opacity=".3"/>' +
      '<text x="60" y="128" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="9" font-weight="600" fill="#3f3a2f" opacity=".7">' + sub + '</text>' +
      '</svg>'
    );
  }

  function artSvg(product) {
    if (product.art === 'bottle') return bottleSvg(product.bottleLabel, product.bottleSub);
    if (product.art === 'stone') return STONE_SVG;
    return APPLE_SVG;
  }

  /* ----------------------------- Funcții utilitare --------------------------- */
  function getProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  function fullName(product) {
    return product.name + ' (' + product.unit + ')';
  }

  function formatPrice(value) {
    var amount = Number(value) || 0;
    return (
      amount.toLocaleString('ro-RO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + ' lei'
    );
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function pluralProduse(n) {
    if (n === 1) return '1 produs';
    var mod100 = n % 100;
    if (mod100 >= 1 && mod100 <= 19) return n + ' produse';
    return n + ' de produse';
  }

  /* ----------------------------- Coș (localStorage) -------------------------- */
  /* index.html și cart.html folosesc EXACT aceeași cheie (CART_KEY) și aceleași
     funcții. Formatul canonic este o hartă { idProdus: cantitate }; formatele
     vechi (altă cheie, array de obiecte) sunt convertite automat la citire. */
  var memoryCart = {};

  function safeStorage(kind) {
    try {
      var store = window[kind];
      if (!store) return null;
      store.setItem('__livada_probe__', '1');
      store.removeItem('__livada_probe__');
      return store;
    } catch (error) {
      return null;
    }
  }

  var localStore = safeStorage('localStorage');
  var sessionStore = safeStorage('sessionStorage');
  var storageWorks = Boolean(localStore || sessionStore);

  function rawGet(store, key) {
    if (!store) return null;
    try {
      return store.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function rawSet(store, key, value) {
    if (!store) return false;
    try {
      store.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function rawRemove(store, key) {
    if (!store) return;
    try {
      store.removeItem(key);
    } catch (error) {
      /* ignorăm */
    }
  }

  /* Rezervă pentru browsere care blochează storage-ul (mod privat). */
  function writeCookieCart(json) {
    try {
      document.cookie = CART_KEY + '=' + encodeURIComponent(json) + ';path=/;max-age=' + (60 * 60 * 24 * 7) + ';SameSite=Lax';
      return true;
    } catch (error) {
      return false;
    }
  }

  function readCookieCart() {
    try {
      var match = document.cookie.match(new RegExp('(?:^|;\\s*)' + CART_KEY + '=([^;]*)'));
      return match ? decodeURIComponent(match[1]) : null;
    } catch (error) {
      return null;
    }
  }

  /* Extrage id-ul de produs din orice formă de intrare: 'id', { id }, { productId },
     { key }, { sku }, { product: 'id' } sau { product: { id } }. */
  function cartItemId(item) {
    if (!item) return null;
    if (typeof item === 'string') return item;
    if (typeof item !== 'object') return null;

    var id = item.id || item.productId || item.key || item.sku;
    if (!id && item.product && typeof item.product === 'object') {
      id = item.product.id || item.product.sku;
    }
    if (!id && typeof item.product === 'string') id = item.product;
    return id || null;
  }

  /* Extrage cantitatea: qty, apoi quantity, count și amount; implicit 1. */
  function cartItemQty(item) {
    if (!item || typeof item !== 'object') return 1;
    var qty = item.qty;
    if (qty == null) qty = item.quantity;
    if (qty == null) qty = item.count;
    if (qty == null) qty = item.amount;
    if (qty == null) qty = 1;
    return qty;
  }

  /* Acceptă { id: qty }, [{ id, qty }], [{ product: { id }, quantity }],
     [{ productId, amount }] sau ['id', 'id']. Indiferent de forma citită, cheia
     canonică scrisă în localStorage rămâne o hartă { idProdus: cantitate } —
     exact structura pe care o citesc ambele pagini. */
  function normalizeCart(data) {
    var cart = {};

    function add(id, qty) {
      var product = getProduct(id);
      var amount = Math.floor(Number(qty));
      if (!product || !isFinite(amount) || amount <= 0) return;
      cart[product.id] = Math.min((cart[product.id] || 0) + amount, MAX_QTY);
    }

    if (!data) return cart;

    if (Array.isArray(data)) {
      data.forEach(function (item) {
        add(cartItemId(item), cartItemQty(item));
      });
      return cart;
    }

    if (typeof data === 'object') {
      Object.keys(data).forEach(function (id) {
        var value = data[id];
        add(id, value && typeof value === 'object' ? cartItemQty(value) : value);
      });
    }
    return cart;
  }

  function parseJsonSafe(raw) {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function parseCartRaw(raw) {
    if (!raw) return null;
    var parsed = parseJsonSafe(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return normalizeCart(parsed);
  }

  /* Detectează un conținut care există, dar nu poate fi mapat pe niciun produs
     curent (id-uri schimbate, alt format). Nu trebuie confundat cu un coș golit
     intenționat: doar în acest caz căutăm mai departe, în cheile vechi. */
  function hasUnusableItems(data) {
    if (!data || typeof data !== 'object') return false;

    var ids;
    if (Array.isArray(data)) {
      if (!data.length) return false;
      ids = data.map(cartItemId);
    } else {
      ids = Object.keys(data);
      if (!ids.length) return false;
    }

    return ids.every(function (id) {
      return !getProduct(id);
    });
  }

  function readCart() {
    var raw = rawGet(localStore, CART_KEY);
    var parsed = parseJsonSafe(raw);
    var current = parsed && typeof parsed === 'object' ? normalizeCart(parsed) : null;

    if (current && !hasUnusableItems(parsed)) {
      /* dacă sursa era un array, o rescriem în forma canonică { id: cantitate } */
      if (Array.isArray(parsed)) {
        writeCart(current);
      }
      return current;
    }

    if (current) {
      console.warn(
        '[Livada] Conținutul cheii "' + CART_KEY + '" nu corespunde niciunui produs; încerc cheile vechi.',
        raw
      );
    }

    /* migrăm cheile vechi, ca ambele pagini să citească din aceeași sursă */
    for (var i = 0; i < LEGACY_CART_KEYS.length; i += 1) {
      var legacy = parseCartRaw(rawGet(localStore, LEGACY_CART_KEYS[i]));
      if (!legacy || !Object.keys(legacy).length) continue;
      writeCart(legacy);
      return legacy;
    }

    /* oglinda din aceeași filă: acoperă cazul în care localStorage e blocat */
    var mirror = parseCartRaw(rawGet(sessionStore, CART_MIRROR_KEY));
    if (mirror && Object.keys(mirror).length) {
      rawSet(localStore, CART_KEY, JSON.stringify(mirror));
      return mirror;
    }

    var cookieCart = parseCartRaw(readCookieCart());
    if (cookieCart && Object.keys(cookieCart).length) {
      storageWorks = true; /* cookie-ul ține coșul sincronizat între pagini */
      return cookieCart;
    }

    return Object.assign({}, memoryCart);
  }

  function writeCart(cart) {
    memoryCart = Object.assign({}, cart);
    var json = JSON.stringify(memoryCart);

    var savedLocal = rawSet(localStore, CART_KEY, json);
    var savedSession = rawSet(sessionStore, CART_MIRROR_KEY, json);

    if (savedLocal) {
      storageWorks = true;
      LEGACY_CART_KEYS.forEach(function (key) {
        rawRemove(localStore, key);
      });
      try {
        document.cookie = CART_KEY + '=;path=/;max-age=0';
      } catch (error) {
        /* ignorăm */
      }
    } else if (savedSession) {
      storageWorks = true;
    } else {
      storageWorks = writeCookieCart(json);
    }

    updateStorageNotice();
  }

  function cartEntries() {
    var cart = readCart();
    return PRODUCTS.filter(function (product) {
      return cart[product.id] > 0;
    }).map(function (product) {
      return { product: product, qty: cart[product.id] };
    });
  }

  function cartTotal() {
    return cartEntries().reduce(function (sum, entry) {
      return sum + entry.product.price * entry.qty;
    }, 0);
  }

  function cartCount() {
    return cartEntries().reduce(function (sum, entry) {
      return sum + entry.qty;
    }, 0);
  }

  function addToCart(id, qty) {
    var product = getProduct(id);
    if (!product) return 0;
    var cart = readCart();
    var amount = Math.max(1, Math.floor(Number(qty) || 1));
    cart[id] = Math.min((cart[id] || 0) + amount, MAX_QTY);
    writeCart(cart);
    return cart[id];
  }

  function setQty(id, qty) {
    if (!getProduct(id)) return;
    var cart = readCart();
    var next = Math.floor(Number(qty));
    if (!isFinite(next) || next <= 0) {
      delete cart[id];
    } else {
      cart[id] = Math.min(next, MAX_QTY);
    }
    writeCart(cart);
  }

  function removeFromCart(id) {
    var cart = readCart();
    delete cart[id];
    writeCart(cart);
  }

  function clearCart() {
    writeCart({});
  }

  /* --------------------------- Elemente comune de UI ------------------------- */
  function updateCartBadge() {
    var badges = document.querySelectorAll('[data-cart-count]');
    var count = cartCount();
    Array.prototype.forEach.call(badges, function (badge) {
      badge.textContent = String(count);
      badge.classList.toggle('hidden', count === 0);
      if (count > 0) {
        badge.classList.remove('badge-pop');
        void badge.offsetWidth;
        badge.classList.add('badge-pop');
      }
    });
  }

  function updateStorageNotice() {
    var notice = document.getElementById('storage-notice');
    if (!notice) return;
    notice.classList.toggle('hidden', storageWorks);
  }

  function isCartKey(key) {
    return !key || key === CART_KEY || key === CART_MIRROR_KEY || LEGACY_CART_KEYS.indexOf(key) !== -1;
  }

  var toastTimer = null;
  var orderSent = false;
  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    var label = toast.querySelector('[data-toast-message]');
    if (label) label.textContent = message;

    toast.classList.add('toast-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('toast-visible');
    }, 2600);
  }



  /* ---------------------------- Pagina magazinului --------------------------- */
  function productMedia(product) {
    var gradient =
      'background-image:linear-gradient(135deg,' +
      product.gradient[0] +
      ',' +
      product.gradient[1] +
      ')';
    var artWidth = product.art === 'bottle' ? 'w-16 sm:w-20' : 'w-24';
    var image = product.image
      ? '<img src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.alt) + '" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover" onerror="this.remove()">'
      : '';

    return (
      '<div class="relative aspect-[4/3] overflow-hidden" style="' + gradient + '">' +
      '<div class="absolute inset-0 grid place-items-center text-white/90"><span class="block ' + artWidth + '">' + artSvg(product) + '</span></div>' +
      image +
      '<span class="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand-800 shadow-sm backdrop-blur">' + CATEGORY_LABELS[product.category] + '</span>' +
      '<span class="absolute right-3 top-3 rounded-full bg-brand-900/55 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur">' + escapeHtml(product.unit) + '</span>' +
      '</div>'
    );
  }

  function productCard(product) {
    return (
      '<article class="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-900/10">' +
      productMedia(product) +
      '<div class="flex flex-1 flex-col p-4 sm:p-5">' +
      '<h3 class="font-display text-lg font-semibold leading-snug text-brand-900">' + escapeHtml(product.name) + '</h3>' +
      '<p class="mt-1 text-sm leading-relaxed text-brand-800/60">' + escapeHtml(product.desc) + '</p>' +
      '<div class="mt-4 border-t border-brand-900/5 pt-3">' +
      '<p class="font-display text-lg font-semibold text-brand-700">' + formatPrice(product.price) +
      '<span class="ml-1 font-sans text-xs font-normal text-brand-800/55">/ ' + escapeHtml(product.unit) + '</span></p>' +
      '</div>' +
      '<button type="button" data-add-to-cart="' + product.id + '" class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white">' +
      '<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 4.5v11M4.5 10h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      'Adaugă în coș</button>' +
      '</div></article>'
    );
  }

  function renderProducts() {
    var grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(productCard).join('');
  }

  function initStorefront() {
    var grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.addEventListener('click', function (event) {
      var button = event.target.closest ? event.target.closest('[data-add-to-cart]') : null;
      if (!button) return;

      var product = getProduct(button.getAttribute('data-add-to-cart'));
      if (!product) return;

      addToCart(product.id, 1);
      updateCartBadge();
      showToast(fullName(product) + ' a fost adăugat în coș.');
    });
  }

  /* ------------------------------ Pagina coșului ----------------------------- */
  function cartThumb(product) {
    var gradient =
      'background-image:linear-gradient(135deg,' +
      product.gradient[0] +
      ',' +
      product.gradient[1] +
      ')';
    var artWidth = product.art === 'bottle' ? 'w-7' : 'w-11';
    var image = product.image
      ? '<img src="' + escapeHtml(product.image) + '" alt="" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover" onerror="this.remove()">'
      : '';

    return (
      '<div class="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl" style="' + gradient + '">' +
      '<div class="absolute inset-0 grid place-items-center text-white/90"><span class="block ' + artWidth + '">' + artSvg(product) + '</span></div>' +
      image +
      '</div>'
    );
  }

  function cartRow(entry) {
    var product = entry.product;
    var lineTotal = product.price * entry.qty;
    var label = escapeHtml(fullName(product));

    return (
      '<li class="flex gap-3 py-4 sm:gap-4">' +
      cartThumb(product) +
      '<div class="flex min-w-0 flex-1 flex-col justify-between gap-2">' +
      '<div class="flex items-start justify-between gap-3">' +
      '<div class="min-w-0">' +
      '<p class="truncate font-semibold leading-tight text-brand-900">' + escapeHtml(product.name) + '</p>' +
      '<p class="mt-0.5 text-xs text-brand-800/60">' + escapeHtml(product.unit) + ' · ' + formatPrice(product.price) + ' / buc.</p>' +
      '</div>' +
      '<p class="shrink-0 font-display text-base font-semibold text-brand-800">' + formatPrice(lineTotal) + '</p>' +
      '</div>' +
      '<div class="flex items-center justify-between gap-3">' +
      '<div class="inline-flex items-center rounded-xl bg-cream/80 ring-1 ring-brand-900/10">' +
      '<button type="button" data-qty-action="dec" data-id="' + product.id + '" aria-label="Scade cantitatea pentru ' + label + '" class="grid h-9 w-9 place-items-center rounded-l-xl text-lg font-semibold leading-none text-brand-800 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">&minus;</button>' +
      '<span class="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">' + entry.qty + '</span>' +
      '<button type="button" data-qty-action="inc" data-id="' + product.id + '" aria-label="Crește cantitatea pentru ' + label + '" class="grid h-9 w-9 place-items-center rounded-r-xl text-lg font-semibold leading-none text-brand-800 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">+</button>' +
      '</div>' +
      '<button type="button" data-remove="' + product.id + '" class="rounded-lg px-2 py-1 text-xs font-semibold text-brand-800/55 underline decoration-brand-800/30 underline-offset-2 transition hover:text-red-600 hover:decoration-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">Șterge</button>' +
      '</div></div></li>'
    );
  }

  function renderCart() {
    var list = document.getElementById('cart-items');
    if (!list) {
      console.warn('[Livada] #cart-items lipsește din pagină: coșul nu poate fi afișat.');
      return;
    }

    var entries = cartEntries();
    var empty = entries.length === 0;
    var emptyState = document.getElementById('cart-empty');
    var aside = document.getElementById('cart-aside');
    var view = document.getElementById('cart-view');
    var clearButton = document.getElementById('clear-cart');
    var totalValue = cartTotal();

    list.innerHTML = entries.map(cartRow).join('');
    list.classList.toggle('hidden', empty);
    if (emptyState) emptyState.classList.toggle('hidden', !empty);
    if (aside) aside.classList.toggle('hidden', empty);
    if (view) view.classList.toggle('cart-view--empty', empty);
    if (clearButton) clearButton.classList.toggle('hidden', empty);

    var subtotal = document.getElementById('cart-subtotal');
    var total = document.getElementById('cart-total');
    var countLabel = document.getElementById('cart-count-label');
    if (subtotal) subtotal.textContent = formatPrice(totalValue);
    if (total) total.textContent = formatPrice(totalValue);
    if (countLabel) countLabel.textContent = pluralProduse(cartCount());

    var submit = document.getElementById('checkout-submit');
    if (submit) submit.disabled = empty;

    updateStorageNotice();
    updateCartBadge();
  }

  function focusQty(action, id) {
    var button = document.querySelector('[data-qty-action="' + action + '"][data-id="' + id + '"]');
    if (button) button.focus();
  }

  function initCartPage() {
    var list = document.getElementById('cart-items');
    if (!list) return;

    list.addEventListener('click', function (event) {
      var button = event.target.closest ? event.target.closest('[data-qty-action], [data-remove]') : null;
      if (!button) return;

      var id = button.getAttribute('data-id') || button.getAttribute('data-remove');
      var entry = cartEntries().filter(function (item) {
        return item.product.id === id;
      })[0];
      if (!entry) return;

      if (button.hasAttribute('data-remove')) {
        removeFromCart(id);
        renderCart();
        showToast(fullName(entry.product) + ' a fost eliminat din coș.');
        return;
      }

      var action = button.getAttribute('data-qty-action');
      setQty(id, action === 'inc' ? entry.qty + 1 : entry.qty - 1);
      renderCart();
      focusQty(action, id);
    });

    var clearButton = document.getElementById('clear-cart');
    if (clearButton) {
      clearButton.addEventListener('click', function () {
        clearCart();
        renderCart();
        showToast('Coșul a fost golit.');
      });
    }

    initCheckoutForm();

    /* sincronizare între tab-uri/file: orice scriere în cheia coșului re-randează */
    window.addEventListener('storage', function (event) {
      if (orderSent || !isCartKey(event.key)) return;
      renderCart();
    });
  }

  /* --------------------------- Finalizarea comenzii -------------------------- */
  function normalizePhone(raw) {
    var digits = String(raw || '').replace(/\D/g, '');
    if (digits.indexOf('004') === 0) {
      digits = digits.slice(3);
    } else if (digits.indexOf('40') === 0 && digits.length > 10) {
      digits = digits.slice(2);
    }
    if (digits.charAt(0) === '0') digits = digits.slice(1);
    if (/^[237]\d{8}$/.test(digits)) return '0' + digits;
    return null;
  }

  function formatPhone(value) {
    if (/^0\d{9}$/.test(value)) {
      return value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7);
    }
    return value;
  }

  var FIELD_RULES = {
    name: function (value) {
      var clean = String(value || '').trim().replace(/\s+/g, ' ');
      if (clean.length < 3) {
        return { error: 'Introdu numele complet (minim 3 caractere).' };
      }
      if (!/^[A-Za-zĂÂÎȘȚăâîșțÀ-ÖØ-öø-ÿ' .-]+$/.test(clean)) {
        return { error: 'Numele poate conține doar litere, spații și cratime.' };
      }
      return { value: clean };
    },
    phone: function (value) {
      var phone = normalizePhone(value);
      if (!phone) {
        return { error: 'Introdu un număr de telefon valid (ex. 07xx xxx xxx).' };
      }
      return { value: phone };
    },
    address: function (value) {
      var clean = String(value || '').trim().replace(/\s+/g, ' ');
      if (clean.length < 10) {
        return { error: 'Introdu adresa completă de livrare (minim 10 caractere).' };
      }
      return { value: clean };
    }
  };

  var FIELDS = [
    { key: 'name', input: 'customer-name', error: 'error-name' },
    { key: 'phone', input: 'customer-phone', error: 'error-phone' },
    { key: 'address', input: 'customer-address', error: 'error-address' }
  ];

  function setFieldError(field, message) {
    var input = document.getElementById(field.input);
    var error = document.getElementById(field.error);

    if (error) {
      error.textContent = message || '';
      error.classList.toggle('hidden', !message);
    }
    if (input) {
      if (message) {
        input.setAttribute('aria-invalid', 'true');
        input.classList.add('field-invalid');
      } else {
        input.removeAttribute('aria-invalid');
        input.classList.remove('field-invalid');
      }
    }
  }

  function validateCheckout() {
    var values = {};
    var firstInvalid = null;

    FIELDS.forEach(function (field) {
      var input = document.getElementById(field.input);
      if (!input) return;

      var result = FIELD_RULES[field.key](input.value);
      if (result.error) {
        setFieldError(field, result.error);
        if (!firstInvalid) firstInvalid = input;
      } else {
        setFieldError(field, '');
        values[field.key] = result.value;
      }
    });

    return { ok: !firstInvalid, values: values, firstInvalid: firstInvalid };
  }

  function buildOrderMessage(values, entries, total) {
    var lines = [
      'Comandă nouă de pe site-ul Livada Bio Cetate:',
      '',
      'Nume: ' + values.name,
      'Telefon: ' + formatPhone(values.phone),
      'Adresă: ' + values.address,
      '',
      'Produse:'
    ];

    entries.forEach(function (entry) {
      lines.push(
        '• ' +
          fullName(entry.product) +
          ' × ' +
          entry.qty +
          ' = ' +
          formatPrice(entry.product.price * entry.qty)
      );
    });

    lines.push('', 'Total: ' + formatPrice(total));
    return lines.join('\n');
  }

  function showOrderSuccess(name) {
    orderSent = true;
    var success = document.getElementById('cart-success');
    var view = document.getElementById('cart-view');
    var firstName = document.getElementById('success-name');

    if (firstName) firstName.textContent = String(name || '').split(' ')[0];
    if (view) view.classList.add('hidden');
    if (success) {
      success.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function initCheckoutForm() {
    var form = document.getElementById('checkout-form');
    if (!form) return;

    FIELDS.forEach(function (field) {
      var input = document.getElementById(field.input);
      if (!input) return;

      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') setFieldError(field, '');
      });

      input.addEventListener('blur', function () {
        if (input.value.trim() === '') {
          setFieldError(field, '');
          return;
        }
        var result = FIELD_RULES[field.key](input.value);
        setFieldError(field, result.error || '');
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var entries = cartEntries();
      if (!entries.length) {
        showToast('Coșul este gol. Adaugă produse înainte de a trimite comanda.');
        return;
      }

      var validation = validateCheckout();
      if (!validation.ok) {
        if (validation.firstInvalid) validation.firstInvalid.focus();
        return;
      }

      var message = buildOrderMessage(validation.values, entries, cartTotal());
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

      var popup = null;
      try {
        popup = window.open(url, '_blank');
      } catch (error) {
        popup = null;
      }
      if (popup) {
        try {
          popup.opener = null;
        } catch (error) {
          /* fereastra nouă rămâne independentă */
        }
      } else {
        window.location.href = url;
      }

      clearCart();
      form.reset();
      renderCart();
      showOrderSuccess(validation.values.name);
    });
  }

  /* --------------------------------- Pornire -------------------------------- */
  function detectPage() {
    var page = document.body.getAttribute('data-page');
    if (page) return page;
    /* plasă de siguranță: dacă atributul lipsește, deducem pagina din DOM */
    return document.getElementById('cart-items') ? 'cart' : 'home';
  }

  function refresh() {
    try {
      updateCartBadge();
      updateStorageNotice();
      if (detectPage() === 'cart' && !orderSent) renderCart();
    } catch (error) {
      console.error('[Livada] Reîmprospătarea coșului a eșuat:', error);
    }
  }

  function boot() {
    var page = detectPage();

    try {
      updateCartBadge();
      updateStorageNotice();
    } catch (error) {
      console.error('[Livada] Badge-ul coșului a eșuat:', error);
    }

    if (page === 'cart') {
      try {
        initCartPage();
      } catch (error) {
        console.error('[Livada] Evenimentele coșului au eșuat:', error);
      }
      /* randează chiar dacă initCartPage a picat — altfel pagina pare goală */
      renderCart();
    } else {
      try {
        renderProducts();
        initStorefront();
      } catch (error) {
        console.error('[Livada] Inițializarea magazinului a eșuat:', error);
      }
    }

    /* pagina restaurată din cache (butonul Înapoi) sau filă reactivată */
    window.addEventListener('pageshow', function (event) {
      if (event.persisted) refresh();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') refresh();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
