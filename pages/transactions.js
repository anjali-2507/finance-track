import { useState, useEffect } from 'react';
import AddTransactionForm from '../components/AddTransactionForm';

export default function Transactions() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await fetch('/api/transactions');
            const data = await response.json();
            setTransactions(data);
        };
        fetchTransactions();
    }, []);

    const handleAddTransaction = (transaction) => {
        setTransactions([...transactions, transaction]);
        setShowAddForm(false);
    };

    return (
        <div className="transactions-page">
            <div className="page-header-with-button">
                <h1>Transactions</h1>
                <button 
                    className="add-transaction-button"
                    onClick={() => setShowAddForm(true)}
                >
                    + Add Transaction
                </button>
            </div>

            <div className="transaction-table-container">
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                <td>{transaction.description}</td>
                                <td className={transaction.type === 'expense' ? 'expense' : 'income'}>
                                ₹{Math.abs(transaction.amount).toFixed(2)}
                                </td>
                                <td>{transaction.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Add New Transaction</h2>
                            <button 
                                className="close-button"
                                onClick={() => setShowAddForm(false)}
                            >
                                ×
                            </button>
                        </div>
                        <AddTransactionForm 
                            onAdd={handleAddTransaction}
                            onClose={() => setShowAddForm(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
} 