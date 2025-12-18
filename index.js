require('dotenv').config(); // Load environment variables if .env file exists
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(cors({
  origin: ['http://localhost:4200', 'https://madrasa-islamia.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- CONNECT TO MONGODB ---
// 👇 CHANGE 2: Look for the Secret Key first. If not found, use the hardcoded link.
const mongoURI = process.env.MONGO_URL || 'mongodb+srv://Emad:sihipur123@madrasa-sihipur.y40rdp3.mongodb.net/?appName=Madrasa-Sihipur'; 

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB Atlas!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- SCHEMA ---
const AdmissionSchema = new mongoose.Schema({
    studentName: String,
    fatherName: String,
    dob: String,
    gender: String,
    contact: String,
    address: String,
    class: String,
    date: { type: Date, default: Date.now }
});

const Admission = mongoose.model('Admission', AdmissionSchema);

// --- ROUTES ---

// 1. Test Route
app.get('/', (req, res) => {
    res.send('Welcome to Madrasa Backend Server!');
});

// 2. GET Route (Fetch Data for Admin)
app.get('/api/admission', async (req, res) => {
    try {
        const students = await Admission.find();
        console.log("Fetching students data...");
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
});

// 3. POST Route (Save Data)
app.post('/api/admission', async (req, res) => {
    try {
        const formData = req.body;
        console.log("Received Data:", formData);
        const newStudent = new Admission(formData);
        await newStudent.save();
        console.log("✅ Data Saved to Database!");
        res.json({ message: "Admission form received and saved!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving data" });
    }
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});