const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/user');


passport.serializeUser((user, done)=>{//para almacenar en el navegador
    done(null, user.id);
});

passport.deserializeUser( async (id, done)=>{//para buscar la id de sesion que esta ene l anvegador
    const user = await User.findById(id);
    done(null, user);
});



passport.use('local-signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done)=>{

    const user = await User.findOne({email: email})
    if (user) {
        return done(null, false, req.flash('signupMessage', ' The email is alredy taken'));
    }else{
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
    }
}));


passport.use('local-signin', new localStrategy({
    //esto son los datos de cuando una persona se loguea desde el html, es decir son los inputs
    //por eso se le dice 'email', porque ene l input hay un campo llamado email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done)=>{
    const user =  await User.findOne({email: email});
    if (!user) {
        return done(null, false, req.flash('signinMessage', 'No User found'));
    }
    if (!user.comparePassword(password)) {
        return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
    }

    done(null, user)
}))