// const dotenv = require('dotenv');
// dotenv.config({ path: './.env' });
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const axios = require('axios');
// const axios = GitHubStrategy.Strategy.prototype._oauth2;
const cors = require('cors'); // Import the cors middleware



const userRoutes = require('./routes/userRoutes');
const cityRoutes = require('./routes/cityRoutes');
const stationRoutes = require('./routes/stationRoutes');
const scooterRoutes = require('./routes/scooterRoutes');
const { findUserById, findUserByGitHubId, createUser } = require('./maria_db/userQueries');

const app = express();
const port = 3050;

app.use(cors()); // Use cors middleware
app.use(bodyParser.json());
app.use(session({ secret: 'xFee9VAijC', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new GitHubStrategy({
    clientID: 'f2722ea4e63a5cd59e2f',
    clientSecret: '5aed2122ad6089b1d3a0449e8902a8baff975495',
    callbackURL: 'http://localhost:3050/auth/callback',
    authorizationURL: 'https://github.com/login/oauth/authorize',
    tokenURL: 'https://github.com/login/oauth/access_token'
}, async (accessToken, refreshToken, profile, done) => {
    console.log('GitHub authentication callback executed');
    try {
        const existingUser = await findUserByGitHubId(profile.id);

        if (existingUser) {
            return done(null, existingUser);
        } else {
            const newUser = {
                githubId: profile.id,
                username: profile.username,
                email: profile.email || '',
                // ... other relevant user properties
            };
            console.log('New User:', newUser);

            const createdUser = await createUser(newUser);
            return done(null, createdUser);
        }
    } catch (error) {
        return done(error);
    }
}));

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

passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, Number(user.user_id));  // Convert BigInt to number
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await findUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

app.get('/', (req, res) => {
    try {
        res.json(['Svenska Elsparkcyklar AB']);
    } catch (error) {
        console.error('Error in GET /:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Redirect to GitHub for authentication
// app.get('/auth/github', passport.authenticate('github'));

// // GitHub callback handler
// app.get('/auth/callback',
//     passport.authenticate('github', { failureRedirect: '/' }),
//     (req, res) => {
//         // Log the authorization code
//         console.log('Authorization Code:', req.query.code);

//         // Successful authentication, redirect to the home page or a profile page
//         res.redirect('/');
//     }
// );

app.use('/elcyckel/v1/users', userRoutes);
app.use('/elcyckel/v1/cities', cityRoutes);
app.use('/elcyckel/v1/stations', stationRoutes);
app.use('/elcyckel/v1/scooters', scooterRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
