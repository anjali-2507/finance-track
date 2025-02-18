import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyExpensesChart = ({ transactions }) => {
    const monthlyData = {};

    transactions.forEach(transaction => {
        const month = new Date(transaction.date).toLocaleString('default', { month: 'long' });
        if (!monthlyData[month]) {
            monthlyData[month] = 0;
        }
        monthlyData[month] += transaction.amount;
    });

    const data = Object.keys(monthlyData).map(month => ({
        name: month,
        amount: monthlyData[month],
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default MonthlyExpensesChart;