// add new user for wait second player
var user_in_db = "0";

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
	    } else if(data['new_user']==0){
		alert('Вы уже создали сервер!');
	    } else if(data['new_user']==2){
		alert('Вы уже в игре!');
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
    if( data['user_status'] == '1'){
	window.location.href = "/configure/";
    } else {
	if( data['current_user'] == "0"){
	    user_in_db = "0";
	} else {
	    user_in_db = data['current_user'];
	}
	// update list users
	$('#list_players').text('');
	$('#list_players').append('<h3>Ждут игры:</h3>');
	$('#list_players').append('<table id="table_players"></table>');
	$.each(data['users'], function(key, val){
		   $('#table_players').append('<tr id="users_wait"><td width="180px">' + val + '</td><td id="' + key + '"><input class="btn" type="button" name="game" value="Играть!"></td></tr>');
		   $('#'+key).children('input').click(Configure);
	       });
	// update list games
	$('#list_games').text('');
	$('#list_games').append('<h3>Сейчас играют:</h3>');
	$('#list_games').append('<table id="table_games"></table>');
	$.each(data['games'], function(key, val){
		   $('#table_games').append('<tr id="games_go"><td width="400px">' + val[0] + ' vs ' + val[1] + '</td><td id="'+ key + '"><input id="' + key + '"class="btn" type="button" name="watch" value="Смотреть бой!"></td></tr>');
		   $('#'+key).children('input').click(goMoveBattle);
	       });
    }
}

// add second player in games
function Configure(){
    if(user_in_db == "0"){
	user_in_db = prompt('Представьтесь, пожалуйста!');
    }
    if( user_in_db ){
	$.ajax({
    		   url: '/add_second_user/',
    		   type: 'post',
    		   dataType: 'json',
    		   data: ({"user_id":$(this).parent().attr('id'), 
			   "username":user_in_db}),
    		   success: function (data){
		       if( data['result'] == "1" ){
			   window.location.href = "/configure/";			   
		       } else {
			   alert('Вы не можете играть сами с собой!');
		       }
		   }
    	       });
    } 
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

// go to page /go_move_battle/<id>/ with id
function goMoveBattle(){
    window.location.href = '/go_move_battle/' + $(this).attr('id') + '/';
};


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
