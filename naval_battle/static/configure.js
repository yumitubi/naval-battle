// for configure html


// draw field
function DrawRow(m){
    for (var n=0; n<10; n++){
	$('#' + m).append('<div id="' + m + n + '" onmouseover="ChangeRed()" onmouseour="ChangeWhite()">' + m + n + '</div>');
	$('#'+m+n).css('float', 'left');
	$('#'+m+n).css('width', '40px');
	$('#'+m+n).css('border-style', 'solid');
	$('#'+m+n).css('border-width', '1px');
	$('#'+m+n).css('height', '40px');
    }
}


function DrawField(){
    for (var m=0; m<10; m++){
	$('.settings_field').append('<div id="' + m + '"></div>');
	$('#' + m).css('width', '440px')
	DrawRow(m);
    }
}

// Change color cell when cursor over cell
function ChangeRed(){
    $('this').css('background', 'red');
}

function ChangeWhite(){
    $('this').css('background', 'white');
}

function AllRun(){
    DrawField();
}
$(document).ready(AllRun)
