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
		var str = '<tr id="users_wait"><td><div id="' + data['user_id'] + '">' + data['username']+ '</td><td><input class="btn" type="button" name="game" value="Играть!" /></div></td></tr>'
		$('#users_wait').parent().append(str);
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
	success: UpdateMainPage(data)
    });
}

// Update Main Page
// get info about:
//     - users who wait second player
//     - games which does now
////////////////////////////////////////////
// Argments ////////////////////////////////
// `data` - json from server
function UpdateMainPage(data){
    var i = 0;
    ++i;
}

function TestRepeat(){
    window.m = 0;
    var intid = setInterval(function (){
	$('#test3').append(m+' ');
	++m;
	if (m > 9){
	    clearInterval(intid);
	}
    }, 1000);
}

$(document).ready(TestRepeat)
