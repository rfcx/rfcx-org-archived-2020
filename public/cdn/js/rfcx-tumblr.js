
  function strLimitLength(str,len) {
    if (str.length > len) { return str.substr(0,len-2) + "...";
    } else { return str; }
  }

  function loadPopularSidebar() {
    var url = '/tagged/popular/rss';
    var $list = $('#popular');
    $.ajax({ url: url, type: 'GET', dataType: 'xml',
      success: function(data) {
        var $items = $(data).find('item:lt(4)');
        $items.each( function() {
          var $item = $(this);
          var link = $item.children('link').text();
          var title = $item.children('title').text();
          var content = $item.children('description').text();
          var date = $item.children('pubDate').text();
          var author = $item.children('dc\\:creator').text();
          if (link || title) {
            $list.append($('<li class="article"><a class="title" href="'+  link +'">'+ strLimitLength(title,28) +'</a>'
              +'<a class="author-name" href="'+  link +'">by '+author+'</a>'
            +'<div class="rte content">'+ content + '</div></li>'));
          } 
        });
        $("#popular li.article").each(function(){
        var imgurl = $(this).find('.rte.content img:eq(0)').attr('src');
        $(this).prepend('<a href="'+$(this).find("a.title").attr("href")+'"><div class="popimg"><img src="'+ imgurl +'" /></div></a>');
      });
    }});
  }

  
  // //Photoset grid
  // $('.photoset-container').imagesLoaded(function(){
  //   $('.photoset-container').photosetGrid({
  //     gutter: '5px',
  //     rel: $('.photoset-container').attr('data-id'),
  //     highresLinks: true,
  //     onInit: function(){},
  //     onComplete: function(){
  //       // Show the grid after it renders
  //       $('.photoset-container').attr('style', '');
  //       $('.photoset-container a').colorbox({
  //         photo: true, scalePhotos: true, maxHeight:'90%', maxWidth:'90%'
  //       });
  //     }
  //   });
  // });


$(function(){
  
  loadPopularSidebar();

  var pathname = window.location.pathname;
  var container = $("#container");
  var masonryContainer = $("#masonry-container");
  var featured = $('#masonry-container .article:first-child');

  if (pathname === "/") {

    $('.article.text').each(function(){
        var firstImage = $(this).find('.text-body img:eq(0)');
        var perms = $(this).attr("data-permalink");
        if (firstImage){
            $(this).find('.post-image').append(firstImage);
            $(this).find('.post-image img').css('width', '100%').wrap('<a href="'+perms+'"></a>');
        }
    });
    //Truuncate text in .text-body after images have been appended
    $(".sticky, .article.text, .article.link").each(function(){
        var title = $(this).find(".text-body").text();
        if(title){
            var excerpt = jQuery.trim(title).substring(0, 300) + "[...]";
            title = $(this).find(".text-body").text(excerpt);
        }
    });
    //Truuncate text in other post types
    $(".article.photo, .article.photoset, .article.video").each(function(){
        var title = $(this).find(".post-text").text();
        if (title){
            var excerpt = jQuery.trim(title).substring(0, 300) + "[...]";
            title = $(this).find(".post-text").text(excerpt);
        }
    });
    
    $(".text-body").attr('style', '');

    masonryContainer.imagesLoaded(function(){
        //Masonize this babeh!
        masonryContainer.masonry({ itemSelector: '.article' });
    });


    $("div.article div.post-text").css({height:"13em"});
    var sticky = featured.addClass("sticky");
    container.prepend(sticky);
    container.prepend("<div class=\"section-header section-header-featured\"><h2>FEATURED POST</h2></div>");
    $("#masonry-container .large-6").removeClass("large-6").removeClass("six").addClass("large-12").addClass("twelve");
  }

  container.css({visibility:"visible"});
  
});
