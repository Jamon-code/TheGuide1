const express = require('express');
const cors = require('cors');
require('dotenv').config();

const planRoutes = require('./routes/planRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/plan', planRoutes);
app.use('/api/services', serviceRoutes);  // ← NOUVELLE ROUTE

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API TheGuide is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/plan/generate`);
  console.log(`API modify endpoint: http://localhost:${PORT}/api/plan/modify`);
  console.log(`API services add: http://localhost:${PORT}/api/services/add`);
});