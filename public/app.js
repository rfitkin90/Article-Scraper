$(document).ready(function () {

   // scrape current affairs for new articles to add to the database
   $(document).on('click', '#scrape-articles-btn', function (e) {
      e.preventDefault();
      $('#content').html('<p>Scraping articles...</p>');

      $.ajax({
         url: "/api/scrape/",
         method: "GET"
      })
         .then(function (data) {
            location.reload();
         })
         .catch(function (err) {
            console.error(err);
         });
      ;

   });

   // bring up the post comment modal
   $(document).on('click', '.post-comment-btn', function (e) {
      e.preventDefault();

      // set data-articleId value of submit button to the id the article being commented on
      $('#submit-comment').attr('data-articleId', $(this).attr('data-articleId'));

   });

   // post a comment
   $(document).on('click', '#submit-comment', function (e) {
      e.preventDefault();

      $.ajax({
         url: "/api/articles/" + $(this).attr('data-articleId'),
         method: "POST",
         data: {
            title: $('#comment-title').val().trim(),
            body: $('#comment-body').val().trim()
         }
      })
         .then(function (data) {
            // clear the text fields
            $('#comment-title').val('');
            $('#comment-body').val('');
         })
         .catch(function (err) {
            console.error(err);
         });
      ;

   });

   // view the comments of an article
   $(document).on('click', '.view-comments-btn', function (e) {
      e.preventDefault();
      // set btn's article id to a variable
      var articleId = $(this).attr('data-articleId');

      // get the title of the modal
      $('#comments-modal-title').text($(this).attr('data-headline'));

      // empty the comments section to be repopulated by the ajax request
      $('#modal-comments-body').empty();

      // get the article's comments from the database
      $.ajax({
         url: "/api/articles/" + articleId,
         method: "GET"
      })
         .then(function (data) {
            data.comments.forEach(elem => {
               console.log(elem);
               $('#modal-comments-body').append(`
                  <div class="comment-div" data-commentId="${elem._id}" id="comment-div-${elem._id}">
                     <h4>${elem.title}</h4>
                     <p>${elem.body}</p>
                     <button class="btn btn-secondary delete-comment-btn"
                        data-commentId="${elem._id}">Delete Comment</button>
                  </div>
               `);
            });
         })
         .catch(function (err) {
            console.error(err);
         });
      ;

   });

   // delete a comment
   $(document).on('click', '.delete-comment-btn', function (e) {
      e.preventDefault();
      var commentId = $(this).attr('data-commentId');

      // delete the comment in the database
      $.ajax({
         url: "/api/comments/" + commentId,
         method: "DELETE"
      })
         .then(function (data) {
            // remove the comment's div from the page
            $(`#comment-div-${commentId}`).remove();
         })
         .catch(function (err) {
            console.error(err);
         });
      ;

   });



});