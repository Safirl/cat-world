import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Servir les fichiers statiques de Vite
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all pour retourner l'index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});