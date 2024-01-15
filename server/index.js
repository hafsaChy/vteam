// const dotenv = require('dotenv');
// dotenv.config({ path: './.env' });
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./auth');
const axios = require('axios');
// const axios = GitHubStrategy.Strategy.prototype._oauth2;
const cors = require('cors'); // Import the cors middleware

const userRoutes = require('./routes/userRoutes');
const cityRoutes = require('./routes/cityRoutes');
const stationRoutes = require('./routes/stationRoutes');
const scooterRoutes = require('./routes/scooterRoutes');
const receiptRoutes = require('./routes/receiptRoutes');

const app = express();
const port = 3050;

app.use(passport.initialize());
// app.use(passport.session());
app.use(cors()); // Use cors middleware
app.use(bodyParser.json());
app.use(session({ secret: 'xFee9VAijC', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Redirect to GitHub for authentication
app.get('/auth/github', passport.authenticate('github'));


// GitHub callback handler
app.get('/auth/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      const code = req.query.code;
      console.log('Authorization Code:', code);
      console.log('Request URL:', req.originalUrl);
      console.log('Request Headers:', req.headers);
      console.log('Request Parameters:', req.query);

      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        null,
        {
          params: {
            client_id: 'f2722ea4e63a5cd59e2f',
            client_secret: '5aed2122ad6089b1d3a0449e8902a8baff975495',
            code: code,
            redirect_uri: 'http://localhost:3050/auth/callback',
            grant_type: 'authorization_code',
          },
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      console.log('Token Response:', tokenResponse.data);
      const accessToken = tokenResponse.data.access_token;

      if (accessToken) {
        console.log('Access Token:', accessToken);
        // Now, we can use the accessToken to make requests to the GitHub API or save it as needed.
        res.redirect('/');
      } else {
        console.error('Access Token not received in the response.');
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } catch (error) {
      console.error('Error exchanging authorization code for access token:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

app.get('/', (req, res) => {
    try {
        res.json(['Svenska Elsparkcyklar AB']);
    } catch (error) {
        console.error('Error in GET /:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use('/elcyckel/v1/users', userRoutes);
app.use('/elcyckel/v1/cities', cityRoutes);
app.use('/elcyckel/v1/stations', stationRoutes);
app.use('/elcyckel/v1/scooters', scooterRoutes);
app.use('/elcyckel/v1/receipt', receiptRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
