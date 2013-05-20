jQuery(document).ready(function() {
	
	//if submit button is clicked
	jQuery('.contact-form #submit').click(function () {		
		
		//Get the data from all the fields
		var name = jQuery('input[name=name]');
		var email = jQuery('input[name=email]');
		var website = jQuery('input[name=website]');
		var comment = jQuery('textarea[name=comment]');

		//Simple validation to make sure user entered something
		//If error found, add hightlight class to the text field
		if (name.val()=='') {
			name.addClass('hightlight');
			return false;
		} else name.removeClass('hightlight');
		
		if (email.val()=='') {
			email.addClass('hightlight');
			return false;
		} else email.removeClass('hightlight');
		
		if (comment.val()=='') {
			comment.addClass('hightlight');
			return false;
		} else comment.removeClass('hightlight');
		
		//disabled all the text fields
		jQuery('.text').attr('disabled','true');
		
		//show the loading sign
		jQuery('.loading').show();

		jQuery.post("../wp-content/themes/SCRN/index.php", { name : name.val(), email : email.val(), comment : comment.val(), submit : "yes" }, function() {
						
			jQuery('.form').fadeOut('slow');					

			jQuery('.done').fadeIn('slow');

			jQuery('.contact-form form').fadeOut('slow');

		});
					
		return false;
						
		//cancel the submit button default behaviours
	});	
});	
