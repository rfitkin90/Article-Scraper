$(document).ready(function () {


   $.ajax({
      method: "GET",
      url: "api/articles/"
   })
      .then(function (data) {
         console.log('article data:', data);

         for (let i = 0; i < 10; i++) {
            $('#content').append(`
               <div class="row article-div">
                  <div class="col-md-4">
                     <img src=${data[i].img} />
                  </div>
                  <div class="col-md-8">
                     <h4 class="post-title">
                        <a href="${data[i].URL}">${data[i].headline}</a>
                     </h4>
                     <p class="summary">${data[i].summary}</p>
                     <p class="by-line">by <a href="${data[i].byLineURL}">${data[i].byLine}</a></p>
                  </div>
               </div>
               <hr>
            `);
         }

      })
      .catch(function (err) {
         console.log(err);
      });
   ;


});