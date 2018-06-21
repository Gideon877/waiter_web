"use strict";
const moment = require('moment');
const bcrypt = require('bcrypt');
const _ = require('lodash');

module.exports = function(models) {
    const mongoDB = models.Waiter;
    const userLogin = (req, res, done) => {
        const body = req.body;
        (req.session && req.session.user) ? res.redirect('/') : verifyUser(body, { res, req, done });
    }
    function verifyUser (body, argument) {
        let { username, password } = body;
        let { req, res, done } = argument;

        mongoDB.findOne({ username }, (err, user) => {
            if (err) return done(err);

            (!user) ? ( 
                req.flash('error', 'Username does not exist!') && 
                res.render('login')
            ) : 
            ( 
                bcrypt.compare(password, user.password, function(err) {
                    if (err)
                        return done(err);
                    if (result) {
                        req.session.user = user;
                        res.redirect('/');
                    } else {
                        console.log('Password Failed');
                        req.flash('error', 'Incorrect Password');
                        res.render('login');
                    }
                })
            )

        })

    }


    return {
        userLogin
    }
}