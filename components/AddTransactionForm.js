import React, { useState } from 'react';
import { CATEGORIES } from '../utils/categories';

const AddTransactionForm = ({ onAdd, onClose }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        type: 'expense',
        category: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const newTransaction = {
                    ...formData,
                    amount: formData.type === 'expense' ? 
                        -Math.abs(Number(formData.amount)) : 
                        Math.abs(Number(formData.amount))
                };

                const response = await fetch('/api/transactions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newTransaction)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    onAdd(data.data); // Pass the newly created transaction back
                    onClose();
                } else {
                    setError(data.error || 'Failed to add transaction');
                }
            } catch (error) {
                console.error('Error adding transaction:', error);
                setError('Failed to add transaction. Please try again.');
            }
        }
    };

    const validateForm = () => {
        if (!formData.amount || !formData.date || !formData.description || !formData.category) {
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

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-scrollable">
                <div className="modal-header">
                    <h2>Add New Transaction</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Date:</label>
                            <input
                                type="date"
                                value={formData.date}
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
                                placeholder="Enter description"
                            />
                        </div>

                        <div className="form-group">
                            <label>Amount (₹):</label>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                                placeholder="Enter amount"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label>Type:</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ 
                                    ...formData, 
                                    type: e.target.value,
                                    category: '' // Reset category when type changes
                                })}
                                required
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
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

                        <div className="button-group">
                            <button type="submit" className="save-btn">Add Transaction</button>
                            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTransactionForm;
