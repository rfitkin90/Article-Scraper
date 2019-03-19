$(document).ready(function () {

   // put loading message first
   $('#content').html('<p>Loading articles...</p>');

   // append all articles in the database to the page on load
   $.ajax({
      method: "GET",
      url: "/api/articles/"
   })
      .then(function (data) {
         console.log('article data:', data);
         // get rid of the loading message after the api request finishes
         $('#content').empty();

         data.forEach(elem => {
            $('#content').prepend(`
               <div class="row article-div">
                  <div class="col-md-4">
                     <img src=${elem.img} />
                  </div>
                  <div class="col-md-8">
                     <h4 class="post-title">
                        <a href="${elem.URL}" target="blank">${elem.headline}</a>
                     </h4>
                     <p class="summary">${elem.summary}</p>
                     <p class="by-line">by <a href="${elem.byLineURL}" target="blank">${elem.byLine}</a></p>

                     <button class="btn btn-secondary view-comments-btn" data-articleId="${elem._id}"
                        data-toggle="modal" data-target="#view-comments-modal"
                        data-headline="${elem.headline}">View Comments</button>

                     <button class="btn btn-secondary post-comment-btn" data-articleId="${elem._id}" 
                        data-toggle="modal" data-target="#post-comment-modal">Post Comment</button>
                  </div>
               </div>
               <hr>
            `);
         });

      })
      .catch(function (err) {
         console.log(err);
      });
   ;

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