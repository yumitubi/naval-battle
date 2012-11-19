// Main field object for this game

var field = {
    line_up: false, // default line up false
    field: {},      // field battle array 
    cells: {},      // cells
    ships: {        // ships 
	'1': 0,
	'2': 0,
	'3': 0, 
	'4': 0 },  
    numcell: 0      // num cell on field
};

///////////////////////////////////////////////
// the method draw table
field.drawtable = function (){
    var 
    str_table = '<table class="field"></table>',
    str_tr = '<tr></tr>',
    str_td = '<td></td>';
    
    field.get();
    $('.settings_table').append(str_table);
    
    for(var i=0; i<10; i++){
    	$('.field').append($(str_tr).attr('id',i));
    	$('#'+i).css('height','40px');
    	for(var m=0; m<10; m++){
    	    $('#'+i).append($(str_td).attr('id', '' + i + m ));
	    $('#'+i+m).css('border', 'solid 1px');
	    $('#'+i+m).css('width', '40px');
	    $('#'+i+m).attr('mark', '0');
	    

	    $('#'+i+m).hover(
		function (){
		    $(this).css('background-color', 'red');
		},
		function (){
		    if($(this).attr('mark') != '2'){
			$(this).css('background-color', 'white');
		    }
		}
	    );
	    $('#'+i+m).click(
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

// the method get a data from server
field.get = function (){
    $.ajax({
	url: '/send_state_field/',
	type: 'post',
	dataType: 'json',
	data: ({}),
        success: function (data){
	    field.field = data["field"];
	}
    });
    return false;
};

// the method push a data on server
field.push = function (){
    for(var i=0; i<10; i++){
	for(var m=0; m<10; m++){
	    field.field[''+i+m] = $('#'+i+m).attr('mark');
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
    
    if( field.field[coordinata] && CheckCell(x, y)){
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
    x1y1 = '#' + ((+x)-1) + ((+y)-1),
    x3y3 = '#' + ((+x)-1) + ((+y)+1),
    x5y5 = '#' + ((+x)+1) + ((+y)+1),
    x7y7 = '#' + ((+x)+1) + ((+y)-1),
    x2y2 = '#' + ((+x)-1) + y,
    x6y6 = '#' + ((+x)+1) + y,
    x4y4 = '#' + x + ((+y)+1),
    x8y8 = '#' + x + ((+y)-1);
    
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
    if($("#"+x+y).length){
	return true;
    }
    return false;
}

// calculate number cell which has mark as '2' - the cell of ship
field.checkmaximum = function (){
    field.numcell = 0;
    for(var i=0; i<10; i++){
	for(var m=0; m<10; m++){
	    if( $('#'+i+m).attr('mark') == '2' ){
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
	    if( $('#'+i+m).attr('mark') == '2' ){
		// | x |   |
		// |---|---|
		// | x |   |
		// |---|---|
		// |   |   |
		// its first cell in vertical row!
		if( ((i-1)<0 || $('#'+(i-1)+m).attr('mark') == '0') && 
		    ((m+1)>9 || $('#'+i+(m+1)).attr('mark') == '0') && 
		    ((m-1)<0 || $('#'+i+(m-1)).attr('mark') == '0') ){ 
		    
		    var flag = true, p = 1;
		    while( flag == true ){
			if(p>4){
			    return false;
			}
			if($('#'+(i+p)+m).attr('mark') == '0' || (i+p)>9 ){
			    field.ships[''+p] += 1;
			    flag = false;
			}
			++p;
		    }
		}
		// |   | x | x | x |   |   |   |
		// |---|---|---|---|---|---|---
		// its first cell in gorizontal row!
		else if( ((m-1)<0 || $('#'+i+(m-1)).attr('mark') == '0') &&
		         ((i-1)<0 || $('#'+(i-1)+m).attr('mark') == '0') && 
		         ((i+1)>9 || $('#'+(i+1)+m).attr('mark') == '0')){ 

		    flag = true; 
		    p = 1;
		    while( flag == true ){
			if(p>4){
			    return false;
			}
			if($('#'+i+(p+m)).attr('mark') == '0' || (m+p)>9 ){
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

function AllRun(){
    field.drawtable();
    field.get();
    // setInterval(field.get, 3000);
    // setInterval(field.push, 3000);
}

$(document).ready(AllRun);
//$(document).ready(alert(JSON.stringify(field.get())), 3000);
