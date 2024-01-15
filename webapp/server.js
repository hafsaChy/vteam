// server.js

const express = require('express');
const path = require('path');
const app = express();
const port = 3003;
app.use('/style', express.static('style/'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/user', (req, res) => {

  res.sendFile(path.join(__dirname, 'public', 'user_info.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
