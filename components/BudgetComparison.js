import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import Chart from 'chart.js/auto';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BudgetComparison = ({ transactions, budgets }) => {
    // Calculate current month's expenses
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyExpenses = transactions.reduce((acc, transaction) => {
        const transDate = new Date(transaction.date);
        if (transaction.type === 'expense' &&
            transDate.getMonth() === currentMonth &&
            transDate.getFullYear() === currentYear) {
            acc[transaction.category] = (acc[transaction.category] || 0) + Math.abs(transaction.amount);
        }
        return acc;
    }, {});

    const categories = Object.keys(budgets);
    const budgetData = categories.map(cat => budgets[cat] || 0);
    const actualData = categories.map(cat => monthlyExpenses[cat] || 0);

    const data = {
        labels: categories,
        datasets: [
            {
                label: 'Budget',
                data: budgetData,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Actual',
                data: actualData,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount (₹)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Budget vs Actual Spending'
            },
        },
    };

    return (
        <div className="budget-comparison">
            <Bar data={data} options={options} />
            <div className="spending-insights">
                <h3>Spending Insights</h3>
                <ul>
                    {categories.map(category => {
                        const budget = budgets[category] || 0;
                        const actual = monthlyExpenses[category] || 0;
                        const difference = budget - actual;
                        const percentageUsed = budget ? ((actual / budget) * 100).toFixed(1) : 0;

                        return (
                            <li key={category} className="insight-item">
                                <strong>{category}:</strong>
                                <span className={difference < 0 ? 'over-budget' : 'under-budget'}>
                                    {percentageUsed}% of budget used
                                    ({difference < 0 ? 'Over by' : 'Under by'} ₹{Math.abs(difference).toFixed(2)})
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default BudgetComparison; 