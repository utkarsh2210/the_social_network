function flash_msg(type, message)
{
    new Noty({
        theme: 'relax',
        text: message,
        type: type,
        layout: 'topRight',
        timeout: 1000,
    }).show();
}

// method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container').prepend(newPost);
                    flash_msg('success', 'Post created Successfully!');
                    deletePost($('.delete-post-button', newPost));

                    // call the create comment class
                    new PostComments(data.data.post._id);
                    $("#new-post-form")[0].reset();

                    // for creating functionality of toggle like button on new post
                    new ToggleLike($('.toggle-like-button', newPost));

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
    // method to create a post in DOM
    let newPostDom = function(post){
        console.log(post);
        return $(`<div class="card w-100 mt-3 mb-2" id="post-${post._id}">
        <div class="card-body">
    
            <!-- options to delete a post and stuff -->
            
            <div class="dropdown">
                <a class="float-right" href="" id="more_options_${post._id}" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false">
                    <i class="fas fa-ellipsis-h"></i>
                </a>
                <div class="dropdown-menu" aria-labelledby="more_options_${post._id}">
                    <a class="delete-post-button dropdown-item " href="/posts/destroy/${post._id}"><i
                            class="fas fa-trash-alt"></i>
                        Delete</a>
                </div>
            </div>
            
            <h5 class="card-title">${post.user.name}</h5>
            <p class="card-text">${post.content}</p>
            <div class="card-text mt-2"><small>${post.user.updatedAt.toString().substr(0, 15)}</small></div>
            <hr>
            
            <a href="/likes/toggle/?id=${post._id}&type=Post" class="toggle-like-button"
             data-likes="0"><i class="far fa-heart"></i> <span>0</span></a>
            &nbsp&nbsp&nbsp
            <a data-toggle="collapse" href="#collapse_${post._id}" role="button" aria-expanded="false"
                aria-controls="collapse${post._id}"><i class="far fa-comment"></i></a>&nbsp&nbsp&nbsp
            <a href=""><i class="fas fa-paper-plane"></i></a>
        </div>
        <div class="collapse post-comments mr-2 ml-2" id="collapse_${post._id}">
            
            <form action="/comments/create" method="POST" id="post-${ post._id }-comments-form">
                <input type="text" class="form-control" placeholder="Add a new Comment..." aria-label="Username"
                    aria-describedby="basic-addon1" name="content" required>
                <input type="hidden" name="post" value="${post._id}">
                <button type="submit" class="btn btn-primary btn-sm mt-2 mb-2 mr-2">Add Comment</button>
            </form>
            <!-- comments list container -->
            <hr>
            <div class="post-comments-list pl-4 pr-4">
                <div id="post-comments-${post._id}">
                
                </div>
            </div>
            
        </div>
    </div>`)

    }


    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    flash_msg('success', 'Post Deleted!');
                },
                error: function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

    let deleteAllPosts = function(){
        $('#posts-list-container>div').each(function(){
            deletePost($(' .delete-post-button', this));
            let postId = $(this).prop('id').split("-")[1]
            new PostComments(postId);
        });

    }

    createPost();
    deleteAllPosts();
   
