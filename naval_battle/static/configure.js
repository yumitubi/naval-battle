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
	    $('#'+i+m).attr('mark', 'false');

	    $('#'+i+m).hover(
		function (){
		    $(this).css('background-color', 'red');
		},
		function (){
		    if($(this).attr('mark') != 'True'){
			$(this).css('background-color', 'white');
		    }
		}
	    );

	    $('#'+i+m).click(
		function (){
		    if( $(this).attr('mark') == 'false'){
			$(this).css('background-color', 'red');
			$(this).attr('mark', 'True');
		    } else {
			$(this).css('background-color', 'red');
			$(this).attr('mark', 'false');
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
	    this['field'] = data['field'];
	}
    });
    return this['field'];
};

// the method push a data on server
field.push = function (){
    
};

// other function

function AllRun(){
    field.drawtable();
    setInterval(alert('test'));
    // setInterval($('.test_json').text(JSON.stringify(field.get())), 1000);
}

$(document).ready(AllRun);


