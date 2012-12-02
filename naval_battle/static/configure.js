// configure battle.field

function AllRun(){
    field.user = 'build';
    field.drawtable('yourfield');
    field.get();
    field.setclick();
    field.checkship();
    setInterval(field.get, 5000);
}

$(document).ready(AllRun);

