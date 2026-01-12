import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: true
}));

// Handle all routes by serving index.html (for React Router SPA)
app.get('*', (req, res) => {
  const indexPath = join(__dirname, 'dist', 'index.html');
  
  if (!existsSync(indexPath)) {
    return res.status(404).send('Build files not found. Please run npm run build first.');
  }
  
  try {
    const indexHtml = readFileSync(indexPath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(indexHtml);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Error loading application');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving static files from: ${join(__dirname, 'dist')}`);
});
