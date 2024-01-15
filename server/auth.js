// auth.js
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const { findUserById, findUserByGitHubId, createUser } = require('./maria_db/userQueries');


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

module.exports = passport;
