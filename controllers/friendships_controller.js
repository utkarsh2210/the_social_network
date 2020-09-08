const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.toggle_friendship = function(req, res){

    let from_id = req.user._id;
    let to_id = req.params.id;

    Friendship.findOne({ $or: [{ from_user: from_id, to_user: to_id }, { from_user: to_id, to_user: from_id }] },
        function (err, friends)
        {
            console.log('###########', friends);
            
            if (err)
            {
                console.log('There was an error in finding the friendship between the users', err);
            }
            if (friends)
            {
                /* updating users database */
                User.findByIdAndUpdate(from_id, { $pull: { friendships: friends._id } }, function (err, data)
                {
                    if (err)
                    {
                        console.log('Error in removing the friendship from the user', err);
                        return;
                    }
                    console.log(data);
                });
                User.findByIdAndUpdate(to_id, { $pull: { friendships: friends._id } }, function (err, data)
                {
                    if (err)
                    {
                        console.log('Error in removing the friendship from the user', err);
                        return;
                    }
                });

                /* updating friendships database */
                Friendship.deleteOne({$or:[{ from_user: from_id, to_user: to_id }, { from_user: to_id, to_user: from_id }]}, function (err)
                {
                    if (err)
                    {
                        console.log('Unable to remove friendship', err);
                        return;
                    }
                    console.log('Deleted Friendship!');
                });
            }
            else
            {
                /* updating friendships database */
                Friendship.create({ from_user: from_id, to_user: to_id }, function (err, new_friend)
                {
                    if (err)
                    {
                        console.log('There was an error in creating a friendship!', err);
                    }
                    new_friendship.save();
                    /* updating users database */
                    User.findByIdAndUpdate(from_id, { $push: { friendships: new_friend._id } }, function (err, data)
                    {
                        if (err)
                        {
                            console.log('Error in adding the friendship to the user database', err);
                            return;
                        }
                        console.log(data);
                    });
                    User.findByIdAndUpdate(to_id, { $push: { friendships: new_friend._id } }, function (err, data)
                    {
                        if (err)
                        {
                            console.log('Error in adding the friendship to the user database', err);
                            return;
                        }
                        console.log(data);
                    });
                });
            }
            return res.redirect('back');
        });
}