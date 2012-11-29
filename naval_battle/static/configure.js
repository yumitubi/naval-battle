// configure battle.field

function AllRun(){
    field.user = 'build';
    field.drawtable('yourfield', 'test');
    field.get();
    field.setclick();
    setInterval(field.get, 5000);
    // setInterval(field.push, 3000);
}

$(document).ready(AllRun);
//$(document).ready(alert(JSON.stringify(field.get())), 3000);
