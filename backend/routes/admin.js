const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'thevolvoro@gmail.com';
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Aa12Aa12';
        
        console.log('Login attempt:', { email, providedPassword: password ? '***' : 'empty' });
        console.log('Expected credentials:', { expectedEmail: ADMIN_EMAIL, expectedPassword: ADMIN_PASSWORD ? '***' : 'empty' });
        
        // Check credentials against environment variables
        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            console.log('Login failed: Invalid credentials');
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );
        
        res.json({ 
            token,
            user: { email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
