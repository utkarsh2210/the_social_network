const User = require('../models/user');
const Token = require('../models/reset_password_token');
const crypto=require('crypto');
const resetPassMailer = require('../mailers/reset_password_mailer');
const queue = require('../config/kue');
const resetPassWorker = require('../workers/reset_password_worker');

module.exports.email_page = async function(req, res){
    return res.render('forgot_password_email', 
    { 
        title: 'The Social Network' 
    });
}

module.exports.reset_pass_send_mail = async function(req, res){

    let token_string = crypto.randomBytes(20).toString('hex');
    let user = await User.findOne({email: req.body.email});

    if(user)
    {
        let token = await Token.create({
            is_valid: true,
            access_token: token_string,
            user: user
        });

        console.log('##########');
        console.log('token');

        let job = queue.create('reset_pass_email', token).save(function(err){
            if(err){
                console.log('error in creating a queue', err);
                return;
            }

            console.log('job enqueued', job.id);
            req.flash('success', 'Please Check Your Email-id for the reset link');
            return res.redirect('back');
        });

    }else{
        req.flash('success', 'The user does not exist!');
        return res.redirect('back');
    }

}

module.exports.change_password_page = async function(req, res){
    let token_in_link = req.query.access_token;
    let token = await Token.findOne({ access_token: token_in_link });
    if (!token.is_valid)
    {
        return res.redirect('back');
    }
    return res.render('change_password', 
    { 
        title: ' Change Password', 
        access_token: token_in_link 
    });
}

module.exports.changed_password = function(req, res){
    let token_in_link = req.body.access_token;
    let password = req.body.password;
    let confirm_password = req.body.confirm_password;

    if (password!= confirm_password)
    {
        req.flash('error', 'Please enter same password in both the fields!');
        return res.redirect('back');
    }

    if(password=="")
    {
        req.flash('error', 'Please enter a non empty password in both the fields!');
        return res.redirect('back');
    }

    Token.findOneAndUpdate({access_token: token_in_link}, {$set:{is_valid:false}}, function(error, token){
        if(error){
            console.log('Error in finding the token', err);
        }

        if (!token.is_valid)
        {
            return res.redirect('back');
        }

        User.findByIdAndUpdate(token.user, {$set:{password:password}}, function(error, user)
        {
            if(error)
            {
                console.log('Error in finding the user with the provided token!');
                return;
            }
            console.log(user.password, token.is_valid);
            return res.redirect('/users/sign-in');
        });
    });
}