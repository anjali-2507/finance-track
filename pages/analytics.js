import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

export default function Analytics() {
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState({});
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    });

    useEffect(() => {
        const fetchData = async () => {
            const [transResponse, budgetResponse] = await Promise.all([
                fetch('/api/transactions'),
                fetch('/api/budgets')
            ]);
            const [transData, budgetData] = await Promise.all([
                transResponse.json(),
                budgetResponse.json()
            ]);
            setTransactions(transData);
            setBudgets(budgetData);
        };
        fetchData();
    }, []);

    // Get list of available months from transactions
    const availableMonths = [...new Set(transactions.map(t => {
        const date = new Date(t.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }))].sort().reverse();

    // Filter transactions for selected month
    const selectedMonthData = transactions.filter(t => {
        const date = new Date(t.date);
        const transMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return transMonth === selectedMonth;
    });

    // Calculate monthly expenses by category
    const monthlyExpenses = selectedMonthData.reduce((acc, t) => {
        if (t.type === 'expense') {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        }
        return acc;
    }, {});

    // Calculate monthly income by category
    const monthlyIncome = selectedMonthData.reduce((acc, t) => {
        if (t.type === 'income') {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        }
        return acc;
    }, {});

    // Budget comparison data
    const budgetComparisonData = {
        labels: Object.keys(budgets),
        datasets: [
            {
                label: 'Budget',
                data: Object.keys(budgets).map(cat => budgets[cat] || 0),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Actual Spending',
                data: Object.keys(budgets).map(cat => monthlyExpenses[cat] || 0),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            }
        ]
    };

    // Calculate summary statistics
    const totalIncome = Object.values(monthlyIncome).reduce((a, b) => a + b, 0);
    const totalExpenses = Object.values(monthlyExpenses).reduce((a, b) => a + b, 0);
    const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);
    const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

    return (
        <div className="analytics-page">
            <header className="analytics-header">
                <h1>Financial Analytics</h1>
                <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="month-selector"
                >
                    {availableMonths.map(month => (
                        <option key={month} value={month}>
                            {new Date(month + '-01').toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long' 
                            })}
                        </option>
                    ))}
                </select>
            </header>

            <div className="analytics-summary">
                <div className="summary-card">
                    <h3>Total Income</h3>
                    <p className="amount income">₹{totalIncome.toFixed(2)}</p>
                </div>
                <div className="summary-card">
                    <h3>Total Expenses</h3>
                    <p className="amount expense">₹{totalExpenses.toFixed(2)}</p>
                </div>
                <div className="summary-card">
                    <h3>Budget Utilization</h3>
                    <p className="amount">{budgetUtilization.toFixed(1)}%</p>
                </div>
            </div>

            <div className="analytics-grid">
                <div className="chart-container">
                    <h2>Budget vs Actual Spending</h2>
                    <Bar 
                        data={budgetComparisonData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Amount (₹)'
                                    }
                                }
                            }
                        }}
                    />
                </div>

                <div className="budget-details">
                    <h2>Category Details</h2>
                    <div className="category-grid">
                        {Object.keys(budgets).map(category => {
                            const budget = budgets[category] || 0;
                            const spent = monthlyExpenses[category] || 0;
                            const remaining = budget - spent;
                            const percentage = budget > 0 ? (spent / budget) * 100 : 0;

                            return (
                                <div key={category} className="category-card">
                                    <h3>{category}</h3>
                                    <div className="progress-bar-container">
                                        <div 
                                            className="progress-bar"
                                            style={{
                                                width: `${Math.min(percentage, 100)}%`,
                                                backgroundColor: percentage > 100 ? '#dc3545' : '#28a745'
                                            }}
                                        ></div>
                                    </div>
                                    <div className="category-stats">
                                        <p>Budget: ₹{budget}</p>
                                        <p>Spent: ₹{spent}</p>
                                        <p className={remaining >= 0 ? 'positive' : 'negative'}>
                                            {remaining >= 0 ? 'Remaining: ' : 'Overspent: '}
                                            ₹{Math.abs(remaining)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
} 