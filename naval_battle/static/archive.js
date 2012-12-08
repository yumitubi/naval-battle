// archive page

function getlistgames(){
    $.ajax({
	       url: '/get_archive_game/',
	       type: 'post',
	       dataType: 'json',
	       success: function(data){
		   $.each( data['games'], function(key, value) {
			       $('#list_games').append('<tr><td>' + value['date']+ '</td><td>' + value['players'] + '</td><td><input class="btn" type="button" id="' + key + '" value="Посмотреть"></td></tr>');
			       $('#' + key).click(goMoveBattle);
			   });
	       }
	   });   
    return false;
}

// move to game
function goMoveBattle(){
    window.location.href = '/go_move_battle/' + $(this).attr('id') + '/';
};

function AllRun(){
    getlistgames();
}

$(document).ready(AllRun);
