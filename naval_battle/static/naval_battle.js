// add new user for wait second player
function AddNewUser(){
    var username = $("input:text").val();
    $.ajax({
	url: '/add_new_user/',
	type: 'post',
	dataType: 'json',
	data: ({"username": username}),
	success: function(data)
	{
	    if (data['new_user']==1){
		var str = '<tr id="users_wait"><td width="180px">' + data['username']+ '</td><td id="' + data['user_id'] + '"><input class="btn" type="button" name="game" value="Играть!" /></div></td></tr>'
		$('.table').append(str);
	    }
	}
    });
    return false;
}

// draw main page
// - load list of users who wait second player
// - load open servers for game
function LoadMainPage(){
    $.ajax({
	url: '/update_data_for_main_page/',
	type: 'post',
	dataType: 'json',
	data: ({}),
	success: UpdateMainPage
    });
}

// Update Main Page
// get info about:
//     - users is who wait second player
//     - games is which does now
////////////////////////////////////////////
// Argments ////////////////////////////////
// `data` - json from server
function UpdateMainPage(data){
    $('#list_gamers').text('')
    $('#list_gamers').append('<h3>Ждут игры:</h3>');
    $('#list_gamers').append('<table></table>');
    $('table').attr('class', 'table');
    $.each(data['users'], function(key, val){
	$('.table').append('<tr id="users_wait"><td width="180px">' + val + '</td><td id="' + key + '"><input class="btn" type="button" name="game" value="Играть!"></td></tr>')
    });
}

// draw information about gamers and games
$(document).ready(LoadMainPage)
$(document).ready(setInterval(LoadMainPage, 5000))

////////////////////////////////////////////////
// function TestRepeat(){                     // 
//     window.m = 0;                          //
//     var intid = setInterval(function (){   //
// 	$('#test3').append(m+' ');            // 
// 	++m;                                  //
// 	if (m > 9){                           //
// 	    clearInterval(intid);             //
// 	}                                     //
//     }, 1000);                              //
// }                                          //
//                                            //
// $(document).ready(TestRepeat)              //
////////////////////////////////////////////////
