
    $(function() {
        var url = '/tagged/popular/rss';
        var $list = $('#popular');
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'xml',
            success: function(data) {
                var $items = $(data).find('item:lt(4)');
                    $items.each( function() {
                    var $item = $(this);
                    var link = $item.children('link').text();
                    var title = $item.children('title').text();
                    var content = $item.children('description').text();
                    var date = $item.children('pubDate').text();
                    if (link || title) {
                        $list.append($('<li class="article"><a class="title" href="'+  link +'">'+ strLimitLength(title,28) +'</a><div class="rte content">'+ content + '</div></li>'));
                    } 
                });
                $("#popular li.article").each(function(){
                    var imgurl = $(this).find('.rte.content img:eq(0)').attr('src');
                    $(this).prepend('<div class="popimg"><img src="'+ imgurl +'"></a>');
                });
            }
        });
    });
        
    //Photoset grid
    $('.photoset-container').imagesLoaded( function() {
        $('.photoset-container').photosetGrid({
            gutter: '5px',
            rel: $('.photoset-container').attr('data-id'),
            highresLinks: true,
            onInit: function(){},
            onComplete: function(){
                // Show the grid after it renders
                $('.photoset-container').attr('style', '');
                $('.photoset-container a').colorbox({
                    photo: true,
                    scalePhotos: true,
                    maxHeight:'90%',
                    maxWidth:'90%'
                });
            }
        });
    });


$(function(){
    
    var pathname = window.location.pathname;
    $("#masonry-container .post-image").remove();
    $("#masonry-container .large-6")
      .removeClass("large-6").removeClass("six")
      .addClass("large-12").addClass("twelve");
        
});
