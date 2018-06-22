$.getJSON("/articles", function(data){
	for (var i = 0; i < data.length; i++){
		$("#articles").append(`
 	<div class="row justify-content-center">
		<div class="col-12">
			<h3 data-id="${data[i]._id}">${data[i].title}</h3>
			<a href="${data[i].link}">View Post</a>
		</div>
	</div>
	`)
	}
});

$(document).on("click", "h3", function(){
	$("#notes").empty();
	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "GET",
		url: "/articles/" + thisId
	})
	.then(function(data){
		console.log(data);
		$("#note").html(`
			<h5>${data.title}</h5>
			<input id="titleinput" name="title">
			<textarea id="bodyinput" name="body"></textarea><br>
			<button class="btn btn-primary" data-id="${data._id}" id="savenote">Save Note</button>
			`)
	})
})
