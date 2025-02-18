import { useState, useEffect } from 'react';
import TransactionList from '../components/TransactionList';
import CategoryPieChart from '../components/CategoryPieChart';
import DashboardSummary from '../components/DashboardSummary';
import BudgetManager from '../components/BudgetManager';
import BudgetComparison from '../components/BudgetComparison';
import MonthlyIncome from '../components/MonthlyIncome';
import MonthlyBudget from '../components/MonthlyBudget';

export default function Home() {
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            // Fetch transactions
            const transResponse = await fetch('/api/transactions');
            const transData = await transResponse.json();
            setTransactions(transData);

            // Fetch budgets
            const budgetResponse = await fetch('/api/budgets');
            const budgetData = await budgetResponse.json();
            setBudgets(budgetData);
        };
        fetchData();
    }, []);

    const handleSaveBudget = async (newBudgets) => {
        try {
            const response = await fetch('/api/budgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBudgets),
            });
            const data = await response.json();
            if (response.ok) {
                setBudgets(data);
            }
        } catch (error) {
            console.error('Error saving budgets:', error);
        }
    };

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <DashboardSummary transactions={transactions} />
            <MonthlyIncome transactions={transactions} />
            <MonthlyBudget transactions={transactions} budgets={budgets} />
            <div className="dashboard-grid">
                <CategoryPieChart transactions={transactions} />
                <BudgetManager onSaveBudget={handleSaveBudget} currentBudgets={budgets} />
                <BudgetComparison transactions={transactions} budgets={budgets} />
            </div>
            <TransactionList transactions={transactions} />
        </div>
    );
}