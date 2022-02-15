import {Router} from "express"
import passport from "passport";

const router = Router({mergeParams: true})

//passport local
router.post('/login',
    passport.authenticate('local', {failureRedirect: '/'}),
    function (req, res) {
        res.redirect('/dashboard');
    });

//passport google
router.get('/google', passport.authenticate('google', {scope: ['profile']}));
router.get('/google/callback', passport.authenticate('google', {
        failureRedirect: '/'
    }), (req, res) => {
        res.redirect('/dashboard')
    }
);

//passport telegram
router.get('/telegram',
    passport.authenticate('telegram', {failureRedirect: '/'}),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
    });

//logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})


export default router
