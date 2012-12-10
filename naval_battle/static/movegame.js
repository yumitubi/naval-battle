// move game info

function AllRun(){
    field.drawtable('yourfield');
    field.po = 'notyou';
    field.drawtable('opponentfield');
    field.po = 'you';
    field.gettwofields();
    field.getlistmoves();
    window.updatefields = setInterval(field.gettwofields, 5000);
    setInterval(field.getlistmoves, 5000);
}

$(document).ready(AllRun);

