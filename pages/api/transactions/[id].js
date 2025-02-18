import { connectToDatabase } from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const { method, query: { id } } = req;

    if (!id) {
        return res.status(400).json({ success: false, error: 'No ID provided' });
    }

    try {
        const { db } = await connectToDatabase();
        const collection = db.collection('transactions');

        // Convert string ID to MongoDB ObjectId format
        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID format'
            });
        }

        switch (method) {
            case 'PUT':
                try {
                    const updatedData = req.body;
                    delete updatedData._id; // Remove _id from update data

                    const result = await collection.findOneAndUpdate(
                        { _id: objectId },
                        { $set: updatedData },
                        { returnDocument: 'after' }
                    );

                    if (result.value) {
                        return res.status(200).json({
                            success: true,
                            data: {
                                ...result.value,
                                _id: result.value._id.toString()
                            }
                        });
                    } else {
                        return res.status(404).json({
                            success: false,
                            error: 'Transaction not found'
                        });
                    }
                } catch (error) {
                    console.error('Update error:', error);
                    return res.status(400).json({
                        success: false,
                        error: error.message
                    });
                }
                break;

            case 'DELETE':
                try {
                    console.log('Attempting to delete transaction with ID:', id);
                    
                    const result = await collection.deleteOne({ 
                        _id: objectId 
                    });

                    console.log('Delete result:', result);

                    if (result.deletedCount === 1) {
                        return res.status(200).json({
                            success: true,
                            message: 'Transaction deleted successfully'
                        });
                    } else {
                        return res.status(404).json({
                            success: false,
                            error: 'Transaction not found'
                        });
                    }
                } catch (error) {
                    console.error('Delete operation error:', error);
                    return res.status(500).json({
                        success: false,
                        error: error.message
                    });
                }
                break;

            default:
                res.setHeader('Allow', ['PUT', 'DELETE']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error',
            details: error.message
        });
    }
} 