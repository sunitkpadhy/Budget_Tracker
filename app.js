const STORAGE_KEY = "budget-tracker-v1";
const DEFAULT_CATEGORIES = [
  "Food", "Groceries", "Rent", "Utilities", "Transport",
  "Entertainment", "Health", "Shopping", "Other"
];

const state = loadState();

const el = {
  form: document.getElementById("expenseForm"),
  date: document.getElementById("date"),
  amount: document.getElementById("amount"),
  category: document.getElementById("category"),
  newCategory: document.getElementById("newCategory"),
  addCategoryBtn: document.getElementById("addCategoryBtn"),
  description: document.getElementById("description"),
  monthSelect: document.getElementById("monthSelect"),
  totalSpent: document.getElementById("totalSpent"),
  entryCount: document.getElementById("entryCount"),
  topCategory: document.getElementById("topCategory"),
  categoryBreakdown: document.getElementById("categoryBreakdown"),
  expenseBody: document.getElementById("expenseBody"),
  emptyHint: document.getElementById("emptyHint"),
};

init();

function init() {
  const today = new Date();
  el.date.valueAsDate = today;
  el.monthSelect.value = monthKey(today);

  renderCategories();
  render();

  el.form.addEventListener("submit", onAddExpense);
  el.addCategoryBtn.addEventListener("click", onAddCategory);
  el.monthSelect.addEventListener("change", render);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        expenses: parsed.expenses || [],
        categories: parsed.categories && parsed.categories.length
          ? parsed.categories
          : [...DEFAULT_CATEGORIES],
      };
    }
  } catch (_) {}
  return { expenses: [], categories: [...DEFAULT_CATEGORIES] };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function monthKey(d) {
  const date = typeof d === "string" ? new Date(d) : d;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function formatMoney(n) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderCategories() {
  el.category.innerHTML = "";
  for (const cat of state.categories) {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    el.category.appendChild(opt);
  }
}

function onAddCategory() {
  const name = el.newCategory.value.trim();
  if (!name) return;
  const exists = state.categories.some(c => c.toLowerCase() === name.toLowerCase());
  if (exists) {
    el.category.value = state.categories.find(c => c.toLowerCase() === name.toLowerCase());
  } else {
    state.categories.push(name);
    saveState();
    renderCategories();
    el.category.value = name;
  }
  el.newCategory.value = "";
}

function onAddExpense(e) {
  e.preventDefault();
  const amount = parseFloat(el.amount.value);
  if (!Number.isFinite(amount) || amount <= 0) return;

  state.expenses.push({
    id: crypto.randomUUID(),
    date: el.date.value,
    amount,
    category: el.category.value,
    description: el.description.value.trim(),
  });
  saveState();

  el.amount.value = "";
  el.description.value = "";
  render();
}

function deleteExpense(id) {
  state.expenses = state.expenses.filter(x => x.id !== id);
  saveState();
  render();
}

function render() {
  const selectedMonth = el.monthSelect.value || monthKey(new Date());
  const monthExpenses = state.expenses
    .filter(x => monthKey(x.date) === selectedMonth)
    .sort((a, b) => b.date.localeCompare(a.date));

  renderSummary(monthExpenses);
  renderTable(monthExpenses);
}

function renderSummary(expenses) {
  const total = expenses.reduce((s, x) => s + x.amount, 0);
  el.totalSpent.textContent = formatMoney(total);
  el.entryCount.textContent = expenses.length;

  const byCat = {};
  for (const x of expenses) {
    byCat[x.category] = (byCat[x.category] || 0) + x.amount;
  }
  const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]);

  el.topCategory.textContent = sorted.length ? sorted[0][0] : "—";

  el.categoryBreakdown.innerHTML = "";
  if (!sorted.length) {
    const li = document.createElement("li");
    li.className = "cat-amount";
    li.textContent = "No spending recorded.";
    el.categoryBreakdown.appendChild(li);
    return;
  }

  const max = sorted[0][1];
  for (const [cat, amt] of sorted) {
    const li = document.createElement("li");
    const pct = max > 0 ? (amt / max) * 100 : 0;
    const share = total > 0 ? (amt / total) * 100 : 0;

    const name = document.createElement("span");
    name.className = "cat-name";
    name.textContent = cat;

    const value = document.createElement("span");
    value.className = "cat-amount";
    value.textContent = `${formatMoney(amt)}  (${share.toFixed(1)}%)`;

    const bar = document.createElement("span");
    bar.className = "bar";
    const fill = document.createElement("span");
    fill.style.width = `${pct}%`;
    bar.appendChild(fill);

    li.appendChild(name);
    li.appendChild(value);
    li.appendChild(bar);
    el.categoryBreakdown.appendChild(li);
  }
}

function renderTable(expenses) {
  el.expenseBody.innerHTML = "";
  el.emptyHint.classList.toggle("hidden", expenses.length > 0);

  for (const x of expenses) {
    const tr = document.createElement("tr");

    const dateTd = document.createElement("td");
    dateTd.textContent = x.date;

    const catTd = document.createElement("td");
    catTd.textContent = x.category;

    const descTd = document.createElement("td");
    descTd.textContent = x.description || "—";

    const amtTd = document.createElement("td");
    amtTd.className = "right";
    amtTd.textContent = formatMoney(x.amount);

    const delTd = document.createElement("td");
    delTd.className = "right";
    const btn = document.createElement("button");
    btn.className = "delete-btn";
    btn.textContent = "Delete";
    btn.addEventListener("click", () => deleteExpense(x.id));
    delTd.appendChild(btn);

    tr.appendChild(dateTd);
    tr.appendChild(catTd);
    tr.appendChild(descTd);
    tr.appendChild(amtTd);
    tr.appendChild(delTd);
    el.expenseBody.appendChild(tr);
  }
}
