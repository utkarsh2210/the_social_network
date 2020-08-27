module.exports.profile = function(req, res){
    res.render('user_profile', { 
        title: "Profile Page"
    });
}

// render the sign up page
module.exports.signUp = function(req, res){
    res.render('user_sign_up', {
        title: "Network | Sign Up"
    });
}

// render the sign in page
module.exports.signIn = function(req, res){
    res.render('user_sign_in', {
        title: "Network | Sign In"
    });
}

// get the sign up data
module.exports.create = function(req, res){
    //TODO later
}

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    //TODO later
}