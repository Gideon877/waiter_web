'use strict'

const _ = require('lodash');
const moment = require('moment');
const SHARED = require('./lib/shared');
const { UserTypes } = require('./lib/constant')

module.exports = (models) => {
    const Shared = SHARED(models);


    const signIn = async (req, res) => {
        const { username, password } = req.body;

        try {
            const checkUser = await Shared.checkUserLoginData(username, password);
            return (checkUser ? Login(username) : Retry(username));
            
            async function Login(username) {
                let user = await Shared.getUserByUsername(username);
                req.session.user = user;
                (user.type == UserTypes.Admin) ? res.redirect('/days') : res.redirect(`/waiters/${user._id}`);
            };
        
            async function Retry(username) {
                req.flash('error', `${username} doesn't exist or you have entered incorrect password!`);
                res.render('signIn');
            };

        } catch (error) {
            return Retry(username);
        };
    };


    const signUp = async (req, res) => {
        const { username } = req.body;
        try {
            let user = await Shared.signUpCheck(req.body);
            console.log('User:', user);
            return (user ? Login() : Retry());

            async function Login(username) {
                let user = await Shared.getUserByUsername(username);
                req.session.user = user;
                (user.type == UserTypes.Admin) ? res.redirect('/days') : res.redirect(`/waiters/${user._id}`);
            };
        
            async function Retry(username) {
                req.flash('error', `${username} doesn't exist or you have entered incorrect password!`);
                res.render('signUp');
            };


        } catch (error) {
            console.log('-----error----', error)
            Retry(username);
        }

    }









    return {
        signUp,
        signIn,
        // addDays,
        // dashBoard,
        // getWaitersDays,
        // resetWeeklyShift
    }
}