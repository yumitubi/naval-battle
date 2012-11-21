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
		var str = '<tr id="users_wait"><td width="180px">' + data['username']+ '</td><td id="' + data['user_id'] + '"><input class="btn" type="button" name="game" value="Играть!" onclick="Configure()/></div></td></tr>';
		$('.table').append(str);
		$('#'+data['user_id']).children().click(Configure);
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
    $('#list_gamers').text('');
    $('#list_gamers').append('<h3>Ждут игры:</h3>');
    $('#list_gamers').append('<table></table>');
    $('table').attr('class', 'table');
    if( data['user_status'] == '1'){
	window.location.href = "/configure/";
    } else {
	$.each(data['users'], function(key, val){
		   $('.table').append('<tr id="users_wait"><td width="180px">' + val + '</td><td id="' + key + '"><input class="btn" type="button" name="game" value="Играть!"></td></tr>');
		   $('#'+key).children('input').click(Configure);
	       });
    }
}

// add second player in games
function Configure(){
    
    $.ajax({
    	       url: '/add_second_user/',
    	       type: 'post',
    	       dataType: 'json',
    	       data: ({"user_id":$(this).parent().attr('id'), 
		       "username":prompt('Представьтесь, пожалуйста!')}),
    	       success: function (data){
		   alert(JSON.stringify(data));
		   window.location.href = "/configure/";
	       }

    	   });
}

// get current coolies
// source - http://www.codenet.ru/webmast/js/Cookies.php
function getCookie(name) {
    var 
    cookie = " " + document.cookie,
    search = " " + name + "=",
    setStr = null,
    offset = 0,
    end = 0;
    if (cookie.length > 0) {
	offset = cookie.indexOf(search);
	if (offset != -1) {
	    offset += search.length;
	    end = cookie.indexOf(";", offset);
	    if (end == -1) {
		end = cookie.length;
	    }
	    setStr = unescape(cookie.substring(offset, end));
	}
    }
    return(setStr);
}

// draw information about gamers and games
$(document).ready(LoadMainPage);
$(document).ready(setInterval(LoadMainPage, 5000));

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
