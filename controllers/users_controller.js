const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Friendship = require('../models/friendship');


module.exports.profile = function(req, res){

    User.findById(req.params.id, function(err, user){

        let are_friends = false;

        Friendship.findOne({ $or: [{ from_user: req.user._id, to_user: req.params.id },
            { from_user: req.params.id, to_user: req.user._id }]
        }, function (error, friendship)
        {
            if (error)
            {
                console.log('There was an error in finding the friendship', error);
                return;
            }
            if (friendship)
            {
                are_friends = true;
            }
        

            return res.render('user_profile', { 
                title: "Profile Page",
                profile_user: user,
                are_friends: are_friends
            });

        });

    });
    
 
}

module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     req.flash('success', 'Profile Updated!');
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         return res.redirect('back');
    //     });
    // }else{
    //     req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id){

        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('********Multer Error: ', err);
                }

                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){

                    if(user.avatar){
                        if(fs.existsSync(path.join(__dirname, '..', user.avatar)))
                        {
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        }
                        
                    }

                    //this is saving the path of uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err)
            return res.redirect('back');

        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
        

    }




}

// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect(`/users/profile/${req.user._id}`);
    }
    
    return res.render('user_sign_up', {
        title: "Network | Sign Up"
    });
}

// render the sign in page
module.exports.signIn = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect(`/users/profile/${req.user._id}`);
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