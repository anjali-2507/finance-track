import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req, res) {
    const { method } = req;

    try {
        const { db } = await connectToDatabase();
        const collection = db.collection('transactions');

        switch (method) {
            case 'GET':
                try {
                    const transactions = await collection
                        .find({})
                        .toArray();

                    // Convert MongoDB _id to string format
                    const formattedTransactions = transactions.map(transaction => ({
                        ...transaction,
                        _id: transaction._id.toString()
                    }));

                    res.status(200).json(formattedTransactions);
                } catch (error) {
                    console.error('Error fetching transactions:', error);
                    res.status(500).json({ error: 'Failed to fetch transactions' });
                }
                break;

            case 'POST':
                try {
                    const transaction = req.body;
                    const result = await collection.insertOne(transaction);
                    res.status(201).json({
                        success: true,
                        data: {
                            ...transaction,
                            _id: result.insertedId.toString()
                        }
                    });
                } catch (error) {
                    console.error('Error creating transaction:', error);
                    res.status(500).json({ error: 'Failed to create transaction' });
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