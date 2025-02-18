import React, { useState } from 'react';
import { CATEGORIES } from '../utils/categories';

const BudgetManager = ({ onSaveBudget, currentBudgets }) => {
    const [budgets, setBudgets] = useState(currentBudgets || {});
    const [error, setError] = useState('');

    const handleBudgetChange = (category, value) => {
        setBudgets(prev => ({
            ...prev,
            [category]: Number(value) || 0
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            // Validate budgets
            const validBudgets = Object.entries(budgets).reduce((acc, [category, amount]) => {
                if (amount > 0) {
                    acc[category] = amount;
                }
                return acc;
            }, {});

            onSaveBudget(validBudgets);
            setError('');
        } catch (error) {
            setError('Failed to save budgets. Please try again.');
        }
    };

    return (
        <div className="budget-manager">
            <h2>Monthly Category Budgets</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                {CATEGORIES.EXPENSE.map(category => (
                    <div key={category} className="budget-item">
                        <label>{category}</label>
                        <input
                            type="number"
                            value={budgets[category] || ''}
                            onChange={(e) => handleBudgetChange(category, e.target.value)}
                            placeholder="Set budget amount"
                            min="0"
                            step="100"
                        />
                    </div>
                ))}
                <button type="submit" className="save-btn">Save Budgets</button>
            </form>
        </div>
    );
};

export default BudgetManager; 