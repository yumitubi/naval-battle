// configure battle.field

function AllRun(){
    field.drawtable('yourfield', 'test');
    field.get();
    field.setclick();
    setInterval(field.get, 1000);
    // setInterval(field.push, 3000);
}

$(document).ready(AllRun);
//$(document).ready(alert(JSON.stringify(field.get())), 3000);
