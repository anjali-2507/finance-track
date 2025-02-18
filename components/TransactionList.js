import React from 'react';

const TransactionList = ({ transactions }) => {
    return (
        <div className="transaction-table-container">
            <table className="transaction-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Type</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionList;