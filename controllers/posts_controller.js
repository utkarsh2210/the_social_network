const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr){
            
            post = await post.populate('user','name updatedAt').execPopulate();
            
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');
    }catch(err){
        req.flash('Error', err);
        return res.redirect('back');
    }

}

module.exports.destroy = async function(req, res){
    
    try{
        let post = await Post.findById(req.params.id);
        // .id means converting the object _id to string
        if(post.user == req.user.id){

            // delete likes on the post as well the likes on the comments of that post
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            
            post.remove();

            await Comment.deleteMany({post: req.params.id});
            
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            req.flash('success', 'Post and associated comments deleted');
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', 'You cant delete this post');
        return res.redirect('back');
    }
}