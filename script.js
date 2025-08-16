// Coffee Machine Menu
const menu = [
    { name: "latte", cost: 20, ingredients: { water: 200, milk: 150, coffee: 24 } },
    { name: "espresso", cost: 15, ingredients: { water: 50, milk: 0, coffee: 18 } },
    { name: "cappuccino", cost: 30, ingredients: { water: 250, milk: 50, coffee: 24 } }
];

// Resources and Profit
let resources = { water: 3000, milk: 1500, coffee: 500 };
let profit = 0;
let selectedDrink = null;

// Coin Values in INR
const coinValues = {
    oneRupee: 1,
    twoRupee: 2,
    fiveRupee: 5,
    tenRupee: 10
};

// DOM Elements
const waterEl = document.getElementById('water');
const milkEl = document.getElementById('milk');
const coffeeEl = document.getElementById('coffee');
const profitEl = document.getElementById('profit');
const menuSection = document.querySelector('.menu');
const paymentSection = document.getElementById('payment-section');
const paymentTitle = document.getElementById('payment-title');

// Update machine status display
function updateDisplay() {
    waterEl.textContent = `${resources.water}ml`;
    milkEl.textContent = `${resources.milk}ml`;
    coffeeEl.textContent = `${resources.coffee}g`;
    profitEl.textContent = `₹${profit.toFixed(2)}`;
}

// Check if enough ingredients are available
function checkResources(drink) {
    for (const ingredient in drink.ingredients) {
        if (drink.ingredients[ingredient] > resources[ingredient]) {
            alert(`❌ Sorry, not enough ${ingredient}!`);
            return false;
        }
    }
    return true;
}

// Called when user selects a drink
function selectDrink(drinkName) {
    const drink = menu.find(d => d.name === drinkName);
    if (drink && checkResources(drink)) {
        selectedDrink = drink;
        showPaymentSection();
    }
}

// Show payment UI
function showPaymentSection() {
    menuSection.style.display = 'none';
    paymentSection.style.display = 'block';
    paymentTitle.innerHTML = `💰 Payment for ${selectedDrink.name} (₹${selectedDrink.cost.toFixed(2)})`;
    document.getElementById('required-amount').textContent = `₹${selectedDrink.cost.toFixed(2)}`;
    updatePaymentDisplay();
}

// Hide payment UI and go back to menu
function hidePaymentSection() {
    menuSection.style.display = 'block';
    paymentSection.style.display = 'none';
    selectedDrink = null;
    resetCoins();
}

// Calculate how much the user inserted
function calculatePayment() {
    let total = 0;
    for (const coin in coinValues) {
        const count = parseInt(document.getElementById(coin).value) || 0;
        total += count * coinValues[coin];
    }
    return total;
}

// Try to make the payment
function makePayment() {
    const totalPaid = calculatePayment();
    const cost = selectedDrink.cost;

    if (totalPaid >= cost) {
        const change = totalPaid - cost;

        // Deduct ingredients
        for (const ing in selectedDrink.ingredients) {
            resources[ing] -= selectedDrink.ingredients[ing];
        }

        profit += cost;
        updateDisplay();

        alert(`✅ Enjoy your ${selectedDrink.name} ☕! ${change > 0 ? `Here is your change: ₹${change.toFixed(2)}` : ''}`);
        hidePaymentSection();
    } else {
        alert("❌ Not enough money. Money refunded.");
    }
}

// Reset machine to original state
function resetMachine() {
    resources = { water: 300, milk: 200, coffee: 100 };
    profit = 0;
    updateDisplay();
    hidePaymentSection();
    alert("🔁 Machine has been reset.");
}

// Reset all coin inputs
function resetCoins() {
    ['oneRupee', 'twoRupee', 'fiveRupee', 'tenRupee'].forEach(coin => {
        document.getElementById(coin).value = 0;
    });
    updatePaymentDisplay();
}

// Update inserted money display
function updatePaymentDisplay() {
    const total = calculatePayment();
    document.getElementById('total-paid').textContent = `₹${total.toFixed(2)}`;
}

// Initial Setup
document.addEventListener('DOMContentLoaded', function () {
    updateDisplay();

    // Drink buttons
    document.querySelectorAll('.order-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.drink-card');
            const drinkName = card.dataset.drink;
            selectDrink(drinkName);
        });
    });

    // Coin input listeners
    ['oneRupee', 'twoRupee', 'fiveRupee', 'tenRupee'].forEach(coin => {
        document.getElementById(coin).addEventListener('input', updatePaymentDisplay);
    });

    // Payment buttons
    document.getElementById('pay-btn').addEventListener('click', makePayment);
    document.getElementById('cancel-btn').addEventListener('click', hidePaymentSection);
    document.getElementById('reset-btn').addEventListener('click', resetMachine);
});