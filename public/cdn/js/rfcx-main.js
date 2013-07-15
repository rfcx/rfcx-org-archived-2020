
$(function(){

});

function showHelpBubbles() {

	$("div.screen-container div.alert-help").each(function(i){
		$(this).delay(500*i).fadeIn(function(){
			$(this).addClass("hint--always");
		});
	});

	// for (var i = 0; i < divs; i++) {
	// 	setTimeout(function(){
//			$("div.hint--rounded").addClass("hint--always");
	// 	},((i+1)*500));
	// }
	// $("div.hint--rounded").each(function(){
	// 	setTimeout(function(){
	// 		$(this).addClass("hint--always");
	// 	},(500*i));
	// });
	// i++;
}