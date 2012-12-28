// Main field object for this game

var field = {
    field: {},      // field battle array 
    field_two: {},  // field battle of opponent 
    cells: {},      // cells
    ships: {        // ships 
	'1': 0,
	'2': 0,
	'3': 0, 
	'4': 0 },  
    numcell: 0,      // num cell on field
    po: 'you',
    user: 'wait'
};

///////////////////////////////////////////////
// the method draw table
field.drawtable = function (nameblock){
    var 
    str_table = '<table class="field'+ nameblock +'"></table>',
    str_tr = '<tr></tr>',
    str_td = '<td></td>';
    
    $('.'+nameblock).append(str_table);
    for(var i=0; i<10; i++){
    	$('.field'+nameblock).append($(str_tr).attr('id',i+nameblock));
    	$('#'+i+nameblock).css('height','35px');
    	for(var m=0; m<10; m++){
    	    $('#'+i+nameblock).append($(str_td).attr('id', '' + i + m + field.po));
	    $('#'+i+m+field.po).css('border', 'solid 1px');
	    $('#'+i+m+field.po).css('width', '35px');
	    $('#'+i+m+field.po).css('background-color', 'white');
	    $('#'+i+m+field.po).attr('mark', '0');
    	}
    }
    return false;
};

// this method set a event by click for settings field
field.setclick = function (){
    for(var i=0; i<10; i++){
	for(var m=0; m<10; m++){
	    $('#'+i+m+field.po).click(
		function (){
		    if(field.user == 'build'){
			if( $(this).attr('mark') == '0' ){
			    if( field.addcell($(this).attr('id')) && field.numcell<=20 ){
				$(this).attr('mark', '2');	
				$(this).css('background-color', 'red');
				field.field[$(this).attr('id')[0] + $(this).attr('id')[1]] = '2';
				if(field.checkship()){
				    field.push();
				} else {
				    $(this).attr('mark', '0');	
				    $(this).css('background-color', 'white');
				    field.field[$(this).attr('id')[0] + $(this).attr('id')[1]] = '0';
				}
			    } 
			} else {
			    $(this).css('background-color', 'white');
			    $(this).attr('mark', '0');
			    field.field[$(this).attr('id')] = '0';
			    field.checkmaximum();
			    field.push();
			}
			field.checkship();
			field.checkmaximum();
		    } else {
			alert('Больше нельзя расставлять корабли!');
			window.location.href = "/battle/";
		    }
		}
	    );	    
	}
    }
    return false;
};

// this method set a event by click for shooting
field.clickshot = function (){
    for(var i=0; i<10; i++){
	for(var m=0; m<10; m++){
	    $('#'+i+m+'notyou').click(
		function (){
		    if(field.user == 'go'){
			field.user = 'wait';
			$('#status_go').text('Проверка!');
			var 
			xy = ($(this).attr('id'))[0] + ($(this).attr('id'))[1];
			$.ajax({
				   url: '/check_shot/',
				   type: 'post',
				   dataType: 'json',
				   data: ({"coordinata": xy}),
				   success: function (data){
				       field.field_two = data['field_opponent'];
				       field.update_field_two();
				       switch(data['result']){
		 		           case '0':
				           $('#'+data['coordinata']+'notyou').css('background-color', 'gray');
					   var audio = $("#splash")[0];
					   audio.play();
				           break;
				           case '1':
				           $('#'+data['coordinata']+'notyou').css('background-color', 'gray');
					   var audio = $("#splash")[0];
					   audio.play();
				           break;
				           case '2':
				           $('#'+data['coordinata']+'notyou').css('background-color', 'black');
					   field.user = 'go';
 					   $('#status_go').text('Ваш ход!');
					   var audio = $("#boom")[0];
					   audio.play();
				           break;
				           case '3':
				           $('#'+data['coordinata']+'notyou').css('background-color', 'black');
					   field.user = 'go';
					   $('#status_go').text('Ваш ход!');
					   var audio = $("#boom")[0];
					   audio.play();
					   break;
				           case '4':
				           $('#'+data['coordinata']+'notyou').css('background-color', 'black');
					   field.user = 'win';
					   var audio = $("#boom")[0];
					   audio.play();
					   $('#status_go').text('Тысяча чертей, Вы победили!');
				           break;
				       }

				   }
			       });
		    }
		}
	    );}
    }
    field.po = 'you';
    return false;
};

// update view field from field.field
field.update_field = function (){
    for(var i=0; i<10; i++){
	for(var m=0; m<10; m++){
	    if(field.field[''+i+m]=='1'){
		$('#'+i+m+field.po).css('background-color', 'gray');
	    }
	    if(field.field[''+i+m]=='2'){
		$('#'+i+m+field.po).css('background-color', 'red');
	    }
	    if(field.field[''+i+m]=='3'){
		$('#'+i+m+field.po).css('background-color', 'black');
	    }
	}
    }
};

// update view field from field.field
field.update_field_two = function (){
    for(var i=0; i<10; i++){
	for(var m=0; m<10; m++){
	    if(field.field_two[''+i+m]=='1'){
		$('#'+i+m+'notyou').css('background-color', 'gray');
	    }
	    if(field.field_two[''+i+m]=='3'){
		$('#'+i+m+'notyou').css('background-color', 'black');
	    }
	}
    }
};

// the method get a data from server
field.get = function (){
    $.ajax({
	url: '/send_state_field/',
	type: 'post',
	dataType: 'json',
	data: ({}),
        success: function (data){
	    // alert(JSON.stringify(data));
	    if(data['status'] == '7'){ // checking is the status 
		// if user broken
		$.ajax({
			   url: '/reset_game/',
			   type: 'post',
			   success: function (data){
			       alert('Ваш противник трусливо сбежал с моря боя!');
			       window.location.href = "/";
			   }
		       });
	    } else if(data['status'] == '1'){
		// if user configure his field
		field.field = data["field"];
		field.user = 'build';
	    } else if(data['status'] == '2'){
		// ready to play
	    	field.field = data["field"];
		field.update_field();
		field.user = 'in game';
	    } else if(data['status'] == '3'){
		// user move
	    	field.field = data["field"];
		field.user = 'go';
		$('#status_go').text('Ваш ход!');
		field.update_field();
		$('.number_watcher').text('За игрой следят: ' + data['number_watch_user'] + ' человек.');
	    } else if(data['status'] == '4'){
		// user wait of move other gamer
	    	field.field = data["field"];
		field.user = 'wait';
		$('#status_go').text('Ожидайте хода соперника!');
		field.update_field();
		$('.number_watcher').text('За игрой следят: ' + data['number_watch_user'] + ' человек.');
	    } else if(data['status'] == '5'){
		// user win!
	    	field.field = data["field"];
		field.user = 'win';
		var audio = $("#victory")[0];
		audio.play();
		$('#status_go').text('Тысяча чертей, Вы победили!');
		field.update_field();
		alert("Тысяча чертей, Вы победили");
		window.location.href = "/move_game/";
	    } else if(data['status'] == '6'){
		// user lose!
	    	field.field = data["field"];
		field.user = 'lose';
		$('#status_go').text('Вы проиграли!');
		field.update_field();
		var audio = $("#blynk")[0];
		audio.play();
		alert("Вы прогирали =(");
		window.location.href = "/move_game/";
	    }//  else {
	    // 	alert('Игра прервана');
	    // 	window.location.href = "/";
	    // }
	}
    });
    return false;
};

// get data from database and update opponents' field
field.get_field_two = function (){
    $.ajax({
        url: '/get_field_second/',
	type: 'post',
	dataType: 'json',
        success: function (data){
	    field.field_two = data['field_opponent'];
	    field.update_field_two();
	}
    });
    return false;
};

// get data about two fields for /move_games/
field.gettwofields = function (){
    var id_game = $('.id_game').attr('id');
    $.ajax({
        url: '/get_fields/',
	type: 'post',
	dataType: 'json',
	data: ({ "id_game": id_game }),       
        success: field.update_game_move });
    return false;
};

// the method get list moves from database
field.getlistmoves = function (){
    var id_game = $('.id_game').attr('id');
    $.ajax({
        url: '/get_list_moves/',
	type: 'post',
	dataType: 'json',
	data: ({ "id_game": id_game }),    
        success: function(data){
	    $('#list_shoot').text('');
	    var i = 1;
	    while( data['moves']['' + i] != undefined ){
		$('#list_shoot').append('<tr><td id="' + data['moves']['' + i] + '"> Ход №: ' + i + '</td></tr>');
		$('#'+data['moves']['' + i]).click(field.ShowMove);
		i++;
	    }
	}
    });
    return false;
};

// show move
field.ShowMove = function (){
    clearInterval(window.updatefields);
    $.ajax({
        url: '/get_fields_move/',
	type: 'post',
	dataType: 'json',
	data: ({ "id_move": $(this).attr('id') }),    
        success: field.update_game_move });
    return false;
};

// update
field.update_game_move = function (data){
    field.drawtable('you');
    $('#info').css('text-align', 'center');
    $('#info').css('font-size', '2em');
    if(data['result'] == "0"){
	window.location.href = "/";
    } else {
	if(data['game_status'] == "3"){
	    $('#info').text('Игроки готовятся!');
	} else if(data['game_status'] == "1"){
	    $('#info').text('Битва в разгаре!');
	} else if(data['game_status'] == "2"){
	    $('#info').text('Битва в завершена!');
	} else {
	    $('#info').text('Состояние не определено');
	}
	field.field = data['user_field'];
	field.field_two = data['opponent_field'];
	for(var i=0; i<10; i++){
	    for(var m=0; m<10; m++){
		if(field.field[''+i+m]=='1'){
		    $('#'+i+m+field.po).css('background-color', 'gray');
		}
		if(field.field[''+i+m]=='2'){
		    $('#'+i+m+field.po).css('background-color', 'red');
		}
		if(field.field[''+i+m]=='3'){
		    $('#'+i+m+field.po).css('background-color', 'black');
		}
	    }
	}
	field.po = 'notyou';
	field.drawtable('notyou');    
	for(var i=0; i<10; i++){
	    for(var m=0; m<10; m++){
		if(field.field_two[''+i+m]=='1'){
		    $('#'+i+m+field.po).css('background-color', 'gray');
		}
		if(field.field_two[''+i+m]=='2'){
		    $('#'+i+m+field.po).css('background-color', 'red');
		}
		if(field.field_two[''+i+m]=='3'){
		    $('#'+i+m+field.po).css('background-color', 'black');
		}
	    }
	}
	field.po = 'you';
	$('#user').text(data['username']);
	$('#user').css('text-align', 'center');
	$('#user').css('font-size', '1.8em');
	$('#opponent').text(data['opponentname']);
	$('#opponent').css('text-align', 'center');
	$('#opponent').css('font-size', '1.8em');
	
	// date and time
	$('#begin_game').text('Битва началась в: ' + data['time_begin']);
	$('#duration_game').text('Длительность игры: ' + data['game_duration']);
    }
};

// the method push a data on server
field.push = function (){
    for(var i=0; i<10; i++){
	for(var m=0; m<10; m++){
	    field.field[''+i+m] = $('#'+i+m+field.po).attr('mark');
	}
    }

    $.ajax({
	url: '/get_state_field/',
	type: 'post',
	dataType: 'json',
	data: (JSON.stringify(field.field)),
        success: function (data){
	    if(data['result'] == '1'){
		// alert('Все путем');
	    } else {
		alert('Потеряна связь с сервером');
	    }
	}
    });
    return false;
};

// add the cell on a field
field.addcell = function (coordinata){
    var 
    x = coordinata[0],
    y = coordinata[1];
    if( field.field[x+y] && CheckCell(x, y)){
	// alert('добавлено');
	return true;
    } 
    return false;
};


// other functions

// 'x and 'y' - strings
function CheckCell(x, y){

    // structure:
    // | 1 | 2 | 3 |
    // |---+---+---|
    // | 8 | x | 4 |
    // |---+---+---|
    // | 7 | 6 | 5 |
    // check this structure
    // x --- > this row
    // y --- > this column

    var 
    x1y1 = '#' + ((+x)-1) + ((+y)-1) + field.po,
    x3y3 = '#' + ((+x)-1) + ((+y)+1) + field.po,
    x5y5 = '#' + ((+x)+1) + ((+y)+1) + field.po,
    x7y7 = '#' + ((+x)+1) + ((+y)-1) + field.po,
    x2y2 = '#' + ((+x)-1) + y + field.po,
    x6y6 = '#' + ((+x)+1) + y + field.po,
    x4y4 = '#' + x + ((+y)+1) + field.po,
    x8y8 = '#' + x + ((+y)-1) + field.po;
    
    // 1, 3, 5, 7
    // TODO: use cicle, stupid!
    if( CellExist(x1y1[1], x1y1[2]) && $(x1y1).attr('mark') == '2' ){
	return false;
    }
    if( CellExist(x3y3[1], x3y3[2]) && $(x3y3).attr('mark') == '2'){
	return false;
    }
    if( CellExist(x5y5[1], x5y5[2]) && $(x5y5).attr('mark') == '2'){
	return false;
    }
    if( CellExist(x7y7[1], x7y7[2]) && $(x7y7).attr('mark') == '2'){
	return false;
    }
    // 2
    if( CellExist(x2y2[1], x2y2[2]) && $(x2y2).attr('mark') == '2'){
	// for 4 at 2
	if( CellExist(x4y4[1], x4y4[2]) && $(x4y4).attr('mark') == '2'){
	    return false;
	}
	// for 8 at 2
	if( CellExist(x8y8[1], x8y8[2]) && $(x8y8).attr('mark') == '2'){
	    return false;
	}
    }
    // 6
    if( CellExist(x6y6[1], x6y6[2]) && $(x6y6).attr('mark') == '2'){
	// for 4 at 6
	if( CellExist(x4y4[1], x4y4[2]) && $(x4y4).attr('mark') == '2'){
	    return false;
	}
	// for 8 at 6
	if( CellExist(x8y8[1], x8y8[2]) && $(x8y8).attr('mark') == '2'){
	    return false;
	}
    }
    // 4
    if( CellExist(x4y4[1], x4y4[2]) && $(x4y4).attr('mark') == '2'){
	// for 2 at 4
	if( CellExist(x2y2[1], x2y2[2]) && $(x2y2).attr('mark') == '2'){
	    return false;
	}
	// for 6 at 4
	if( CellExist(x6y6[1], x6y6[2]) && $(x6y6).attr('mark') == '2'){
	    return false;
	}
    }
    // 8
    if( CellExist(x8y8[1], x8y8[2]) && $(x8y8).attr('mark') == '2'){
	// for 2 at 8
	if( CellExist(x2y2[1], x2y2[2]) && $(x2y2).attr('mark') == '2'){
	    return false;
	}
	// for 6 at 8
	if( CellExist(x6y6[1], x6y6[2]) && $(x6y6).attr('mark') == '2'){
	    return false;
	}
    }
    field.numcell += 1;
    return true;
}

 

// 'x and 'y' - strings
// TODO: rewrite with one arguments
function CellExist(x, y){
    if($("#"+x+y+field.po).length){
	return true;
    }
    return false;
}

// calculate number cell which has mark as '2' - the cell of ship
field.checkmaximum = function (){
    field.numcell = 0;
    for(var i=0; i<10; i++){
	for(var m=0; m<10; m++){
	    if( $('#'+i+m+field.po).attr('mark') == '2' ){
		field.numcell += 1;
	    }
	}
    }
    $('.numcell').text('Количество юнитов: ' + field.numcell);
    return field.numcell;
};

// check number 1, 2, 3 and 4-cell ship
field.checkship = function (){
    field.ships['1'] = 0;     
    field.ships['2'] = 0;     
    field.ships['3'] = 0;     
    field.ships['4'] = 0;     
    for(var i=0; i<10; i++){
	for(var m=0; m<10; m++){
	    if( $('#'+i+m+field.po).attr('mark') == '2' ){
		// | x |   |
		// |---|---|
		// | x |   |
		// |---|---|
		// |   |   |
		// its first cell in vertical row!
		if( ((i-1)<0 || $('#'+(i-1)+m+field.po).attr('mark') == '0') && 
		    ((m+1)>9 || $('#'+i+(m+1)+field.po).attr('mark') == '0') && 
		    ((m-1)<0 || $('#'+i+(m-1)+field.po).attr('mark') == '0') ){ 
		    
		    var flag = true, p = 1;
		    while( flag == true ){
			if(p>4){
			    return false;
			}
			if($('#'+(i+p)+m+field.po).attr('mark') == '0' || (i+p)>9 ){
			    field.ships[''+p] += 1;
			    flag = false;
			}
			++p;
		    }
		}
		// |   | x | x | x |   |   |   |
		// |---|---|---|---|---|---|---
		// its first cell in gorizontal row!
		else if( ((m-1)<0 || $('#'+i+(m-1)+field.po).attr('mark') == '0') &&
		         ((i-1)<0 || $('#'+(i-1)+m+field.po).attr('mark') == '0') && 
		         ((i+1)>9 || $('#'+(i+1)+m+field.po).attr('mark') == '0')){ 

		    flag = true; 
		    p = 1;
		    while( flag == true ){
			if(p>4){
			    return false;
			}
			if($('#'+i+(p+m)+field.po).attr('mark') == '0' || (m+p)>9 ){
			    field.ships[''+p] += 1;
			    flag = false;
			}
			++p;
		    }
		}
	    }
	}
    }
    // show info about ships
    $('.' + '1').text('1 парус:  ' + field.ships[''+1]);
    for(var i=2; i<5; i++){
	$('.' + i).text(i + ' паруса: ' + field.ships[''+i]);	
    }
    
    if( field.ships['1']<5 &&
	field.ships['2']<4 &&
        field.ships['3']<3 &&
        field.ships['4']<2 ){
	    return true;
	}
    return false;
};

// get names of players 
field.getnamesplayers = function (){
    $.ajax({
	url: '/get_names_players/',
	type: 'post',
	dataType: 'json',
        success: function (data){
	    $('#user').text(data['username']);
	    $('#user').css('text-align', 'center');
	    $('#user').css('font-size', '1.8em');
	    $('#opponent').text(data['opponent']);
	    $('#opponent').css('text-align', 'center');
	    $('#opponent').css('font-size', '1.8em');
	    $('#info').css('text-align', 'center');
	    $('#info').css('font-size', '2em');
	    
	}
	   });
};


// batton ready for battle
function allReady(){
    if( field.checkship() && field.numcell==20 ){
	$.ajax({
		   url: '/move_battle/',
		   type: 'post',
		   success: function (data){
		       window.location.href = "/battle/";
		   }
	       });
    } else {
	alert('Расставьте все корабли!');
    }
    return false;
}

// loser
function allCancel(){
    $.ajax({
	url: '/all_cancel/',
	type: 'post',
        success: function (data){
	    window.location.href = "/";
	}
    });
    return false;
}

