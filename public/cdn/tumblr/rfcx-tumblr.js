
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

function emailSubscribeFormSetup() {

  if ($("form.rfcx-form").length > 0) {
    $.getScript("http://cdn.rfcx.org/vendor/parsley.js/1.1.16/parsley.min.js",function(){
      $("#mc-embedded-subscribe-form").submit(function(){
        var isEmailValid = $("input.input-large.email").parsley("validate");
        if (!isEmailValid) {
          alert("Please enter a valid e-mail.");
        }
        return isEmailValid;
      });
      $("#mc-embedded-subscribe-form a.btn-success").click(function(){
        $("#mc-embedded-subscribe-form").submit();
      });
    });
  }

}

function loadDisqus() {
  window.disqus_shortname = 'rfcx-tumblr';
  var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true; dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js'; (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
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

function formatFeatured() {
  var sticky = featured.addClass("sticky");
    container.find(".section-header-featured").after(sticky);
}

function formatPreviews(pageName) {

    $('.article.text').each(function(){
        var firstImage = $(this).find('.text-body img:eq(0)');
        var permaLink = $(this).attr("data-permalink");
        if (firstImage){
            $(this).find('.post-image').append(firstImage);
            $(this).find('.post-image img').css('width', '100%').wrap('<a href="'+permaLink+'"></a>');
        }

        $(this).find("div.post-text").css({height:"13em"}).after("<a class=\"read-more\" href=\""+permaLink+"\">read more &raquo;</a>");
        $(this).find("div.text-body").each(function(){
          $(this).text($.trim($(this).text()).substring(0, 300) + "[...]")
          $(this).css({cursor:"pointer", fontStyle:"italic", color:"rgb(131, 131, 131)"}).attr("onClick","location='"+permaLink+"';");
        });
        $(this).css({width:"49.9%"});
    });

    container.addClass("container-"+pageName);
    masonryContainer.addClass("masonry-container-"+pageName).imagesLoaded(function(){
        masonryContainer.masonry({ itemSelector: '.article' });
    });
    masonryContainer.find(".large-6").removeClass("large-6").removeClass("six").addClass("large-12").addClass("twelve");
}

function formatPost() {
    
    $('.text-body img, #post-notes img').each(function(){
     $(this).addClass('th');
    });
    
    loadDisqus();
}

$(function(){
  
  loadPopularSidebar();

  window.pathname = window.location.pathname;
  window.container = $("#container");
  window.masonryContainer = $("#masonry-container");
  window.featured = masonryContainer.find('.article:first-child');

  if (pathname === "/") {
    formatFeatured();
    formatPreviews("index");
  } else if (pathname.substr(0,6) === "/post/") {
    formatPost();
  } else if (pathname.substr(0,8) === "/search/") {
    formatPreviews("search");
  }

  container.css({visibility:"visible"});
  
  emailSubscribeFormSetup();

});
