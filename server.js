// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle form submission
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email provider (e.g., Gmail, Outlook)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `New Query from ${name} via Contact Form`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Message sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('There was an error sending your message.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
