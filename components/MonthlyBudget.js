import React from 'react';
import { Bar } from 'react-chartjs-2';

const MonthlyBudget = ({ transactions, budgets }) => {
    // Get current month's expenses by category
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyExpenses = transactions.reduce((acc, t) => {
        const transDate = new Date(t.date);
        if (t.type === 'expense' &&
            transDate.getMonth() === currentMonth &&
            transDate.getFullYear() === currentYear) {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        }
        return acc;
    }, {});

    // Prepare data for the chart
    const categories = Object.keys(budgets);
    const budgetAmounts = categories.map(cat => budgets[cat] || 0);
    const actualAmounts = categories.map(cat => monthlyExpenses[cat] || 0);

    const data = {
        labels: categories,
        datasets: [
            {
                label: 'Budget',
                data: budgetAmounts,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Actual Spending',
                data: actualAmounts,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Budget vs Actual Spending'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount (₹)'
                }
            }
        }
    };

    // Calculate budget statistics
    const totalBudget = budgetAmounts.reduce((a, b) => a + b, 0);
    const totalSpent = actualAmounts.reduce((a, b) => a + b, 0);
    const remainingBudget = totalBudget - totalSpent;
    const spendingPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return (
        <div className="monthly-budget-container">
            <div className="budget-stats">
                <div className="stat-card">
                    <h3>Total Budget</h3>
                    <p className="stat-value">₹{totalBudget.toFixed(2)}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Spent</h3>
                    <p className="stat-value">₹{totalSpent.toFixed(2)}</p>
                </div>
                <div className="stat-card">
                    <h3>Remaining Budget</h3>
                    <p className={`stat-value ${remainingBudget >= 0 ? 'positive' : 'negative'}`}>
                        ₹{Math.abs(remainingBudget).toFixed(2)}
                    </p>
                </div>
                <div className="stat-card">
                    <h3>Budget Utilization</h3>
                    <p className="stat-value">{spendingPercentage.toFixed(1)}%</p>
                </div>
            </div>
            <div className="budget-chart">
                <Bar data={data} options={options} />
            </div>
            <div className="budget-details">
                <h3>Category-wise Budget Status</h3>
                <div className="budget-grid">
                    {categories.map(category => {
                        const budget = budgets[category] || 0;
                        const spent = monthlyExpenses[category] || 0;
                        const remaining = budget - spent;
                        const percentage = budget > 0 ? (spent / budget) * 100 : 0;
                        
                        return (
                            <div key={category} className="budget-item-card">
                                <h4>{category}</h4>
                                <div className="budget-progress">
                                    <div 
                                        className="progress-bar"
                                        style={{
                                            width: `${Math.min(percentage, 100)}%`,
                                            backgroundColor: percentage > 100 ? '#dc3545' : '#28a745'
                                        }}
                                    ></div>
                                </div>
                                <div className="budget-details-text">
                                    <span>Budget: ₹{budget}</span>
                                    <span>Spent: ₹{spent}</span>
                                    <span className={remaining >= 0 ? 'positive' : 'negative'}>
                                        {remaining >= 0 ? 'Remaining: ' : 'Overspent: '}
                                        ₹{Math.abs(remaining)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MonthlyBudget; 