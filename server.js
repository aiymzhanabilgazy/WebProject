const express = require('express');
const app = express();
app.use(express.static('public'));
app.use('/images', express.static('images'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});
app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});
app.get('/creativity', (req, res) => {
  res.sendFile(__dirname + '/views/creativity.html');
});
app.get('/locations', (req, res) => {
  res.sendFile(__dirname + '/views/locations.html');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
