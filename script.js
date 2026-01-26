// Enhanced data structure
let transactions = [];
let budgets = {
    Food: 5000,
    Transport: 2000,
    Entertainment: 1500,
    Bills: 3000,
    Shopping: 2000,
    Education: 1000,
    Other: 1000
};
let currentPeriod = 'all';

// Categories
const categories = {
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Education', 'Entertainment', 'Other'],
    income: ['Salary', 'Freelance', 'Gift', 'Investment', 'Other']
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date
    document.getElementById('date').valueAsDate = new Date();
    
    // Load from localStorage
    loadData();
    
    // Setup event listeners
    document.getElementById('transactionType').addEventListener('change', updateCategoryOptions);
    
    // Initial render
    updateCategoryOptions();
    renderTransactions();
    updateSummary();
    updateCategoryFilter();
    updateInsights();
    updateBudgetTracking();
    updateCategoryBreakdown();
    checkUpcomingBills();
    
    // Daily summary notification
    setTimeout(sendDailySummary, 1000);
});

// Update category options based on transaction type
function updateCategoryOptions() {
    const type = document.getElementById('transactionType').value;
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '';
    
    categories[type].forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

// Add transaction
function addTransaction() {
    const type = document.getElementById('transactionType').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value.trim();
    const date = document.getElementById('date').value;

    // Validation
    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }

    if (!description) {
        showNotification('Please enter a description', 'error');
        return;
    }

    if (!date) {
        showNotification('Please select a date', 'error');
        return;
    }

    // Check budget limits
    if (type === 'expense') {
        const currentSpending = getCategorySpending()[category] || 0;
        const budget = budgets[category] || 0;
        if (currentSpending + amount > budget * 0.9 && budget > 0) {
            showNotification(`⚠️ This will exceed 90% of your ${category} budget!`, 'warning');
        }
    }

    // Create transaction object
    const transaction = {
        id: Date.now(),
        type: type,
        amount: amount,
        category: category,
        description: description,
        date: date
    };

    // Add to array
    transactions.unshift(transaction);

    // Save and render
    saveData();
    renderTransactions();
    updateSummary();
    updateInsights();
    updateBudgetTracking();
    updateCategoryBreakdown();

    // Clear form
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').valueAsDate = new Date();

    showNotification('Transaction added successfully!', 'success');
}

// Delete transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveData();
        renderTransactions();
        updateSummary();
        updateInsights();
        updateBudgetTracking();
        updateCategoryBreakdown();
        showNotification('Transaction deleted successfully!', 'success');
    }
}

// Clear all transactions
function clearAllTransactions() {
    if (confirm('⚠️ WARNING: This will delete ALL transactions permanently! Are you absolutely sure?')) {
        transactions = [];
        saveData();
        renderTransactions();
        updateSummary();
        updateInsights();
        updateBudgetTracking();
        updateCategoryBreakdown();
        showNotification('All transactions cleared successfully!', 'success');
    }
}

// Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('.dark-mode-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.querySelector('.dark-mode-toggle i').classList.remove('fa-moon');
    document.querySelector('.dark-mode-toggle i').classList.add('fa-sun');
}

// Time period filtering
function setTimePeriod(period) {
    currentPeriod = period;
    document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderTransactions();
    updateSummary();
    updateInsights();
}

function filterByTimePeriod(transactionsList, period) {
    const now = new Date();
    return transactionsList.filter(t => {
        const transactionDate = new Date(t.date);
        switch(period) {
            case 'week':
                return isSameWeek(transactionDate, now);
            case 'month':
                return transactionDate.getMonth() === now.getMonth() && 
                       transactionDate.getFullYear() === now.getFullYear();
            case 'year':
                return transactionDate.getFullYear() === now.getFullYear();
            default:
                return true;
        }
    });
}

function isSameWeek(date1, date2) {
    const weekStart = new Date(date2);
    weekStart.setDate(date2.getDate() - date2.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return date1 >= weekStart && date1 <= weekEnd;
}

// Calculate enhanced summary
function calculateSummary() {
    const filtered = filterByTimePeriod(transactions, currentPeriod);
    const summary = {
        income: 0,
        expense: 0,
        balance: 0,
        savingsRate: 0,
        monthlyAverage: 0,
        highestCategory: '',
        transactionCount: filtered.length
    };

    const categorySpending = {};
    
    filtered.forEach(t => {
        if (t.type === 'income') {
            summary.income += t.amount;
        } else {
            summary.expense += t.amount;
            categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
        }
    });

    summary.balance = summary.income - summary.expense;
    summary.savingsRate = summary.income > 0 ? (summary.balance / summary.income * 100) : 0;
    
    // Find highest spending category
    const highestCategory = Object.entries(categorySpending)
        .sort(([,a], [,b]) => b - a)[0];
    summary.highestCategory = highestCategory ? highestCategory[0] : 'None';

    // Calculate monthly average
    const uniqueMonths = new Set(filtered.map(t => t.date.substring(0, 7))).size;
    summary.monthlyAverage = uniqueMonths > 0 ? summary.expense / uniqueMonths : 0;

    return summary;
}

// Update summary display with trends
function updateSummary() {
    const summary = calculateSummary();
    const previousSummary = getPreviousPeriodSummary();
    
    document.getElementById('totalIncome').textContent = '₹' + summary.income.toFixed(2);
    document.getElementById('totalExpense').textContent = '₹' + summary.expense.toFixed(2);
    document.getElementById('currentBalance').textContent = '₹' + summary.balance.toFixed(2);
    document.getElementById('savingsRate').textContent = summary.savingsRate.toFixed(1) + '%';

    // Update trend indicators
    updateTrendIndicator('incomeTrend', summary.income, previousSummary.income);
    updateTrendIndicator('expenseTrend', summary.expense, previousSummary.expense);
    updateBalanceStatus(summary.balance, summary.savingsRate);
    updateSavingsStatus(summary.savingsRate);

    // Update balance card color
    const balanceCard = document.getElementById('balanceCard');
    if (summary.balance < 0) {
        balanceCard.classList.add('negative');
    } else {
        balanceCard.classList.remove('negative');
    }
}

function updateTrendIndicator(elementId, current, previous) {
    const element = document.getElementById(elementId);
    const change = previous > 0 ? ((current - previous) / previous * 100) : 0;
    
    if (change > 5) {
        element.innerHTML = '📈 +' + change.toFixed(1) + '%';
        element.style.color = 'var(--success-color)';
    } else if (change < -5) {
        element.innerHTML = '📉 ' + change.toFixed(1) + '%';
        element.style.color = 'var(--danger-color)';
    } else {
        element.innerHTML = '📊 Stable';
        element.style.color = '#666';
    }
}

function updateBalanceStatus(balance, savingsRate) {
    const element = document.getElementById('balanceStatus');
    if (balance < 0) {
        element.innerHTML = '⚠️ Overdrawn';
        element.style.color = 'var(--danger-color)';
    } else if (savingsRate >= 20) {
        element.innerHTML = '💰 Excellent saving!';
        element.style.color = 'var(--success-color)';
    } else if (savingsRate >= 10) {
        element.innerHTML = '👍 Good saving';
        element.style.color = 'var(--warning-color)';
    } else {
        element.innerHTML = '💡 Consider saving more';
        element.style.color = '#666';
    }
}

function updateSavingsStatus(savingsRate) {
    const element = document.getElementById('savingsStatus');
    if (savingsRate >= 30) {
        element.innerHTML = '🏆 Outstanding!';
    } else if (savingsRate >= 20) {
        element.innerHTML = '💪 Great habits';
    } else if (savingsRate >= 10) {
        element.innerHTML = '👍 Building habits';
    } else {
        element.innerHTML = '📈 Room to improve';
    }
}

function getPreviousPeriodSummary() {
    // Simple comparison with previous month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastMonthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === lastMonth.getMonth() && 
               date.getFullYear() === lastMonth.getFullYear();
    });

    const summary = { income: 0, expense: 0 };
    lastMonthTransactions.forEach(t => {
        if (t.type === 'income') summary.income += t.amount;
        else summary.expense += t.amount;
    });

    return summary;
}

// Smart insights
function updateInsights() {
    const summary = calculateSummary();
    const insights = generateInsights(summary);
    
    const container = document.getElementById('insightsContainer');
    container.innerHTML = '';

    insights.forEach(insight => {
        const div = document.createElement('div');
        div.className = 'insight-card';
        div.innerHTML = `<strong>${insight.icon} ${insight.title}</strong><br>${insight.message}`;
        container.appendChild(div);
    });

    document.getElementById('insightsSection').style.display = 
        insights.length > 0 ? 'block' : 'none';
}

function generateInsights(summary) {
    const insights = [];
    const categorySpending = getCategorySpending();

    // Overspending insight
    if (summary.balance < 0) {
        insights.push({
            icon: '⚠️',
            title: 'Overspending Alert',
            message: 'Your expenses exceed your income. Consider reducing discretionary spending.'
        });
    }

    // High spending category insight
    const highestCategory = Object.entries(categorySpending)
        .sort(([,a], [,b]) => b - a)[0];
    
    if (highestCategory && highestCategory[1] > summary.income * 0.3) {
        insights.push({
            icon: '💡',
            title: 'Spending Focus',
            message: `${highestCategory[0]} is your biggest expense. Consider ways to reduce it.`
        });
    }

    // Savings insight
    if (summary.savingsRate < 10 && summary.income > 0) {
        insights.push({
            icon: '💰',
            title: 'Savings Opportunity',
            message: 'Try to save at least 10% of your income for emergencies.'
        });
    }

    // Transaction frequency insight
    const dailyAverage = summary.transactionCount / 30;
    if (dailyAverage > 5) {
        insights.push({
            icon: '📊',
            title: 'Transaction Frequency',
            message: 'You have many transactions per day. Consider consolidating expenses.'
        });
    }

    return insights;
}

// Budget tracking
function updateBudgetTracking() {
    const categorySpending = getCategorySpending();
    const container = document.getElementById('budgetContainer');
    container.innerHTML = '';

    Object.entries(budgets).forEach(([category, budget]) => {
        const spent = categorySpending[category] || 0;
        const percentage = budget > 0 ? (spent / budget) * 100 : 0;
        const remaining = budget - spent;

        const div = document.createElement('div');
        div.className = 'budget-item';
        
        let barClass = 'normal';
        let statusIcon = '✅';
        if (percentage > 90) {
            barClass = 'danger';
            statusIcon = '⚠️';
        } else if (percentage > 70) {
            barClass = 'warning';
            statusIcon = '⚠️';
        }

        div.innerHTML = `
            <div class="budget-header">
                <span><strong>${statusIcon} ${category}</strong></span>
                <span>₹${spent.toFixed(2)} / ₹${budget.toFixed(2)}</span>
            </div>
            <div class="budget-bar-container">
                <div class="budget-bar ${barClass}" style="width: ${Math.min(percentage, 100)}%"></div>
            </div>
            <div style="font-size: 0.8em; color: #666; margin-top: 5px;">
                ${remaining >= 0 ? 'Remaining: ₹' + remaining.toFixed(2) : 'Over by: ₹' + Math.abs(remaining).toFixed(2)}
            </div>
        `;
        container.appendChild(div);
    });

    document.getElementById('budgetSection').style.display = 'block';
}

function getCategorySpending() {
    const spending = {};
    const filtered = filterByTimePeriod(transactions, currentPeriod);
    
    filtered.filter(t => t.type === 'expense').forEach(t => {
        spending[t.category] = (spending[t.category] || 0) + t.amount;
    });
    
    return spending;
}

// Get filtered transactions
function getFilteredTransactions() {
    const typeFilter = document.getElementById('filterType').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    const filtered = filterByTimePeriod(transactions, currentPeriod);

    return filtered.filter(t => {
        const typeMatch = typeFilter === 'all' || t.type === typeFilter;
        const categoryMatch = categoryFilter === 'all' || t.category === categoryFilter;
        return typeMatch && categoryMatch;
    });
}

// Render transactions
function renderTransactions() {
    const filtered = getFilteredTransactions();
    const container = document.getElementById('transactionsList');
    
    document.getElementById('transactionCount').textContent = 
        filtered.length + ' transaction' + (filtered.length !== 1 ? 's' : '');

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p><i class="fas fa-inbox" style="font-size: 3em; color: #ccc;"></i></p>
                <p>No transactions found</p>
                <p style="font-size: 0.9em; margin-top: 10px;">Add your first transaction to get started!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    filtered.forEach(transaction => {
        const div = document.createElement('div');
        div.className = `transaction ${transaction.type}-trans`;
        
        div.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-desc">${transaction.description}</div>
                <div>
                    <span class="transaction-category">${transaction.category}</span>
                    <span class="transaction-date">${transaction.date}</span>
                </div>
            </div>
            <div style="display: flex; align-items: center;">
                <div class="transaction-amount">
                    ${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toFixed(2)}
                </div>
                <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        container.appendChild(div);
    });
}

// Update category breakdown
function updateCategoryBreakdown() {
    const breakdown = getCategorySpending();
    const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    
    const breakdownSection = document.getElementById('breakdownSection');
    const container = document.getElementById('categoryBreakdown');

    if (Object.keys(breakdown).length === 0) {
        breakdownSection.style.display = 'none';
        return;
    }

    breakdownSection.style.display = 'block';
    container.innerHTML = '';

    Object.entries(breakdown).forEach(([category, amount]) => {
        const percentage = total > 0 ? (amount / total) * 100 : 0;
        
        const div = document.createElement('div');
        div.className = 'breakdown-item';
        div.innerHTML = `
            <div class="breakdown-header">
                <span class="breakdown-label">${category}</span>
                <span class="breakdown-amount">₹${amount.toFixed(2)}</span>
            </div>
            <div class="breakdown-bar-container">
                <div class="breakdown-bar" style="width: ${percentage}%"></div>
            </div>
            <div class="breakdown-percentage">${percentage.toFixed(1)}%</div>
        `;
        container.appendChild(div);
    });
}

// Update category filter options
function updateCategoryFilter() {
    const select = document.getElementById('filterCategory');
    const allCategories = [...new Set([...categories.expense, ...categories.income])];
    
    select.innerHTML = '<option value="all">All Categories</option>';
    allCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

// Export to CSV
function exportToCSV() {
    const filtered = getFilteredTransactions();
    if (filtered.length === 0) {
        showNotification('No transactions to export!', 'warning');
        return;
    }
    
    const csv = filtered.map(t => 
        `${t.date},${t.type},${t.category},"${t.description}",${t.amount}`
    ).join('\n');
    
    const blob = new Blob([`Date,Type,Category,Description,Amount\n${csv}`], 
                         { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.innerHTML = message;
    notification.classList.add('show');
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.borderLeftColor = colors[type] || colors.info;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Bill reminders
function checkUpcomingBills() {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingBills = transactions.filter(t => {
        if (t.category !== 'Bills') return false;
        const billDate = new Date(t.date);
        return billDate >= today && billDate <= nextWeek;
    });

    if (upcomingBills.length > 0) {
        showNotification(`📅 ${upcomingBills.length} bills due this week!`, 'warning');
    }
}

// Daily summary
function sendDailySummary() {
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = transactions.filter(t => t.date === today);
    
    if (todayTransactions.length === 0) return;

    const totalSpent = todayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalIncome = todayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    if (totalSpent > 0 || totalIncome > 0) {
        const balance = totalIncome - totalSpent;
        const message = balance >= 0 ? 
            `💰 Today's balance: +₹${balance.toFixed(2)}` : 
            `📉 Today's balance: -₹${Math.abs(balance).toFixed(2)}`;
        
        showNotification(message, balance >= 0 ? 'success' : 'warning');
    }
}

// Utility functions
function scrollToForm() {
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

function saveData() {
    localStorage.setItem('financeTransactions', JSON.stringify(transactions));
    localStorage.setItem('financeBudgets', JSON.stringify(budgets));
}

function loadData() {
    const saved = localStorage.getItem('financeTransactions');
    if (saved) {
        transactions = JSON.parse(saved);
    }
    
    const savedBudgets = localStorage.getItem('financeBudgets');
    if (savedBudgets) {
        budgets = JSON.parse(savedBudgets);
    }
}