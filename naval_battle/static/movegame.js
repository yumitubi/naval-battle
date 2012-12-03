// move game info

function AllRun(){
    field.drawtable('yourfield');
    field.po = 'notyou';
    field.drawtable('opponentfield');
    field.po = 'you';
    field.gettwofields();
    setInterval(field.gettwofields, 5000);
}

$(document).ready(AllRun);

