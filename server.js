const express = require('express');
const app = express();

app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use(express.urlencoded({extended:true}))
app.post('/submit',(req,res)=>{
  const{name,email,message}=req.body;

  res.send (`
    <h2>Form submitted</h2>
    <p>Name:${name}</p>
    <p>Email:${email}</p>
    <p>Message:${message}</p>
    <a href="/contact.html">Back</a>
    `);
});
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
app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/views/contact.html');
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));
