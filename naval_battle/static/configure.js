// Main field object for this game

var field = {
    line_up: false, // default line up false
    field: {}       // field battle array 
};

///////////////////////////////////////////////
// the method draw table
field.drawtable = function (){
    var str_table = '<table class="field"></table>';
    var str_tr = '<tr></tr>';
    var str_td = '<td></td>';
    
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
		    if( $(this).attr('mark') == '0'){
			$(this).css('background-color', 'red');
			$(this).attr('mark', '2');
			field.valid();
			field.push();
		    } else {
			$(this).css('background-color', 'white');
			$(this).attr('mark', '0');
			field.valid();
			field.push();
		    }
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

field.valid = function (){
    for(var i=0; i<10; i++){
	for(var m=0; m<10; m++){
	    field.field[''+i+m] = $('#'+i+m).attr('mark');
	}
    }
    
    // TODO:
    // - handler 
    // - send a status
    return false;
}

// other functions

function AllRun(){
    field.drawtable();
    // setInterval(field.get, 3000);
    // setInterval(field.push, 3000);
}

function FindShip(field){
    
}

$(document).ready(AllRun);
//$(document).ready(alert(JSON.stringify(field.get())), 3000);




