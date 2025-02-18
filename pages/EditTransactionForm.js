import { useState, useEffect } from 'react';
import AmountSlider from '../components/AmountSlider';
import EditTransactionForm from '../components/EditTransactionForm';

export default function EditTransactionFormPage() {
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const fetchTransactions = async () => {
        const response = await fetch('/api/transactions');
        const data = await response.json();
        setTransactions(data);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleUpdate = async (updatedTransaction) => {
        try {
            const response = await fetch(`/api/transactions/${updatedTransaction._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTransaction),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Refresh the transactions list after successful update
                    await fetchTransactions();
                    setSelectedTransaction(null);
                    console.log('Transaction updated successfully');
                } else {
                    console.error('Failed to update transaction:', data.error);
                    alert('Failed to update transaction: ' + (data.error || 'Unknown error'));
                }
            } else {
                console.error('Failed to update transaction');
                alert('Failed to update transaction. Please try again.');
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
            alert('Error updating transaction. Please try again.');
        }
    };

    const handleDelete = async (transactionId) => {
        if (!transactionId) {
            console.error('No transaction ID provided');
            return;
        }

        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                console.log('Deleting transaction with ID:', transactionId);
                
                const response = await fetch(`/api/transactions/${transactionId}`, {
                    method: 'DELETE'
                });

                const data = await response.json();
                
                if (response.ok && data.success) {
                    // Refresh the transactions list after successful deletion
                    const updatedResponse = await fetch('/api/transactions');
                    const updatedTransactions = await updatedResponse.json();
                    setTransactions(updatedTransactions);
                    console.log('Transaction deleted successfully');
                } else {
                    const errorMessage = data.error || 'Unknown error';
                    console.error('Failed to delete transaction:', errorMessage);
                    alert('Failed to delete transaction: ' + errorMessage);
                }
            } catch (error) {
                console.error('Error during delete operation:', error);
                alert('Error deleting transaction. Please try again.');
            }
        }
    };

    return (
        <div className="edit-page">
            <div className="page-header">
                <h1>Edit Transactions</h1>
                <p>Select a transaction to edit or delete</p>
            </div>

            <div className="transaction-table-container">
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                <td>{transaction.description}</td>
                                <td>{transaction.category}</td>
                                <td className={transaction.type === 'expense' ? 'expense' : 'income'}>
                                    ₹{Math.abs(transaction.amount).toFixed(2)}
                                </td>
                                <td>{transaction.type}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => setSelectedTransaction(transaction)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(transaction._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedTransaction && (
                <div className="edit-form-overlay">
                    <div className="edit-form-container">
                        <div className="modal-header">
                            <h2>Edit Transaction</h2>
                            <button 
                                className="close-button"
                                onClick={() => setSelectedTransaction(null)}
                            >
                                ×
                            </button>
                        </div>
                        <EditTransactionForm
                            transaction={selectedTransaction}
                            onUpdate={handleUpdate}
                            onCancel={() => setSelectedTransaction(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
} 