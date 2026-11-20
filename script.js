// База данных проектов с интегрированными изображениями из ./images/
const products = [
  {
    id: 1,
    title: "Nordic Mini 24",
    category: "compact",
    categoryName: "Компактный модуль",
    area: 24,
    insulation: "150 мм PIR-плита",
    buildDays: "14 дней",
    price: 1450000,
    images: [
      "./images/compact-house.jpeg",
      "./images/interior-living.jpeg",
      "./images/hero-house.jpeg"
    ],
    desc: "Идеальный гостевой дом или дача выходного дня с панорамным остеклением и отделкой лиственницей.",
    specs: ["Площадь: 24 м² (6.0 × 4.0 м)", "Утепление: 150 мм PIR-плита", "Срок сборки в цеху: 14 дней", "Санузел, бойлер и кухня включены"]
  },
  {
    id: 2,
    title: "Nordic Family 65",
    category: "family",
    categoryName: "Семейный дом",
    area: 65,
    insulation: "200 мм базальт + PIR",
    buildDays: "21 день",
    price: 3890000,
    images: [
      "./images/hero-house.jpeg",
      "./images/interior-living.jpeg",
      "./images/compact-house.jpeg"
    ],
    desc: "Полноценный дом для круглогодичного проживания с двумя спальнями, кухней-гостиной и террасой.",
    specs: ["Площадь: 65 м² (3 модуля)", "Утепление: 200 мм базальт + PIR", "2 спальни + кухня-гостиная 26 м²", "Терраса из сибирской лиственницы"]
  },
  {
    id: 3,
    title: "Wood Sauna Pro",
    category: "sauna",
    categoryName: "Баня / SPA",
    area: 28,
    insulation: "150 мм PIR + фольга",
    buildDays: "16 дней",
    price: 1690000,
    images: [
      "./images/sauna-spa.jpeg",
      "./images/interior-living.jpeg",
      "./images/compact-house.jpeg"
    ],
    desc: "Модульная баня с парной из канадского кедра, тропическим душем и панорамной комнатой отдыха.",
    specs: ["Площадь: 28 м²", "Финская печь Harvia в комплекте", "Панорамный стеклопакет в парной", "Электрический теплый пол"]
  },
  {
    id: 4,
    title: "Nordic Studio 32",
    category: "compact",
    categoryName: "Компактный модуль",
    area: 32,
    insulation: "180 мм PIR-плита",
    buildDays: "18 дней",
    price: 1920000,
    images: [
      "./images/compact-house.jpeg",
      "./images/interior-living.jpeg",
      "./images/sauna-spa.jpeg"
    ],
    desc: "Уютный модуль со вторым светом, высокими потолками и спальным местом на антресоли.",
    specs: ["Площадь: 32 м²", "Высота в коньке: 3.6 м", "Антресольный спальный этаж", "Фальцевая кровля"]
  },
  {
    id: 5,
    title: "Nordic Grand 90",
    category: "family",
    categoryName: "Семейный дом",
    area: 90,
    insulation: "220 мм базальт + PIR",
    buildDays: "28 дней",
    price: 5400000,
    images: [
      "./images/hero-house.jpg",
      "./images/interior-living.jpg",
      "./images/sauna-spa.jpg"
    ],
    desc: "Флагманский проект из 4 модулей с мастер-спальней, кабинетом и крытой верандой.",
    specs: ["Площадь: 90 м² (4 модуля)", "3 спальни, 2 санузла, гардеробная", "Рекуперация воздуха в базе", "Монтаж на участке за 3 дня"]
  },
  {
    id: 6,
    title: "Thermal SPA Complex",
    category: "sauna",
    categoryName: "Баня / SPA",
    area: 45,
    insulation: "180 мм PIR + термодерево",
    buildDays: "22 дня",
    price: 2750000,
    images: [
      "./images/sauna-spa.jpeg",
      "./images/hero-house.jpeg",
      "./images/interior-living.jpeg"
    ],
    desc: "Банный комплекс с террасой и просторной лаунж-зоной с отделкой натуральным деревом.",
    specs: ["Площадь: 45 м²", "Купель с подогревом", "Отделка термодеревом и кедром", "Полная инженерная разводка"]
  }
];

// Дополнительные опции для калькулятора
const extraOptions = [
  { id: "foundation", name: "Свайно-винтовой фундамент + монтаж", price: 140000 },
  { id: "terrace", name: "Открытая терраса из лиственницы (15 м²)", price: 220000 },
  { id: "smarthome", name: "Система «Умный дом» (управление отоплением и светом)", price: 115000 },
  { id: "winter", name: "Зимний пакет (утепление 250 мм + греющий кабель)", price: 185000 }
];

// Состояние приложения
let currentCategory = "all";
let searchQuery = "";let sortType = "default";
let cart = JSON.parse(localStorage.getItem("nordic_cart")) || [];
let compareList = JSON.parse(localStorage.getItem("nordic_compare")) || [];

// Элементы DOM
const catalogGrid = document.getElementById("catalogGrid");
const categoryFilters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const formatPrice = (price) => price.toLocaleString("ru-RU") + " ₽";

// Плавное появление карточек при прокрутке
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

// Отрисовка каталога
function renderCatalog() {
  let filtered = products.filter((item) => {
    const matchesCategory = currentCategory === "all" || item.category === currentCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.area.toString().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (sortType === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sortType === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (sortType === "area-desc") filtered.sort((a, b) => b.area - a.area);

  if (filtered.length === 0) {
    catalogGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Ничего не найдено. Попробуйте изменить фильтры.</p>`;
    return;
  }

  catalogGrid.innerHTML = filtered
    .map((item) => {
      const isCompared = compareList.includes(item.id);
      return `
      <article class="card">
        <div class="card-img-wrap">
          <img src="${item.images[0]}" alt="${item.title}" class="card-img">
          <button class="compare-toggle-btn ${isCompared ? "active" : ""}" onclick="toggleCompare(${item.id})">
            ${isCompared ? "✓ В сравнении" : "+ Сравнить"}
          </button>
          <span class="card-badge-spec">Сборка: ${item.buildDays} • ${item.images.length} фото</span>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span>${item.categoryName}</span>
            <span>${item.area} м²</span>
          </div>
          <h3 class="card-title">${item.title}</h3>
          <p class="card-desc">${item.desc}</p>
          <div class="card-footer">
            <span class="card-price">от ${formatPrice(item.price)}</span>
            <div class="card-actions">
              <button class="btn-outline" onclick="openModal(${item.id})">Интерьер и расчёт</button>
              <button class="btn-primary" onclick="addToCart(${item.id})">В смету</button>
            </div>
          </div>
        </div>
      </article>
    `;
    })
    .join("");

  document.querySelectorAll(".card").forEach((card) => observer.observe(card));
}

// Логика сравнения проектов (до 3 штук)
const compareBar = document.getElementById("compareBar");
const compareChips = document.getElementById("compareChips");
const compareCount = document.getElementById("compareCount");
const compareModal = document.getElementById("compareModal");
const compareTableWrap = document.getElementById("compareTableWrap");

function saveCompare() {
  localStorage.setItem("nordic_compare", JSON.stringify(compareList));
  updateCompareBar();
  renderCatalog();
}

function toggleCompare(id) {
  const index = compareList.indexOf(id);
  if (index > -1) {
    compareList.splice(index, 1);
  } else {
    if (compareList.length >= 3) {
      return alert("Одновременно можно сравнить до 3 проектов. Удалите один из выбранных, чтобы добавить новый.");
    }
    compareList.push(id);
  }
  saveCompare();
}

function clearCompare() {
  compareList = [];
  saveCompare();
}

function updateCompareBar() {
  compareCount.textContent = compareList.length;compareBar.classList.toggle("visible", compareList.length > 0);

  const selectedProducts = products.filter((p) => compareList.includes(p.id));
  compareChips.innerHTML = selectedProducts
    .map(
      (item) => `
      <span class="compare-chip">
        ${item.title}
        <button onclick="toggleCompare(${item.id})" title="Убрать">&times;</button>
      </span>
    `
    )
    .join("");
}

function openCompareModal() {
  if (compareList.length < 2) {
    return alert("Выберите хотя бы 2 проекта для сравнения.");
  }

  const items = products.filter((p) => compareList.includes(p.id));

  compareTableWrap.innerHTML = `
    <table class="compare-table">
      <tbody>
        <tr>
          <th>Проект</th>
          ${items
            .map(
              (item) => `
            <td>
              <img src="${item.images[0]}" alt="${item.title}" class="compare-col-img">
              <strong>${item.title}</strong>
            </td>
          `
            )
            .join("")}
        </tr>
        <tr>
          <th>Базовая цена</th>
          ${items.map((item) => `<td><strong>от ${formatPrice(item.price)}</strong></td>`).join("")}
        </tr>
        <tr>
          <th>Площадь</th>
          ${items.map((item) => `<td>${item.area} м²</td>`).join("")}
        </tr>
        <tr>
          <th>Срок сборки</th>
          ${items.map((item) => `<td>${item.buildDays}</td>`).join("")}
        </tr>
        <tr>
          <th>Утепление</th>
          ${items.map((item) => `<td>${item.insulation}</td>`).join("")}
        </tr>
        <tr>
          <th>Характеристики</th>
          ${items
            .map(
              (item) => `
            <td>
              <ul class="compare-specs-list">
                ${item.specs.map((s) => `<li>${s}</li>`).join("")}
              </ul>
            </td>
          `
            )
            .join("")}
        </tr>
        <tr>
          <th>Действия</th>
          ${items
            .map(
              (item) => `
            <td>
              <div style="display:flex; flex-direction:column; gap:8px;">
                <button class="btn-outline" onclick="closeCompareModal(); openModal(${item.id});">Калькулятор опций</button>
                <button class="btn-primary" onclick="closeCompareModal(); addToCart(${item.id});">В смету</button>
              </div>
            </td>
          `
            )
            .join("")}
        </tr>
      </tbody>
    </table>
  `;

  compareModal.classList.add("open");
}

function closeCompareModal() {
  compareModal.classList.remove("open");
}

document.getElementById("clearCompareBtn").addEventListener("click", clearCompare);
document.getElementById("openCompareModalBtn").addEventListener("click", openCompareModal);
document.getElementById("closeCompareModalBtn").addEventListener("click", closeCompareModal);
compareModal.addEventListener("click", (e) => {
  if (e.target === compareModal) closeCompareModal();
});

// Фильтры, поиск и сортировка
categoryFilters.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter-btn")) return;
  document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");
  currentCategory = e.target.dataset.category;
  renderCatalog();
});

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderCatalog();
});

sortSelect.addEventListener("change", (e) => {
  sortType = e.target.value;
  renderCatalog();
});

// Работа с корзиной (Сметой)
function saveCart() {
  localStorage.setItem("nordic_cart", JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id, selectedOptions = []) {
  const product = products.find((p) => p.id === id);
  const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const finalPrice = product.price + optionsPrice;
  const optionsNames = selectedOptions.map((opt) => opt.name);const configKey = `${id}_${selectedOptions.map((o) => o.id).sort().join("-")}`;
  const existing = cart.find((item) => item.configKey === configKey);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      configKey,
      id: product.id,
      title: product.title,
      price: finalPrice,
      options: optionsNames,
      qty: 1
    });
  }
  saveCart();
  toggleCart(true);
}

function removeFromCart(configKey) {
  cart = cart.filter((item) => item.configKey !== configKey);
  saveCart();
}

function updateCartUI() {
  const cartItemsEl = document.getElementById("cartItems");
  const cartCountEl = document.getElementById("cartCount");
  const cartTotalEl = document.getElementById("cartTotal");

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCountEl.textContent = totalCount;
  cartTotalEl.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p style="color: var(--text-muted); text-align: center; margin-top: 40px;">Смета пока пуста</p>`;
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div>
          <strong>${item.title}</strong>
          ${
            item.options && item.options.length > 0
              ? `<div class="cart-item-options">+ ${item.options.join(", ")}</div>`
              : `<div class="cart-item-options">Базовая комплектация</div>`
          }
          <div class="cart-item-price">
            ${item.qty} шт. × ${formatPrice(item.price)}
          </div>
        </div>
        <button class="btn-outline" onclick="removeFromCart('${item.configKey}')">Удалить</button>
      </div>
    `
    )
    .join("");
}

// Открытие/закрытие корзины
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function toggleCart(open) {
  cartDrawer.classList.toggle("open", open);
  cartOverlay.classList.toggle("open", open);
}

document.getElementById("openCartBtn").addEventListener("click", () => toggleCart(true));
document.getElementById("closeCartBtn").addEventListener("click", () => toggleCart(false));
cartOverlay.addEventListener("click", () => toggleCart(false));

// Отправка формы
document.getElementById("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (cart.length === 0) return alert("Добавьте хотя бы один проект в смету!");
  alert("Спасибо! Ваша заявка и инженерный расчет сметы отправлены.");
  cart = [];
  saveCart();
  toggleCart(false);
  e.target.reset();
});

// Модальное окно с галереей интерьеров и калькулятором
const modal = document.getElementById("productModal");
const modalBody = document.getElementById("modalBody");

function openModal(id) {
  const item = products.find((p) => p.id === id);

  modalBody.innerHTML = `
    <div class="modal-gallery">
      <img src="${item.images[0]}" id="modalMainImg" class="modal-main-img" alt="${item.title}">
      <div class="modal-thumbs">
        ${item.images
          .map(
            (img, idx) => `
          <img src="${img}" class="modal-thumb ${idx === 0 ? "active" : ""}" onclick="switchModalImage(this, '${img}')" alt="Фото ${idx + 1}">
        `
          )
          .join("")}
      </div>
    </div>

    <h2>${item.title}</h2>
    <p style="color:var(--text-muted); margin: 6px 0 14px; font-size: 14px;">${item.desc}</p>
    
    <h4 style="margin-bottom:8px; font-size: 15px;">Спецификация и интерьер:</h4>
    <ul style="padding-left: 20px; margin-bottom: 18px; font-size: 14px; color: var(--text-muted);">
      ${item.specs.map((s) => `<li>${s}</li>`).join("")}
    </ul>

    <div class="calc-box">
      <div class="calc-title">Инженерные и строительные опции:</div>
      ${extraOptions
        .map(
          (opt) => `
        <label class="calc-option">
          <span class="calc-option-left"><input type="checkbox" class="option-checkbox" value="${opt.id}" data-price="${opt.price}" data-name="${opt.name}">
            <span>${opt.name}</span>
          </span>
          <span class="calc-option-price">+${formatPrice(opt.price)}</span>
        </label>
      `
        )
        .join("")}
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; padding-top: 12px; border-top: 1px solid var(--border); gap: 12px;">
      <div>
        <div style="font-size: 12px; color: var(--text-muted);">Итоговая стоимость проекта:</div>
        <strong id="modalTotalPrice" style="font-size:22px;">${formatPrice(item.price)}</strong>
      </div>
      <button class="btn-primary" id="addConfiguredBtn" style="padding: 12px 20px; font-size: 15px;">
        Добавить в смету
      </button>
    </div>
  `;

  const checkboxes = modalBody.querySelectorAll(".option-checkbox");
  const totalPriceEl = document.getElementById("modalTotalPrice");

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      let extraSum = 0;
      checkboxes.forEach((box) => {
        if (box.checked) extraSum += Number(box.dataset.price);
      });
      totalPriceEl.textContent = formatPrice(item.price + extraSum);
    });
  });

  document.getElementById("addConfiguredBtn").addEventListener("click", () => {
    const selected = [];
    checkboxes.forEach((box) => {
      if (box.checked) {
        selected.push({
          id: box.value,
          name: box.dataset.name,
          price: Number(box.dataset.price)
        });
      }
    });
    addToCart(item.id, selected);
    closeModal();
  });

  modal.classList.add("open");
}

function switchModalImage(thumbEl, src) {
  document.getElementById("modalMainImg").src = src;
  document.querySelectorAll(".modal-thumb").forEach((t) => t.classList.remove("active"));
  thumbEl.classList.add("active");
}

function closeModal() {
  modal.classList.remove("open");
}

document.getElementById("closeModalBtn").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Переключение светлой / темной темы
const themeToggleBtn = document.getElementById("themeToggleBtn");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggleBtn.textContent = "☀️ ";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggleBtn.textContent = "🌙 ";
  }
  localStorage.setItem("nordic_theme", theme);
}

const savedTheme = localStorage.getItem("nordic_theme") || (prefersDark ? "dark" : "light");
applyTheme(savedTheme);

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  applyTheme(isDark ? "light" : "dark");
});

// Запуск при загрузке
renderCatalog();
updateCartUI();
updateCompareBar();