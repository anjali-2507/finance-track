import React, { useState } from 'react';
import AmountSlider from './AmountSlider';
import { CATEGORIES } from '../utils/categories';

const EditTransactionForm = ({ transaction, onUpdate, onCancel }) => {
    const [formData, setFormData] = useState({
        date: transaction.date,
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        type: transaction.type,
        category: transaction.category || '',
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onUpdate({
                ...transaction,
                ...formData,
                amount: formData.type === 'expense' ? -Math.abs(formData.amount) : Math.abs(formData.amount),
            });
        }
    };

    const validateForm = () => {
        if (!formData.amount || !formData.date || !formData.description) {
            setError('All fields are required.');
            return false;
        }
        if (isNaN(formData.amount) || formData.amount <= 0) {
            setError('Amount must be a positive number.');
            return false;
        }
        setError('');
        return true;
    };

    const handleAmountChange = (value) => {
        setFormData({ ...formData, amount: value });
    };

    return (
        <div className="edit-form-overlay">
            <div className="edit-form-container">
                <h2>Edit Transaction</h2>
                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={formData.date.split('T')[0]}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Amount (₹):</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Type:</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Category:</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        >
                            <option value="">Select a category</option>
                            {formData.type === 'income' 
                                ? CATEGORIES.INCOME.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))
                                : CATEGORIES.EXPENSE.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))
                            }
                        </select>
                    </div>

                    {error && <p className="error">{error}</p>}

                    <div className="form-actions">
                        <button type="submit" className="save-btn">Save</button>
                        <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTransactionForm;