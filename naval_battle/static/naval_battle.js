// send data from form to server in JSON

function AddNewUser(){
    var username = $("input:text").val();
    // alert(username)
    $.ajax({
	url: '/add_new_user/',
	type: 'post',
	dataType: 'json',
	data: ({"username": username}),
	success: function(data)
	{
            $.each(data, function(i, val) {   
		alert(val);
            });
	}
     });
    return false;
}


