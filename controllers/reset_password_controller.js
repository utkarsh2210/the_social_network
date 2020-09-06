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