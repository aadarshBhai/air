const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://air:VOLVOROANURAG098@cluster0.lts5rjd.mongodb.net/air?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI).then(async () => {
  console.log('✅ Connected to MongoDB');
  const products = await Product.find({}).limit(5).lean();
  console.log(`\n📦 Found ${products.length} products:\n`);
  
  products.forEach((p, i) => {
    console.log(`${i + 1}. Product: ${p.name}`);
    console.log(`   ID: ${p._id}`);
    console.log(`   Images array:`, JSON.stringify(p.images, null, 2));
    console.log(`   Images count: ${Array.isArray(p.images) ? p.images.length : 0}`);
    if (p.image) {
      console.log(`   Single image field: ${p.image}`);
    }
    console.log('');
  });
  
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

