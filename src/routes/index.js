const express = require('express');

const {Router} = require('express');

const router = Router();

const passport = require('passport');


//Primera ruta: Ruta inicial
router.get('/', (req, res, next)=>{
    res.render('index');
});


//Ruta para mostrar la ventada de resgitro
router.get('/signup', (req, res, next)=>{
    res.render('signup')
});

//Ruta para enviar los datos de registro
router.post('/signup',passport.authenticate('local-signup',{
    successRedirect:'/profile',
    failureRedirect:'/signup',
    passReqToCallback: true
}));



//Ventada de login
router.get('/signin', (req, res, next)=>{
    res.render('signin')
});

//Ruta para enviar los datos de login
router.post('/signin',passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
}));



router.get('/logout', (req, res, next)=>{
    req.logout(function(err){
        if (err){return next(err);}
        res.redirect('/');
    });
});

router.use((req, res, next)=>{
    isAuthenticated(req, res, next);
    next();
})


router.get('/profile', (req, res, next)=>{
    res.render('profile');
})


function isAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;