import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const { method } = req;

    try {
        const { db } = await connectToDatabase();
        const collection = db.collection('budgets');

        switch (method) {
            case 'GET':
                try {
                    // Get the latest budget document
                    const budget = await collection
                        .findOne({}, { sort: { _id: -1 } });

                    res.status(200).json(budget?.budgets || {});
                } catch (error) {
                    console.error('Error fetching budgets:', error);
                    res.status(500).json({ error: 'Failed to fetch budgets' });
                }
                break;

            case 'POST':
                try {
                    const newBudgets = req.body;
                    
                    // Insert new budget document
                    const result = await collection.insertOne({
                        budgets: newBudgets,
                        createdAt: new Date()
                    });

                    if (result.acknowledged) {
                        res.status(201).json(newBudgets);
                    } else {
                        throw new Error('Failed to save budgets');
                    }
                } catch (error) {
                    console.error('Error saving budgets:', error);
                    res.status(500).json({ error: 'Failed to save budgets' });
                }
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
} 