const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// ---------- MODELS ----------

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: String,
  destination: String,
  description: String,
  price: Number,
  originalPrice: Number,
  duration: String,
  groupSize: String,
  difficulty: { type: String, default: 'Easy' },
  category: { type: String, default: 'Adventure' },
  highlights: [String],
  itinerary: [{
    day: Number,
    title: String,
    details: String
  }],
  inclusions: [String],
  exclusions: [String],
  images: [String],
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  message: String,
  interestedPackage: String,
  source: { type: String, default: 'popup' },
  page: String,
  status: { type: String, default: 'new' },
  adminNotes: String,
  createdAt: { type: Date, default: Date.now }
});

const Package = mongoose.model('Package', packageSchema);
const Lead = mongoose.model('Lead', leadSchema);

// ---------- PACKAGE ROUTES ----------

// Get all active packages
app.get('/api/packages', async (req, res) => {
  try {
    const { category, search, featured, sort } = req.query;
    let query = { isActive: true };

    if (category && category !== 'all') query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const packages = await Package.find(query).sort(sortOption);
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single package
app.get('/api/packages/:slug', async (req, res) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug, isActive: true });
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- LEAD ROUTES ----------

// Submit lead (popup form)
app.post('/api/leads', async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json({ success: true, message: 'Lead saved!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- ADMIN ROUTES ----------

// Admin auth middleware
const adminAuth = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Get all leads (admin)
app.get('/api/admin/leads', adminAuth, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update lead status (admin)
app.patch('/api/admin/leads/:id', adminAuth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete lead (admin)
app.delete('/api/admin/leads/:id', adminAuth, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all packages (admin - includes inactive)
app.get('/api/admin/packages', adminAuth, async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add package (admin)
app.post('/api/admin/packages', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    if (req.files) {
      data.images = req.files.map(f => `/uploads/${f.filename}`);
    }
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const pkg = new Package(data);
    await pkg.save();
    res.status(201).json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update package (admin)
app.put('/api/admin/packages/:id', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => `/uploads/${f.filename}`);
    }
    if (data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    const pkg = await Package.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete package (admin)
app.delete('/api/admin/packages/:id', adminAuth, async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard stats (admin)
app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'new' });
    const calledLeads = await Lead.countDocuments({ status: 'called' });
    const confirmedLeads = await Lead.countDocuments({ status: 'confirmed' });
    const totalPackages = await Package.countDocuments();
    const activePackages = await Package.countDocuments({ isActive: true });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayLeads = await Lead.countDocuments({ createdAt: { $gte: todayStart } });

    res.json({
      totalLeads, newLeads, calledLeads, confirmedLeads,
      totalPackages, activePackages, todayLeads
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create uploads folder
const fs = require('fs');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//mongoose.connect(process.env.MONGO_URI)
