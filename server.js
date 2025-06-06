const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const cors = require('cors')

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Path to JSON file to store appointments
const DATA_FILE = path.join(__dirname, 'appointments.json');

// Helper function to read appointments from file
function readAppointments() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading appointments:', err);
    return [];
  }
}

// Helper function to write appointments to file
function writeAppointments(appointments) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(appointments, null, 2));
  } catch (err) {
    console.error('Error writing appointments:', err);
  }
}

// API endpoint to receive appointment submissions
app.post('/api/appointments', (req, res) => {
  const { name, email, serviceType, address } = req.body;
  if (!name || !email || !serviceType || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const appointments = readAppointments();
  const newAppointment = {
    id: Date.now(),
    name,
    email,
    serviceType,
    address,
    createdAt: new Date().toISOString()
  };
  appointments.push(newAppointment);
  writeAppointments(appointments);
  // Redirect to appointment.html with query params for confirmation
  const query = `?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&serviceType=${encodeURIComponent(serviceType)}&address=${encodeURIComponent(address)}`;
  res.redirect('/appointment.html' + query);
});

const allowedOrigins=[
  'https://lamelo05.github.io']

app.use(cors({
  origin:allowedOrgins,
  methods:['post']
}))

// API endpoint to get all appointments
app.get('/api/appointments', (req, res) => {
  const appointments = readAppointments();
  res.json(appointments);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
