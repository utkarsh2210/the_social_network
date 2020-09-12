
    // let createComment = function(){
        
    //     let newCommentForm = $(`#new-comment-form`);
    //     newCommentForm.submit(function(e){
    //         e.preventDefault();

    //         $.ajax({
    //             type: 'post',
    //             url: '/comments/create',
    //             data: newCommentForm.serialize(),
    //             success: function(data){
    //                 let newComment = newCommentDom(data.data.comment);
    //                 // console.log(data.data.comment);
    //                 $(`#post-comments-${data.data.comment.post}`).prepend(newComment);
    //             }, error: function(error){
    //                 console.log(error);
    //             }

    //         });
    //     });
    // }

    // // method to create a coomend in DOM
    // let newCommentDom = function(comment){
    //     return $(`<li id="comment-${ comment._id }">
    //         <p>
    //             <small>
    //                 <a href="/comments/destroy/${ comment._id }">X</a>
    //             </small>
    //             ${ comment.content }
    //             <br>
    //             <small>
    //                 ${ comment.user.name }
    //             </small>
    //         </p>
    //     </li>`)

    // }
    // // Comments();
    // createComment();


// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }


    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                   
                    pSelf.deleteComment($('.delete-comment-button', newComment));

                    new ToggleLike($(' .toggle-like-button', newComment));
                    flash_msg('success', 'Comment Published!');

                }, error: function(error){
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment){
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<div id="comment-${comment._id}">
        <div class="dropdown">
            <a class="float-right" href="" id="more_options_${comment._id}" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-ellipsis-h"></i>
            </a>
            <div class="dropdown-menu" aria-labelledby="more_options_${comment._id}">
                <a class="dropdown-item delete-comment-button" href="/comments/destroy/${comment._id}"><i
                        class="fas fa-trash-alt"></i>
                    Delete</a>
            </div>
        </div>
        <b>${comment.user.name}</b>
        <p>
            ${comment.content}
        </p>
        <div class="align-middle action-buttons">
            <!-- like button on post -->
            <a href="/likes/toggle/?id=${comment._id}&type=Comment" class="toggle-like-button"
                data-likes="0"><i class="far fa-heart"></i> <span>0</span> </a> &nbsp
            <!-- comment button on post -->
            <a data-toggle="collapse" href="#collapse${comment._id}" role="button" aria-expanded="false"
            aria-controls="collapse${comment._id}"><i class="far fa-comment"></i></a>&nbsp
        </div>
        <hr>
    </div>`);
    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                    flash_msg('success', 'Comment Deleted!');
                    
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}