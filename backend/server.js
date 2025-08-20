const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors({ origin: 'http://localhost:4200'})); // Enables cross-origin requests from your Angular app

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, company, message } = req.body;

    // Create a Nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        // Send the email
        await transporter.sendMail({
            from: `"Sweta's Portfolio" <${process.env.EMAIL_USER}>`,
            to: process.env.RECIPIENT_EMAIL, 
            subject: `New Contact from Portfolio: ${name}`,
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${company}</p>
                <p><strong>Message:</strong> ${message}</p>
            `,
        });
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send message.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});