// Main field object for this game

var field = {
    field: {},      // field battle array 
    cells: {},      // cells
    ships: {        // ships 
	'1': 0,
	'2': 0,
	'3': 0, 
	'4': 0 },  
    numcell: 0,      // num cell on field
    po: 'you'
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
	    $('#'+i+m+field.po).attr('mark', '0');
    	}
    }
    return false;
};

field.setclick = function (){
    for(var i=0; i<10; i++){
	for(var m=0; m<10; m++){
	    $('#'+i+m+field.po).click(
		function (){
		    if( $(this).attr('mark') == '0' ){
			if( field.addcell($(this).attr('id')) && field.numcell<=20 ){
			    $(this).attr('mark', '2');	
			    $(this).css('background-color', 'red');
			    field.field[$(this).attr('id')] = '2';
			    if(field.checkship()){
				field.push();
			    } else {
				$(this).attr('mark', '0');	
				$(this).css('background-color', 'white');
				field.field[$(this).attr('id')] = '0';
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
		}
	    );	    
	}
    }
    return false;
};

field.clickshot = function (){
    for(var i=0; i<10; i++){
	for(var m=0; m<10; m++){
	    $('#'+i+m+'notyou').click(
		function (){
		    var xy = ($(this).attr('id'))[0] + ($(this).attr('id'))[1];
		    $.ajax({
			       url: '/check_shot/',
			       type: 'post',
			       dataType: 'json',
			       data: ({"coordinata": xy }),
			       success: function (data){
				   switch(data['result']){
				       case '0':
				           $('#'+data['coordinata']+'notyou').css('background-color', 'gray');
				           break;
				       case '1':
				           $('#'+data['coordinata']+'notyou').css('background-color', 'gray');
				           break;
				       case '2':
				           $('#'+data['coordinata']+'notyou').css('background-color', 'black');
				           break;
				       case '3':
				           $('#'+data['coordinata']+'notyou').css('background-color', 'black');
				           break;
				   }
			       }
			   });
		}
	    );}
    }
    field.po = 'you';
    return false;
};

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
}

// the method get a data from server
field.get = function (){
    $.ajax({
	url: '/send_state_field/',
	type: 'post',
	dataType: 'json',
	data: ({}),
        success: function (data){
	    if(data['status'] == '0'){ // checking is the status of opponent 
		$.ajax({
			   url: '/reset_game/',
			   type: 'post',
			   success: function (data){
			       alert('Ваш противник трусливо сбежал с поля боя!');
			       window.location.href = "/";
			   }
		       });
	    } else if(data['status'] == '1'){
		field.field = data["field"];
	    } else if(data['status'] == '2'){
	    	field.field = data["field"];
		field.update_field();
	    } else {
		alert('Игра прервана');
		window.location.href = "/";
	    }
	}
    });
    return false;
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

// run validate of field
field.valid = function (){
    // TODO:
    // - handler 
    // - send a status
    return false;
}

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
}


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
    $('.numcell').text(field.numcell);
    return field.numcell;
}

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
    for(var i=0; i<5; i++){
	$('.' + i).text(field.ships[''+i]);
    }
    if( field.ships['1']<5 &&
	field.ships['2']<4 &&
        field.ships['3']<3 &&
        field.ships['4']<2 ){
	    return true;
	}
    return false;
}

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

