jQuery(window).load(function() {
	jQuery('.filterable_portfolio').isotope({
	 	 // options
	  	itemSelector : '.item',
	});

	jQuery('.filterable_portfolio').isotope({ filter: "*" });

	//filtering
	jQuery('.filter-categories a').click(function(){
		jQuery('.filter-categories a').removeClass('selected');
	  	var selector = jQuery(this).attr('data-filter');
	  	jQuery(this).addClass('selected');
	 	jQuery('.filterable_portfolio').isotope({ filter: selector });
	 	return false;
	});

	jQuery("a.portf-load").on('click', function(e) {
		e.preventDefault();
		var url = jQuery(this).attr("href");
		jQuery.get(url, function(data) {
			jQuery(".portfolio_details").html(data);
		});
	});
});	
