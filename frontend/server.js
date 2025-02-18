import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le répertoire actuel de ce fichier
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// For any route, send index.html (important for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend is running on port ${port}`);
});