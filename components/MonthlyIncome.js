import React from 'react';
import { Line } from 'react-chartjs-2';

const MonthlyIncome = ({ transactions }) => {
    // Process transactions to get monthly income
    const monthlyIncome = transactions.reduce((acc, t) => {
        if (t.type === 'income') {
            const date = new Date(t.date);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
            acc[monthYear] = (acc[monthYear] || 0) + Math.abs(t.amount);
        }
        return acc;
    }, {});

    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyIncome).sort((a, b) => {
        const [monthA, yearA] = a.split('/');
        const [monthB, yearB] = b.split('/');
        return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });

    const data = {
        labels: sortedMonths,
        datasets: [
            {
                label: 'Monthly Income',
                data: sortedMonths.map(month => monthlyIncome[month]),
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                fill: true,
                tension: 0.4,
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
                text: 'Monthly Income Trend'
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

    // Calculate statistics
    const totalMonths = sortedMonths.length;
    const totalIncome = Object.values(monthlyIncome).reduce((a, b) => a + b, 0);
    const averageIncome = totalMonths > 0 ? totalIncome / totalMonths : 0;
    const maxIncome = Math.max(...Object.values(monthlyIncome));
    const minIncome = Math.min(...Object.values(monthlyIncome));

    return (
        <div className="monthly-income-container">
            <div className="income-stats">
                <div className="stat-card">
                    <h3>Average Monthly Income</h3>
                    <p className="stat-value">₹{averageIncome.toFixed(2)}</p>
                </div>
                <div className="stat-card">
                    <h3>Highest Monthly Income</h3>
                    <p className="stat-value">₹{maxIncome.toFixed(2)}</p>
                </div>
                <div className="stat-card">
                    <h3>Lowest Monthly Income</h3>
                    <p className="stat-value">₹{minIncome.toFixed(2)}</p>
                </div>
            </div>
            <div className="income-chart">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default MonthlyIncome; 