const Post = require('../models/post');
const User = require('../models/user');
const Friendship = require('../models/friendship');
//module.exports.functionName = function(req, res) {}

module.exports.home = async function(req, res){
    // console.log(req.cookies);
    // res.cookie('user_id', 25);

    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title: "Home",
    //         posts: posts
    //     });
    // });

    // populate the user of each post
    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
            // populate: {
            //     path: 'likes'
            // }
        }).populate('likes');

        let users = await User.find({});

        let friends = new Array();
        if (req.user)
        {
            let all_friendships = await Friendship.find({ $or: [{ from_user: req.user._id }, { to_user: req.user._id }] })
                .populate('from_user')
                .populate('to_user');

            for (let all of all_friendships)
            {
                if (all.from_user._id.toString() == req.user._id.toString())
                {
                    friends.push({
                        friend_name: all.to_user.name,
                        friend_id: all.to_user._id,
                        friend_avatar: all.to_user.avatar
                    });
                }
                else if (all.to_user._id.toString() == req.user._id.toString())
                {
                    friends.push({
                        friend_name: all.from_user.name,
                        friend_id: all.from_user._id,
                        friend_avatar: all.from_user.avatar
                    });
                }
            }
        }


        return res.render('home', {
            title: "Home",
            posts: posts,
            all_users: users,
            all_friends: friends
        }); 

    }catch(err){
        console.log('Error', err);
        return;
    }
}
