# Personal Finance Tracker 💰

A comprehensive, feature-rich personal finance management application built with vanilla JavaScript. Track your income and expenses, set budgets, gain financial insights, and make informed decisions about your money.

## ✨ Features

### Core Functionality
- **Transaction Management**: Add, view, and delete income and expense transactions
- **Smart Categorization**: Separate categories for income (Salary, Freelance, Gift, Investment, Other) and expenses (Food, Transport, Shopping, Bills, Education, Entertainment, Other)
- **Budget Tracking**: Set and monitor budgets for each expense category with visual progress bars
- **Time Period Filtering**: View transactions by week, month, year, or all time
- **Advanced Filtering**: Filter transactions by type and category

### Analytics & Insights
- **Financial Summary**: Real-time calculation of total income, expenses, balance, and savings rate
- **Trend Indicators**: Track changes in income and expenses compared to previous periods
- **Smart Insights**: AI-powered suggestions based on your spending patterns
- **Category Breakdown**: Visual representation of spending distribution across categories
- **Monthly Averages**: Track average monthly spending patterns

### User Experience
- **Dark Mode**: Toggle between light and dark themes
- **Notifications**: Real-time alerts for transactions, budget warnings, and bill reminders
- **Export Functionality**: Download transaction data as CSV files
- **Bill Reminders**: Automatic notifications for upcoming bills within 7 days
- **Daily Summary**: End-of-day balance notifications
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Data Persistence
- **Local Storage**: All data is saved locally in your browser
- **Auto-save**: Transactions and budgets are automatically saved

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or backend required - runs entirely in the browser

### Installation

1. **Download the files**:
   ```bash
   git clone <repository-url>
   cd finance-tracker
   ```

2. **File Structure**:
   ```
   finance-tracker/
   ├── index.html          # Main HTML file
   ├── styles.css          # Styling
   ├── script.js           # This JavaScript file
   └── README.md           # This file
   ```

3. **Open in Browser**:
   - Simply open `index.html` in your web browser
   - No build process or installation required

### Required HTML Elements

The JavaScript expects the following HTML element IDs to be present:

**Form Elements**:
- `transactionType` - Select for income/expense
- `amount` - Input for transaction amount
- `category` - Select for category
- `description` - Input for description
- `date` - Date picker

**Display Elements**:
- `totalIncome` - Display total income
- `totalExpense` - Display total expenses
- `currentBalance` - Display current balance
- `savingsRate` - Display savings percentage
- `transactionsList` - Container for transaction list
- `transactionCount` - Display transaction count
- `notification` - Notification container

**Filter Elements**:
- `filterType` - Type filter (all/income/expense)
- `filterCategory` - Category filter

**Additional Sections**:
- `insightsContainer` - Smart insights display
- `budgetContainer` - Budget tracking display
- `categoryBreakdown` - Category breakdown charts
- `balanceCard` - Balance summary card

## 📖 Usage Guide

### Adding Transactions

1. Select transaction type (Income or Expense)
2. Enter the amount
3. Choose a category from the dropdown
4. Add a description
5. Select the date
6. Click "Add Transaction"

### Setting Budgets

Budgets are defined in the code and can be customized:

```javascript
let budgets = {
    Food: 5000,
    Transport: 2000,
    Entertainment: 1500,
    Bills: 3000,
    Shopping: 2000,
    Education: 1000,
    Other: 1000
};
```

### Filtering Transactions

- **By Time Period**: Use period buttons (Week, Month, Year, All)
- **By Type**: Filter by Income, Expense, or All
- **By Category**: Select specific categories to view

### Exporting Data

1. Click the "Export to CSV" button
2. Choose filtered view to export specific data
3. File downloads automatically with date stamp

### Dark Mode

- Click the moon/sun icon in the header
- Preference is saved automatically

## 🔧 Customization

### Adding New Categories

Update the `categories` object:

```javascript
const categories = {
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Education', 'Entertainment', 'Other', 'YourNewCategory'],
    income: ['Salary', 'Freelance', 'Gift', 'Investment', 'Other', 'YourNewIncome']
};
```

### Modifying Budget Limits

Change values in the `budgets` object:

```javascript
let budgets = {
    Food: 8000,        // Increase from 5000
    Transport: 3000,   // Increase from 2000
    // ... other categories
};
```

### Adjusting Notification Thresholds

Modify warning percentages in the code:

```javascript
// Current: warns at 90% budget usage
if (currentSpending + amount > budget * 0.9 && budget > 0) {
    // Change 0.9 to 0.8 for 80% warning
}
```

## 📊 Key Functions

### Transaction Management
- `addTransaction()` - Add new transaction with validation
- `deleteTransaction(id)` - Remove transaction by ID
- `clearAllTransactions()` - Delete all transactions
- `renderTransactions()` - Display filtered transaction list

### Financial Calculations
- `calculateSummary()` - Compute income, expenses, balance, savings rate
- `getCategorySpending()` - Calculate spending by category
- `getPreviousPeriodSummary()` - Get previous period data for trends

### Budget & Insights
- `updateBudgetTracking()` - Display budget progress with visual indicators
- `generateInsights()` - Create smart financial recommendations
- `updateCategoryBreakdown()` - Show spending distribution

### Utilities
- `saveData()` - Persist to localStorage
- `loadData()` - Retrieve from localStorage
- `exportToCSV()` - Download transaction data
- `showNotification(message, type)` - Display alerts

## 🎨 Notification Types

The app supports four notification types:
- `success` - Green (successful operations)
- `error` - Red (validation errors)
- `warning` - Orange (budget warnings, bill reminders)
- `info` - Blue (informational messages)

## 💡 Smart Insights

The app provides intelligent insights including:
- **Overspending Alerts**: When expenses exceed income
- **High Category Spending**: When a category exceeds 30% of income
- **Savings Opportunities**: Suggestions when savings rate is below 10%
- **Transaction Frequency**: Alerts for high daily transaction counts

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🔒 Privacy & Security

- All data stored locally in your browser
- No data sent to external servers
- No account or login required
- Data persists only in your browser's localStorage
- Clear browser data to remove all information

## 🐛 Troubleshooting

**Transactions not saving?**
- Check browser localStorage is enabled
- Ensure you're not in private/incognito mode

**Dark mode not persisting?**
- Browser may be clearing localStorage
- Check browser privacy settings

**Export not working?**
- Ensure browser allows file downloads
- Check popup blocker settings

## 🛠️ Technical Details

**Dependencies**: None - Pure vanilla JavaScript

**Browser APIs Used**:
- localStorage (data persistence)
- DOM manipulation
- Date API
- Blob API (CSV export)

**Data Structure**:
```javascript
transaction = {
    id: timestamp,
    type: 'income' | 'expense',
    amount: number,
    category: string,
    description: string,
    date: 'YYYY-MM-DD'
}

## 👨‍💻 Author

Created with ❤️ for better personal finance management

