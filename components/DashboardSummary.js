import React from 'react';

const DashboardSummary = ({ transactions }) => {
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netBalance = totalIncome - totalExpenses;

    const categoryBreakdown = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            if (t.category) {
                acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
            }
            return acc;
        }, {});

    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    return (
        <div className="dashboard-summary">
            <div className="summary-card total-income">
                <h3>Total Income</h3>
                <p className="amount income">₹{totalIncome.toFixed(2)}</p>
            </div>

            <div className="summary-card total-expenses">
                <h3>Total Expenses</h3>
                <p className="amount expense">₹{totalExpenses.toFixed(2)}</p>
            </div>

            <div className="summary-card net-balance">
                <h3>Net Balance</h3>
                <p className={`amount ${netBalance >= 0 ? 'income' : 'expense'}`}>
                    ₹{Math.abs(netBalance).toFixed(2)}
                </p>
            </div>

            <div className="summary-card category-breakdown">
                <h3>Category Breakdown</h3>
                <ul>
                    {Object.entries(categoryBreakdown).map(([category, amount]) => (
                        <li key={category}>
                            <span>{category}:</span>
                            <span>₹{amount.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="summary-card recent-transactions">
                <h3>Recent Transactions</h3>
                <ul>
                    {recentTransactions.map(t => (
                        <li key={t._id}>
                            <span>{new Date(t.date).toLocaleDateString()}</span>
                            <span>{t.description}</span>
                            <span className={t.type}>₹{Math.abs(t.amount).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DashboardSummary; 