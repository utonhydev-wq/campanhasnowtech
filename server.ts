import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'campaigns_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Health Check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'NowTech Solar Campaign Management API',
    });
  });

  // Get Store
  app.get('/api/store', (_req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        res.json(JSON.parse(raw));
      } else {
        res.json({ empty: true });
      }
    } catch (err) {
      console.error('Error reading store:', err);
      res.status(500).json({ error: 'Failed to read data store' });
    }
  });

  // Save / Sync Store
  app.post('/api/store', (req, res) => {
    try {
      const data = req.body;
      if (!data || typeof data !== 'object') {
        res.status(400).json({ error: 'Invalid data format' });
        return;
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
      res.json({ success: true, timestamp: new Date().toISOString() });
    } catch (err) {
      console.error('Error saving store:', err);
      res.status(500).json({ error: 'Failed to save data store' });
    }
  });

  // Reset store to seeds if requested
  app.post('/api/store/reset', (_req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        fs.unlinkSync(DATA_FILE);
      }
      res.json({ success: true, message: 'Store reset to defaults' });
    } catch (err) {
      console.error('Error resetting store:', err);
      res.status(500).json({ error: 'Failed to reset store' });
    }
  });

  // Mount Vite middleware in development
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NowTech Solar server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
