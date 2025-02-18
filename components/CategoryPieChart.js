import React from 'react';
import Chart from 'chart.js/auto';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ transactions }) => {
    // Process transactions to get category totals for both expense and income
    const expenseTotals = transactions.reduce((acc, transaction) => {
        if (transaction.type === 'expense' && transaction.category) {
            acc[transaction.category] = (acc[transaction.category] || 0) + Math.abs(transaction.amount);
        }
        return acc;
    }, {});

    const incomeTotals = transactions.reduce((acc, transaction) => {
        if (transaction.type === 'income' && transaction.category) {
            acc[transaction.category] = (acc[transaction.category] || 0) + Math.abs(transaction.amount);
        }
        return acc;
    }, {});

    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#2ecc71', '#e74c3c', '#3498db', '#f1c40f'
    ];

    const expenseData = {
        labels: Object.keys(expenseTotals),
        datasets: [{
            data: Object.values(expenseTotals),
            backgroundColor: colors.slice(0, Object.keys(expenseTotals).length),
            borderColor: colors.slice(0, Object.keys(expenseTotals).length),
            borderWidth: 1,
        }]
    };

    const incomeData = {
        labels: Object.keys(incomeTotals),
        datasets: [{
            data: Object.values(incomeTotals),
            backgroundColor: colors.slice(0, Object.keys(incomeTotals).length),
            borderColor: colors.slice(0, Object.keys(incomeTotals).length),
            borderWidth: 1,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    font: { size: 12 },
                    padding: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `₹${value.toFixed(2)} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="charts-container">
            <div className="category-pie-chart">
                <h2>Expense Categories</h2>
                {Object.keys(expenseTotals).length > 0 ? (
                    <div style={{ position: 'relative', height: '400px', width: '100%', maxWidth: '600px', margin: 'auto' }}>
                        <Pie data={expenseData} options={options} />
                    </div>
                ) : (
                    <p>No expense data to display</p>
                )}
            </div>

            <div className="category-pie-chart">
                <h2>Income Categories</h2>
                {Object.keys(incomeTotals).length > 0 ? (
                    <div style={{ position: 'relative', height: '400px', width: '100%', maxWidth: '600px', margin: 'auto' }}>
                        <Pie data={incomeData} options={options} />
                    </div>
                ) : (
                    <p>No income data to display</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPieChart; 