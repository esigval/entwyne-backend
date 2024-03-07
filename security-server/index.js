import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/password-reset', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'password-reset.html'));
});

app.get('/new-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'new-password.html'));
});

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});