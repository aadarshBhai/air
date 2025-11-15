const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

async function createAdmin() {
    try {
        // Force MongoDB Atlas connection
        const MONGODB_URI = 'mongodb+srv://volvoro:VOLVOROANURAG098@cluster0.lts5rjd.mongodb.net/air?retryWrites=true&w=majority';
        
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        
        console.log('Connected to MongoDB');
        
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }
        
        // Create new admin
        const admin = new Admin({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        });
        
        await admin.save();
        console.log('Admin created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
