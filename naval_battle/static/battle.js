// configure battle.field

function AllRun(){
    field.drawtable();
    field.get();
    setInterval(field.get, 5000);
    // setInterval(field.push, 3000);
}

$(document).ready(AllRun);
//$(document).ready(alert(JSON.stringify(field.get())), 3000);
