// archive page

function getlistgames(){
    $.ajax({
	       url: '/get_archive_game/',
	       type: 'post',
	       dataType: 'json',
	       data: ({'firstdate': $("#datepicker1").val(),
		       'seconddate': $("#datepicker2").val()}),
	       success: function(data){
		   if( data['result'] == "1"){
		       $('#list_games').text('');
		       $.each( data['games'], function(key, value) {
				   $('#list_games').append('<tr><td>' + value['date']+ '</td><td>' + value['players'] + '</td><td><input class="btn" type="button" id="' + key + '" value="Посмотреть"></td></tr>');
				   $('#' + key).click(goMoveBattle);
			       });
		   } else {
		       alert('Неправильная дата!');
		   }
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
    $( "#datepicker1" ).datepicker();
    $( "#datepicker2" ).datepicker();
}

$(document).ready(AllRun);
