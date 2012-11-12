// for configure html

// draw field
function DrawRow(m){
    for (var n=0; n<10; n++){
	$('#' + m).append('<div id="' + m + n + '" onclick="ChangeRed()" onmouseover="ChangeRed()" onmouseour="ChangeWhite()">' + m + n + '</div>');
	$('#'+m+n).css('float', 'left');
	$('#'+m+n).css('width', '40px');
	$('#'+m+n).css('border-style', 'solid');
	$('#'+m+n).css('border-width', '1px');
	$('#'+m+n).css('height', '40px');
    }
    return false;
}

function DrawField(){
    for (var m=0; m<10; m++){
	$('.settings_field').append('<div id="' + m + '"></div>');
	$('#' + m).css('width', '440px');
	DrawRow(m);
    }
    return false;
}

///////////////////////////////////////////////
// Draw table
function DrawTable(){
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
}

function AllRun(){
    DrawTable();
}

$(document).ready(AllRun);

