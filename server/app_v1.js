// app.js
const express = require('express');
const session = require('express-session');
const passport = require('./auth');
const app = express();
const port = 3004;

app.use(
    session({
        secret: 'xFee9VAijC',
        resave: true,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Define a route for the homepage
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`<h1>Hello, ${req.user.displayName}!</h1><a href="/logout">Logout</a>`);
    } else {
        res.send('<h1>Welcome to My Express Webpage! Please <a href="/auth/github">Login with GitHub</a></h1>');
    }
});

// GitHub authentication route
app.get('/auth/github', passport.authenticate('github'));

// GitHub callback handler
app.get('/auth/callback', (req, res, next) => {
    console.log('GitHub callback handler executed');
    passport.authenticate('github', { failureRedirect: '/' })(req, res, next);
}, (req, res) => {
    console.log('Authentication successful');
    res.redirect('/');
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
