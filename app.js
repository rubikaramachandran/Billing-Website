const STORAGE_KEYS = {
    MENU: "juiceMenu",
    CART: "juiceCart",
    SALES: "juiceSalesLog"
};

const DEFAULT_DRINKS = [
    { id: crypto.randomUUID(), name: "Soda", category: "soda", price: 20, description: "Classic fizz to refresh instantly.", image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=60" },
    { id: crypto.randomUUID(), name: "Lemon Soda", category: "soda", price: 30, description: "Zesty lemon punch with sparkling water.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=60" },
    { id: crypto.randomUUID(), name: "Paneer Soda", category: "special", price: 15, description: "Iconic South-Indian rose flavored fizz.", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=60" },
    { id: crypto.randomUUID(), name: "Rosemilk", category: "milk", price: 30, description: "Chilled rose milk topped with nuts.", image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=600&q=60" },
    { id: crypto.randomUUID(), name: "Badam Milk", category: "milk", price: 30, description: "Slow cooked almond rich milk.", image: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=600&q=60" },
    { id: crypto.randomUUID(), name: "Goli Soda", category: "soda", price: 25, description: "Nostalgic goli soda in multiple flavors.", image: "https://images.unsplash.com/photo-1468465226960-8899e992537c?auto=format&fit=crop&w=600&q=60" },
    { id: crypto.randomUUID(), name: "Goli Paneer Soda", category: "special", price: 15, description: "Goli soda infused with paneer rose.", image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=600&q=60" },
    { id: crypto.randomUUID(), name: "Kalar", category: "special", price: 10, description: "Refreshing palm fruit cooler.", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=60" },
    { id: crypto.randomUUID(), name: "Grape Juice", category: "juice", price: 30, description: "Cold pressed purple grape juice.", image: "https://images.unsplash.com/photo-1441040744088-a70b8213d4d4?auto=format&fit=crop&w=600&q=60" },
    { id: crypto.randomUUID(), name: "Orange Juice", category: "juice", price: 15, description: "Fresh squeezed orange goodness.", image: "https://images.unsplash.com/photo-1469536526925-9dba8d4966b6?auto=format&fit=crop&w=600&q=60" },
    { id: crypto.randomUUID(), name: "Lemon Juice", category: "juice", price: 15, description: "Simple lemon cooler with mint.", image: "https://images.unsplash.com/photo-1464306076886-da185f6a9d12?auto=format&fit=crop&w=600&q=60" }
];

const state = {
    menu: [],
    cart: [],
    sales: []
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
    cacheElements();
    hydrateState();
    bindEvents();
    renderAll();
});

function cacheElements() {
    els.menuGrid = document.getElementById("menuGrid");
    els.menuSearch = document.getElementById("menuSearch");
    els.totalItems = document.getElementById("total-items");
    els.monthlyRevenue = document.getElementById("monthly-revenue");
    els.cartBody = document.getElementById("cartBody");
    els.subtotal = document.getElementById("subtotal");
    els.grandTotal = document.getElementById("grandTotal");
    els.clearCart = document.getElementById("clearCart");
    els.printBill = document.getElementById("printBill");
    els.payNow = document.getElementById("payNow");
    els.menuSection = document.getElementById("menu");
    els.manageMenuPanel = document.getElementById("manageMenu");
    els.manageMenuToggle = document.getElementById("manageMenuToggle");
    els.closeManageMenu = document.getElementById("closeManageMenu");
    els.menuForm = document.getElementById("menuForm");
    els.editingId = document.getElementById("editingId");
    els.drinkName = document.getElementById("drinkName");
    els.drinkCategory = document.getElementById("drinkCategory");
    els.drinkPrice = document.getElementById("drinkPrice");
    els.drinkImage = document.getElementById("drinkImage");
    els.drinkDescription = document.getElementById("drinkDescription");
    els.resetForm = document.getElementById("resetForm");
    els.ordersThisMonth = document.getElementById("ordersThisMonth");
    els.revenueThisMonth = document.getElementById("revenueThisMonth");
    els.bestSeller = document.getElementById("bestSeller");
    els.reportBody = document.getElementById("reportBody");
    els.manualSaleForm = document.getElementById("manualSaleForm");
    els.manualAmount = document.getElementById("manualAmount");
    els.manualDate = document.getElementById("manualDate");
    els.manualNote = document.getElementById("manualNote");
    els.toast = document.getElementById("toast");
    els.qrModal = document.getElementById("qrModal");
    els.modalCloseButtons = Array.from(document.querySelectorAll(".modal-close"));
    els.viewReports = document.getElementById("viewReports");
}

function hydrateState() {
    state.menu = readStorage(STORAGE_KEYS.MENU, DEFAULT_DRINKS);
    ensureDefaultMenuAssets();
    if (!localStorage.getItem(STORAGE_KEYS.MENU)) {
        persistMenu();
    }

    state.cart = readStorage(STORAGE_KEYS.CART, []);
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
        persistCart();
    }

    state.sales = readStorage(STORAGE_KEYS.SALES, []);
    if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
        localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(state.sales));
    }
}

function ensureDefaultMenuAssets() {
    let changed = false;
    const defaultImages = DEFAULT_DRINKS.reduce((acc, drink) => {
        acc[drink.name.toLowerCase()] = drink.image;
        return acc;
    }, {});

    state.menu = state.menu.map(item => {
        const key = item.name.toLowerCase();
        if (!item.image && defaultImages[key]) {
            changed = true;
            return { ...item, image: defaultImages[key] };
        }
        return item;
    });

    if (changed) {
        persistMenu();
    }
}

function bindEvents() {
    els.menuSearch.addEventListener("input", renderMenu);
    els.clearCart.addEventListener("click", clearCart);
    els.printBill.addEventListener("click", printBill);
    els.payNow.addEventListener("click", handlePayNow);
    els.manageMenuToggle.addEventListener("click", () => togglePanel(els.manageMenuPanel, true));
    els.closeManageMenu.addEventListener("click", () => togglePanel(els.manageMenuPanel, false));
    els.menuForm.addEventListener("submit", submitMenuForm);
    els.resetForm.addEventListener("click", () => populateForm());
    els.modalCloseButtons.forEach(btn => btn.addEventListener("click", () => toggleModal(false)));
    els.qrModal.addEventListener("click", (event) => {
        if (event.target === els.qrModal) {
            toggleModal(false);
        }
    });
    els.manualSaleForm.addEventListener("submit", submitManualSale);
    els.viewReports.addEventListener("click", () => {
        document.getElementById("reports").scrollIntoView({ behavior: "smooth" });
    });
}

function renderAll() {
    renderMenu();
    renderCart();
    renderReports();
    updateHeroStats();
}

function renderMenu() {
    const searchTerm = els.menuSearch.value?.toLowerCase().trim() || "";
    const fragment = document.createDocumentFragment();

    state.menu
        .filter(item => item.name.toLowerCase().includes(searchTerm))
        .forEach(item => {
            const card = document.createElement("article");
            card.className = "menu-card";
            card.dataset.id = item.id;

            card.innerHTML = `
                <img src="${item.image || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=600&q=60"}" alt="${item.name}">
                <div class="menu-card__body">
                    <div class="menu-card__top">
                        <h3>${item.name}</h3>
                        <span class="badge">${formatCategory(item.category)}</span>
                    </div>
                    <p>${item.description || "Freshly made to order."}</p>
                    <strong>₹${item.price.toFixed(2)}</strong>
                    <div class="menu-card__actions">
                        <button class="btn secondary" data-action="add">Add</button>
                        <button class="btn outline" data-action="edit">Edit</button>
                        <button class="btn danger" data-action="delete">Del</button>
                    </div>
                </div>
            `;

            card.addEventListener("click", (event) => {
                const action = event.target.dataset.action;
                if (!action) {
                    addToCart(item.id);
                    return;
                }

                event.stopPropagation();

                if (action === "add") addToCart(item.id);
                if (action === "edit") populateForm(item);
                if (action === "delete") deleteMenuItem(item.id);
            });

            fragment.appendChild(card);
        });

    els.menuGrid.replaceChildren(fragment);
    els.totalItems.textContent = `${state.menu.length} menu items`;
}

function renderCart() {
    const fragment = document.createDocumentFragment();
    let subtotal = 0;

    state.cart.forEach((entry) => {
        const row = document.createElement("tr");
        subtotal += entry.price * entry.quantity;

        row.innerHTML = `
            <td data-label="Item">${entry.name}</td>
            <td data-label="Qty">
                <div class="qty-controls">
                    <button aria-label="Decrease" data-action="decrease">-</button>
                    <span>${entry.quantity}</span>
                    <button aria-label="Increase" data-action="increase">+</button>
                </div>
            </td>
            <td data-label="Price">₹${entry.price.toFixed(2)}</td>
            <td data-label="Total">₹${(entry.price * entry.quantity).toFixed(2)}</td>
            <td data-label="Actions"><button class="btn icon-btn" data-action="remove">✕</button></td>
        `;

        row.addEventListener("click", (event) => {
            const action = event.target.dataset.action;
            if (!action) return;

            if (action === "increase") updateCartQuantity(entry.id, entry.quantity + 1);
            if (action === "decrease") updateCartQuantity(entry.id, entry.quantity - 1);
            if (action === "remove") removeFromCart(entry.id);
        });

        fragment.appendChild(row);
    });

    els.cartBody.replaceChildren(fragment);

    const total = subtotal;
    els.subtotal.textContent = formatCurrency(subtotal);
    els.grandTotal.textContent = formatCurrency(total);
}

function renderReports() {
    const monthlySummary = summarizeSales(state.sales);
    const fragment = document.createDocumentFragment();

    Object.entries(monthlySummary).forEach(([month, summary]) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${month}</td>
            <td>${summary.orders}</td>
            <td>${formatCurrency(summary.revenue)}</td>
            <td>${summary.bestSeller || "-"}</td>
        `;
        fragment.appendChild(row);
    });

    els.reportBody.replaceChildren(fragment);

    const currentMonthKey = getMonthKey(new Date());
    const currentMonth = monthlySummary[currentMonthKey] || { orders: 0, revenue: 0, bestSeller: "-" };
    els.ordersThisMonth.textContent = currentMonth.orders;
    els.revenueThisMonth.textContent = formatCurrency(currentMonth.revenue);
    els.bestSeller.textContent = currentMonth.bestSeller || "-";
    els.monthlyRevenue.textContent = `${formatCurrency(currentMonth.revenue)} sales this month`;
}

function addToCart(menuId) {
    const menuItem = state.menu.find(item => item.id === menuId);
    if (!menuItem) return;

    const existing = state.cart.find(entry => entry.id === menuId);
    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({ id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1 });
    }
    persistCart();
    renderCart();
    showToast(`${menuItem.name} added to bill.`);
}

function updateCartQuantity(itemId, newQty) {
    const entry = state.cart.find(item => item.id === itemId);
    if (!entry) return;

    if (newQty <= 0) {
        removeFromCart(itemId);
        return;
    }

    entry.quantity = newQty;
    persistCart();
    renderCart();
}

function removeFromCart(itemId) {
    state.cart = state.cart.filter(item => item.id !== itemId);
    persistCart();
    renderCart();
}

function clearCart() {
    if (!state.cart.length) return;
    state.cart = [];
    persistCart();
    renderCart();
    showToast("Cart cleared.");
}

function submitMenuForm(event) {
    event.preventDefault();
    const payload = {
        name: els.drinkName.value.trim(),
        category: els.drinkCategory.value,
        price: Number(els.drinkPrice.value),
        image: els.drinkImage.value.trim(),
        description: els.drinkDescription.value.trim()
    };

    if (els.editingId.value) {
        const id = els.editingId.value;
        state.menu = state.menu.map(item => (item.id === id ? { ...item, ...payload } : item));
        showToast("Menu item updated.");
    } else {
        state.menu.push({ id: crypto.randomUUID(), ...payload });
        showToast("Menu item added.");
    }

    persistMenu();
    renderMenu();
    updateHeroStats();
    populateForm();
}

function populateForm(item) {
    if (!item) {
        els.menuForm.reset();
        els.editingId.value = "";
        return;
    }

    els.editingId.value = item.id;
    els.drinkName.value = item.name;
    els.drinkCategory.value = item.category;
    els.drinkPrice.value = item.price;
    els.drinkImage.value = item.image;
    els.drinkDescription.value = item.description || "";

    togglePanel(els.manageMenuPanel, true);
    els.drinkName.focus();
}

function deleteMenuItem(id) {
    if (!confirm("Delete this menu item?")) return;
    state.menu = state.menu.filter(item => item.id !== id);
    persistMenu();
    renderMenu();
    updateHeroStats();
    showToast("Menu item removed.");
}

function printBill() {
    if (!state.cart.length) {
        showToast("Add items before printing.");
        return;
    }
    window.print();
}

function handlePayNow() {
    if (!state.cart.length) {
        showToast("Cart is empty.");
        return;
    }

    logSale();
    clearCart();
    renderReports();
    toggleModal(true);
}

function submitManualSale(event) {
    event.preventDefault();
    const amount = Number(els.manualAmount.value);
    if (!amount || amount <= 0) {
        showToast("Enter a valid amount.");
        return;
    }

    const note = els.manualNote.value.trim() || "Manual sale";
    const dateValue = els.manualDate.value ? new Date(els.manualDate.value) : new Date();

    const manualSale = {
        id: crypto.randomUUID(),
        timestamp: dateValue.toISOString(),
        total: amount,
        items: [{ name: note, quantity: 1 }]
    };

    state.sales.push(manualSale);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(state.sales));
    els.manualSaleForm.reset();
    renderReports();
    updateHeroStats();
    showToast("Manual sale logged.");
}

function logSale() {
    const totalAmount = parseCurrency(els.grandTotal.textContent);
    const sale = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        total: totalAmount,
        items: state.cart.map(item => ({ name: item.name, quantity: item.quantity }))
    };

    state.sales.push(sale);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(state.sales));
    showToast("Sale logged. Awaiting payment.");
}

function summarizeSales(sales) {
    return sales.reduce((acc, sale) => {
        const monthKey = getMonthKey(new Date(sale.timestamp));
        if (!acc[monthKey]) {
            acc[monthKey] = { orders: 0, revenue: 0, items: {} };
        }
        acc[monthKey].orders += 1;
        acc[monthKey].revenue += sale.total;

        sale.items.forEach((line) => {
            acc[monthKey].items[line.name] = (acc[monthKey].items[line.name] || 0) + line.quantity;
        });

        const bestSeller = Object.entries(acc[monthKey].items)
            .sort((a, b) => b[1] - a[1])[0];
        acc[monthKey].bestSeller = bestSeller ? bestSeller[0] : "-";

        return acc;
    }, {});
}

function persistMenu() {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(state.menu));
}

function persistCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.cart));
}

function togglePanel(panel, show) {
    panel.classList.toggle("hidden", !show);
}

function toggleModal(show) {
    els.qrModal.classList.toggle("hidden", !show);
}

function readStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(fallback) && typeof fallback === "object") {
            return { ...fallback, ...parsed };
        }
        return parsed;
    } catch {
        return fallback;
    }
}

function updateHeroStats() {
    els.totalItems.textContent = `${state.menu.length} menu items`;
    const monthlySummary = summarizeSales(state.sales);
    const current = monthlySummary[getMonthKey(new Date())];
    els.monthlyRevenue.textContent = current ? `${formatCurrency(current.revenue)} sales this month` : "₹0 sales this month";
}

function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.remove("hidden");
    clearTimeout(els.toastTimer);
    els.toastTimer = setTimeout(() => {
        els.toast.classList.add("hidden");
    }, 2200);
}

function updateCartFromStorage() {
    state.cart = readStorage(STORAGE_KEYS.CART, []);
    renderCart();
}

window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEYS.MENU) {
        state.menu = readStorage(STORAGE_KEYS.MENU, DEFAULT_DRINKS);
        renderMenu();
        updateHeroStats();
    }
    if (event.key === STORAGE_KEYS.CART) {
        updateCartFromStorage();
    }
    if (event.key === STORAGE_KEYS.SALES) {
        state.sales = readStorage(STORAGE_KEYS.SALES, []);
        renderReports();
    }
});

function formatCategory(cat) {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
}

function formatCurrency(value) {
    return `₹${value.toFixed(2)}`;
}

function parseCurrency(value) {
    return Number(value.replace(/[₹,]/g, "")) || 0;
}

function getMonthKey(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}


