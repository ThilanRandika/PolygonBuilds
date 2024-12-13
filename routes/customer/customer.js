// Import required packages
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../../models/customer/Customer'); // Adjust the path as necessary

const router = express.Router();

// Secret key for JWT (store in environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const SALT_ROUNDS = 10; // Number of bcrypt salt rounds

/**
 * Registration Route
 * POST /register
 */
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, mobile, password } = req.body;

        // Check if the email already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create a new customer
        const newCustomer = new Customer({
            first_name,
            last_name,
            email,
            mobile,
            password: hashedPassword
        });

        // Save the customer to the database
        await newCustomer.save();

        res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

/**
 * Login Route
 * POST /login
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the customer by email
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: customer._id, email: customer.email },
            JWT_SECRET, // Token expiration time
            { expiresIn: '7d' } // Token expires in 7 days
        );

        res
        .cookie("access_token", token, {
            httpOnly: true,    // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            path: '/',         // Makes the cookie accessible on all routes
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        }).status(200).json({
            message: 'Login successful!',
            user:customer
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

module.exports = router;
