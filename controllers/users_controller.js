const User = require('../models/user');



module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', { 
            title: "Profile Page",
            profile_user: user
        });
    });
    
 
}

module.exports.update = function(req, res){
    if(req.user.id == req.params.id){
        req.flash('success', 'Profile Updated!');
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            return res.redirect('back');
        });
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    
    return res.render('user_sign_up', {
        title: "Network | Sign Up"
    });
}

// render the sign in page
module.exports.signIn = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Network | Sign In"
    });
}

// get the sign up data
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        req.flash('error', "Passwords Do Not Match!");
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err)
        {
            console.log('Error in finding user in signing up');
            return;
        }

        if(!user){
            User.create(req.body, function(err, user){
                if(err)
                {
                    console.log('Error in creating user while signing up');
                    return;
                }
                req.flash('success', 'Successfully Signed Up!');
                return res.redirect('/users/sign-in');
            });
        }else{
            req.flash('error', "Email Already Taken");
            return res.redirect('back');
        }

    });
}

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out');

    return res.redirect('/');
}