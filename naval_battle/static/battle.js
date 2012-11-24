// configure battle.field

function AllRun(){
    field.drawtable('yourfield');
    field.po = 'notyou';
    field.drawtable('opponentfield');    
    field.get_field_two();
    field.get();
    field.po = 'you';
    field.get();
    field.clickshot();
    setInterval(field.get, 5000);
    // setInterval(field.push, 3000);
}

$(document).ready(AllRun);
//$(document).ready(alert(JSON.stringify(field.get())), 3000);
