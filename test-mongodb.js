import mongoose from 'mongoose';

// Use the connection string directly for testing
const MONGODB_URI = 'mongodb+srv://volvoro:VOLVOROANURAG098@cluster0.lts5rjd.mongodb.net/air?retryWrites=true&w=majority&appName=Cluster0';

console.log('Testing MongoDB connection...');
console.log('Connection string:', MONGODB_URI);

async function testConnection() {
    try {
        console.log('Attempting to connect...');
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
        
        console.log('✅ Successfully connected to MongoDB!');
        console.log('Database name:', mongoose.connection.name);
        
        // List all collections to verify access
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nCollections in the database:');
        collections.forEach(coll => console.log(`- ${coll.name}`));
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error);
        process.exit(1);
    }
}

testConnection();
